import { useState, useCallback } from "react";
import '../assets/css/WeatherForecast.css';

interface WeatherData {
  location: {
    name: string;
    countryCode: string;
    latitude: number;
    longitude: number;
    timezone: string;

  };
    weather: {
        latitude: number;
        longitude: number;
        timezone: string;
        current: {
            time: string;
            temperatureC: number;
            relativeHumidityPercent: number;
            apparentTemperatureC: number;
            precipitationMm: number;
            weatherCode: number;
            windSpeedKmh: number;
        };
    };
}   

const WeatherPage = () => {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const API_BASE = `${API_BASE_URL}/api/Weather/current-by-city`;

    const fetchWeather = useCallback(async () => {
        if (!city.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const url = `${API_BASE}?city=${encodeURIComponent(city)}`; 
            const response = await fetch(url, {
                headers: {
                    'Accept': 'text/plain' ,
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: WeatherData = await response.json();
            setWeather(data);
            setHasSearched(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, [city]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchWeather();
    };

    return (
        <div style={{ paddingTop: '100px' }} className="weather-container">
            <h1 >Weather Forecast</h1>
            <form onSubmit={handleSearch} className="weather-form">
                <input
                    type="text"
                    placeholder="Enter city name"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="weather-input"
                />
                <button type="submit" className="weather-button">Get Weather</button>
            </form>
            {loading && <p>Loading...</p>}
            {error && <p className="weather-error">{error}</p>}
            {weather && (
                <div className="weather-result">
                    <h2>{weather.location.name}, {weather.location.countryCode}</h2>
                    <p>{weather.weather.current.windSpeedKmh} km/h</p>
          
                    <p>{weather.weather.current.apparentTemperatureC}°C</p>
                </div>
            )}
            {!loading && !error && hasSearched && !weather && (
                <p className="weather-error">No weather data found for "{city}". Please try another city.</p>
            )}
        </div>
    );
}

export default WeatherPage;
