// gemini.js
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
console.log(genAI);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });


/**
 * Get disease details from Gemini
 * @param {string} diseaseName - Name of the disease
 * @returns {Promise<object>} - JSON output
 */
export async function getDiseaseDetails(diseaseName) {
  try {
const prompt = `
  You are a plant pathology expert.
  Explain the disease in **simple, easy-to-understand language** so that anyone without scientific background can understand.
  Provide information in strict JSON format only (no extra text).
  JSON format:
  {
    "name": "<disease name>",
    "description": "<about 50 words, simple explanation of the disease in plain English>",
    "organic_cure": "<simple, short treatment methods in 10-20 words>",
    "inorganic_cure": "<simple, short treatment methods in 10-20 words>"
  }
  Disease: ${diseaseName}
`;



    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    if (text.startsWith("```")) {
      text = text.replace(/```json|```/g, "").trim();
    }

    // ✅ Parse JSON safely
    try {
      return JSON.parse(text);
    } catch (err) {
      console.error("⚠️ JSON parse failed, raw output:", text);
      return { error: "Invalid JSON from Gemini", raw: text };
    }

  } catch (error) {
    return { error: error.message };
  }
}
/**
 * Get crop suggestions from Gemini
 * @param {object} params - { city, soil, weather: { temp, rain, humidity, wind } }
 * @returns {Promise<Array<string>>} - Array of crop names
 */
export async function getCropSuggestions({ city, soil, weather }) {
  try {
   const prompt = `
  You are an expert agricultural advisor.
  Suggest the best crops for:
  - City: ${city}
  - Soil: ${soil}
  - Weather: Temp ${weather.temp}°C, Rain ${weather.rain}mm, Humidity ${weather.humidity}%, Wind ${weather.wind}km/h

  Respond **only with a JSON array** of crop names.
  Include both **English and Tamil names** for each crop where possible.
  Include popular and regionally famous crops in the suggestions.
  
  Example response format:
  [
    "Rice (அரிசி)",
    "Wheat (கோதுமை)",
    "Maize (மக்காச்சோளம்)",
    "Sugarcane (சர்க்கரை வளா்)",
    "Tomato (தக்காளி)"
  ]
`;


    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    if (text.startsWith("```")) text = text.replace(/```json|```/g, "").trim();

    const crops = JSON.parse(text);
    return Array.isArray(crops) ? crops : [];
  } catch (err) {
    console.error("Gemini crop suggestion error:", err);
    return [];
  }
}
/**
 * Get friendly plant advice from Gemini
 * @param {string} userQuery
 * @returns {Promise<string>} - Friendly chatbot response
 */
export async function getFriendlyAdvice(userQuery) {
  try {
const prompt = `
  You are a friendly plant assistant for farmers.
  Respond in simple, easy-to-understand language.
  Give practical, region-appropriate farming advice.
  Be encouraging and polite.

  Match the language and writing style of the user's question exactly:
    - If the user asks in Tamil, reply in Tamil.
    - If the user asks in Malayalam, reply in Malayalam.
    - If the user asks in Hindi, reply in Hindi.
    - If the user asks in English, reply in English.
    - If the user writes a regional language (like Hindi or Tamil) using English letters (e.g., "mera paudha sookh gaya" or "enna maram valarala"),
      then reply in the **same transliterated format** (the same language written in English letters).

  User says: "${userQuery}"
`;
;



    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (err) {
    console.error("Error from Gemini Chat:", err);
    return "⚠️ Sorry, I couldn't fetch advice. Please try again.";
  }
}
