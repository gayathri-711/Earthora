import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import SectionHeading from '../../components/common/SectionHeading';
import { SERVICES } from '../../data/catalogData';

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Agricultural Services"
        title="Supporting Growers & Mindful Kitchens"
        subtitle="Beyond our direct organic marketplace, Agriva delivers soil agronomy, certification guidance, and zero-waste farm logistics."
      />

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {SERVICES.map((srv) => (
          <div key={srv.id} className="card-surface overflow-hidden">
            <img src={srv.image} alt={srv.title} className="aspect-[16/9] w-full object-cover" />
            <div className="p-6">
              <h3 className="font-display text-2xl font-semibold text-agriva-ink">{srv.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-agriva-muted">{srv.description}</p>
              <div className="mt-5 flex items-center justify-between border-t border-agriva-line pt-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-agriva-forest">
                  <CheckCircle2 className="h-4 w-4 text-agriva-leaf" />
                  Available Regionally
                </span>
                <Link to="/contact" className="inline-flex items-center gap-1 text-sm font-semibold text-agriva-forest hover:underline">
                  Request Consultation <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

