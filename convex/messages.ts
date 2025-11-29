import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getTripMessages = query({
  args: { tripId: v.id("trips") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    // Check if user has access to this trip's chat
    const trip = await ctx.db.get(args.tripId);
    if (!trip) return [];

    // Check if user is trip author or accepted member
    const isAuthor = trip.authorId === userId;
    const acceptedRequest = await ctx.db
      .query("tripRequests")
      .withIndex("by_trip_and_requester", (q) => 
        q.eq("tripId", args.tripId).eq("requesterId", userId)
      )
      .filter((q) => q.eq(q.field("status"), "accepted"))
      .unique();

    if (!isAuthor && !acceptedRequest) {
      return [];
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_trip", (q) => q.eq("tripId", args.tripId))
      .order("asc")
      .collect();

    // Get sender details for each message
    const messagesWithSenders = await Promise.all(
      messages.map(async (message) => {
        if (message.type === "system") {
          return {
            ...message,
            sender: { name: "System", avatar: null },
          };
        }

        const sender = await ctx.db.get(message.senderId);
        const profile = await ctx.db
          .query("profiles")
          .withIndex("by_user", (q) => q.eq("userId", message.senderId))
          .unique();

        return {
          ...message,
          sender: {
            name: profile?.name || sender?.name || "Unknown",
            avatar: profile?.avatar,
          },
        };
      })
    );

    return messagesWithSenders;
  },
});

export const sendMessage = mutation({
  args: {
    tripId: v.id("trips"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to send messages");
    }

    // Check if user has access to this trip's chat
    const trip = await ctx.db.get(args.tripId);
    if (!trip) {
      throw new Error("Trip not found");
    }

    const isAuthor = trip.authorId === userId;
    const acceptedRequest = await ctx.db
      .query("tripRequests")
      .withIndex("by_trip_and_requester", (q) => 
        q.eq("tripId", args.tripId).eq("requesterId", userId)
      )
      .filter((q) => q.eq(q.field("status"), "accepted"))
      .unique();

    if (!isAuthor && !acceptedRequest) {
      throw new Error("Not authorized to send messages in this trip");
    }

    const messageId = await ctx.db.insert("messages", {
      tripId: args.tripId,
      senderId: userId,
      content: args.content,
      type: "text",
    });

    return messageId;
  },
});

export const getTripParticipants = query({
  args: { tripId: v.id("trips") },
  handler: async (ctx, args) => {
    const trip = await ctx.db.get(args.tripId);
    if (!trip) return [];

    // Get trip author
    const author = await ctx.db.get(trip.authorId);
    const authorProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", trip.authorId))
      .unique();

    const participants = [{
      userId: trip.authorId,
      name: authorProfile?.name || author?.name || "Unknown",
      avatar: authorProfile?.avatar,
      role: "author",
    }];

    // Get accepted members
    const acceptedRequests = await ctx.db
      .query("tripRequests")
      .withIndex("by_trip", (q) => q.eq("tripId", args.tripId))
      .filter((q) => q.eq(q.field("status"), "accepted"))
      .collect();

    for (const request of acceptedRequests) {
      const user = await ctx.db.get(request.requesterId);
      const profile = await ctx.db
        .query("profiles")
        .withIndex("by_user", (q) => q.eq("userId", request.requesterId))
        .unique();

      participants.push({
        userId: request.requesterId,
        name: profile?.name || user?.name || "Unknown",
        avatar: profile?.avatar,
        role: "member",
      });
    }

    return participants;
  },
});
