import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getAllTrips = query({
  args: { 
    limit: v.optional(v.number()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let trips;
    
    if (args.status) {
      trips = await ctx.db
        .query("trips")
        .withIndex("by_status", (q) => q.eq("status", args.status as any))
        .order("desc")
        .take(args.limit || 20);
    } else {
      trips = await ctx.db
        .query("trips")
        .order("desc")
        .take(args.limit || 20);
    }

    // Get author details for each trip
    const tripsWithAuthors = await Promise.all(
      trips.map(async (trip) => {
        const author = await ctx.db.get(trip.authorId);
        const profile = await ctx.db
          .query("profiles")
          .withIndex("by_user", (q) => q.eq("userId", trip.authorId))
          .unique();
        
        return {
          ...trip,
          author: {
            name: profile?.name || author?.name || "Unknown",
            avatar: profile?.avatar,
          },
        };
      })
    );

    return tripsWithAuthors;
  },
});

export const getTripById = query({
  args: { tripId: v.id("trips") },
  handler: async (ctx, args) => {
    const trip = await ctx.db.get(args.tripId);
    if (!trip) return null;

    const author = await ctx.db.get(trip.authorId);
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", trip.authorId))
      .unique();

    return {
      ...trip,
      author: {
        name: profile?.name || author?.name || "Unknown",
        avatar: profile?.avatar,
      },
    };
  },
});

export const createTrip = mutation({
  args: {
    destination: v.string(),
    startDate: v.string(),
    endDate: v.string(),
    budget: v.number(),
    maxTravelers: v.number(),
    interests: v.array(v.string()),
    description: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to create a trip");
    }

    const tripId = await ctx.db.insert("trips", {
      authorId: userId,
      destination: args.destination,
      startDate: args.startDate,
      endDate: args.endDate,
      budget: args.budget,
      maxTravelers: args.maxTravelers,
      currentTravelers: 1,
      interests: args.interests,
      description: args.description,
      status: "open",
      imageUrl: args.imageUrl,
    });

    return tripId;
  },
});

export const getUserTrips = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const trips = await ctx.db
      .query("trips")
      .withIndex("by_author", (q) => q.eq("authorId", userId))
      .order("desc")
      .collect();

    return trips;
  },
});

export const searchTrips = query({
  args: { 
    destination: v.optional(v.string()),
    maxBudget: v.optional(v.number()),
    interests: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    let trips = await ctx.db.query("trips").collect();

    // Filter by destination
    if (args.destination) {
      trips = trips.filter(trip => 
        trip.destination.toLowerCase().includes(args.destination!.toLowerCase())
      );
    }

    // Filter by budget
    if (args.maxBudget) {
      trips = trips.filter(trip => trip.budget <= args.maxBudget!);
    }

    // Filter by interests
    if (args.interests && args.interests.length > 0) {
      trips = trips.filter(trip => 
        trip.interests.some(interest => 
          args.interests!.includes(interest)
        )
      );
    }

    // Get author details
    const tripsWithAuthors = await Promise.all(
      trips.map(async (trip) => {
        const author = await ctx.db.get(trip.authorId);
        const profile = await ctx.db
          .query("profiles")
          .withIndex("by_user", (q) => q.eq("userId", trip.authorId))
          .unique();
        
        return {
          ...trip,
          author: {
            name: profile?.name || author?.name || "Unknown",
            avatar: profile?.avatar,
          },
        };
      })
    );

    return tripsWithAuthors;
  },
});
