import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, MapPin, ShieldCheck, Sprout } from 'lucide-react';
import api from '../../api/client';
import SectionHeading from '../../components/common/SectionHeading';
import { FARMERS } from '../../data/catalogData';

export default function FarmersPage() {
  const [farmers, setFarmers] = useState(FARMERS);

  useEffect(() => {
    api
      .get('/farmers')
      .then(({ data }) => {
        if (Array.isArray(data.data?.farmers) && data.data.farmers.length > 0) {
          setFarmers(data.data.farmers);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <SectionHeading
          eyebrow="Our Partner Growers"
          title="Meet the Farmers Behind Every Harvest"
          subtitle="Every grower on Agriva undergoes organic verification and shares real-time harvest dates and soil practices."
        />
        <Link to="/register?role=farmer" className="btn-primary shrink-0">
          <Sprout className="h-4 w-4" />
          Apply as a Partner Farmer
        </Link>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {farmers.map((farmer) => (
          <article key={farmer._id || farmer.id} className="card-surface grid overflow-hidden sm:grid-cols-12">
            <img
              src={farmer.image || '/assets/img/home-3/team/01.jpg'}
              alt={farmer.name}
              className="h-64 w-full object-cover object-top sm:col-span-5 sm:h-full"
            />
            <div className="flex flex-col justify-between p-6 sm:col-span-7">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-agriva-pine">
                  {farmer.farmName}
                </p>
                <h2 className="mt-1 font-display text-2xl font-semibold text-agriva-ink">
                  {farmer.name}
                </h2>
                <p className="mt-1 text-xs font-medium text-agriva-earth">{farmer.specialty}</p>
                <p className="mt-3 text-sm leading-relaxed text-agriva-muted">{farmer.bio}</p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {(farmer.certifications || ['USDA Organic']).map((cert) => (
                    <span
                      key={cert}
                      className="inline-flex items-center gap-1 rounded-md bg-agriva-mint/50 px-2.5 py-1 text-[11px] font-semibold text-agriva-forest"
                    >
                      <ShieldCheck className="h-3 w-3" />
                      {cert}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-agriva-line pt-4 text-xs text-agriva-muted">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-agriva-earth" />
                  {farmer.location}
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-agriva-ink">
                  <Award className="h-3.5 w-3.5 text-agriva-pine" />
                  {farmer.experience || '10+ Years'}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

