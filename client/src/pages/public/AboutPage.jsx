import { Link } from 'react-router-dom';
import {
  Award,
  CheckCircle2,
  Cpu,
  Globe,
  Leaf,
  ShieldCheck,
  Sparkles,
  Sprout,
  Users,
} from 'lucide-react';
import SectionHeading from '../../components/common/SectionHeading';

const PILLARS = [
  {
    icon: Sprout,
    title: 'Biological Soil Regeneration',
    desc: 'Prioritizing living soil biomes, cover cropping, and no-till practices that sequester carbon and build biological drought resilience.',
  },
  {
    icon: Cpu,
    title: 'Precision IoT & Telemetry',
    desc: 'Connecting low-power wireless LoRaWAN sensors, satellite NDVI imagery, and solar actuators to eliminate over-fertilization and water waste.',
  },
  {
    icon: ShieldCheck,
    title: 'Uncompromised Traceability',
    desc: 'Every agricultural input, seed batch, and harvested crate carries verifiable laboratory certifications and farm origin records.',
  },
  {
    icon: Users,
    title: 'Direct Farmer Equity',
    desc: 'Empowering independent family farms with open market access, fair pricing, and direct agronomic guidance without predatory middlemen.',
  },
];

const TIMELINE = [
  { year: '2020', title: 'The Soil Sensor Pilot', desc: 'Deployed first LoRaWAN soil moisture and NPK test clusters across 6 California vineyards and vegetable farms.' },
  { year: '2022', title: 'Agronomy Advisory Network', desc: 'Integrated certified agronomists and peer-reviewed consultation booking into a centralized grower portal.' },
  { year: '2024', title: 'Automated Micro-Drip Sync', desc: 'Connected real-time evapotranspiration weather radar with solar solenoid valve controllers to cut water usage by 40%.' },
  { year: '2026', title: 'EARTHORA Ecosystem Launch', desc: 'A unified global platform connecting farmers, agricultural experts, input suppliers, and consumers.' },
];

export default function AboutPage() {
  return (
    <div className="space-y-16 pb-20">
      {/* Header Banner */}
      <section className="border-b border-earthora-sand/70 bg-earthora-beige/60 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-7">
              <span className="badge-tag border border-earthora-forest/30 bg-white text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-earthora-forest shadow-xs">
                ABOUT EARTHORA ECOSYSTEM
              </span>
              <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black text-earthora-forest leading-[1.08] tracking-tight">
                Rooted in Nature. <br /><span className="text-emerald-700">Driven by Innovation.</span>
              </h1>
              <p className="text-base leading-relaxed text-earthora-muted">
                EARTHORA was founded on a simple yet transformative conviction: that the future of
                human nutrition and climate resilience lies at the intersection of biological soil stewardship
                and intelligent digital technology.
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="card-surface overflow-hidden rounded-3xl border-2 border-earthora-forest/10 p-3 shadow-elevated">
                <img
                  src="/assets/img/about/earthora-farm-aerial.jpg"
                  alt="Earthora Farmland"
                  className="aspect-[4/3] w-full rounded-2xl border border-earthora-sand/80 object-cover shadow-sm transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/assets/img/hero/crops-hero.jpg';
                  }}
                />
                <div className="mt-3 flex items-center justify-between text-xs px-2 text-earthora-muted">
                  <span className="font-bold text-earthora-forest">Sonoma Pilot Research Acreage</span>
                  <span className="text-earthora-mint font-semibold">45 Bio-Intensive Acres</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="center"
          eyebrow="The Earthora Standard"
          title="Built Upon Four Scientific Foundations"
          subtitle="How our digital agriculture architecture restores ecosystems while maximizing sustainable farm profitability."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="card-surface p-6">
                <div className="mb-4 inline-flex rounded-xl bg-earthora-mint/20 p-3 text-earthora-forest">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-xl font-bold text-earthora-forest">{p.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-earthora-muted">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Research & Field Infrastructure Gallery */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="center"
          eyebrow="Living Laboratories"
          title="Where Science Meets The Soil"
          subtitle="From rhizospheric microbiology testing to commercial IoT canopy deployments."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="card-surface overflow-hidden border border-earthora-sand/80 p-0 shadow-md">
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src="/assets/img/about/soil-research-lab.jpg"
                alt="Soil Microbiology Lab"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="p-5">
              <span className="text-[10px] font-bold text-earthora-olive uppercase tracking-wider">Research Hub</span>
              <h4 className="mt-1 font-heading text-base font-bold text-earthora-forest">Rhizosphere Chemistry Lab</h4>
              <p className="mt-1 text-xs text-earthora-muted">Continuous microbial plating, mycorrhizal spore counts, and CEC cation balance testing.</p>
            </div>
          </div>

          <div className="card-surface overflow-hidden border border-earthora-sand/80 p-0 shadow-md">
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src="/assets/img/about/agtech-field-trial.jpg"
                alt="Agtech Field Trials"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="p-5">
              <span className="text-[10px] font-bold text-earthora-mint uppercase tracking-wider">Field Trials</span>
              <h4 className="mt-1 font-heading text-base font-bold text-earthora-forest">Autonomous Canopy Scanning</h4>
              <p className="mt-1 text-xs text-earthora-muted">Multispectral drone flights mapping NDVI index benchmarks across commercial orchard canopies.</p>
            </div>
          </div>

          <div className="card-surface overflow-hidden border border-earthora-sand/80 p-0 shadow-md">
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src="/assets/img/farmers/farm-green-valley.jpg"
                alt="Partner Regenerative Farm"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="p-5">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Partner Farmland</span>
              <h4 className="mt-1 font-heading text-base font-bold text-earthora-forest">Certified Bio-Intensive Acreage</h4>
              <p className="mt-1 text-xs text-earthora-muted">Over 200+ verified acres across California and Oregon practicing zero synthetic chemical inputs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="border-y border-earthora-sand/70 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Evolution"
            title="The Journey to Earthora"
            subtitle="Pioneering precision regenerative agriculture through relentless experimentation."
          />

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TIMELINE.map((item) => (
              <div key={item.year} className="card-surface p-6 border-earthora-sand/80">
                <span className="font-heading text-3xl font-black text-earthora-mint">{item.year}</span>
                <h3 className="mt-2 font-heading text-lg font-bold text-earthora-forest">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-earthora-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-earthora-forest p-10 text-white shadow-elevated">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-8">
              <h2 className="font-heading text-3xl font-bold">Join the Smart Farming Revolution</h2>
              <p className="text-sm text-emerald-100/80">
                Whether you cultivate 500 acres or a market greenhouse, Earthora equips you with
                hardware sensors, agronomy insights, and direct marketplace access.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
              <Link to="/register?role=farmer" className="btn-accent px-6 py-3">
                Register Your Farm
              </Link>
              <Link to="/contact" className="btn-secondary bg-white/10 text-white border-white/20 hover:bg-white/20 px-6 py-3">
                Contact Advisory
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
