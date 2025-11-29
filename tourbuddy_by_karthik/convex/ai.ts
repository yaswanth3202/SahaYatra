import { action } from "./_generated/server";
import { v } from "convex/values";

// Gemini API configuration (use ENV vars in production!)
const GEMINI_API_KEY = "AIzaSyDBEAYYpabT2rhqNR5z3LQpNzXZAur0Kz4";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

// Unsplash API configuration
const UNSPLASH_ACCESS_KEY = "0Jdj0HdnS_6o70cafNtFlzsq8lrgKcH24h9Bh_WOqjY";
const UNSPLASH_API_URL = "https://api.unsplash.com";

export const generateItinerary = action({
  args: {
    destination: v.string(),
    startDate: v.string(),
    endDate: v.string(),
    budget: v.number(),
    travelers: v.number(),
    interests: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const prompt = `Create a detailed travel itinerary for ${args.destination} from ${args.startDate} to ${args.endDate}.

    Requirements:
    - Budget: ₹${args.budget} for ${args.travelers} travelers
    - Interests: ${args.interests.join(", ")}
    - Provide day-by-day activities with realistic costs
    - Include practical tips and recommendations
    - Focus on Indian destinations and local experiences

    IMPORTANT: Respond ONLY with valid JSON in this exact format:
    {
      "days": [
        {
          "day": 1,
          "title": "Arrival and City Exploration",
          "activities": [
            "Arrive at airport and check into hotel",
            "Visit local landmark",
            "Try local cuisine"
          ],
          "estimatedCost": 5000,
          "tips": "Book airport transfer in advance"
        }
      ],
      "totalEstimatedCost": 15000,
      "generalTips": [
        "Carry cash for local markets",
        "Book accommodations in advance"
      ]
    }`;

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `You are a travel planning expert specializing in Indian destinations. Provide practical, budget-conscious itineraries with accurate cost estimates in Indian Rupees.\n\n${prompt}` }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
        }),
      });

      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!content) throw new Error("No response from AI");

      try {
        let cleanContent = content.trim();
        cleanContent = cleanContent.replace(/```json\n?/g, "").replace(/```\n?/g, "");
        const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) cleanContent = jsonMatch[0];

        const itinerary = JSON.parse(cleanContent);

        if (itinerary.days && Array.isArray(itinerary.days)) {
          return {
            days: itinerary.days.map((day: any, index: number) => ({
              day: day.day || index + 1,
              title: day.title || `Day ${index + 1}`,
              activities: Array.isArray(day.activities) ? day.activities : [day.activities || "Activity details not available"],
              estimatedCost: day.estimatedCost || Math.floor(args.budget / (itinerary.days.length || 1)),
              tips: day.tips || "Enjoy your day!"
            })),
            totalEstimatedCost: itinerary.totalEstimatedCost || args.budget,
            generalTips: Array.isArray(itinerary.generalTips) ? itinerary.generalTips : [itinerary.generalTips || "Have a great trip!"]
          };
        }
        return itinerary;
      } catch (parseError) {
        console.error("JSON parsing error:", parseError);
        console.error("Raw content:", content);

        const lines = content.split("\n").filter((line: any) => line.trim());
        const activities = lines.slice(0, 5).map((line: string) => line.replace(/^\d+\.?\s*/, "").trim());

        return {
          days: [
            {
              day: 1,
              title: "AI Generated Itinerary",
              activities: activities.length > 0 ? activities : ["AI generated itinerary - please check the full response for details"],
              estimatedCost: Math.floor(args.budget / 3),
              tips: "AI response received. Please review the detailed itinerary above."
            }
          ],
          totalEstimatedCost: args.budget,
          generalTips: ["AI response received", "Please review the detailed itinerary", "Contact support if you need assistance"]
        };
      }
    } catch (error) {
      console.error("AI generation error:", error);
      throw new Error("Failed to generate itinerary. Please try again.");
    }
  },
});

export const chatWithAI = action({
  args: { message: v.string(), context: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const systemPrompt = `You are sahyaatra AI, a helpful travel assistant for India. You help users with:
    - Travel planning and recommendations
    - Budget advice for Indian destinations
    - Cultural insights and local tips
    - Safety and practical travel information
    - Connecting with travel companions

    Keep responses helpful, concise, and focused on Indian travel. If asked about booking or payments, explain that users should use the platform's trip posting feature to connect with travel buddies.

    ${args.context ? `Context: ${args.context}` : ""}`;

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\nUser: ${args.message}` }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
        }),
      });

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process your request. Please try again.";
    } catch (error) {
      console.error("AI chat error:", error);
      return "I'm experiencing some technical difficulties. Please try again later or use the platform's other features to plan your trip.";
    }
  },
});

export const getDestinationInfo = action({
  args: { destination: v.string() },
  handler: async (ctx, args) => {
    const prompt = `Provide key information about ${args.destination} as a travel destination in India. Include:
    - Best time to visit
    - Top 5 attractions
    - Approximate budget for 3 days (budget, mid-range, luxury)
    - Local cuisine highlights
    - Transportation tips
    
    Format as JSON:
    {
      "bestTime": "Month range",
      "attractions": ["Attraction 1", "Attraction 2", ...],
      "budgetEstimate": {
        "budget": 5000,
        "midRange": 12000,
        "luxury": 25000
      },
      "cuisine": ["Dish 1", "Dish 2", ...],
      "transportation": "Transportation tips"
    }`;

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `You are a travel expert specializing in Indian destinations. Provide accurate, practical information.\n\n${prompt}` }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 1024 }
        }),
      });

      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!content) throw new Error("No response from AI");

      try {
        return JSON.parse(content);
      } catch (parseError) {
        return {
          bestTime: "October to March",
          attractions: ["Information available on request"],
          budgetEstimate: { budget: 5000, midRange: 12000, luxury: 25000 },
          cuisine: ["Local specialties"],
          transportation: content.substring(0, 200)
        };
      }
    } catch (error) {
      console.error("Destination info error:", error);
      throw new Error("Failed to get destination information");
    }
  },
});

// Unsplash API functions
export const getPlaceImages = action({
  args: { placeName: v.string(), count: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const count = args.count || 5;
    try {
      const response = await fetch(
        `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(args.placeName + " India tourism")}&per_page=${count}&orientation=landscape`,
        { headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` } }
      );

      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results.map((photo: any) => ({
          id: photo.id,
          url: photo.urls.regular,
          thumbUrl: photo.urls.thumb,
          alt: photo.alt_description || args.placeName,
          photographer: photo.user.name,
          photographerUrl: photo.user.links.html,
        }));
      }
      return [];
    } catch (error) {
      console.error("Unsplash API error:", error);
      return [];
    }
  },
});

export const getDestinationImages = action({
  args: { destination: v.string(), category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const query = args.category ? `${args.destination} ${args.category} India` : `${args.destination} tourism India`;
    try {
      const response = await fetch(
        `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(query)}&per_page=8&orientation=landscape`,
        { headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` } }
      );

      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results.map((photo: any) => ({
          id: photo.id,
          url: photo.urls.regular,
          thumbUrl: photo.urls.thumb,
          alt: photo.alt_description || args.destination,
          photographer: photo.user.name,
          photographerUrl: photo.user.links.html,
        }));
      }
      return [];
    } catch (error) {
      console.error("Unsplash API error:", error);
      return [];
    }
  },
});

export const getRandomTravelImages = action({
  args: { count: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const count = args.count || 10;
    try {
      const response = await fetch(
        `${UNSPLASH_API_URL}/search/photos?query=India travel tourism&per_page=${count}&orientation=landscape`,
        { headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` } }
      );

      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results.map((photo: any) => ({
          id: photo.id,
          url: photo.urls.regular,
          thumbUrl: photo.urls.thumb,
          alt: photo.alt_description || "India travel",
          photographer: photo.user.name,
          photographerUrl: photo.user.links.html,
        }));
      }
      return [];
    } catch (error) {
      console.error("Unsplash API error:", error);
      return [];
    }
  },
});
