import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Weather.css";
import { getCropSuggestions } from "./help/geminiService";

const Weather = () => {
  const navigate = useNavigate();
  const [city, setCity] = useState("Delhi");
  const [soil, setSoil] = useState("alluvial");
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestedCrops, setSuggestedCrops] = useState([]);

  const apiKey = "7b6bb05c1b0c4e9c55d0c17e8b009178"; // OpenWeather API Key

  const fetchWeather = async (inputCity = city) => {
    if (!inputCity) return;
    setLoading(true);
    setDailyData([]);
    setSuggestedCrops([]);

    try {
      // --- Fetch weather data ---
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${inputCity},IN&units=metric&appid=${apiKey}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.cod !== "200") {
        alert(data.message || "City not found");
        setLoading(false);
        return;
      }

      // --- Process daily weather ---
      const daily = {};
      data.list.forEach((item) => {
        const date = item.dt_txt.split(" ")[0];
        if (!daily[date]) {
          daily[date] = { temps: [], rain: 0, humidity: [], wind: [], weather: [] };
        }
        daily[date].temps.push(item.main.temp);
        daily[date].rain += item.rain?.["3h"] || 0;
        daily[date].humidity.push(item.main.humidity);
        daily[date].wind.push(item.wind.speed);
        daily[date].weather.push(item.weather[0].main.toLowerCase());
      });

      const dailyTable = Object.keys(daily).map((date) => {
        const temps = daily[date].temps;
        const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
        const avgHumidity =
          daily[date].humidity.reduce((a, b) => a + b, 0) / daily[date].humidity.length;
        const avgWind =
          daily[date].wind.reduce((a, b) => a + b, 0) / daily[date].wind.length;

        // Farmer-friendly note
        let note = "✅ Normal conditions";
        if (avgHumidity > 80 && daily[date].rain > 5) note = "🌧️ Risk of fungal disease";
        else if (avgHumidity < 60 && avgTemp > 30 && daily[date].rain === 0)
          note = "☀️ Good for harvesting";
        else if (avgWind > 15) note = "💨 Strong winds — protect crops";

        return {
          date,
          avgTemp: avgTemp.toFixed(1),
          rain: daily[date].rain.toFixed(1),
          humidity: avgHumidity.toFixed(1),
          wind: avgWind.toFixed(1),
          note,
        };
      });

      setDailyData(dailyTable);

      // --- AI-driven crop suggestions ---
      const todayWeather = dailyTable[0];
    
if (todayWeather) {
  const crops = await getCropSuggestions({
    city: inputCity,
    soil,
    weather: {
      temp: parseFloat(todayWeather.avgTemp),
      rain: parseFloat(todayWeather.rain),
      humidity: parseFloat(todayWeather.humidity),
      wind: parseFloat(todayWeather.wind),
    },
  });
  setSuggestedCrops(crops);
}
    } catch (err) {
      console.error(err);
      alert("Failed to fetch weather or crop suggestions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weather-container">
      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back
      </button>

      <h1 className="title">🌤 Weather & Crop Advisor</h1>

      <div className="input-area">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city..."
        />
        <select
          value={soil}
          onChange={(e) => setSoil(e.target.value)}
          style={{ marginLeft: "10px" }}
        >
          <option value="alluvial">Alluvial</option>
          <option value="black">Black</option>
          <option value="red">Red</option>
          <option value="laterite">Laterite</option>
          <option value="sandy">Sandy</option>
        </select>
        <button
          onClick={() => fetchWeather()}
          disabled={loading}
          style={{ marginLeft: "10px" }}
        >
          {loading ? "Loading..." : "Check Weather"}
        </button>
      </div>

      {dailyData.length > 0 && (
        <>
          <table className="weather-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Temp (°C)</th>
                <th>Rain (mm)</th>
                <th>Humidity (%)</th>
                <th>Wind (km/h)</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {dailyData.map((day, index) => (
                <tr key={index}>
                  <td>{day.date}</td>
                  <td>{day.avgTemp}</td>
                  <td>{day.rain}</td>
                  <td>{day.humidity}</td>
                  <td>{day.wind}</td>
                  <td>{day.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
<div className="crop-suggestion">
  <h3>🌱 Suggested Crops:</h3>
  <div className="crop-list">
    {suggestedCrops.map((crop, i) => (
      <div key={i} className="crop-card">
        <span className="crop-icon">🌾</span>
        <span className="crop-name">{crop}</span>
      </div>
    ))}
  </div>
</div>

        </>
      )}
    </div>
  );
};

export default Weather;
