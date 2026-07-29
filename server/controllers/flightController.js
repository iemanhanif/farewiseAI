import Flight from '../models/Flight.js';
import MonthlyPrice from '../models/MonthlyPrice.js';
import SearchHistory from '../models/SearchHistory.js';
import SavedFlight from '../models/SavedFlight.js';
import jwt from 'jsonwebtoken';

/**
 * @desc    Search flights matching criteria
 * @route   GET /api/flights/search
 * @access  Public (Optional auth for history tracking)
 */
export const searchFlights = async (req, res, next) => {
  try {
    const { from, to, departureDate, returnDate, class: travelClass, stops } = req.query;

    // Build outbound query
    const outboundQuery = {
      from: new RegExp(`^${from.trim()}$`, 'i'),
      to: new RegExp(`^${to.trim()}$`, 'i'),
      departureDate: departureDate.trim()
    };

    if (travelClass) {
      outboundQuery.class = travelClass;
    }
    if (stops !== undefined) {
      outboundQuery.stops = parseInt(stops);
    }

    // Query outbound flights
    const outboundFlights = await Flight.find(outboundQuery).sort({ price: 1 });

    // Build return query if returnDate is specified
    let inboundFlights = [];
    if (returnDate) {
      const inboundQuery = {
        from: new RegExp(`^${to.trim()}$`, 'i'),
        to: new RegExp(`^${from.trim()}$`, 'i'),
        departureDate: returnDate.trim()
      };

      if (travelClass) {
        inboundQuery.class = travelClass;
      }
      if (stops !== undefined) {
        inboundQuery.stops = parseInt(stops);
      }

      inboundFlights = await Flight.find(inboundQuery).sort({ price: 1 });
    }

    // Attempt to log search history if user is authenticated
    let userId = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretfarewisekey1234567890');
        userId = decoded.id;
      } catch (err) {
        // Suppress invalid token error for public search
      }
    }

    if (userId && outboundFlights.length > 0) {
      const cheapestPrice = outboundFlights[0].price;
      
      // Save search log
      await SearchHistory.create({
        userId,
        from: from.trim(),
        to: to.trim(),
        departureDate: departureDate.trim(),
        returnDate: returnDate ? returnDate.trim() : undefined,
        cheapestPrice
      });
    }

    res.json({
      outbound: outboundFlights,
      inbound: inboundFlights
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get average monthly prices for a destination
 * @route   GET /api/flights/monthly-prices
 * @access  Public
 */
export const getMonthlyFares = async (req, res, next) => {
  try {
    const { destination } = req.query;
    if (!destination) {
      return res.status(400).json({ message: 'Destination parameter is required' });
    }

    const fares = await MonthlyPrice.find({
      destination: new RegExp(`^${destination.trim()}$`, 'i')
    });

    res.json(fares);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dashboard metrics and pricing insights
 * @route   GET /api/flights/dashboard-stats
 * @access  Private
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // 1. Get recent searches
    const recentSearches = await SearchHistory.find({ userId })
      .sort({ searchDate: -1 })
      .limit(5);

    // 2. Get saved flights details (populate flight info)
    const savedFlights = await SavedFlight.find({ userId })
      .sort({ savedAt: -1 })
      .populate('flightId')
      .limit(5);

    // Filter out potential null references if a flight was deleted
    const filteredSavedFlights = savedFlights.filter(item => item.flightId !== null);

    // 3. Find cheapest destination this month (using current month)
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const currentMonth = monthNames[new Date().getMonth()];
    
    const cheapestDestination = await MonthlyPrice.findOne({ month: currentMonth })
      .sort({ averagePrice: 1 });

    // 4. Saved flights price distribution statistics
    // E.g., calculate how many economy vs business class flights are saved
    const savedAll = await SavedFlight.find({ userId }).populate('flightId');
    const classCounts = { Economy: 0, Business: 0, First: 0 };
    let totalPrice = 0;
    let savedCount = 0;

    savedAll.forEach(item => {
      if (item.flightId) {
        classCounts[item.flightId.class] = (classCounts[item.flightId.class] || 0) + 1;
        totalPrice += item.flightId.price;
        savedCount++;
      }
    });

    const avgSavedPrice = savedCount > 0 ? Math.round(totalPrice / savedCount) : 0;

    // 5. Popular destinations in general (mock count combined with search logs if available)
    const allSearchLogs = await SearchHistory.aggregate([
      { $group: { _id: '$to', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const defaultPopular = [
      { name: 'Dubai', count: 12 },
      { name: 'London', count: 10 },
      { name: 'Tokyo', count: 9 },
      { name: 'Paris', count: 8 },
      { name: 'Istanbul', count: 7 }
    ];

    const popularDestinations = allSearchLogs.length > 0 
      ? allSearchLogs.map(item => ({ name: item._id, count: item.count }))
      : defaultPopular;

    res.json({
      recentSearches,
      savedFlights: filteredSavedFlights.map(item => item.flightId),
      cheapestDestinationThisMonth: cheapestDestination ? {
        destination: cheapestDestination.destination,
        month: cheapestDestination.month,
        averagePrice: cheapestDestination.averagePrice
      } : { destination: 'Dubai', month: currentMonth, averagePrice: 380 },
      stats: {
        classCounts,
        avgSavedPrice,
        popularDestinations
      }
    });
  } catch (error) {
    next(error);
  }
};
