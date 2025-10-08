import express from "express";
import multer from "multer";
import fs from "fs";
import fetch from "node-fetch";
import dotenv from "dotenv";
import FormData from "form-data";
import { getDiseaseDetails } from "./gemini.js";
import { getCropSuggestions } from "./gemini.js"
import { getFriendlyAdvice } from "./gemini.js";


dotenv.config();
const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Hugging Face API (replace with inference API if needed)
const API_URL = "https://mridulverma-crop-disease-apini.hf.space/predict";
const API_KEY = process.env.HF_API_KEY;

async function queryModel(filePath) {
  try {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        ...(API_KEY && { Authorization: `Bearer ${API_KEY}` }),
        ...formData.getHeaders(), // important for multipart
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(
        `HF API failed with ${response.status}: ${await response.text()}`
      );
    }

    return await response.json();
  } catch (err) {
    console.error("❌ Error querying model:", err.message);
    return null;
  }
}



router.post("/suggested-crops", async (req, res) => {
  const { city, soil, weather } = req.body;
  try {
    const crops = await getCropSuggestions({ city, soil, weather });
    return res.json({ crops });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch crop suggestions from Gemini" });
  }
});

router.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) return res.status(400).json({ reply: "Please type your message." });

  try {
    const reply = await getFriendlyAdvice(message);
    res.json({ reply });
  } catch (err) {
    console.error("Chatbot error:", err);
    res.status(500).json({ reply: "⚠️ Something went wrong. Please try again." });
  }
});



router.post("/predict", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const result = await queryModel(req.file.path);
  fs.unlinkSync(req.file.path); // delete file after use

  if (!result) return res.status(500).json({ error: "Prediction failed" });

  try {
    console.log("Model raw result:", result);
    const detectedDisease =
      result.predicted_class || result.label || JSON.stringify(result);

    console.log("0Detected Disease:", detectedDisease);

    const response = await getDiseaseDetails(detectedDisease );
    res.json(response);
  } catch (err) {
    console.error("⚠️ Parsing error:", err.message);
    return res.status(500).json({ error: "Failed to parse prediction" });
  }
});

export default router;
