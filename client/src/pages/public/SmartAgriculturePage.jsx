import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  CloudRain,
  Cpu,
  Database,
  Droplets,
  Layers,
  Radio,
  Satellite,
  ShieldAlert,
  Sparkles,
  Zap,
} from 'lucide-react';
import SectionHeading from '../../components/common/SectionHeading';

const SMART_FEATURES = [
  {
    icon: Radio,
    title: 'LoRaWAN Field Gateways',
    badge: 'Hardware Tier 1',
    description: 'Ultra-long-range (up to 15km) low-power telemetry transmitting soil moisture, temperature, and electrical conductivity every 15 minutes.',
  },
  {
    icon: Satellite,
    title: 'Satellite NDVI Crop Scouting',
    badge: 'Remote Sensing',
    description: 'Weekly multispectral satellite passes flagging chlorophyll loss and moisture stress 7–10 days before leaf discoloration manifests.',
  },
  {
    icon: Droplets,
    title: 'Automated Solar Solenoid Valves',
    badge: 'Water Automation',
    description: 'Cloud-synced valves that trigger micro-drip cycles based on real-time root-zone water potential and regional evapotranspiration data.',
  },
  {
    icon: Database,
    title: 'AI Yield & Phenology Modeling',
    badge: 'Data Science',
    description: 'Predictive algorithms trained on regional soil types and weather history calculating exact harvest maturity dates and bin estimates.',
  },
];

export default function SmartAgriculturePage() {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero */}
      <section className="border-b border-earthora-sand/70 bg-gradient-to-b from-earthora-beige/60 to-earthora-ivory py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-7">
              <span className="badge-tag border border-earthora-forest/20 bg-white text-xs font-bold uppercase tracking-wider text-earthora-forest">
                Precision AgTech Architecture
              </span>
              <h1 className="font-heading text-4xl font-extrabold text-earthora-forest sm:text-5xl">
                Smart Agriculture. <br />
                <span className="text-emerald-700">Precision in Every Drop.</span>
              </h1>
              <p className="text-base leading-relaxed text-earthora-muted">
                EARTHORA merges IoT telemetry, agro-meteorological forecasting, and soil biological modeling
                into a unified operational dashboard. Eliminate overwatering, prevent crop disease outbreaks,
                and maximize harvest value with surgical precision.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link to="/crop-management" className="btn-primary">
                  Explore Crop Management
                </Link>
                <Link to="/marketplace?category=irrigation" className="btn-secondary">
                  Shop Smart Irrigation Hardware
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="card-surface relative overflow-hidden border-2 border-earthora-forest/10 p-4 shadow-elevated">
                <img
                  src="/assets/img/home-3/service/01.jpg"
                  alt="Precision Smart Agriculture"
                  className="aspect-[4/3] w-full rounded-xl object-cover"
                />
                <div className="mt-4 rounded-xl bg-earthora-forest p-4 text-white">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-earthora-mint">System Architecture</span>
                    <span className="text-[11px] text-emerald-300">Live Status: Connected</span>
                  </div>
                  <p className="mt-1 font-heading text-sm font-semibold">
                    12 LoRaWAN Probes · 4 Solenoids Active · North Field Cluster
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Smart Features */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="center"
          eyebrow="Capabilities"
          title="Hardware &amp; Software Working As One"
          subtitle="Explore the four primary technologies powering the Earthora Smart Agriculture Suite."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SMART_FEATURES.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="card-surface flex flex-col justify-between p-6 hover:shadow-elevated">
                <div>
                  <span className="badge-tag bg-earthora-beige text-[11px] font-bold text-earthora-forest mb-4">
                    {item.badge}
                  </span>
                  <div className="mb-3 inline-flex rounded-xl bg-earthora-mint/20 p-3 text-earthora-forest">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-earthora-forest">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-earthora-muted">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Workflow Diagram */}
      <section className="border-y border-earthora-sand/70 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="The Data Loop"
            title="How Earthora Smart Agriculture Operates in Real Time"
          />

          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {[
              {
                step: '01',
                title: 'Sense & Measure',
                text: 'LoRaWAN probes continuously sample soil tension (kPa), root moisture, and surface ambient temperature.',
              },
              {
                step: '02',
                title: 'Satellite & Weather Fusion',
                text: 'Local telemetry combines with multispectral satellite vegetation indices and 48-hour rain forecasts.',
              },
              {
                step: '03',
                title: 'Automated Micro-Action',
                text: 'Solar solenoid valves deliver measured water and organic compost tea only when roots truly require it.',
              },
              {
                step: '04',
                title: 'Agronomist Verification',
                text: 'Certified agronomists monitor anomalies and prescribe organic remedies directly through Expert Connect.',
              },
            ].map((s) => (
              <div key={s.step} className="rounded-2xl border border-earthora-sand bg-earthora-ivory p-6">
                <span className="font-heading text-3xl font-black text-earthora-mint">{s.step}</span>
                <h4 className="mt-3 font-heading text-base font-bold text-earthora-forest">{s.title}</h4>
                <p className="mt-2 text-xs text-earthora-muted leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-earthora-forest p-10 text-white shadow-elevated">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h3 className="font-heading text-2xl font-bold">Ready to Deploy Smart Telemetry on Your Land?</h3>
              <p className="text-xs text-emerald-100/80 mt-1">
                Explore our LoRaWAN starter kits, precision valves, and automated gateways on the Marketplace.
              </p>
            </div>
            <Link to="/marketplace?category=irrigation" className="btn-accent shrink-0 px-6 py-3">
              Explore Smart Equipment →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

