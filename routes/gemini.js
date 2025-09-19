// gemini.js
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
console.log(genAI);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Get disease details from Gemini
 * @param {string} diseaseName - Name of the disease
 * @returns {Promise<object>} - JSON output
 */
export async function getDiseaseDetails(diseaseName) {
  try {
    const prompt = `
      You are a plant pathology expert.
      Provide information in strict JSON format only (no extra text).
      JSON format:
      {
        "name": "<disease name>",
        "description": "<about 200 words detailed explanation>",
        "organic_cure": "<organic treatment methods>",
        "inorganic_cure": "<inorganic treatment methods>"
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
