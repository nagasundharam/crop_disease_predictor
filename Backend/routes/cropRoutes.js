// croproutes.js
import express from "express";
import multer from "multer";
import path from "path";
import { predictCrop } from "../services/cropService.js";


const router = express.Router();

// Configure multer storage
const storage = multer.memoryStorage(); // store in memory; optional: diskStorage
const upload = multer({ storage });

// POST /api/crop/predict
router.post("/predict", upload.single("image"), async (req, res) => {
  try {
    const { plantName } = req.body;
    const imageFile = req.file; // uploaded image

    if (!plantName || !imageFile) {
      return res.status(400).json({ error: "Plant name and image are required" });
    }

    // Call your service with plantName and image buffer
    const prediction = await predictCrop({ plantName, image: imageFile });
    console.log("Prediction result:", prediction);

    res.json(prediction); // Example: { disease: "Leaf Spot", solution: "Apply fungicide" }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Prediction failed", details: error.message });
  }
});



export default router;
