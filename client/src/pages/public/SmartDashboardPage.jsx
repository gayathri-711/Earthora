import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowUpRight,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Cpu,
  Droplets,
  Layers,
  Leaf,
  MapPin,
  Package,
  Radio,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  Sprout,
  Sun,
  Tractor,
  TrendingUp,
  Users,
  Wheat,
} from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { EARTHORA_CROPS, EARTHORA_PRODUCTS, EARTHORA_SOIL_TESTS } from '../../data/catalogData';

export default function SmartDashboardPage() {
  const [activeRange, setActiveRange] = useState('30d');

  const stats = [
    { label: 'Active Farms', value: '42', change: '+3 this month', icon: Tractor, color: 'text-emerald-700' },
    { label: 'Monitored Acreage', value: '1,420 ac', change: '100% Regenerative', icon: Sprout, color: 'text-earthora-forest' },
    { label: 'Living Soil Health', value: '92 / 100', change: 'Optimal Rhizosphere', icon: Award, color: 'text-earthora-olive' },
    { label: 'Monthly GMV', value: '$42,850', change: '+18.4% vs last period', icon: TrendingUp, color: 'text-earthora-gold' },
  ];

  const salesBreakdown = [
    { category: 'Fresh Produce Harvest', percentage: 44, value: '$18,854', color: 'bg-emerald-600' },
    { category: 'Smart IoT Irrigation', percentage: 26, value: '$11,141', color: 'bg-blue-600' },
    { category: 'Bio-Organic Fertilizers', percentage: 18, value: '$7,713', color: 'bg-amber-600' },
    { category: 'Heirloom Seed Stock', percentage: 12, value: '$5,142', color: 'bg-teal-600' },
  ];

  const recentTelemetryEvents = [
    {
      time: '12 mins ago',
      node: 'Sonoma Plot 02',
      event: 'LoRaWAN Drip Actuator #3 cycled 1,200L',
      type: 'irrigation',
      status: 'Optimal',
    },
    {
      time: '45 mins ago',
      node: 'Meadow Ridge OR',
      event: 'Topsoil moisture calibrated at 26% (28 kPa tension)',
      type: 'soil',
      status: 'Optimal',
    },
    {
      time: '2 hours ago',
      node: 'Dispatch Hub Lancaster',
      event: 'Cold-chain shipment #ETH-2026-1001 picked for regional delivery',
      type: 'logistics',
      status: 'Shipped',
    },
    {
      time: '4 hours ago',
      node: 'Agronomy Council',
      event: 'Dr. Aris Thorne submitted biological prescription for South Swale',
      type: 'expert',
      status: 'Prescribed',
    },
  ];

  return (
    <DashboardLayout
      title="Ecosystem Smart Dashboard"
      subtitle="Autonomous field telemetry, IoT node health, crop phenology, and marketplace revenue."
    >
      <div className="space-y-8">
        {/* Top Metric Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="card-surface p-6 border border-earthora-sand/80 shadow-sm">
                <div className="flex items-center justify-between text-xs text-earthora-muted">
                  <span className="font-semibold uppercase tracking-wider">{s.label}</span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-earthora-sand/40 text-earthora-forest">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3 font-heading text-3xl font-extrabold text-earthora-forest">
                  {s.value}
                </div>
                <p className="mt-1 text-xs font-medium text-emerald-700">{s.change}</p>
              </div>
            );
          })}
        </div>

        {/* Live Weather & Agronomy Radar Strip */}
        <div className="rounded-3xl bg-earthora-forest p-6 text-white sm:p-8 relative overflow-hidden">
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-earthora-mint">
                <Radio className="h-4 w-4 animate-pulse" />
                Live Agro-Telemetry Feed · Sonoma &amp; Willamette Valley
              </div>
              <h2 className="mt-2 font-heading text-2xl font-bold sm:text-3xl">
                Micro-Climate &amp; Automated Irrigation Station
              </h2>
              <p className="mt-1 text-xs text-earthora-sand/80 max-w-xl">
                Atmospheric RH at 58%, soil temp at 10cm is 18.2°C. Solar radiation steady at 680 W/m² with low wind drift.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/weather-intelligence"
                className="btn-accent text-xs font-bold shadow-md shadow-earthora-mint/20"
              >
                Inspect Climate Radar
              </Link>
              <Link
                to="/soil-insights"
                className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/20 transition-all"
              >
                Soil Insights
              </Link>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 sm:grid-cols-4 text-xs">
            <div>
              <span className="text-earthora-sand/70">Bio-Spray Window</span>
              <p className="font-bold text-earthora-mint text-sm">Optimal (Next 3h)</p>
            </div>
            <div>
              <span className="text-earthora-sand/70">Evapotranspiration (ET₀)</span>
              <p className="font-bold text-white text-sm">4.2 mm / day</p>
            </div>
            <div>
              <span className="text-earthora-sand/70">Active LoRaWAN Valves</span>
              <p className="font-bold text-earthora-gold text-sm">38 Synced / 0 Errors</p>
            </div>
            <div>
              <span className="text-earthora-sand/70">Water Savings Rate</span>
              <p className="font-bold text-earthora-mint text-sm">-42% vs timer baseline</p>
            </div>
          </div>
        </div>

        {/* Charts & Analytics Row */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Sales & Revenue Distribution */}
          <div className="card-surface p-6 sm:p-8 border border-earthora-sand/80 lg:col-span-7">
            <div className="flex items-center justify-between border-b border-earthora-sand/50 pb-4">
              <div>
                <h3 className="font-heading text-lg font-bold text-earthora-forest">
                  Marketplace Revenue by Sector
                </h3>
                <p className="text-xs text-earthora-muted">Trailing 30 days distribution across 5 core categories</p>
              </div>
              <span className="rounded-xl bg-earthora-sand/40 px-3 py-1 text-xs font-bold text-earthora-forest">
                $42,850 Total
              </span>
            </div>

            <div className="mt-6 space-y-5">
              {salesBreakdown.map((item) => (
                <div key={item.category}>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-earthora-charcoal">{item.category}</span>
                    <span className="text-earthora-forest">{item.value} ({item.percentage}%)</span>
                  </div>
                  <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-earthora-sand/30">
                    <div
                      className={`h-full rounded-full ${item.color} transition-all duration-700`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl bg-earthora-ivory p-4 text-xs border border-earthora-sand/50 flex items-center justify-between">
              <div>
                <span className="font-bold text-earthora-forest">Direct Grower Revenue Share:</span>
                <p className="text-earthora-muted">82% of all fresh produce proceeds disbursed directly to farm accounts.</p>
              </div>
              <span className="font-heading text-xl font-extrabold text-emerald-800">$15,460</span>
            </div>
          </div>

          {/* Active Field Crops Phenology */}
          <div className="card-surface p-6 sm:p-8 border border-earthora-sand/80 lg:col-span-5">
            <div className="flex items-center justify-between border-b border-earthora-sand/50 pb-4">
              <div>
                <h3 className="font-heading text-lg font-bold text-earthora-forest">
                  Crop Phenology Roster
                </h3>
                <p className="text-xs text-earthora-muted">Monitored plots in active growth stages</p>
              </div>
              <Link to="/crop-management" className="text-xs font-bold text-earthora-forest hover:text-earthora-mint">
                Manage →
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              {EARTHORA_CROPS.map((crop) => (
                <div key={crop._id} className="rounded-2xl border border-earthora-sand/60 bg-earthora-ivory/40 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-heading text-xs font-bold text-earthora-forest">{crop.name}</h4>
                      <p className="text-[10px] text-earthora-muted">{crop.farmName} ({crop.acreage} ac)</p>
                    </div>
                    <span className="rounded-full bg-earthora-forest px-2.5 py-0.5 text-[10px] font-bold text-earthora-mint">
                      {crop.status}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-earthora-sand/40">
                      <div
                        className="h-full rounded-full bg-earthora-mint transition-all"
                        style={{ width: `${crop.growthProgress}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-earthora-forest">{crop.growthProgress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Activity & Telemetry Feed */}
        <div className="card-surface p-6 sm:p-8 border border-earthora-sand/80 shadow-sm">
          <div className="flex items-center justify-between border-b border-earthora-sand/50 pb-4">
            <div>
              <h3 className="font-heading text-lg font-bold text-earthora-forest">
                Real-Time Ecosystem Audit Trail
              </h3>
              <p className="text-xs text-earthora-muted">
                Continuous telemetry signals, automated solenoid actuation, and cold-chain dispatches
              </p>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              Live WebSocket Synced
            </span>
          </div>

          <div className="mt-6 divide-y divide-earthora-sand/40">
            {recentTelemetryEvents.map((evt, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 gap-2 text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-earthora-sand/40 text-earthora-forest font-bold text-[10px]">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-bold text-earthora-forest">{evt.event}</p>
                    <p className="text-[11px] text-earthora-muted">Node: <strong className="text-earthora-charcoal">{evt.node}</strong></p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:text-right">
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                    {evt.status}
                  </span>
                  <span className="text-earthora-muted text-[11px]">{evt.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
