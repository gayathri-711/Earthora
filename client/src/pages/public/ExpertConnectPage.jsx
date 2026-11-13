import { useState } from 'react';
import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  HelpCircle,
  MapPin,
  MessageSquare,
  PlusCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  ThumbsUp,
  User,
  Users,
  Video,
  X,
} from 'lucide-react';
import SectionHeading from '../../components/common/SectionHeading';
import { EARTHORA_EXPERTS } from '../../data/catalogData';
import { useToast } from '../../context/ToastContext';

const INITIAL_QUESTIONS = [
  {
    _id: 'q-1',
    title: 'What is the optimal biochar-to-compost ratio for clay-loam aeration?',
    author: 'Elena Vance (Green Valley Farm)',
    crop: 'Brassicas & Cover Crops',
    date: '3 days ago',
    votes: 24,
    hasVoted: false,
    answeredBy: 'Dr. Aris Thorne',
    expertTitle: 'Principal Soil Microbiologist',
    answer:
      'Raw biochar should never be applied un-inoculated. Co-compost biochar at 10% to 15% by volume with active thermophilic compost for at least 3 weeks. This charges the pores with mycorrhizae and soluble nitrogen, preventing initial nutrient lockup in the rhizosphere.',
  },
  {
    _id: 'q-2',
    title: 'Managing brassica flea beetles in organic hoop houses without pyrethrins?',
    author: 'Daniel Brooks (Clearwater Co-op)',
    crop: 'Tender Baby Kale & Mustard Greens',
    date: '5 days ago',
    votes: 19,
    hasVoted: false,
    answeredBy: 'Dr. Julian Morales',
    expertTitle: 'Organic IPM & Entomologist',
    answer:
      'Deploy yellow sticky perimeter barriers immediately after seeding, combined with an ultra-fine 25-mesh exclusion netting. For biological control, introduce beneficial nematodes (Heterorhabditis bacteriophora) to target overwintering larvae in the top 5cm of soil.',
  },
  {
    _id: 'q-3',
    title: 'How to calculate ET₀ drip replenishment volume in high afternoon heat?',
    author: 'Marcus Thorne (Sunridge Agro)',
    crop: 'Heritage Einkorn & Honeycrisp Apples',
    date: '1 week ago',
    votes: 14,
    hasVoted: false,
    answeredBy: 'Sofia Al-Mansoor',
    expertTitle: 'Precision Irrigation Engineer',
    answer:
      'Use the formula: Irrigation (Liters) = Canopy Area (m²) × ET₀ (mm/day) × Crop Coefficient (Kc) ÷ Irrigation System Efficiency (0.90 for sub-surface drip). During peak fruit sizing, apple Kc is ~0.95.',
  },
];

export default function ExpertConnectPage() {
  const [experts] = useState(EARTHORA_EXPERTS);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [askModalOpen, setAskModalOpen] = useState(false);
  const [questions, setQuestions] = useState(INITIAL_QUESTIONS);
  const { showToast } = useToast();

  const [bookingForm, setBookingForm] = useState({
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    timeSlot: '10:00 AM - 10:45 AM',
    topic: 'Soil Microbiome Optimization & Biochar Inoculation',
    farmName: '',
    acreage: '',
    notes: '',
  });

  const [questionForm, setQuestionForm] = useState({
    title: '',
    crop: '',
    author: '',
    description: '',
  });

  const timeSlots = [
    '09:00 AM - 09:45 AM',
    '10:30 AM - 11:15 AM',
    '02:00 PM - 02:45 PM',
    '04:00 PM - 04:45 PM',
  ];

  const handleOpenBooking = (expert) => {
    setSelectedExpert(expert);
    setBookingModalOpen(true);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingModalOpen(false);
    showToast(
      `Consultation with ${selectedExpert.name} confirmed for ${bookingForm.date} at ${bookingForm.timeSlot}. A calendar invite has been sent.`,
      'success'
    );
  };

  const handleVote = (qId) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q._id === qId) {
          const nextVoted = !q.hasVoted;
          return {
            ...q,
            votes: nextVoted ? q.votes + 1 : q.votes - 1,
            hasVoted: nextVoted,
          };
        }
        return q;
      })
    );
  };

  const handleAskSubmit = (e) => {
    e.preventDefault();
    if (!questionForm.title) {
      showToast('Please provide a question title.', 'error');
      return;
    }

    const newQ = {
      _id: `q-${Date.now()}`,
      title: questionForm.title,
      author: questionForm.author || 'Member Grower',
      crop: questionForm.crop || 'Regenerative Farm',
      date: 'Just now',
      votes: 1,
      hasVoted: true,
      answeredBy: 'Earthora Agronomy Board',
      expertTitle: 'Review in Progress',
      answer:
        'Thank you for submitting your agronomy inquiry. One of our verified specialists will review your plot telemetry and provide a biological prescription within 12 hours.',
    };

    setQuestions([newQ, ...questions]);
    setAskModalOpen(false);
    setQuestionForm({ title: '', crop: '', author: '', description: '' });
    showToast('Your agronomy question has been posted to the specialist desk!', 'success');
  };

  return (
    <div className="bg-earthora-ivory min-h-screen">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-earthora-forest py-20 text-white lg:py-24">
        <div className="absolute inset-0 opacity-15">
          <img
            src="/assets/img/home-1/hero/slider-2.jpg"
            alt="Agronomy Experts"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-earthora-forest via-earthora-forest/90 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-earthora-mint/30 bg-earthora-mint/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-earthora-mint uppercase">
              <Users className="h-4 w-4" />
              Verified Agronomists &amp; Soil Scientists
            </div>
            <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl">
              Earthora Expert Connect
            </h1>
            <p className="mt-4 text-base leading-relaxed text-earthora-sand/90 sm:text-lg">
              Book one-on-one virtual field consultations with accredited soil microbiologists, precision
              irrigation engineers, and organic pest specialists. Explore our peer-reviewed grower Q&amp;A.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => handleOpenBooking(experts[0])}
              className="btn-accent flex items-center gap-2 shadow-lg shadow-earthora-mint/20"
            >
              <Video className="h-5 w-5" />
              Book Agronomy Consultation
            </button>
            <button
              onClick={() => setAskModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              <HelpCircle className="h-5 w-5 text-earthora-mint" />
              Ask a Community Question
            </button>
          </div>
        </div>
      </section>

      {/* Specialist Directory */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Accredited Specialists"
          title="Agronomy Advisory Council"
          description="Experienced researchers and regenerative practitioners dedicated to maximizing farm yields naturally."
        />

        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {experts.map((expert) => (
            <div
              key={expert._id}
              className="card-surface overflow-hidden border border-earthora-sand/80 transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <img
                    src={expert.image}
                    alt={expert.name}
                    className="h-16 w-16 rounded-2xl border-2 border-white object-cover shadow-md"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading text-lg font-bold text-earthora-forest">
                        {expert.name}
                      </h3>
                      <ShieldCheck className="h-5 w-5 text-earthora-mint" title="Accredited Specialist" />
                    </div>
                    <p className="text-xs font-semibold text-earthora-olive">{expert.title}</p>
                    <p className="text-[11px] text-earthora-muted">{expert.organization}</p>
                  </div>
                </div>

                <p className="mt-4 text-xs leading-relaxed text-earthora-muted">{expert.bio}</p>

                {/* Badges / Rating */}
                <div className="mt-4 flex items-center justify-between rounded-xl bg-earthora-ivory p-3 text-xs">
                  <div className="flex items-center gap-1 text-earthora-gold font-bold">
                    <Star className="h-4 w-4 fill-earthora-gold" />
                    <span>{expert.rating}</span>
                    <span className="text-earthora-muted font-normal text-[11px]">
                      ({expert.reviewCount} reviews)
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-heading font-extrabold text-earthora-forest text-sm">
                      ${expert.consultationFee}
                    </span>
                    <span className="text-[10px] text-earthora-muted ml-1">/ 45 min session</span>
                  </div>
                </div>

                {/* Specializations */}
                <div className="mt-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-earthora-charcoal">
                    Focus Areas:
                  </span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {expert.specializations.map((spec) => (
                      <span
                        key={spec}
                        className="rounded-md bg-earthora-sand/50 px-2 py-0.5 text-[10px] font-semibold text-earthora-forest"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 border-t border-earthora-sand/50 pt-4">
                  <button
                    onClick={() => handleOpenBooking(expert)}
                    className="btn-primary w-full text-center text-xs"
                  >
                    Book Consultation with {expert.name.split(' ')[0]}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community Q&A Section */}
      <section className="bg-earthora-sand/30 border-y border-earthora-sand/60 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <SectionHeading
              eyebrow="Community Forum"
              title="Verified Agronomy Q&amp;A"
              description="Real questions from certified organic growers answered by our advisory board."
            />

            <button
              onClick={() => setAskModalOpen(true)}
              className="btn-accent flex items-center gap-2 self-start text-xs"
            >
              <PlusCircle className="h-4 w-4" />
              Ask a Question
            </button>
          </div>

          <div className="mt-10 space-y-6">
            {questions.map((q) => (
              <div
                key={q._id}
                className="card-surface overflow-hidden border border-earthora-sand/80 p-6 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  {/* Upvote button */}
                  <button
                    onClick={() => handleVote(q._id)}
                    className={`flex flex-col items-center rounded-xl border p-2.5 transition-all ${
                      q.hasVoted
                        ? 'border-earthora-mint bg-emerald-50 text-emerald-800'
                        : 'border-earthora-sand bg-white text-earthora-charcoal hover:border-earthora-forest'
                    }`}
                  >
                    <ThumbsUp className={`h-4 w-4 ${q.hasVoted ? 'fill-emerald-700' : ''}`} />
                    <span className="mt-1 text-xs font-bold">{q.votes}</span>
                  </button>

                  <div className="flex-1">
                    <h4 className="font-heading text-lg font-bold text-earthora-forest">{q.title}</h4>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-earthora-muted">
                      <span>Asked by <strong className="text-earthora-charcoal">{q.author}</strong></span>
                      <span>·</span>
                      <span className="rounded-md bg-earthora-sand/40 px-2 py-0.5 text-[10px] font-semibold text-earthora-forest">
                        {q.crop}
                      </span>
                      <span>·</span>
                      <span>{q.date}</span>
                    </div>

                    {/* Expert Verified Answer */}
                    <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <span>Verified Answer by {q.answeredBy} ({q.expertTitle})</span>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-earthora-charcoal">
                        {q.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {bookingModalOpen && selectedExpert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <button
              onClick={() => setBookingModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-earthora-muted hover:bg-earthora-ivory"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3">
              <img
                src={selectedExpert.image}
                alt={selectedExpert.name}
                className="h-12 w-12 rounded-2xl object-cover shadow"
              />
              <div>
                <h3 className="font-heading text-lg font-bold text-earthora-forest">
                  Book Session with {selectedExpert.name}
                </h3>
                <p className="text-xs text-earthora-muted">
                  ${selectedExpert.consultationFee} · 45-minute virtual telemetry review
                </p>
              </div>
            </div>

            <form onSubmit={handleBookingSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-earthora-charcoal">Consultation Date *</label>
                <input
                  type="date"
                  required
                  value={bookingForm.date}
                  onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                  className="input-field mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-earthora-charcoal">Available Time Slot *</label>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setBookingForm({ ...bookingForm, timeSlot: slot })}
                      className={`rounded-xl border p-2 text-xs font-semibold transition-all ${
                        bookingForm.timeSlot === slot
                          ? 'border-earthora-forest bg-earthora-forest text-white'
                          : 'border-earthora-sand bg-white text-earthora-charcoal hover:bg-earthora-ivory'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Farm / Project Name</label>
                  <input
                    type="text"
                    value={bookingForm.farmName}
                    onChange={(e) => setBookingForm({ ...bookingForm, farmName: e.target.value })}
                    placeholder="e.g. Green Valley"
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Acreage</label>
                  <input
                    type="number"
                    value={bookingForm.acreage}
                    onChange={(e) => setBookingForm({ ...bookingForm, acreage: e.target.value })}
                    placeholder="e.g. 25"
                    className="input-field mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-earthora-charcoal">Primary Inquiry / Field Topic</label>
                <textarea
                  rows="2"
                  value={bookingForm.notes}
                  onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                  placeholder="Describe your soil, crop phenology, or pest problem..."
                  className="input-field mt-1"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-earthora-sand/50">
                <button
                  type="button"
                  onClick={() => setBookingModalOpen(false)}
                  className="rounded-xl border border-earthora-sand px-4 py-2 text-xs font-semibold text-earthora-charcoal hover:bg-earthora-ivory"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-accent text-xs">
                  Confirm Consultation (${selectedExpert.consultationFee})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ask Question Modal */}
      {askModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <button
              onClick={() => setAskModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-earthora-muted hover:bg-earthora-ivory"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="font-heading text-lg font-bold text-earthora-forest">
              Submit Agronomy Question
            </h3>
            <p className="text-xs text-earthora-muted">
              Post your technical farming challenge to our verified specialist community.
            </p>

            <form onSubmit={handleAskSubmit} className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-earthora-charcoal">Question Headline *</label>
                <input
                  type="text"
                  required
                  value={questionForm.title}
                  onChange={(e) => setQuestionForm({ ...questionForm, title: e.target.value })}
                  placeholder="e.g. Preventing blossom end rot in heirloom greenhouse tomatoes?"
                  className="input-field mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Your Name / Farm</label>
                  <input
                    type="text"
                    value={questionForm.author}
                    onChange={(e) => setQuestionForm({ ...questionForm, author: e.target.value })}
                    placeholder="Jordan (Sunridge Farm)"
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Crop / Soil Type</label>
                  <input
                    type="text"
                    value={questionForm.crop}
                    onChange={(e) => setQuestionForm({ ...questionForm, crop: e.target.value })}
                    placeholder="Tomatoes / Clay Loam"
                    className="input-field mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-earthora-charcoal">Detailed Description</label>
                <textarea
                  rows="3"
                  value={questionForm.description}
                  onChange={(e) => setQuestionForm({ ...questionForm, description: e.target.value })}
                  placeholder="Provide context on recent irrigation volumes, soil pH, or observed symptoms..."
                  className="input-field mt-1"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-earthora-sand/50">
                <button
                  type="button"
                  onClick={() => setAskModalOpen(false)}
                  className="rounded-xl border border-earthora-sand px-4 py-2 text-xs font-semibold text-earthora-charcoal hover:bg-earthora-ivory"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-accent text-xs">
                  Post Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
