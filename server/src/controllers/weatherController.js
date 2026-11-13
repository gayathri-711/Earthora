import { asyncHandler, sendSuccess } from '../utils/http.js';

const REGIONAL_WEATHER = {
  sonoma: {
    regionName: 'Sonoma Valley & North Coast',
    station: 'Sonoma Agrometeorology Station 04',
    coordinates: '38.29° N, 122.45° W',
    current: {
      temperature: 21,
      feelsLike: 20,
      condition: 'Partly Sunny · Excellent Soil Work',
      humidity: 58,
      rainfallMm: 0.0,
      windSpeedKmh: 11,
      windDirection: 'NW',
      uvIndex: 4,
      soilTempC: 17,
      evapotranspirationMm: 3.2,
      frostRisk: 'Low',
    },
    forecast: [
      { day: 'Today', tempHigh: 22, tempLow: 11, condition: 'Sunny', rainProb: 5, spraySuitability: 'Optimal' },
      { day: 'Tomorrow', tempHigh: 21, tempLow: 12, condition: 'Partly Cloudy', rainProb: 15, spraySuitability: 'Good' },
      { day: 'Friday', tempHigh: 19, tempLow: 10, condition: 'Morning Mist', rainProb: 20, spraySuitability: 'Moderate' },
      { day: 'Saturday', tempHigh: 20, tempLow: 9, condition: 'Clear', rainProb: 0, spraySuitability: 'Optimal' },
      { day: 'Sunday', tempHigh: 23, tempLow: 11, condition: 'Warm & Sunny', rainProb: 0, spraySuitability: 'Optimal' },
    ],
    advisories: [
      {
        id: 'adv-1',
        type: 'irrigation',
        severity: 'Normal',
        title: 'Optimal Irrigation Window',
        description: 'Atmospheric evapotranspiration is 3.2mm. Recommend 45-minute morning drip pulse for root development.',
      },
      {
        id: 'adv-2',
        type: 'spraying',
        severity: 'Favorable',
        title: 'Ideal Organic Neem / Foliar Spray Window',
        description: 'Low wind speeds (< 12 km/h) and moderate humidity ensure high absorption with zero drift.',
      },
    ],
  },
  willamette: {
    regionName: 'Willamette Valley & Cascades',
    station: 'Willamette Agritech Station 09',
    coordinates: '44.94° N, 123.03° W',
    current: {
      temperature: 17,
      feelsLike: 16,
      condition: 'Gentle Overcast',
      humidity: 72,
      rainfallMm: 1.4,
      windSpeedKmh: 8,
      windDirection: 'SW',
      uvIndex: 3,
      soilTempC: 15,
      evapotranspirationMm: 2.1,
      frostRisk: 'Very Low',
    },
    forecast: [
      { day: 'Today', tempHigh: 18, tempLow: 9, condition: 'Light Mist', rainProb: 35, spraySuitability: 'Moderate' },
      { day: 'Tomorrow', tempHigh: 19, tempLow: 10, condition: 'Scattered Showers', rainProb: 40, spraySuitability: 'Fair' },
      { day: 'Friday', tempHigh: 20, tempLow: 11, condition: 'Clearing', rainProb: 10, spraySuitability: 'Optimal' },
      { day: 'Saturday', tempHigh: 22, tempLow: 12, condition: 'Sunny', rainProb: 0, spraySuitability: 'Optimal' },
      { day: 'Sunday', tempHigh: 21, tempLow: 11, condition: 'Mild', rainProb: 5, spraySuitability: 'Good' },
    ],
    advisories: [
      {
        id: 'adv-3',
        type: 'disease',
        severity: 'Watch',
        title: 'Leaf Moisture & Powdery Mildew Watch',
        description: 'Elevated relative humidity overnight. Monitor brassica canopy spacing to ensure airflow.',
      },
    ],
  },
  hudson: {
    regionName: 'Hudson Valley & Northeast',
    station: 'Hudson Agro-Telemetry Station 12',
    coordinates: '41.70° N, 73.92° W',
    current: {
      temperature: 14,
      feelsLike: 13,
      condition: 'Crisp & Clear',
      humidity: 50,
      rainfallMm: 0.0,
      windSpeedKmh: 14,
      windDirection: 'NNE',
      uvIndex: 3,
      soilTempC: 12,
      evapotranspirationMm: 1.9,
      frostRisk: 'Moderate Overnight',
    },
    forecast: [
      { day: 'Today', tempHigh: 15, tempLow: 4, condition: 'Breezy Clear', rainProb: 0, spraySuitability: 'Fair' },
      { day: 'Tomorrow', tempHigh: 16, tempLow: 3, condition: 'Overnight Frost Risk', rainProb: 5, spraySuitability: 'Good' },
      { day: 'Friday', tempHigh: 18, tempLow: 6, condition: 'Sunny', rainProb: 0, spraySuitability: 'Optimal' },
      { day: 'Saturday', tempHigh: 17, tempLow: 7, condition: 'Partly Cloudy', rainProb: 15, spraySuitability: 'Optimal' },
      { day: 'Sunday', tempHigh: 15, tempLow: 5, condition: 'Cool Crisp', rainProb: 10, spraySuitability: 'Good' },
    ],
    advisories: [
      {
        id: 'adv-4',
        type: 'frost',
        severity: 'Warning',
        title: 'Light Ground Frost Alert (Tomorrow Night)',
        description: 'Expected low 3°C between 4am–6am. Cover sensitive tender seedlings or run low-volume misting.',
      },
    ],
  },
};

export const getWeatherIntelligence = asyncHandler(async (req, res) => {
  const region = (req.query.region || 'sonoma').toLowerCase();
  const data = REGIONAL_WEATHER[region] || REGIONAL_WEATHER.sonoma;
  sendSuccess(res, { weather: data, availableRegions: Object.keys(REGIONAL_WEATHER) });
});

