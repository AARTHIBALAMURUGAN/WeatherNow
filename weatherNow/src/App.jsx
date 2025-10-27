import { useState } from "react";
import "./App.css";

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    setLoading(true);
    setError("");
    setWeather(null);

    try {
      // Get coordinates from Open-Meteo Geocoding API
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error("City not found.");
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // Get current weather
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherData = await weatherRes.json();

      setWeather({
        name,
        country,
        ...weatherData.current_weather,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>🌤️ Weather Checker</h1>

      <div className="search-box">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name..."
        />
        <button onClick={fetchWeather} disabled={!city || loading}>
          {loading ? "Loading..." : "Check"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="weather-card">
          <h2>
            {weather.name}, {weather.country}
          </h2>
          <p className="temp">{weather.temperature}°C</p>
          <p>💨 {weather.windspeed} km/h</p>
          <p>⏱ Updated: {new Date(weather.time).toLocaleTimeString()}</p>
        </div>
      )}
    </div>
  );
}
