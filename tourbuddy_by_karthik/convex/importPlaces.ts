import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// CSV data import action
export const importCSVData = action({
  args: {},
  handler: async (ctx) => {
    // This would typically read from a file, but for now we'll return success
    // In a real implementation, you'd read the CSV file and parse it
    console.log("CSV import functionality ready. Use the CSV data to populate places.");
    return { success: true, message: "CSV import ready" };
  },
});

// Helper function to create a place from CSV row data
export const createPlaceFromCSV = action({
  args: {
    csvRow: v.object({
      state: v.string(),
      state_code: v.string(),
      place_name: v.string(),
      category: v.string(),
      description: v.optional(v.string()),
      timings: v.optional(v.string()),
      entry_fee: v.optional(v.string()),
      best_time: v.optional(v.string()),
      nearest_railway: v.optional(v.string()),
      nearest_bus: v.optional(v.string()),
      nearest_airport: v.optional(v.string()),
      metro_station: v.optional(v.string()),
      accessibility: v.optional(v.string()),
      guided_tours: v.optional(v.string()),
      parking: v.optional(v.string()),
      nearby_amenities: v.optional(v.string()),
      official_website: v.optional(v.string()),
      wikipedia: v.optional(v.string()),
      special_notes: v.optional(v.string()),
      source_file: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args): Promise<string> => {
    const placeId = await ctx.runMutation(api.places.createPlace, {
      state: args.csvRow.state,
      stateCode: args.csvRow.state_code,
      placeName: args.csvRow.place_name,
      category: args.csvRow.category,
      description: args.csvRow.description,
      timings: args.csvRow.timings,
      entryFee: args.csvRow.entry_fee,
      bestTime: args.csvRow.best_time,
      nearestRailway: args.csvRow.nearest_railway,
      nearestBus: args.csvRow.nearest_bus,
      nearestAirport: args.csvRow.nearest_airport,
      metroStation: args.csvRow.metro_station,
      accessibility: args.csvRow.accessibility,
      guidedTours: args.csvRow.guided_tours,
      parking: args.csvRow.parking,
      nearbyAmenities: args.csvRow.nearby_amenities,
      officialWebsite: args.csvRow.official_website,
      wikipedia: args.csvRow.wikipedia,
      specialNotes: args.csvRow.special_notes,
    });
    
    return placeId;
  },
});
