import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAllStates = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("states").collect();
  },
});

export const getStateByCode = query({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("states")
      .withIndex("by_code", (q) => q.eq("code", args.code))
      .unique();
  },
});

export const seedStates = mutation({
  args: {},
  handler: async (ctx) => {
    const states = [
      {
        code: "MH",
        name: "Maharashtra",
        description: "Home to Mumbai, the financial capital of India. Known for Bollywood, beaches, and historic caves.",
        attractions: ["Gateway of India", "Ajanta Caves", "Lonavala", "Mahabaleshwar"],
        bestTime: "October to March",
        imageUrl: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800"
      },
      {
        code: "DL",
        name: "Delhi",
        description: "The capital territory of India, rich in history and culture with magnificent monuments.",
        attractions: ["Red Fort", "India Gate", "Qutub Minar", "Lotus Temple"],
        bestTime: "October to March",
        imageUrl: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800"
      },
      {
        code: "KA",
        name: "Karnataka",
        description: "Known for its palaces, gardens, and IT hub Bangalore. Rich cultural heritage and natural beauty.",
        attractions: ["Mysore Palace", "Hampi", "Coorg", "Bangalore"],
        bestTime: "October to February",
        imageUrl: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"
      },
      {
        code: "RJ",
        name: "Rajasthan",
        description: "Land of kings with magnificent forts, palaces, and desert landscapes.",
        attractions: ["Jaipur", "Udaipur", "Jaisalmer", "Jodhpur"],
        bestTime: "October to March",
        imageUrl: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800"
      },
      {
        code: "GOA",
        name: "Goa",
        description: "India's beach paradise with Portuguese heritage, vibrant nightlife, and pristine beaches.",
        attractions: ["Baga Beach", "Old Goa Churches", "Dudhsagar Falls", "Anjuna Beach"],
        bestTime: "November to February",
        imageUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800"
      },
      {
        code: "KL",
        name: "Kerala",
        description: "God's Own Country with backwaters, hill stations, and spice plantations.",
        attractions: ["Alleppey Backwaters", "Munnar", "Kochi", "Thekkady"],
        bestTime: "September to March",
        imageUrl: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800"
      },
      {
        code: "UP",
        name: "Uttar Pradesh",
        description: "Home to the iconic Taj Mahal and rich Mughal heritage.",
        attractions: ["Taj Mahal", "Varanasi", "Lucknow", "Mathura"],
        bestTime: "October to March",
        imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
      },
      {
        code: "HP",
        name: "Himachal Pradesh",
        description: "Mountain state with hill stations, adventure sports, and scenic beauty.",
        attractions: ["Shimla", "Manali", "Dharamshala", "Spiti Valley"],
        bestTime: "March to June, September to November",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
      }
    ];

    // Check if states already exist
    const existingStates = await ctx.db.query("states").collect();
    if (existingStates.length > 0) {
      return { message: "States already seeded" };
    }

    // Insert all states
    for (const state of states) {
      await ctx.db.insert("states", state);
    }

    return { message: `Seeded ${states.length} states` };
  },
});
