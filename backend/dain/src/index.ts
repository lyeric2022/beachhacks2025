import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import { defineDAINService, ToolConfig } from "@dainprotocol/service-sdk";
import { CardUIBuilder, MapUIBuilder } from "@dainprotocol/utils";
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';

// Load environment variables from .env file
const homeDir = os.homedir();
const envPaths = [
  path.join(process.cwd(), '.env'),                              // Current directory
  path.join(homeDir, 'Repos/r/beachhacks2025/backend/dain/.env') // Project directory
];

// Find and load the first available .env file
let envLoaded = false;
for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log(`Loaded environment variables from ${envPath}`);
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  console.warn('No .env file found. Using environment variables if available.');
  dotenv.config(); // Try to load from process.env anyway
}

// Helper: returns an emoji based on temperature.
function getWeatherEmoji(temperature: number) {
  if (temperature < 0) return "❄️";
  if (temperature < 20) return "🌥️";
  return "☀️";
}

// Get Supabase credentials from environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// Validate required environment variables
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing required environment variables: SUPABASE_URL or SUPABASE_ANON_KEY');
  console.error('Please create a .env file with these variables or set them in your environment');
  process.exit(1);
}

// Create Supabase client with environment variables
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Tool: Get Supabase Data
 *
 * Queries the "assignments", "courses", and "user" tables and returns
 * a UI showing the JSON data even if the tables are empty.
 */
const getSupabaseDataConfig: ToolConfig = {
  id: "get-supabase-data",
  name: "Get Supabase Data",
  description: "Fetches data from assignments, courses, and user tables.",
  input: z.object({}).describe("No special input parameters needed."),
  output: z
    .object({
      assignments: z.array(z.any()).optional(),
      courses: z.array(z.any()).optional(),
      user: z.array(z.any()).optional(),
    })
    .describe("Data fetched from Supabase."),
  pricing: { pricePerUse: 0, currency: "USD" },
  handler: async (input, agentInfo, context) => {
    console.log(`User/Agent ${agentInfo.id} requested data from Supabase.`);

    try {
      // Query each table.
      const { data: assignments, error: errorA } = await supabase
        .from("assignments")
        .select("*");
      const { data: courses, error: errorC } = await supabase
        .from("courses")
        .select("*");
      const { data: userData, error: errorU } = await supabase
        .from("user")
        .select("*");

      if (errorA || errorC || errorU) {
        const errMsg =
          errorA?.message || errorC?.message || errorU?.message || "Unknown error";
        return {
          text: `Error while fetching data from Supabase: ${errMsg}`,
          data: {},
          ui: new CardUIBuilder()
            .setRenderMode("page")
            .title("Supabase Query Error")
            .content(errMsg)
            .build(),
        };
      }

      // Ensure we always have arrays.
      const assignmentsData = assignments || [];
      const coursesData = courses || [];
      const userDataFinal = userData || [];

      // Build UI cards to display the JSON data.
      const assignmentsCard = new CardUIBuilder()
        .content("Assignments:\n" + JSON.stringify(assignmentsData, null, 2))
        .build();
      const coursesCard = new CardUIBuilder()
        .content("Courses:\n" + JSON.stringify(coursesData, null, 2))
        .build();
      const userCard = new CardUIBuilder()
        .content("User Data:\n" + JSON.stringify(userDataFinal, null, 2))
        .build();

      return {
        text: "Successfully fetched data from Supabase!",
        data: {
          assignments: assignmentsData,
          courses: coursesData,
          user: userDataFinal,
        },
        ui: new CardUIBuilder()
          .setRenderMode("page")
          .title("Supabase Data Results")
          .addChild(assignmentsCard)
          .addChild(coursesCard)
          .addChild(userCard)
          .build(),
      };
    } catch (error: any) {
      return {
        text: `Exception occurred: ${error.message}`,
        data: {},
        ui: new CardUIBuilder()
          .setRenderMode("page")
          .title("Supabase Exception")
          .content(error.message)
          .build(),
      };
    }
  },
};

/**
 * Tool: Get Weather
 *
 * Uses the OpenMeteo API to fetch current weather data.
 */
const getWeatherConfig: ToolConfig = {
  id: "get-weather",
  name: "Get Weather",
  description: "Fetches current weather for a city",
  input: z
    .object({
      locationName: z.string().describe("Location name"),
      latitude: z.number().describe("Latitude coordinate"),
      longitude: z.number().describe("Longitude coordinate"),
    })
    .describe("Input parameters for the weather request"),
  output: z
    .object({
      temperature: z.number().describe("Current temperature in Celsius"),
      windSpeed: z.number().describe("Current wind speed in km/h"),
    })
    .describe("Current weather information"),
  pricing: { pricePerUse: 0, currency: "USD" },
  handler: async ({ locationName, latitude, longitude }, agentInfo, context) => {
    console.log(
      `User / Agent ${agentInfo.id} requested weather at ${locationName} (${latitude},${longitude})`
    );
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m`
    );
    const { temperature_2m, wind_speed_10m } = response.data.current;
    const weatherEmoji = getWeatherEmoji(temperature_2m);
    return {
      text: `The current temperature in ${locationName} is ${temperature_2m}°C with wind speed of ${wind_speed_10m} km/h`,
      data: {
        temperature: temperature_2m,
        windSpeed: wind_speed_10m,
      },
      ui: new CardUIBuilder()
        .setRenderMode("page")
        .title(`Current Weather in ${locationName} ${weatherEmoji}`)
        .addChild(
          new MapUIBuilder()
            .setInitialView(latitude, longitude, 10)
            .setMapStyle("mapbox://styles/mapbox/streets-v12")
            .addMarkers([
              {
                latitude,
                longitude,
                title: locationName,
                description: `Temperature: ${temperature_2m}°C\nWind: ${wind_speed_10m} km/h`,
                text: `${locationName} ${weatherEmoji}`,
              },
            ])
            .build()
        )
        .content(`Temperature: ${temperature_2m}°C\nWind Speed: ${wind_speed_10m} km/h`)
        .build(),
    };
  },
};

// Define the DAIN Service.
const dainService = defineDAINService({
  metadata: {
    title: "Weather + Supabase DAIN Service",
    description: "A DAIN service showing weather data and a Supabase query example",
    version: "1.0.0",
    author: "Your Name",
    tags: ["weather", "supabase", "dain"],
    logo: "https://cdn-icons-png.flaticon.com/512/252/252035.png",
  },
  identity: {
    // You can continue to use environment variables for the API key.
    apiKey: process.env.DAIN_API_KEY,
  },
  tools: [getWeatherConfig, getSupabaseDataConfig],
});

// Start the DAIN service and then output Supabase data to the console.
dainService.startNode().then(({ address }) => {
  console.log("DAIN Service is running at :" + address().port);
  outputSupabaseData();
});

// Function to quickly output the Supabase data to the console.
async function outputSupabaseData() {
  try {
    const { data: assignments, error: errorA } = await supabase
      .from("assignments")
      .select("*");
    const { data: courses, error: errorC } = await supabase
      .from("courses")
      .select("*");
    const { data: userData, error: errorU } = await supabase.from("user").select("*");

    if (errorA || errorC || errorU) {
      console.error("Error fetching data from Supabase:", errorA || errorC || errorU);
      return;
    }

    console.log("Supabase Data:");
    console.log("Assignments:", assignments || []);
    console.log("Courses:", courses || []);
    console.log("User Data:", userData || []);
  } catch (error: any) {
    console.error("Exception while fetching Supabase data:", error.message);
  }
}
