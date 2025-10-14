import express from "express";
import bcrypt from "bcryptjs";

export default function createRegisterRoutes(db) {
  const router = express.Router();
  const usersCollection = db.collection("users");

  // ================================
  // 👥 Register Route
  // ================================
  router.post("/register", async (req, res) => {
    try {
      const { username, password, age, address, occupation, landType, contactInfo, cropPreference } = req.body;

      // Basic validation
      if (!username || !password || !contactInfo) {
        return res.status(400).json({ message: "Username, password, and contact info are required" });
      }

      if (username.length < 3) {
        return res.status(400).json({ message: "Username must be at least 3 characters long" });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
      }

      // ✅ Check if username, password, or contactInfo already exist
      const existingUser = await usersCollection.findOne({
        $or: [
          { username: username.toLowerCase().trim() },
          { password: password }, // ⚠️ we'll still hash new passwords, but checking raw here for duplication
          { contactInfo: contactInfo.trim() }
        ]
      });

      if (existingUser) {
        return res.status(409).json({
          message: "A user with the same username, password, or contact info already exists"
        });
      }

      // Hash password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user
      const result = await usersCollection.insertOne({
        username: username.toLowerCase().trim(),
        password: hashedPassword,
        age: age || null,
        address: address || "",
        occupation: occupation || "",
        landType: landType || "",
        contactInfo: contactInfo.trim(),
        cropPreference: cropPreference || "",
        createdAt: new Date()
      });

      res.status(201).json({
        message: "✅ User registered successfully",
        user: {
          id: result.insertedId,
          username: username.trim(),
          age,
          address,
          occupation,
          landType,
          contactInfo,
          cropPreference
        }
      });
    } catch (err) {
      console.error("Registration error:", err);
      res.status(500).json({ message: "❌ Error registering user", error: err.message });
    }
  });

  return router;
}
