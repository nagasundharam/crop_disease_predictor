import express from "express";
import { predictCrop } from "../services/cropService.js";

const router = express.Router();

// POST /api/crop/predict
router.post("/predict", async (req, res) => {
  try {
    const inputData = req.body;
    const prediction = await predictCrop(inputData);
    res.json(prediction);
  } catch (error) {
    res.status(500).json({ error: "Prediction failed", details: error.message });
  }
});

export default router;
