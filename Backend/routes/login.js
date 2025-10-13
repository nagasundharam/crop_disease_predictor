// routes/login/login.js
import express from "express";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";

export default function createAuthRoutes(db) {
  const router = express.Router();
  const usersCollection = db.collection("users");

  // Login
  router.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) return res.status(400).json({ message: "Username and password required" });

      const user = await usersCollection.findOne({ username: username.toLowerCase().trim() });
      if (!user) return res.status(401).json({ message: "Invalid credentials" });

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" });

      res.json({
        message: "✅ Login successful",
        user: {
          id: user._id,
          username: user.username
        }
      });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ message: "❌ Error logging in", error: err.message });
    }
  });

  return router;
}
