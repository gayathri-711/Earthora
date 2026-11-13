import { useState } from 'react';
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Cloud,
  CloudDrizzle,
  CloudLightning,
  CloudRain,
  CloudSun,
  Compass,
  Droplets,
  Eye,
  MapPin,
  Radio,
  Sun,
  Thermometer,
  Wind,
} from 'lucide-react';
import SectionHeading from '../../components/common/SectionHeading';

const REGIONAL_WEATHER = {
  sonoma: {
    name: 'Sonoma County, CA',
    description: 'Northern California Wine & Vegetable Valley',
    tempC: 22,
    feelsLikeC: 23,
    condition: 'Optimal Sun & Mild Fog',
    humidity: 58,
    precipitationChance: 5,
    rainfall24h: 0.0,
    soilTemp10cm: 18.2,
    windSpeedKmh: 7.5,
    windDirection: 'WNW',
    solarRadiation: '680 W/m²',
    uvIndex: 5,
    et0Rate: '4.2 mm/day',
    airQuality: 'Good (AQI 28)',
    advisories: [
      {
        type: 'optimal',
        title: 'Ideal Bio-Foliar Spray Window Open',
        description:
          'Wind speeds below 8 km/h and relative humidity > 55% provide ideal conditions for biological compost tea application until 11:30 AM.',
      },
      {
        type: 'info',
        title: 'High Afternoon Evapotranspiration',
        description:
          'Expected peak solar irradiance at 2:00 PM. LoRaWAN drip actuators set to supplement North Plot brassicas with 1,200L.',
      },
    ],
    forecast: [
      { day: 'Today', tempHigh: 23, tempLow: 11, condition: 'Sunny', rain: '0 mm', icon: 'sun' },
      { day: 'Tomorrow', tempHigh: 21, tempLow: 12, condition: 'Partly Cloudy', rain: '0 mm', icon: 'cloud-sun' },
      { day: 'Thursday', tempHigh: 19, tempLow: 10, condition: 'Light Mist', rain: '1.2 mm', icon: 'rain' },
      { day: 'Friday', tempHigh: 20, tempLow: 9, condition: 'Clear', rain: '0 mm', icon: 'sun' },
      { day: 'Saturday', tempHigh: 22, tempLow: 11, condition: 'Optimal', rain: '0 mm', icon: 'sun' },
    ],
  },
  willamette: {
    name: 'Willamette Valley, OR',
    description: 'Pacific Northwest River Basin & Orchards',
    tempC: 16,
    feelsLikeC: 15,
    condition: 'Overcast & High Humidity',
    humidity: 78,
    precipitationChance: 45,
    rainfall24h: 3.8,
    soilTemp10cm: 14.5,
    windSpeedKmh: 12.0,
    windDirection: 'SSW',
    solarRadiation: '390 W/m²',
    uvIndex: 3,
    et0Rate: '2.1 mm/day',
    airQuality: 'Excellent (AQI 18)',
    advisories: [
      {
        type: 'warning',
        title: 'Foliar Spray Postponement Advised',
        description:
          'Scattered afternoon drizzle will cause spray runoff. Delay biological copper and kelp feeding until Friday morning.',
      },
      {
        type: 'optimal',
        title: 'Optimal Heritage Grain Germination Moisture',
        description:
          'Topsoil moisture at 31 kPa tension. Perfect conditions for ancient einkorn winter tillering.',
      },
    ],
    forecast: [
      { day: 'Today', tempHigh: 16, tempLow: 8, condition: 'Scattered Showers', rain: '3.8 mm', icon: 'rain' },
      { day: 'Tomorrow', tempHigh: 15, tempLow: 7, condition: 'Overcast', rain: '1.5 mm', icon: 'cloud' },
      { day: 'Thursday', tempHigh: 17, tempLow: 9, condition: 'Breaks of Sun', rain: '0.4 mm', icon: 'cloud-sun' },
      { day: 'Friday', tempHigh: 18, tempLow: 8, condition: 'Partly Cloudy', rain: '0 mm', icon: 'cloud-sun' },
      { day: 'Saturday', tempHigh: 19, tempLow: 9, condition: 'Mild', rain: '0 mm', icon: 'sun' },
    ],
  },
  hudson: {
    name: 'Hudson Valley, NY',
    description: 'Northeastern River Terrace & Cold-Climate Crops',
    tempC: 13,
    feelsLikeC: 11,
    condition: 'Crisp Autumn Air',
    humidity: 62,
    precipitationChance: 10,
    rainfall24h: 0.2,
    soilTemp10cm: 11.8,
    windSpeedKmh: 14.5,
    windDirection: 'NNW',
    solarRadiation: '420 W/m²',
    uvIndex: 3,
    et0Rate: '2.4 mm/day',
    airQuality: 'Good (AQI 22)',
    advisories: [
      {
        type: 'warning',
        title: 'Frost Watch for Elevation > 300m',
        description:
          'Overnight low projected to reach 1.8°C. Deploy floating row covers over tender brassicas and winter squash patches.',
      },
    ],
    forecast: [
      { day: 'Today', tempHigh: 14, tempLow: 3, condition: 'Clear', rain: '0 mm', icon: 'sun' },
      { day: 'Tomorrow', tempHigh: 13, tempLow: 2, condition: 'Frost Alert', rain: '0 mm', icon: 'cloud' },
      { day: 'Thursday', tempHigh: 15, tempLow: 5, condition: 'Sunny', rain: '0 mm', icon: 'sun' },
      { day: 'Friday', tempHigh: 16, tempLow: 7, condition: 'Mild', rain: '0 mm', icon: 'sun' },
      { day: 'Saturday', tempHigh: 14, tempLow: 6, condition: 'Passing Showers', rain: '4.0 mm', icon: 'rain' },
    ],
  },
  lancaster: {
    name: 'Lancaster, PA',
    description: 'Piedmont Limestone Silt Loam Region',
    tempC: 18,
    feelsLikeC: 18,
    condition: 'Partly Cloudy',
    humidity: 64,
    precipitationChance: 15,
    rainfall24h: 0.0,
    soilTemp10cm: 15.6,
    windSpeedKmh: 9.0,
    windDirection: 'ENE',
    solarRadiation: '530 W/m²',
    uvIndex: 4,
    et0Rate: '3.1 mm/day',
    airQuality: 'Good (AQI 32)',
    advisories: [
      {
        type: 'optimal',
        title: 'Optimal Cover Crop Seeding Window',
        description:
          'Warm soil temperatures (15.6°C) and gentle upcoming moisture create ideal conditions for crimson clover germination.',
      },
    ],
    forecast: [
      { day: 'Today', tempHigh: 19, tempLow: 9, condition: 'Partly Sunny', rain: '0 mm', icon: 'cloud-sun' },
      { day: 'Tomorrow', tempHigh: 18, tempLow: 8, condition: 'Clear', rain: '0 mm', icon: 'sun' },
      { day: 'Thursday', tempHigh: 20, tempLow: 11, condition: 'Pleasant', rain: '0 mm', icon: 'sun' },
      { day: 'Friday', tempHigh: 19, tempLow: 10, condition: 'Scattered Clouds', rain: '0.8 mm', icon: 'cloud-sun' },
      { day: 'Saturday', tempHigh: 17, tempLow: 8, condition: 'Breezy', rain: '0 mm', icon: 'wind' },
    ],
  },
};

export default function WeatherIntelligencePage() {
  const [activeRegionKey, setActiveRegionKey] = useState('sonoma');
  const region = REGIONAL_WEATHER[activeRegionKey];

  const getWeatherIcon = (icon) => {
    switch (icon) {
      case 'sun':
        return <Sun className="h-6 w-6 text-amber-500" />;
      case 'rain':
        return <CloudRain className="h-6 w-6 text-blue-500" />;
      case 'cloud':
        return <Cloud className="h-6 w-6 text-gray-500" />;
      case 'wind':
        return <Wind className="h-6 w-6 text-teal-600" />;
      default:
        return <CloudSun className="h-6 w-6 text-amber-400" />;
    }
  };

  return (
    <div className="bg-earthora-ivory min-h-screen">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-earthora-forest py-20 text-white lg:py-24">
        <div className="absolute inset-0 opacity-15">
          <img
            src="/assets/img/home-1/hero/slider-1.jpg"
            alt="Weather Radar"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-earthora-forest via-earthora-forest/90 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-earthora-mint/30 bg-earthora-mint/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-earthora-mint uppercase">
              <Radio className="h-4 w-4 animate-pulse" />
              Live Agro-Climatic Sensor Telemetry
            </div>
            <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl">
              Weather Intelligence Engine
            </h1>
            <p className="mt-4 text-base leading-relaxed text-earthora-sand/90 sm:text-lg">
              Hyper-local micro-climate monitoring, 10cm soil thermal probes, evapotranspiration analytics,
              and predictive agronomy spray advisories tailored to organic farm stewardship.
            </p>
          </div>

          {/* Region Switcher */}
          <div className="mt-10 flex flex-wrap gap-2.5">
            {Object.entries(REGIONAL_WEATHER).map(([key, data]) => (
              <button
                key={key}
                onClick={() => setActiveRegionKey(key)}
                className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-bold transition-all ${
                  activeRegionKey === key
                    ? 'bg-earthora-mint text-earthora-forest shadow-lg shadow-earthora-mint/20'
                    : 'border border-white/20 bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <MapPin className="h-4 w-4" />
                <span>{data.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Dashboard Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-earthora-olive">
            Current Agro-Station Readings
          </span>
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="font-heading text-2xl font-bold text-earthora-forest sm:text-3xl">
              {region.name}
            </h2>
            <span className="text-xs font-medium text-earthora-muted">
              Station ID: ETH-STN-{activeRegionKey.toUpperCase()}-01 · Updated 2 mins ago
            </span>
          </div>
          <p className="text-xs text-earthora-muted">{region.description}</p>
        </div>

        {/* Primary Metrics Grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Temperature */}
          <div className="card-surface p-6 border border-earthora-sand/80">
            <div className="flex items-center justify-between text-xs text-earthora-muted">
              <span className="font-semibold uppercase tracking-wider">Air Temperature</span>
              <Thermometer className="h-5 w-5 text-red-500" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-heading text-4xl font-extrabold text-earthora-forest">
                {region.tempC}°C
              </span>
              <span className="text-sm font-semibold text-earthora-muted">
                ({Math.round((region.tempC * 9) / 5 + 32)}°F)
              </span>
            </div>
            <p className="mt-2 text-xs text-earthora-muted">
              Feels like {region.feelsLikeC}°C · {region.condition}
            </p>
          </div>

          {/* Soil Temp at 10cm */}
          <div className="card-surface p-6 border border-earthora-sand/80">
            <div className="flex items-center justify-between text-xs text-earthora-muted">
              <span className="font-semibold uppercase tracking-wider">Soil Temp (10cm Depth)</span>
              <Sun className="h-5 w-5 text-earthora-gold" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-heading text-4xl font-extrabold text-earthora-olive">
                {region.soilTemp10cm}°C
              </span>
              <span className="text-sm font-semibold text-earthora-muted">
                ({Math.round((region.soilTemp10cm * 9) / 5 + 32)}°F)
              </span>
            </div>
            <p className="mt-2 text-xs text-emerald-700 font-medium">
              Optimal for active rhizosphere respiration
            </p>
          </div>

          {/* Humidity & Rain */}
          <div className="card-surface p-6 border border-earthora-sand/80">
            <div className="flex items-center justify-between text-xs text-earthora-muted">
              <span className="font-semibold uppercase tracking-wider">Relative Humidity</span>
              <Droplets className="h-5 w-5 text-blue-500" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-heading text-4xl font-extrabold text-earthora-forest">
                {region.humidity}%
              </span>
              <span className="text-xs font-semibold text-blue-600">
                {region.precipitationChance}% precip
              </span>
            </div>
            <p className="mt-2 text-xs text-earthora-muted">
              24h Accumulation: <strong>{region.rainfall24h} mm</strong>
            </p>
          </div>

          {/* Wind & Evapotranspiration */}
          <div className="card-surface p-6 border border-earthora-sand/80">
            <div className="flex items-center justify-between text-xs text-earthora-muted">
              <span className="font-semibold uppercase tracking-wider">Wind &amp; Evapo (ET₀)</span>
              <Wind className="h-5 w-5 text-teal-600" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-heading text-3xl font-extrabold text-earthora-forest">
                {region.windSpeedKmh} <span className="text-lg">km/h</span>
              </span>
              <span className="text-xs font-semibold text-earthora-muted">
                {region.windDirection}
              </span>
            </div>
            <p className="mt-2 text-xs text-earthora-muted">
              ET₀ Loss: <strong>{region.et0Rate}</strong> · Solar: {region.solarRadiation}
            </p>
          </div>
        </div>

        {/* Agricultural Advisories */}
        <div className="mt-10">
          <h3 className="font-heading text-lg font-bold text-earthora-forest">
            Active Agronomic Advisories &amp; Action Windows
          </h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {region.advisories.map((advisory, idx) => (
              <div
                key={idx}
                className={`flex gap-4 rounded-2xl p-5 border ${
                  advisory.type === 'optimal'
                    ? 'border-emerald-200 bg-emerald-50/60'
                    : advisory.type === 'warning'
                    ? 'border-amber-200 bg-amber-50/60'
                    : 'border-blue-200 bg-blue-50/60'
                }`}
              >
                {advisory.type === 'optimal' ? (
                  <CheckCircle className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
                ) : advisory.type === 'warning' ? (
                  <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
                ) : (
                  <Eye className="h-6 w-6 text-blue-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4
                    className={`text-sm font-bold ${
                      advisory.type === 'optimal'
                        ? 'text-emerald-900'
                        : advisory.type === 'warning'
                        ? 'text-amber-900'
                        : 'text-blue-900'
                    }`}
                  >
                    {advisory.title}
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-earthora-charcoal">
                    {advisory.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5-Day Forecast */}
        <div className="mt-12">
          <SectionHeading
            eyebrow="5-Day Trend"
            title="Agro-Climatic Forecast"
            description="Anticipate planting schedules, irrigation cycles, and frost risks before they impact soil Biology."
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {region.forecast.map((fc, idx) => (
              <div
                key={idx}
                className="card-surface p-5 text-center border border-earthora-sand/80 hover:border-earthora-sage transition-all"
              >
                <div className="text-xs font-bold uppercase tracking-wider text-earthora-muted">
                  {fc.day}
                </div>
                <div className="my-3 flex justify-center">{getWeatherIcon(fc.icon)}</div>
                <div className="text-xs font-semibold text-earthora-charcoal">{fc.condition}</div>
                <div className="mt-2 flex items-center justify-center gap-2 text-sm font-bold text-earthora-forest">
                  <span>{fc.tempHigh}°</span>
                  <span className="text-xs text-earthora-muted">{fc.tempLow}°</span>
                </div>
                <div className="mt-2 text-[11px] font-medium text-blue-600">
                  Rain: {fc.rain}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

