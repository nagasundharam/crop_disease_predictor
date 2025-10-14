import express from "express";
import cors from "cors";
import predictorRoutes from "./routes/predictor.js";
//import geminiRoutes from "./routes/gemini.js";
import dotenv from "dotenv";
import cropRoutes from "./routes/cropRoutes.js";
import { MongoClient,ServerApiVersion} from "mongodb";

import createAuthRoutes from "./routes/login.js";
import createRegisterRoutes from "./routes/register.js";



dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Register routes

const uri = process.env.MONGO_DB;
const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1 }
});

let db;

app.use("/", predictorRoutes);


app.use("/crop", cropRoutes);



async function connectDB() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    db = client.db("CropDiseaseApp");
    console.log("✅ Connected to MongoDB successfully!");

    app.use("/auth", createAuthRoutes(db));
    app.use("/auth", createRegisterRoutes(db));

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => 
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
}

process.on("SIGINT", async () => {
  await client.close();
  console.log("🛑 MongoDB connection closed.");
  process.exit(0);
});

connectDB();