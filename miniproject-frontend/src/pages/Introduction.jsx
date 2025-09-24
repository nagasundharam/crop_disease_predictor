import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Intro.css";

const Introduction = () => {
  const navigate = useNavigate();
  const pages = [
    { title: "🌾 Crop Plant Disease Prediction", desc: "Welcome! Explore the platform features." },
    { title: "🌱 Soil Monitor", desc: "Track soil quality, pH levels, and nutrients." },
    { title: "☁️ Weather Prediction", desc: "Get accurate weather forecasts for your crops." },
    { title: "🤖 AI Crop Advice & Solutions", desc: "Receive AI-powered recommendations." },
    { title: "🏛 Government Schemes", desc: "Stay updated with latest schemes and subsidies." },
    { title: "💹 Mandi Price Prediction", desc: "Check mandi prices and maximize profits." },
  ];

  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < pages.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem("introSeen", "true");
      navigate("/register"); // go to register after intro
    }
  };

  return (
    <div className="intro-container">
      <div className="intro-card">
        <h1 className="intro-title">{pages[step].title}</h1>
        <p className="intro-desc">{pages[step].desc}</p>

        <button onClick={handleNext} className="intro-btn">
          {step === pages.length - 1 ? "Finish" : "Next"}
        </button>

        <div className="intro-dots">
          {pages.map((_, i) => (
            <span key={i} className={`dot ${i === step ? "active" : ""}`}></span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Introduction;
