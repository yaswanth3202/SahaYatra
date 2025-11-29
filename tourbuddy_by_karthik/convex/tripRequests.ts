import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const sendTripRequest = mutation({
  args: {
    tripId: v.id("trips"),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to send trip request");
    }

    // Check if request already exists
    const existingRequest = await ctx.db
      .query("tripRequests")
      .withIndex("by_trip_and_requester", (q) => 
        q.eq("tripId", args.tripId).eq("requesterId", userId)
      )
      .unique();

    if (existingRequest) {
      throw new Error("Request already sent for this trip");
    }

    // Check if trip is still open
    const trip = await ctx.db.get(args.tripId);
    if (!trip || trip.status !== "open") {
      throw new Error("Trip is not available for requests");
    }

    // Check if user is not the trip author
    if (trip.authorId === userId) {
      throw new Error("Cannot request to join your own trip");
    }

    const requestId = await ctx.db.insert("tripRequests", {
      tripId: args.tripId,
      requesterId: userId,
      status: "pending",
      message: args.message,
    });

    return requestId;
  },
});

export const getTripRequests = query({
  args: { tripId: v.id("trips") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    // Check if user is the trip author
    const trip = await ctx.db.get(args.tripId);
    if (!trip || trip.authorId !== userId) {
      return [];
    }

    const requests = await ctx.db
      .query("tripRequests")
      .withIndex("by_trip", (q) => q.eq("tripId", args.tripId))
      .collect();

    // Get requester details
    const requestsWithUsers = await Promise.all(
      requests.map(async (request) => {
        const user = await ctx.db.get(request.requesterId);
        const profile = await ctx.db
          .query("profiles")
          .withIndex("by_user", (q) => q.eq("userId", request.requesterId))
          .unique();

        return {
          ...request,
          requester: {
            name: profile?.name || user?.name || "Unknown",
            avatar: profile?.avatar,
            bio: profile?.bio,
            interests: profile?.interests || [],
          },
        };
      })
    );

    return requestsWithUsers;
  },
});

export const respondToTripRequest = mutation({
  args: {
    requestId: v.id("tripRequests"),
    response: v.union(v.literal("accepted"), v.literal("rejected")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    const request = await ctx.db.get(args.requestId);
    if (!request) {
      throw new Error("Request not found");
    }

    const trip = await ctx.db.get(request.tripId);
    if (!trip || trip.authorId !== userId) {
      throw new Error("Not authorized to respond to this request");
    }

    // Update request status
    await ctx.db.patch(args.requestId, {
      status: args.response,
    });

    // If accepted, increment current travelers
    if (args.response === "accepted") {
      const newTravelerCount = trip.currentTravelers + 1;
      await ctx.db.patch(request.tripId, {
        currentTravelers: newTravelerCount,
        status: newTravelerCount >= trip.maxTravelers ? "full" : "open",
      });

      // Send system message to chat
      await ctx.db.insert("messages", {
        tripId: request.tripId,
        senderId: userId,
        content: "A new traveler has joined the trip!",
        type: "system",
      });
    }

    return { success: true };
  },
});

export const getUserRequests = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const requests = await ctx.db
      .query("tripRequests")
      .withIndex("by_requester", (q) => q.eq("requesterId", userId))
      .collect();

    // Get trip details for each request
    const requestsWithTrips = await Promise.all(
      requests.map(async (request) => {
        const trip = await ctx.db.get(request.tripId);
        return {
          ...request,
          trip,
        };
      })
    );

    return requestsWithTrips;
  },
});
