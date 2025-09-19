import express from "express";
import cors from "cors";
import predictorRoutes from "./routes/predictor.js";
//import geminiRoutes from "./routes/gemini.js";
import dotenv from "dotenv";


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Register routes
app.use("/", predictorRoutes);

const PORT = process.env.PORT||3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});