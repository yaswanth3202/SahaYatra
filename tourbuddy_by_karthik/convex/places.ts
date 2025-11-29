import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Define the place schema based on CSV structure
export const createPlace = mutation({
  args: {
    state: v.string(),
    stateCode: v.string(),
    placeName: v.string(),
    category: v.string(),
    description: v.optional(v.string()),
    timings: v.optional(v.string()),
    entryFee: v.optional(v.string()),
    bestTime: v.optional(v.string()),
    nearestRailway: v.optional(v.string()),
    nearestBus: v.optional(v.string()),
    nearestAirport: v.optional(v.string()),
    metroStation: v.optional(v.string()),
    accessibility: v.optional(v.string()),
    guidedTours: v.optional(v.string()),
    parking: v.optional(v.string()),
    nearbyAmenities: v.optional(v.string()),
    officialWebsite: v.optional(v.string()),
    wikipedia: v.optional(v.string()),
    specialNotes: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const placeId = await ctx.db.insert("places", {
      ...args,
      createdAt: Date.now(),
    });
    return placeId;
  },
});

export const getPlacesByState = query({
  args: { stateCode: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("places")
      .withIndex("by_state", (q) => q.eq("stateCode", args.stateCode))
      .collect();
  },
});

export const getPlacesByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("places")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
  },
});

export const searchPlaces = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const places = await ctx.db.query("places").collect();
    
    const searchTerm = args.searchTerm.toLowerCase();
    return places.filter(place => 
      place.placeName.toLowerCase().includes(searchTerm) ||
      place.state.toLowerCase().includes(searchTerm) ||
      place.category.toLowerCase().includes(searchTerm) ||
      (place.description && place.description.toLowerCase().includes(searchTerm)) ||
      (place.specialNotes && place.specialNotes.toLowerCase().includes(searchTerm))
    );
  },
});

export const getPlaceById = query({
  args: { placeId: v.id("places") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.placeId);
  },
});

export const getFeaturedPlaces = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 12;
    return await ctx.db
      .query("places")
      .order("desc")
      .take(limit);
  },
});

export const getPlacesByBudget = query({
  args: { 
    minBudget: v.optional(v.number()),
    maxBudget: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const places = await ctx.db.query("places").collect();
    
    return places.filter(place => {
      if (!place.entryFee) return true;
      
      // Extract numeric value from entry fee string
      const feeMatch = place.entryFee.match(/₹?(\d+)/);
      if (!feeMatch) return true;
      
      const fee = parseInt(feeMatch[1]);
      const minBudget = args.minBudget || 0;
      const maxBudget = args.maxBudget || Infinity;
      
      return fee >= minBudget && fee <= maxBudget;
    });
  },
});

export const getPopularCategories = query({
  handler: async (ctx) => {
    const places = await ctx.db.query("places").collect();
    const categoryCount: Record<string, number> = {};
    
    places.forEach(place => {
      categoryCount[place.category] = (categoryCount[place.category] || 0) + 1;
    });
    
    return Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([category, count]) => ({ category, count }));
  },
});

export const getStatesWithPlaces = query({
  handler: async (ctx) => {
    const places = await ctx.db.query("places").collect();
    const stateCount: Record<string, { name: string; code: string; count: number }> = {};
    
    places.forEach(place => {
      if (!stateCount[place.stateCode]) {
        stateCount[place.stateCode] = {
          name: place.state,
          code: place.stateCode,
          count: 0
        };
      }
      stateCount[place.stateCode].count++;
    });
    
    return Object.values(stateCount).sort((a, b) => b.count - a.count);
  },
});
