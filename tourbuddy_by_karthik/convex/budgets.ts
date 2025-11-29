import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createBudget = mutation({
  args: {
    tripId: v.id("trips"),
    categories: v.object({
      travel: v.number(),
      food: v.number(),
      stay: v.number(),
      activities: v.number(),
      misc: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    const totalBudget = Object.values(args.categories).reduce((sum, amount) => sum + amount, 0);

    const budgetId = await ctx.db.insert("budgets", {
      tripId: args.tripId,
      userId,
      categories: args.categories,
      totalBudget,
    });

    return budgetId;
  },
});

export const getTripBudget = query({
  args: { tripId: v.id("trips") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    return await ctx.db
      .query("budgets")
      .withIndex("by_trip", (q) => q.eq("tripId", args.tripId))
      .filter((q) => q.eq(q.field("userId"), userId))
      .unique();
  },
});

export const addExpense = mutation({
  args: {
    budgetId: v.id("budgets"),
    category: v.union(
      v.literal("travel"),
      v.literal("food"),
      v.literal("stay"),
      v.literal("activities"),
      v.literal("misc")
    ),
    amount: v.number(),
    description: v.string(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    // Verify budget belongs to user
    const budget = await ctx.db.get(args.budgetId);
    if (!budget || budget.userId !== userId) {
      throw new Error("Budget not found or not authorized");
    }

    const expenseId = await ctx.db.insert("expenses", {
      budgetId: args.budgetId,
      category: args.category,
      amount: args.amount,
      description: args.description,
      date: args.date,
    });

    return expenseId;
  },
});

export const getBudgetExpenses = query({
  args: { budgetId: v.id("budgets") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    // Verify budget belongs to user
    const budget = await ctx.db.get(args.budgetId);
    if (!budget || budget.userId !== userId) {
      return [];
    }

    return await ctx.db
      .query("expenses")
      .withIndex("by_budget", (q) => q.eq("budgetId", args.budgetId))
      .order("desc")
      .collect();
  },
});

export const getBudgetSummary = query({
  args: { budgetId: v.id("budgets") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const budget = await ctx.db.get(args.budgetId);
    if (!budget || budget.userId !== userId) {
      return null;
    }

    const expenses = await ctx.db
      .query("expenses")
      .withIndex("by_budget", (q) => q.eq("budgetId", args.budgetId))
      .collect();

    // Calculate spent amounts by category
    const spent = {
      travel: 0,
      food: 0,
      stay: 0,
      activities: 0,
      misc: 0,
    };

    expenses.forEach(expense => {
      spent[expense.category] += expense.amount;
    });

    const totalSpent = Object.values(spent).reduce((sum, amount) => sum + amount, 0);

    return {
      budget: budget.categories,
      spent,
      totalBudget: budget.totalBudget,
      totalSpent,
      remaining: budget.totalBudget - totalSpent,
    };
  },
});
