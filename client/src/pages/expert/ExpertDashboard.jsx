import { useState } from 'react';
import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  HelpCircle,
  MessageSquare,
  Sparkles,
  Star,
  UserCheck,
  Video,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import DashboardLayout from '../../layouts/DashboardLayout';

const tabs = [
  { id: 'consultations', label: 'Booked Consultations', icon: Video },
  { id: 'qa', label: 'Pending Community Q&A', icon: HelpCircle },
  { id: 'profile', label: 'Advisory Credentials', icon: Award },
];

export default function ExpertDashboard() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('consultations');

  const [consultations, setConsultations] = useState([
    {
      _id: 'c-1',
      growerName: 'Elena Vance',
      farm: 'Green Valley Regenerative Farm',
      topic: 'Cover Crop Cycling & Winter Rye Termination',
      date: '2026-11-16',
      timeSlot: '10:00 AM - 10:45 AM',
      status: 'confirmed',
      fee: 85,
    },
    {
      _id: 'c-2',
      growerName: 'Marcus Thorne',
      farm: 'Sunridge Agro-Ecosystems',
      topic: 'Sub-surface Drip Salinity & Acidification',
      date: '2026-11-18',
      timeSlot: '02:00 PM - 02:45 PM',
      status: 'confirmed',
      fee: 85,
    },
  ]);

  const [pendingQuestions, setPendingQuestions] = useState([
    {
      _id: 'pq-1',
      grower: 'Daniel Brooks (Clearwater Co-op)',
      title: 'Optimal timing for second foliar kelp spray before hard frost?',
      crop: 'Storage Carrots & Kale',
      answerDraft: '',
    },
    {
      _id: 'pq-2',
      grower: 'Priya Nair (Golden Meadow)',
      title: 'Balancing mycorrhizal inoculation when establishing ancient grain tillers?',
      crop: 'Heritage Einkorn Wheat',
      answerDraft: '',
    },
  ]);

  const [expertProfile, setExpertProfile] = useState({
    name: 'Dr. Aris Thorne',
    title: 'Principal Soil Microbiologist',
    fieldOfStudy: 'Rhizosphere Ecology & Nitrogen Fixation',
    organization: 'Earthora Agronomy Advisory',
    experienceYears: 16,
    fee: 85,
    image: '/assets/img/experts/expert-aris-thorne.jpg',
    specializations: 'Soil pH Optimization, Microbial Inoculation, Cover Crop Cycling',
  });

  const handleCompleteConsultation = (id) => {
    setConsultations((prev) =>
      prev.map((c) => (c._id === id ? { ...c, status: 'completed' } : c))
    );
    showToast('Consultation session marked as completed.', 'success');
  };

  const handleAnswerSubmit = (qId) => {
    const q = pendingQuestions.find((item) => item._id === qId);
    if (!q || !q.answerDraft) {
      showToast('Please type an agronomic answer before submitting.', 'error');
      return;
    }
    setPendingQuestions((prev) => prev.filter((item) => item._id !== qId));
    showToast('Verified prescription published to grower and community forum!', 'success');
  };

  return (
    <DashboardLayout
      title="Agriculture Expert Portal"
      subtitle="Manage booked virtual field sessions, review grower questions, and publish accredited soil prescriptions."
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {/* Consultations Tab */}
      {activeTab === 'consultations' && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="card-surface p-5 border border-earthora-sand/80 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-earthora-muted">Upcoming Sessions</span>
              <p className="mt-2 font-heading text-3xl font-extrabold text-earthora-forest">
                {consultations.filter((c) => c.status === 'confirmed').length}
              </p>
              <p className="mt-1 text-xs text-emerald-700">Next: Tomorrow 10:00 AM</p>
            </div>

            <div className="card-surface p-5 border border-earthora-sand/80 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-earthora-muted">Consultation Revenue</span>
              <p className="mt-2 font-heading text-3xl font-extrabold text-earthora-forest">
                ${consultations.reduce((acc, c) => acc + c.fee, 0)}
              </p>
              <p className="mt-1 text-xs text-earthora-muted">Bi-weekly advisory payout</p>
            </div>

            <div className="card-surface p-5 border border-earthora-sand/80 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-earthora-muted">Grower Rating</span>
              <p className="mt-2 font-heading text-3xl font-extrabold text-earthora-gold">4.95 / 5.0</p>
              <p className="mt-1 text-xs text-earthora-muted">42 verified grower reviews</p>
            </div>
          </div>

          <div className="card-surface p-6 border border-earthora-sand/80 shadow-sm">
            <h3 className="font-heading text-lg font-bold text-earthora-forest">Scheduled Telemetry Consultations</h3>
            <p className="text-xs text-earthora-muted">Direct grower video reviews over live soil moisture and crop phenology data.</p>

            <div className="mt-6 space-y-4">
              {consultations.map((c) => (
                <div
                  key={c._id}
                  className="rounded-2xl border border-earthora-sand/60 bg-earthora-ivory/40 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-earthora-forest text-white">
                      <Video className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-heading text-sm font-bold text-earthora-forest">{c.topic}</h4>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            c.status === 'completed'
                              ? 'bg-gray-100 text-gray-700'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {c.status}
                        </span>
                      </div>
                      <p className="text-xs text-earthora-charcoal mt-1">
                        Grower: <strong>{c.growerName}</strong> · {c.farm}
                      </p>
                      <p className="text-[11px] text-earthora-muted mt-0.5">
                        Slot: {c.date} at {c.timeSlot} (${c.fee})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {c.status === 'confirmed' ? (
                      <>
                        <button
                          onClick={() => showToast(`Launching video console for session with ${c.growerName}...`, 'info')}
                          className="btn-accent text-xs py-1.5 px-3 font-bold"
                        >
                          Join Tele-Session
                        </button>
                        <button
                          onClick={() => handleCompleteConsultation(c._id)}
                          className="rounded-xl border border-earthora-sand px-3 py-1.5 text-xs font-semibold text-earthora-forest hover:bg-earthora-ivory"
                        >
                          Mark Completed
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-earthora-muted flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Session Completed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Q&A Desk Tab */}
      {activeTab === 'qa' && (
        <div className="space-y-6">
          <div className="card-surface p-6 border border-earthora-sand/80 shadow-sm">
            <h3 className="font-heading text-lg font-bold text-earthora-forest">Community Agronomy Inquiries</h3>
            <p className="text-xs text-earthora-muted">Answer technical inquiries with peer-reviewed advice.</p>

            <div className="mt-6 space-y-6">
              {pendingQuestions.length === 0 ? (
                <p className="text-xs text-earthora-muted py-4">No pending questions in queue. All inquiries answered!</p>
              ) : (
                pendingQuestions.map((q) => (
                  <div key={q._id} className="rounded-2xl border border-earthora-sand/80 bg-white p-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-heading text-sm font-bold text-earthora-forest">{q.title}</h4>
                        <p className="text-xs text-earthora-muted">
                          Grower: <strong className="text-earthora-charcoal">{q.grower}</strong> · Crop: {q.crop}
                        </p>
                      </div>
                      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
                        Needs Answer
                      </span>
                    </div>

                    <textarea
                      rows="3"
                      value={q.answerDraft}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPendingQuestions((prev) =>
                          prev.map((item) => (item._id === q._id ? { ...item, answerDraft: val } : item))
                        );
                      }}
                      placeholder="Type your scientific agronomy prescription here..."
                      className="input-field text-xs"
                    />

                    <div className="flex justify-end">
                      <button
                        onClick={() => handleAnswerSubmit(q._id)}
                        className="btn-accent text-xs font-bold py-2 px-4"
                      >
                        Publish Verified Prescription
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Advisory Profile Tab */}
      {activeTab === 'profile' && (
        <div className="card-surface p-6 sm:p-8 border border-earthora-sand/80 shadow-sm max-w-2xl">
          <div className="flex items-center gap-4 pb-6 border-b border-earthora-sand/60">
            <img
              src={expertProfile.image || '/assets/img/experts/expert-aris-thorne.jpg'}
              alt={expertProfile.name}
              className="h-16 w-16 rounded-2xl object-cover border-2 border-white shadow-md"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/assets/img/experts/expert-aris-thorne.jpg';
              }}
            />
            <div>
              <h3 className="font-heading text-lg font-bold text-earthora-forest">{expertProfile.name}</h3>
              <p className="text-xs text-earthora-muted">{expertProfile.title} · {expertProfile.organization}</p>
              <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                <CheckCircle2 className="h-3 w-3" /> Accredited Advisory Member
              </span>
            </div>
          </div>
          <h4 className="font-heading text-base font-bold text-earthora-forest mt-6">Advisory Accreditation &amp; Rates</h4>
          <p className="text-xs text-earthora-muted">Manage your public credential dossier visible to growers in Expert Connect.</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              showToast('Advisory credentials updated.', 'success');
            }}
            className="mt-6 space-y-4"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-earthora-charcoal">Professional Title</label>
                <input
                  type="text"
                  value={expertProfile.title}
                  onChange={(e) => setExpertProfile({ ...expertProfile, title: e.target.value })}
                  className="input-field mt-1 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-earthora-charcoal">Field of Study</label>
                <input
                  type="text"
                  value={expertProfile.fieldOfStudy}
                  onChange={(e) => setExpertProfile({ ...expertProfile, fieldOfStudy: e.target.value })}
                  className="input-field mt-1 text-xs"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-earthora-charcoal">Institution / Advisory Firm</label>
                <input
                  type="text"
                  value={expertProfile.organization}
                  onChange={(e) => setExpertProfile({ ...expertProfile, organization: e.target.value })}
                  className="input-field mt-1 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-earthora-charcoal">Consultation Fee ($ / 45 min)</label>
                <input
                  type="number"
                  value={expertProfile.fee}
                  onChange={(e) => setExpertProfile({ ...expertProfile, fee: Number(e.target.value) })}
                  className="input-field mt-1 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-earthora-charcoal">Focus Specializations (comma separated)</label>
              <input
                type="text"
                value={expertProfile.specializations}
                onChange={(e) => setExpertProfile({ ...expertProfile, specializations: e.target.value })}
                className="input-field mt-1 text-xs"
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-earthora-sand/50">
              <button type="submit" className="btn-accent text-xs font-bold py-2.5 px-6">
                Save Advisory Profile
              </button>
            </div>
          </form>
        </div>
      )}
    </DashboardLayout>
  );
}

