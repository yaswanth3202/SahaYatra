import React, { useState, useEffect } from 'react';
import { Cloud, Droplets, Wind, Eye, Thermometer, Gauge, Sun, RefreshCw, MapPin } from 'lucide-react';
import { WeatherService, WeatherData } from '../services/weatherService';

interface WeatherWidgetProps {
  location: string;
  className?: string;
  showDetails?: boolean;
}

export function WeatherWidget({ location, className = '', showDetails = true }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWeatherData();
  }, [location]);

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);
      const weatherData = await WeatherService.getWeatherData(location);
      setWeather(weatherData);
    } catch (err) {
      setError('Failed to load weather data');
      console.error('Weather loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadWeatherData();
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
        <div className="flex items-center justify-center space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
          <span className="text-gray-600">Loading weather...</span>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
        <div className="text-center">
          <Cloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 mb-3">Weather data unavailable</p>
          <button
            onClick={handleRefresh}
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-lg p-6 border border-blue-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">{weather.location}</h3>
        </div>
        <button
          onClick={handleRefresh}
          className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
          title="Refresh weather"
        >
          <RefreshCw className="w-4 h-4 text-blue-600" />
        </button>
      </div>

      {/* Main Weather Info */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="text-4xl">{weather.icon}</div>
          <div>
            <div className="text-3xl font-bold text-gray-800">
              {WeatherService.formatTemperature(weather.temperature)}
            </div>
            <div className="text-gray-600 capitalize">{weather.condition}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">
            Updated {new Date(weather.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Weather Details */}
      {showDetails && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Humidity */}
          <div className="bg-white/60 rounded-lg p-3 text-center">
            <Droplets className="w-5 h-5 text-blue-500 mx-auto mb-1" />
            <div className="text-sm text-gray-600">Humidity</div>
            <div className="text-lg font-semibold text-gray-800">{weather.humidity}%</div>
          </div>

          {/* Wind Speed */}
          <div className="bg-white/60 rounded-lg p-3 text-center">
            <Wind className="w-5 h-5 text-green-500 mx-auto mb-1" />
            <div className="text-sm text-gray-600">Wind</div>
            <div className="text-lg font-semibold text-gray-800">
              {WeatherService.formatWindSpeed(weather.windSpeed)}
            </div>
          </div>

          {/* Pressure */}
          <div className="bg-white/60 rounded-lg p-3 text-center">
            <Gauge className="w-5 h-5 text-purple-500 mx-auto mb-1" />
            <div className="text-sm text-gray-600">Pressure</div>
            <div className="text-lg font-semibold text-gray-800">
              {WeatherService.formatPressure(weather.pressure)}
            </div>
          </div>

          {/* Visibility */}
          <div className="bg-white/60 rounded-lg p-3 text-center">
            <Eye className="w-5 h-5 text-orange-500 mx-auto mb-1" />
            <div className="text-sm text-gray-600">Visibility</div>
            <div className="text-lg font-semibold text-gray-800">
              {WeatherService.formatVisibility(weather.visibility)}
            </div>
          </div>
        </div>
      )}

      {/* UV Index */}
      {showDetails && (
        <div className="mt-4 bg-white/60 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sun className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-gray-600">UV Index</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold text-gray-800">{weather.uvIndex}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                weather.uvIndex <= 2 ? 'bg-green-100 text-green-800' :
                weather.uvIndex <= 5 ? 'bg-yellow-100 text-yellow-800' :
                weather.uvIndex <= 7 ? 'bg-orange-100 text-orange-800' :
                'bg-red-100 text-red-800'
              }`}>
                {WeatherService.getUVIndexDescription(weather.uvIndex)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Weather Description */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600 italic">
          {weather.description}
        </p>
      </div>
    </div>
  );
}

// Compact weather widget for smaller spaces
export function CompactWeatherWidget({ location, className = '' }: { location: string; className?: string }) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeatherData();
  }, [location]);

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      const weatherData = await WeatherService.getWeatherData(location);
      setWeather(weatherData);
    } catch (err) {
      console.error('Weather loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-3 ${className}`}>
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
          <span className="text-sm text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-3 ${className}`}>
        <div className="flex items-center space-x-2">
          <Cloud className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">Weather unavailable</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md p-3 border border-blue-200 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{weather.icon}</span>
          <div>
            <div className="text-lg font-semibold text-gray-800">
              {WeatherService.formatTemperature(weather.temperature)}
            </div>
            <div className="text-xs text-gray-600 capitalize">{weather.condition}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">
            {weather.humidity}% humidity
          </div>
          <div className="text-xs text-gray-500">
            {WeatherService.formatWindSpeed(weather.windSpeed)}
          </div>
        </div>
      </div>
    </div>
  );
}
