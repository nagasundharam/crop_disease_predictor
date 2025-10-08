import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cropdisease.css";

const Cropdisease = () => {
  const [plantName, setPlantName] = useState("");
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please upload an image");
      return;
    }

    setLoading(true);

    try {
      // Prepare form data
      const formData = new FormData();
      formData.append("plantName", plantName);
      formData.append("image", image);
      const BACKEND_URL =  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      console.log("Backend URL:", BACKEND_URL);
      // Send to backend API (update the URL to your server endpoint)
      const response = await fetch(`${BACKEND_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch disease detection result");
      }

      const data = await response.json();

      // Example response: { disease: "Leaf Spot", solution: "Apply fungicide..." }
      setResult(data);
      console.log("Detection result:", data);
    } catch (error) {
      console.error(error);
      alert("Error detecting plant disease. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crop-container">
      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back
      </button>

      <h1 className="title">🌿 Plant Disease Detector</h1>

      {!result ? (
        <form className="form" onSubmit={handleSubmit}>
          <label className="label">Plant Name</label>
          <input
            type="text"
            value={plantName}
            onChange={(e) => setPlantName(e.target.value)}
            placeholder="Enter plant name..."
            required
          />

          <label className="label">Upload Plant Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Detecting..." : "Detect Disease"}
          </button>
        </form>
      ) : (
        <div className="result-box">
          <h2>
            🌱 Plant: <span>{plantName}</span>
          </h2>

          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="Plant"
              className="preview-img"
            />
          )}

          <div className="info">
            <p>
              <strong>🦠 Disease:</strong> {result.name}
            </p>
            <p>
              <strong> Describtion : </strong> {result.description }
            </p>
            <p>
              <strong>💡Inorganic  Solution:</strong> {result.inorganic_cure}
            </p>
            <p>
              <strong>💡 Organic Solution:</strong> {result.organic_cure}
            </p>
          </div>
          

          <button className="submit-btn" onClick={() => setResult(null)}>
            Check Another Plant
          </button>
        </div>
      )}
    </div>
  );
};

export default Cropdisease;
