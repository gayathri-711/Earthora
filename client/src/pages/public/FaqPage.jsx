import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import SectionHeading from '../../components/common/SectionHeading';
import { FAQS } from '../../data/catalogData';

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading
        align="center"
        eyebrow="Help Center"
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about organic certifications, harvest schedules, delivery, and farmer onboarding."
      />

      <div className="mt-10 space-y-3">
        {FAQS.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={item.q} className="card-surface overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
              >
                <span className="font-display text-lg font-semibold text-agriva-ink">{item.q}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-agriva-forest transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="border-t border-agriva-line px-6 py-4 text-sm leading-relaxed text-agriva-muted">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

