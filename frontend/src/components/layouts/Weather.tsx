import { useEffect, useState } from "react";
import axios from "axios";

interface WeatherData {
  city: string;
  temp: number;
  icon: string;
}

export const WeatherDisplay = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [loadErr, setLoadErr] = useState<GeolocationPositionError | Error | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const getWeather = async (lat: number, lon: number) => {
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
        setLoadErr(err as Error);
      } finally {
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          getWeather(lat, lon);
        },
        (err) => {
          setLoadErr(err);
          setLoading(false);
          console.error("Không lấy được vị trí: ", err);
        }
      );
    } else {
      setLoadErr(new Error("Trình duyệt không hỗ trợ geolocation."));
      setLoading(false);
    }
  }, []);

  const getWeatherIcon = (main: string): string => {
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
      <div className="reddit-regular">Loading...</div>
    ) : loadErr ? (
      <div className="text-red-500 reddit-regular">Đã xảy ra lỗi.</div>
    ) : (
      <div></div>
    );
  }

  return (
    <div className="text-white reddit-semibold text-sm md:text-base">
      {weather.city} {weather.icon} {weather.temp}°C
    </div>
  );
};
