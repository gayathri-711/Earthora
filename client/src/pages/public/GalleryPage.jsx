import { useState } from 'react';
import SectionHeading from '../../components/common/SectionHeading';
import { GALLERY_ITEMS } from '../../data/catalogData';

const categories = ['All', 'Harvest', 'Soil & Water', 'Biodiversity', 'Orchards', 'Logistics', 'Grains'];

export default function GalleryPage() {
  const [active, setActive] = useState('All');
  const [selected, setSelected] = useState(null);

  const visible =
    active === 'All' ? GALLERY_ITEMS : GALLERY_ITEMS.filter((item) => item.category === active);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Field Photography"
        title="Life Across Agriva Partner Farms"
        subtitle="Explore our harvest mornings, regenerative soil beds, orchards, and low-footprint packing stations."
      />

      <div className="mt-8 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActive(cat)}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
              active === cat
                ? 'bg-agriva-forest text-white'
                : 'border border-agriva-line bg-white text-agriva-muted hover:text-agriva-ink'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelected(item)}
            className="card-surface group overflow-hidden text-left"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-agriva-pine">
                {item.category}
              </span>
              <h3 className="mt-1 font-display text-lg font-semibold text-agriva-ink">{item.title}</h3>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-w-3xl overflow-hidden rounded-2xl bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={selected.image} alt={selected.title} className="max-h-[75vh] w-full object-cover" />
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-xs font-semibold text-agriva-pine">{selected.category}</p>
                <p className="font-display text-lg font-semibold text-agriva-ink">{selected.title}</p>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

