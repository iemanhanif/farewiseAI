import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
let genAI = null;
let useMock = true;

if (apiKey && apiKey.trim() !== '') {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    useMock = false;
    console.log('Gemini AI Service initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize Gemini AI. Falling back to mock advisor mode:', error.message);
  }
} else {
  console.log('No GEMINI_API_KEY found in environment. Running in Smart Mock Advisor mode.');
}

/**
 * Get AI-powered recommendation for search results
 * @param {Array} flights - List of flight objects
 * @param {Object} searchParams - Search parameters (from, to, date, class, etc.)
 */
export const getFlightRecommendation = async (flights, searchParams) => {
  if (flights.length === 0) {
    return 'No flights available to analyze. Please try searching for a different route or date.';
  }

  // Find some quick statistics to use in our comparison / mock prompt
  const sortedByPrice = [...flights].sort((a, b) => a.price - b.price);
  const cheapest = sortedByPrice[0];
  
  // Custom duration parsing (e.g. "2h 15m" to minutes)
  const parseDuration = (d) => {
    const hours = d.match(/(\d+)h/);
    const mins = d.match(/(\d+)m/);
    const h = hours ? parseInt(hours[1]) * 60 : 0;
    const m = mins ? parseInt(mins[1]) : 0;
    return h + m;
  };
  
  const sortedByDuration = [...flights].sort((a, b) => parseDuration(a.duration) - parseDuration(b.duration));
  const fastest = sortedByDuration[0];
  const sortedByStops = [...flights].sort((a, b) => a.stops - b.stops);
  const directOrMinStops = sortedByStops[0];

  // Best Value heuristic (a mix of low price, few stops, short duration)
  // Value score = price + (stops * 150) + (duration_in_hours * 50)
  const bestValue = [...flights].sort((a, b) => {
    const scoreA = a.price + (a.stops * 150) + (parseDuration(a.duration) / 60 * 50);
    const scoreB = b.price + (b.stops * 150) + (parseDuration(b.duration) / 60 * 50);
    return scoreA - scoreB;
  })[0];

  if (!useMock && genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const flightsDataString = flights.map((f, i) => 
        `[${i + 1}] Airline: ${f.airline}, Route: ${f.from} -> ${f.to}, Price: $${f.price}, Duration: ${f.duration}, Stops: ${f.stops}, Class: ${f.class}`
      ).join('\n');

      const prompt = `You are an expert travel advisor. Analyze these flight options and recommend the best one based on price, travel duration, stops, and overall value. Explain your recommendation in simple, conversational language, and compare at least two options.
      
Search parameters: From ${searchParams.from} to ${searchParams.to} on ${searchParams.departureDate} (${searchParams.class} Class).
      
Flight options:
${flightsDataString}

Return your recommendation in plain text, structured with clean paragraph breaks. Keep it within 150-250 words. Do not use markdown headers (like # or ##) but you can use bolding (*) and bullet points.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API Error in getFlightRecommendation, falling back to mock:', error);
      // Let it fall through to the mock response
    }
  }

  // Smart Mock Response
  let mockText = `**FareWise AI Travel Advisor Report**\n\n`;
  mockText += `Analyzing ${flights.length} available flight options from **${searchParams.from}** to **${searchParams.to}**:\n\n`;
  
  if (cheapest._id.equals(fastest._id)) {
    mockText += `Excellent news! **${cheapest.airline}** is both the **cheapest** and **fastest** option at **$${cheapest.price}** with a travel time of **${cheapest.duration}** (${cheapest.stops === 0 ? 'Direct flight' : cheapest.stops + ' stop(s)'}). This is an absolute no-brainer; we highly recommend booking this flight immediately.`;
  } else {
    mockText += `* **Best Budget Option:** **${cheapest.airline}** at a very competitive rate of **$${cheapest.price}** (${cheapest.stops === 0 ? 'Direct' : cheapest.stops + ' stop(s)'}, duration: ${cheapest.duration}). This will save you about **$${bestValue.price - cheapest.price}** compared to other options.\n`;
    mockText += `* **Fastest Choice:** **${fastest.airline}** with a travel duration of only **${fastest.duration}** priced at **$${fastest.price}** (${fastest.stops === 0 ? 'Direct' : fastest.stops + ' stop(s)'}).\n\n`;
    
    mockText += `**Our Recommendation:** We recommend going with **${bestValue.airline}** at **$${bestValue.price}**. Although it's slightly higher than the absolute cheapest fare, it provides the best overall balance with a shorter travel time of **${bestValue.duration}** and fewer stops. If budget is your only constraint, select **${cheapest.airline}**.`;
  }

  return mockText;
};

/**
 * Handle conversational travel agent queries
 * @param {String} userMessage - Message sent by the user
 * @param {Array} history - Previous messages for context [{role: 'user'|'model', text: String}]
 */
export const askTravelAssistant = async (userMessage, history = []) => {
  if (!useMock && genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      // Map history to Gemini API format
      const contents = history.map(h => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.text }]
      }));
      
      // Add system instruction as part of context if starting, or prepend to user message
      const systemPrompt = "You are FareWise AI, a friendly, professional AI Travel Assistant. Your job is to help users plan trips, recommend airlines, suggest packing lists, compare travel costs, and analyze destinations. Keep answers concise, informative, and warm.";
      
      // Gemini chat session
      const chat = model.startChat({
        history: contents,
        systemInstruction: systemPrompt
      });
      
      const result = await chat.sendMessage(userMessage);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API Error in askTravelAssistant, falling back to mock:', error);
    }
  }

  // Smart Chatbot Mock Answers based on keywords
  const message = userMessage.toLowerCase();
  
  if (message.includes('dubai')) {
    if (message.includes('expensive')) {
      return "Dubai can be both expensive and affordable, depending on your lifestyle. While luxury hotels, fine dining, and shopping at the Dubai Mall carry premium prices, you can travel on a budget by staying in Deira or Bur Dubai, eating at local cafeterias, and using the Dubai Metro. The average daily budget for a tourist ranges from $100 for budget travelers to $350+ for luxury experiences.";
    }
    return "Dubai is a phenomenal destination! Known for the Burj Khalifa, desert safaris, and pristine beaches. The best time to visit is from November to March when the weather is pleasant (20°C to 30°C). During the summer (June to August), temperatures can exceed 40°C, but you can get highly discounted hotel rates.";
  }
  
  if (message.includes('turkey') || message.includes('istanbul')) {
    return "Turkey is a cultural bridge between East and West. The best months to visit Turkey are **April to May** (Spring) and **September to October** (Autumn). The weather is mild, perfect for exploring historical sites in Istanbul, Cappadocia, and Ephesus. Summer (July-August) is perfect for beaches but can be very crowded and hot.";
  }

  if (message.includes('airline') || message.includes('better')) {
    return "Comparing airlines depends on what you value most:\n\n* **Premium Luxury:** Qatar Airways, Emirates, and Singapore Airlines offer industry-leading business classes and excellent economy service.\n* **Punctuality & Reliability:** ANA and Japan Airlines are globally renowned for on-time departures and superior service.\n* **Value/Budget:** AirAsia, flydubai, and Ryanair offer cheaper flights but check for extra fees for luggage and meals.";
  }

  if (message.includes('pack')) {
    return "Here is a quick travel packing checklist:\n\n1. **Essentials:** Passport, visas, credit cards, insurance documents, and phone/charger.\n2. **Electronics:** Travel adapter, power bank, and noise-canceling headphones for the flight.\n3. **Clothing:** Versatile layers, comfortable walking shoes, swimwear, and formal wear if planned.\n4. **Toiletries:** Travel-sized toothbrush, medications, and sunscreen.\n\nAlways check the climate of your destination and pack lightweight or warm clothes accordingly.";
  }

  if (message.includes('japan') || message.includes('tokyo') || message.includes('safe')) {
    return "Japan is consistently ranked as one of the safest countries in the world for tourists. Crime rates are extremely low, and solo travelers (including female travelers) feel very safe walking at night. Standard precautions still apply, but you can feel completely secure exploring Tokyo, Kyoto, or rural Japan.";
  }

  if (message.includes('hello') || message.includes('hi ') || message.includes('hey')) {
    return "Hello! I am FareWise AI, your digital travel advisor. I can help you compare airlines, budget for destinations, check safety conditions, figure out what to pack, and choose the best travel months. What destination are we exploring today?";
  }

  // Generic backup response
  return `That's a great question about travel! While I'm currently running in my offline mode, I can tell you that successful planning is key. Generally, for most international travel, you should book flights 2-3 months in advance, check local entry visa requirements, secure comprehensive travel insurance, and compare prices using our charts. Let me know if you want details on specific destinations like Dubai, Turkey, Japan, or packing tips!`;
};
