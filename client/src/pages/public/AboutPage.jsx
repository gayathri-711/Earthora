import { Link } from 'react-router-dom';
import { Award, CheckCircle2, Leaf, Sprout, Users } from 'lucide-react';
import SectionHeading from '../../components/common/SectionHeading';

const milestones = [
  { year: '2016', title: 'First Soil Cooperative', desc: 'Started with 6 Sonoma family farms restoring depleted topsoil with cover crops.' },
  { year: '2019', title: 'Zero-Plastic Cold Chain', desc: 'Introduced reusable harvest crates and 24-hour regional micro-hub deliveries.' },
  { year: '2022', title: 'QR Field Traceability', desc: 'Every crate gained farm origin codes showing harvest date and certification status.' },
  { year: '2026', title: 'National Regenerative Network', desc: 'Over 48 certified organic farms serving households, co-ops, and farm-to-table kitchens.' },
];

export default function AboutPage() {
  return (
    <div>
      <section className="border-b border-agriva-line bg-agriva-oat py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="space-y-4 lg:col-span-7">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-agriva-pine">
              Our Story &amp; Mission
            </span>
            <h1 className="font-display text-4xl font-semibold text-agriva-ink sm:text-5xl">
              Cultivating living soil and honest food systems.
            </h1>
            <p className="text-base leading-relaxed text-agriva-muted">
              AGRIVA was founded to give organic farmers direct market access while giving families
              transparent, freshly harvested produce free from synthetic pesticides and long-haul
              warehouse storage.
            </p>
          </div>
          <div className="lg:col-span-5">
            <img
              src="/assets/img/home-1/about/01.jpg"
              alt="Agriva organic farmland"
              className="aspect-[4/3] w-full rounded-2xl border border-agriva-line object-cover shadow-soft"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Leaf,
              title: 'Our Mission',
              text: 'Deliver nutrient-dense organic food within 24–48 hours of harvest while ensuring growers receive fair direct revenue.',
            },
            {
              icon: Sprout,
              title: 'Regenerative Practices',
              text: 'No-till cultivation, multi-species cover cropping, rainwater catchment, and pollinator hedgerows across all partner farms.',
            },
            {
              icon: Award,
              title: 'Verified Integrity',
              text: 'Every listing displays active organic certification badges, harvest timestamps, and farm origin traceability.',
            },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="card-surface p-6">
                <div className="mb-4 inline-flex rounded-lg bg-agriva-mint/60 p-3 text-agriva-forest">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="font-display text-xl font-semibold text-agriva-ink">{card.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-agriva-muted">{card.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-y border-agriva-line bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Milestones"
            title="A Decade of Organic Growth"
            subtitle="Key moments shaping our farm-to-home ecosystem."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {milestones.map((m) => (
              <div key={m.year} className="rounded-xl border border-agriva-line bg-agriva-cream p-6">
                <span className="font-display text-3xl font-bold text-agriva-forest">{m.year}</span>
                <h3 className="mt-2 font-display text-lg font-semibold text-agriva-ink">{m.title}</h3>
                <p className="mt-2 text-sm text-agriva-muted">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 rounded-2xl bg-agriva-forest p-8 text-white sm:p-12 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-8">
            <h2 className="font-display text-3xl font-semibold">
              Sustainability Achievements That Matter
            </h2>
            <ul className="grid gap-3 pt-2 sm:grid-cols-2">
              {[
                '1,400+ acres transitioned to chemical-free cultivation',
                '94% reduction in single-use produce plastics',
                '48 family farms onboarded with direct payouts',
                '38% average water savings via drip & mulch systems',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-agriva-mint">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-3 lg:col-span-4">
            <Link to="/products" className="rounded-lg bg-agriva-mint px-5 py-3 text-center text-sm font-semibold text-agriva-forest hover:bg-white">
              Shop Seasonal Produce
            </Link>
            <Link to="/farmers" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/25 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
              <Users className="h-4 w-4" />
              Meet Our Farmers
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

