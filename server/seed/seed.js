import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configure dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

import Flight from '../models/Flight.js';
import MonthlyPrice from '../models/MonthlyPrice.js';
import connectDB from '../config/db.js';

const cities = [
  'Dubai',
  'London',
  'Istanbul',
  'Paris',
  'Tokyo',
  'Kuala Lumpur',
  'Bangkok',
  'New York',
  'Toronto',
  'Sydney',
  'Karachi'
];

const airlines = [
  { name: 'Emirates', hub: 'Dubai', rating: 5 },
  { name: 'Qatar Airways', hub: 'Doha', rating: 5 },
  { name: 'Turkish Airlines', hub: 'Istanbul', rating: 4.5 },
  { name: 'British Airways', hub: 'London', rating: 4 },
  { name: 'ANA (All Nippon Airways)', hub: 'Tokyo', rating: 5 },
  { name: 'Singapore Airlines', hub: 'Singapore', rating: 5 },
  { name: 'Air Canada', hub: 'Toronto', rating: 4 },
  { name: 'Qantas', hub: 'Sydney', rating: 4.5 },
  { name: 'Pakistan International Airlines', hub: 'Karachi', rating: 3 },
  { name: 'FlyDubai', hub: 'Dubai', rating: 3.5 },
  { name: 'Etihad Airways', hub: 'Abu Dhabi', rating: 4.5 }
];

const baseDurations = {
  'Karachi-Dubai': { duration: '2h 15m', basePrice: 220, stopsChance: 0.1 },
  'Karachi-London': { duration: '8h 30m', basePrice: 650, stopsChance: 0.6 },
  'Dubai-London': { duration: '7h 15m', basePrice: 480, stopsChance: 0.2 },
  'London-Paris': { duration: '1h 20m', basePrice: 90, stopsChance: 0.0 },
  'Istanbul-Tokyo': { duration: '11h 45m', basePrice: 850, stopsChance: 0.5 },
  'New York-Toronto': { duration: '1h 35m', basePrice: 120, stopsChance: 0.0 },
  'Sydney-Bangkok': { duration: '9h 10m', basePrice: 580, stopsChance: 0.4 },
  'Kuala Lumpur-Tokyo': { duration: '7h 00m', basePrice: 420, stopsChance: 0.3 },
  'Dubai-Paris': { duration: '6h 45m', basePrice: 450, stopsChance: 0.2 },
  'London-New York': { duration: '8h 05m', basePrice: 550, stopsChance: 0.1 },
  'Tokyo-New York': { duration: '13h 10m', basePrice: 1100, stopsChance: 0.4 },
  'Karachi-Istanbul': { duration: '5h 45m', basePrice: 380, stopsChance: 0.2 },
  'Bangkok-Kuala Lumpur': { duration: '2h 05m', basePrice: 110, stopsChance: 0.1 },
  'Sydney-London': { duration: '22h 30m', basePrice: 1400, stopsChance: 1.0 },
  'Toronto-London': { duration: '7h 10m', basePrice: 510, stopsChance: 0.2 }
};

const travelClasses = ['Economy', 'Business', 'First'];

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Helper to generate a random date in August and September 2026
const getRandomDate = (start, end) => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
};

const generateFlights = () => {
  const flightsList = [];
  const startDate = new Date('2026-08-01');
  const endDate = new Date('2026-09-30');

  // Let's generate flights for common city pairs
  Object.keys(baseDurations).forEach((key) => {
    const [from, to] = key.split('-');
    const info = baseDurations[key];

    // Generate ~15-20 flights per route spread across August/September 2026
    for (let i = 0; i < 18; i++) {
      const depDate = getRandomDate(startDate, endDate);
      
      // Calculate a return date 5-10 days later (optional parameter)
      const depDateObj = new Date(depDate);
      const retDays = Math.floor(Math.random() * 6) + 5; // 5 to 10 days
      const retDateObj = new Date(depDateObj.getTime() + retDays * 24 * 60 * 60 * 1000);
      const retDate = retDateObj.toISOString().split('T')[0];

      // Randomize airlines
      const airline = airlines[Math.floor(Math.random() * airlines.length)];

      // stops
      let stops = 0;
      if (Math.random() < info.stopsChance) {
        stops = Math.random() < 0.8 ? 1 : 2;
      }

      // Modify duration based on stops
      let durationStr = info.duration;
      if (stops > 0) {
        const hours = parseInt(info.duration.split('h')[0]) + (stops * 2) + Math.floor(Math.random() * 3);
        const mins = info.duration.includes('m') ? info.duration.split('h')[1].replace('m', '').trim() : '00';
        durationStr = `${hours}h ${mins}m`;
      }

      // Generate flight records for different travel classes
      travelClasses.forEach((tClass) => {
        // Price modifier based on stops, class, and randomness
        let multiplier = 1.0;
        if (tClass === 'Business') multiplier = 2.5;
        if (tClass === 'First') multiplier = 5.0;

        // Stops reduce price slightly
        if (stops === 1) multiplier *= 0.9;
        if (stops === 2) multiplier *= 0.8;

        // Daily random fluctuation (+/- 15%)
        const fluctuation = 0.85 + Math.random() * 0.3;
        const price = Math.round(info.basePrice * multiplier * fluctuation);

        flightsList.push({
          airline: airline.name,
          from,
          to,
          departureDate: depDate,
          returnDate: Math.random() > 0.3 ? retDate : undefined, // 70% have a return date set
          price,
          duration: durationStr,
          stops,
          class: tClass
        });
      });
    }
  });

  // Let's add some additional random flights to fill out the 11 cities
  for (let i = 0; i < 40; i++) {
    const from = cities[Math.floor(Math.random() * cities.length)];
    let to = cities[Math.floor(Math.random() * cities.length)];
    while (from === to) {
      to = cities[Math.floor(Math.random() * cities.length)];
    }

    // Try to see if this route already has a base duration, otherwise make one
    const routeKey = `${from}-${to}`;
    const reverseRouteKey = `${to}-${from}`;
    let duration = '4h 30m';
    let basePrice = 300;
    
    if (baseDurations[routeKey]) {
      duration = baseDurations[routeKey].duration;
      basePrice = baseDurations[routeKey].basePrice;
    } else if (baseDurations[reverseRouteKey]) {
      duration = baseDurations[reverseRouteKey].duration;
      basePrice = baseDurations[reverseRouteKey].basePrice;
    } else {
      // Calculate mock distance/price
      basePrice = Math.floor(Math.random() * 500) + 150;
      const hours = Math.floor(basePrice / 80) + 1;
      duration = `${hours}h ${Math.floor(Math.random() * 60)}m`;
    }

    const depDate = getRandomDate(startDate, endDate);
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const stops = Math.random() > 0.7 ? 1 : 0;
    const tClass = travelClasses[Math.floor(Math.random() * travelClasses.length)];

    let multiplier = tClass === 'Business' ? 2.3 : tClass === 'First' ? 4.5 : 1.0;
    const price = Math.round(basePrice * multiplier * (0.9 + Math.random() * 0.2));

    flightsList.push({
      airline: airline.name,
      from,
      to,
      departureDate: depDate,
      price,
      duration,
      stops,
      class: tClass
    });
  }

  return flightsList;
};

const generateMonthlyPrices = () => {
  const monthlyPricesList = [];
  const targetDestinations = ['Dubai', 'London', 'Istanbul', 'Paris', 'Tokyo', 'Bangkok', 'New York', 'Sydney'];
  
  const baseAvgPrices = {
    'Dubai': 400,
    'London': 600,
    'Istanbul': 450,
    'Paris': 500,
    'Tokyo': 800,
    'Bangkok': 350,
    'New York': 550,
    'Sydney': 1100
  };

  // Seasonal modifiers for months (July/August/December are peaks, Feb/Nov are low seasons)
  const seasonalModifiers = {
    'January': 0.9,
    'February': 0.8, // Cheapest month generally
    'March': 0.95,
    'April': 1.05,
    'May': 1.1,
    'June': 1.2,
    'July': 1.3,
    'August': 1.25,
    'September': 1.0,
    'October': 0.95,
    'November': 0.85,
    'December': 1.2
  };

  targetDestinations.forEach((dest) => {
    const base = baseAvgPrices[dest];
    months.forEach((month) => {
      const modifier = seasonalModifiers[month];
      const randomNoise = 0.97 + Math.random() * 0.06; // +/- 3% noise
      const averagePrice = Math.round(base * modifier * randomNoise);

      monthlyPricesList.push({
        destination: dest,
        month,
        averagePrice
      });
    });
  });

  return monthlyPricesList;
};

const runSeeding = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();

    console.log('Clearing existing flights and monthly prices...');
    await Flight.deleteMany({});
    await MonthlyPrice.deleteMany({});

    console.log('Generating seed data...');
    const flights = generateFlights();
    const monthlyPrices = generateMonthlyPrices();

    console.log(`Seeding ${flights.length} flights...`);
    await Flight.insertMany(flights);

    console.log(`Seeding ${monthlyPrices.length} monthly average prices...`);
    await MonthlyPrice.insertMany(monthlyPrices);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

runSeeding();
