# 🌾 AI-Powered Crop Disease Prediction & Smart Farming Assistant

An intelligent smart farming system that uses **Deep Learning (VGG16)**, **real-time weather and market data**, and a **voice-supported chatbot** to assist farmers in detecting crop diseases early and making data-driven agricultural decisions.

---

## 📌 Project Overview

Agriculture plays a vital role in global food security, yet farmers face challenges such as crop diseases, unpredictable weather, and fluctuating market prices. Most existing solutions focus only on disease detection and lack real-world usability.

This project proposes a **unified AI-based smart farming platform** that:
- Detects crop diseases from leaf images using a CNN (VGG16)
- Provides live mandi (market) prices
- Offers weather-based crop calendar and plantation guidance
- Includes a multilingual, voice-enabled chatbot for farmer assistance

The system is designed to be **farmer-friendly, accessible, and sustainable**, especially for rural and small-scale farmers.

---

## ✨ Key Features

- 🧠 **AI-Based Crop Disease Detection**
  - Uses a fine-tuned **VGG16 CNN model**
  - Detects diseases from real-time or uploaded leaf images
  - High accuracy with early disease identification

- ☁️ **Real-Time Weather Forecasting**
  - Temperature, humidity, and rainfall updates
  - Helps in irrigation and crop planning decisions

- 💹 **Live Mandi Price Tracking**
  - Fetches real-time crop prices from government APIs
  - Assists farmers in deciding when and where to sell produce

- 🗓️ **Crop Calendar & Plantation Prediction**
  - Suggests best sowing and harvesting times
  - Based on climatic conditions and seasonal data

- 🗣️ **Voice-Supported Multilingual Chatbot**
  - Farmers can interact using voice in local languages
  - Provides disease information, treatment suggestions, and market insights

---

## 🚀 Novelty of the Project

- Combines **disease detection + prediction + decision support** in one system  
- Uses **real-time APIs** instead of static datasets only  
- Introduces **voice-based interaction** to bridge the digital literacy gap  
- Focuses on **actionable recommendations**, not just classification  
- Promotes **sustainable and cost-efficient farming**

---

## 🛠️ Tech Stack

### 🔹 Machine Learning & AI
- Python
- TensorFlow
- Keras (`tf.keras`)
- CNN (VGG16 – Transfer Learning)

### 🔹 Backend
- Flask / FastAPI
- REST APIs

### 🔹 Frontend
- React / Next.js / Streamlit

### 🔹 APIs & Services
- OpenWeatherMap API (Weather)
- AgriMarket / e-Mandi API (Market Prices)
- Google Speech-to-Text & Text-to-Speech (Voice Chatbot)

### 🔹 Tools
- Google Colab / Jupyter Notebook
- VS Code
- Git & GitHub

---
1. User uploads or captures a leaf image
2. Image is preprocessed and passed to the VGG16-based CNN
3. Disease is detected and classified
4. System fetches:
   - Live weather data
   - Current mandi prices
5. Chatbot provides:
   - Disease explanation
   - Treatment suggestions
   - Crop planning advice
6. Results are displayed via web/mobile interface or voice output

---

## 📊 Model Performance

- Accuracy: **~95–97%**
- Evaluation Metrics:
  - Precision
  - Recall
  - F1-score
  - Confusion Matrix

---

## 🌱 Future Enhancements

- Support for more Indian languages
- Fertilizer and pesticide dosage recommendation
- Mobile app deployment

---

## 🤝 Contribution

Contributions are welcome!
Feel free to fork this repository, raise issues, or submit pull requests.

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 👨‍🌾 Author
**Nagasundharam P**

Backend & Devops 

**Mridul Verma** 

AI & Full Stack Developer

**Kavineswar S**

Backend Developer

**Kavimalan K**

Frontend Developer

Project: Crop Disease Prediction & Smart Farming Assistant


