import { useEffect, useState } from "react";
import axios from "axios";

export const WeatherDisplay = () => {
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const apiKey = "41299a0df21ef16f8b552a0bb25da5ac";

          try {
            const response = await axios.get(
              `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
            );

            const data = response.data;
            const city = data.name;
            const temp = Math.round(data.main.temp);
            const icon = getWeatherIcon(data.weather[0].main);

            setWeather({ city, temp, icon });
          } catch (err) {
            setLoadErr(err);
            setLoading(false);
            console.error("Lỗi khi lấy thời tiết: ", err);
          }
        },
        (err) => {
          setLoadErr(err);
          setLoading(false);
          console.error("Không lấy được vị trí: ", err);
        }
      );
    } else {
      setLoading(false);
      console.error("Trình duyệt không hỗ trợ geolocation.");
    }
  }, []);

  const getWeatherIcon = (main) => {
    switch (main) {
      case "Clear":
        return "☀️";
      case "Clouds":
        return "☁️";
      case "Rain":
        return "🌧️";
      case "Thunderstorm":
        return "⛈️";
      case "Snow":
        return "❄️";
      case "Mist":
      case "Fog":
        return "🌫️";
      default:
        return "🌤️";
    }
  };

  if (!weather) {
    return loading ? (
      <div className="poppins-regular">Loading...</div>
    ) : (
      <div></div>
    );
  }

  return (
    <div className="text-white poppins-semibold">
      {weather.city} {weather.icon} {weather.temp}°C
    </div>
  );
}
