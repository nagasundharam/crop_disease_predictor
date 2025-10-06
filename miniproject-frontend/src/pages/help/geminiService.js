import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyAoCLWD_jTlF0aTyxPZzgf0jXKU6WMETi0");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const getCropSuggestions = async ({ city, soil, weather }) => {
  try {
    const prompt = `
      You are an expert agronomist.
      Suggest only 3–5 crops for a farmer based on:
      City: ${city}
      Soil type: ${soil}
      Weather conditions: Temp ${weather.avgTemp }°C, Rain ${weather.rain}mm, Humidity ${weather.humidity}%, Wind ${weather.wind}km/h
      Reply in bullet points, minimal text, no extra explanation.
    `;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();
    return reply.split("\n").filter((line) => line.trim() !== "");
  } catch (err) {
    console.error(err);
    return ["⚠️ Could not fetch crop suggestions"];
  }
};
