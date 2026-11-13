import { useState } from 'react';
import {
  Activity,
  AlertCircle,
  Award,
  CheckCircle2,
  Droplets,
  FileText,
  Filter,
  Flame,
  Layers,
  Leaf,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Sprout,
  X,
} from 'lucide-react';
import SectionHeading from '../../components/common/SectionHeading';
import { EARTHORA_SOIL_TESTS } from '../../data/catalogData';
import { useToast } from '../../context/ToastContext';

export default function SoilInsightsPage() {
  const [soilTests, setSoilTests] = useState(EARTHORA_SOIL_TESTS);
  const [activeTestId, setActiveTestId] = useState(EARTHORA_SOIL_TESTS[0]._id);
  const [showAddModal, setShowAddModal] = useState(false);
  const { showToast } = useToast();

  const activeTest = soilTests.find((t) => t._id === activeTestId) || soilTests[0];

  const [form, setForm] = useState({
    farmName: 'Green Valley Regenerative Farm',
    fieldName: 'West Terrace 02',
    sampleId: `ST-2026-${Math.floor(100 + Math.random() * 900)}`,
    soilType: 'Living Sandy Loam',
    pH: 6.7,
    nitrogen: 140,
    phosphorus: 48,
    potassium: 220,
    organicCarbon: 3.5,
    moistureLevel: 28,
    microbialActivity: 'High (Optimal F:B Ratio 1.1:1)',
    status: 'Optimal',
    recommendations: 'Continue no-till mulching with rye residue. Macronutrient reserve in balance.',
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newRecord = {
      _id: `soil-${Date.now()}`,
      ...form,
      pH: Number(form.pH),
      nitrogen: Number(form.nitrogen),
      phosphorus: Number(form.phosphorus),
      potassium: Number(form.potassium),
      organicCarbon: Number(form.organicCarbon),
      moistureLevel: Number(form.moistureLevel),
      dateTested: new Date().toISOString().split('T')[0],
      recommendations: [form.recommendations],
    };

    setSoilTests([newRecord, ...soilTests]);
    setActiveTestId(newRecord._id);
    setShowAddModal(false);
    showToast(`Soil test sample ${newRecord.sampleId} logged successfully!`, 'success');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Optimal':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Needs Attention':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  return (
    <div className="bg-earthora-ivory min-h-screen">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-earthora-forest py-20 text-white lg:py-24">
        <div className="absolute inset-0 opacity-15">
          <img
            src="/assets/img/home-1/hero/slider-3.jpg"
            alt="Soil"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-earthora-forest via-earthora-forest/90 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-earthora-mint/30 bg-earthora-mint/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-earthora-mint uppercase">
                <Sprout className="h-4 w-4" />
                Living Soil Biological Engine
              </div>
              <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl">
                Soil Insights &amp; NPK Telemetry
              </h1>
              <p className="mt-4 text-base leading-relaxed text-earthora-sand/90 sm:text-lg">
                Measure chemical and biological soil health: active nitrogen, phosphorus, potassium,
                microbiome fungal-to-bacterial ratios, pH equilibrium, and organic carbon drawdown.
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="btn-accent flex items-center gap-2 shadow-lg shadow-earthora-mint/20"
            >
              <Plus className="h-5 w-5" />
              Log Soil Test Sample
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="mt-12 grid grid-cols-2 gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md sm:grid-cols-4">
            <div>
              <div className="font-heading text-3xl font-extrabold text-white">6.6</div>
              <div className="text-xs text-earthora-sand/75">Avg Monitored pH</div>
            </div>
            <div>
              <div className="font-heading text-3xl font-extrabold text-earthora-mint">3.6%</div>
              <div className="text-xs text-earthora-sand/75">Topsoil Organic Carbon</div>
            </div>
            <div>
              <div className="font-heading text-3xl font-extrabold text-earthora-gold">94%</div>
              <div className="text-xs text-earthora-sand/75">NPK Balanced Plots</div>
            </div>
            <div>
              <div className="font-heading text-3xl font-extrabold text-white">1.2 : 1</div>
              <div className="text-xs text-earthora-sand/75">Fungal to Bacterial Ratio</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Analysis Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Sample Selector */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SectionHeading
            eyebrow="Rhizosphere Analysis"
            title="Field Soil Profile"
            description="Select an active field sample to inspect macronutrient availability and organic amendments."
          />

          <div className="flex flex-wrap gap-2">
            {soilTests.map((t) => (
              <button
                key={t._id}
                onClick={() => setActiveTestId(t._id)}
                className={`rounded-2xl px-4 py-2.5 text-xs font-bold transition-all ${
                  activeTestId === t._id
                    ? 'bg-earthora-forest text-white shadow-md'
                    : 'border border-earthora-sand bg-white text-earthora-charcoal hover:border-earthora-forest'
                }`}
              >
                <span>{t.fieldName}</span>
                <span className="ml-2 text-[10px] opacity-75">({t.sampleId})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Sample Overview Banner */}
        <div className="mt-8 rounded-3xl border border-earthora-sand/80 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-earthora-sand/50 pb-6">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="font-heading text-2xl font-bold text-earthora-forest">
                  {activeTest.fieldName}
                </h3>
                <span className={`rounded-full border px-3 py-0.5 text-xs font-bold ${getStatusBadge(activeTest.status)}`}>
                  {activeTest.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-earthora-muted">
                Farm: <strong className="text-earthora-charcoal">{activeTest.farmName}</strong> · Soil Type:{' '}
                <strong className="text-earthora-charcoal">{activeTest.soilType}</strong> · Sample ID:{' '}
                <strong className="text-earthora-charcoal">{activeTest.sampleId}</strong>
              </p>
            </div>

            <div className="text-xs text-earthora-muted md:text-right">
              <div>Sample Date: <strong className="text-earthora-charcoal">{activeTest.dateTested}</strong></div>
              <div>Microbiome: <strong className="text-emerald-700">{activeTest.microbialActivity}</strong></div>
            </div>
          </div>

          {/* Primary Visual Gauges Grid */}
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* pH Gauge */}
            <div className="rounded-2xl border border-earthora-sand/60 bg-earthora-ivory/50 p-5">
              <div className="flex items-center justify-between text-xs font-semibold text-earthora-muted">
                <span>Soil pH Equilibrium</span>
                <Activity className="h-4 w-4 text-earthora-olive" />
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-heading text-4xl font-extrabold text-earthora-forest">
                  {activeTest.pH}
                </span>
                <span className="text-xs font-bold text-emerald-700">
                  {activeTest.pH >= 6.2 && activeTest.pH <= 7.0 ? 'Optimal (6.2 - 7.0)' : 'Correction Advised'}
                </span>
              </div>

              {/* Visual pH Bar */}
              <div className="mt-4">
                <div className="relative h-3 w-full rounded-full bg-gradient-to-r from-red-400 via-emerald-400 to-blue-400">
                  <div
                    className="absolute -top-1 h-5 w-2 rounded-full border-2 border-white bg-earthora-forest shadow"
                    style={{
                      left: `${Math.min(Math.max(((activeTest.pH - 5.0) / 3.0) * 100, 0), 100)}%`,
                    }}
                  />
                </div>
                <div className="mt-1.5 flex justify-between text-[10px] text-earthora-muted font-mono">
                  <span>5.0 Acidic</span>
                  <span>6.5 Neutral</span>
                  <span>8.0 Alkaline</span>
                </div>
              </div>
            </div>

            {/* Organic Carbon */}
            <div className="rounded-2xl border border-earthora-sand/60 bg-earthora-ivory/50 p-5">
              <div className="flex items-center justify-between text-xs font-semibold text-earthora-muted">
                <span>Organic Carbon (SOC)</span>
                <Sparkles className="h-4 w-4 text-earthora-gold" />
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-heading text-4xl font-extrabold text-earthora-forest">
                  {activeTest.organicCarbon}%
                </span>
                <span className="text-xs font-semibold text-earthora-olive">+1.9% vs baseline</span>
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-earthora-muted">
                High microbial carbon drawdown locks active nutrients and enhances water holding capacity.
              </p>
            </div>

            {/* Soil Moisture */}
            <div className="rounded-2xl border border-earthora-sand/60 bg-earthora-ivory/50 p-5">
              <div className="flex items-center justify-between text-xs font-semibold text-earthora-muted">
                <span>Volumetric Water Content</span>
                <Droplets className="h-4 w-4 text-blue-500" />
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-heading text-4xl font-extrabold text-blue-700">
                  {activeTest.moistureLevel}%
                </span>
                <span className="text-xs font-semibold text-earthora-muted">at 28 kPa tension</span>
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-earthora-muted">
                Capillary tension indicates perfect root infiltration. No anaerobic waterlogging detected.
              </p>
            </div>

            {/* Overall Biological Health */}
            <div className="rounded-2xl border border-earthora-sand/60 bg-earthora-ivory/50 p-5">
              <div className="flex items-center justify-between text-xs font-semibold text-earthora-muted">
                <span>Soil Health Index</span>
                <Award className="h-4 w-4 text-earthora-mint" />
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-heading text-4xl font-extrabold text-emerald-800">
                  92<span className="text-lg font-normal text-earthora-muted">/100</span>
                </span>
                <span className="text-xs font-bold text-emerald-700">Class A</span>
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-earthora-muted">
                Regenerative mycorrhizae active with healthy humus humification score.
              </p>
            </div>
          </div>

          {/* NPK Macronutrient Bars */}
          <div className="mt-8 rounded-2xl border border-earthora-sand/60 bg-white p-6">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-earthora-forest">
              Macronutrient Balance (NPK Availability)
            </h4>

            <div className="mt-6 space-y-6">
              {/* Nitrogen (N) */}
              <div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 font-bold text-emerald-800 text-[11px]">
                      N
                    </span>
                    <span className="font-bold text-earthora-charcoal">Available Nitrogen (NO₃-N + NH₄-N)</span>
                  </div>
                  <span className="font-bold text-earthora-forest">{activeTest.nitrogen} mg/kg (Target: 120-160)</span>
                </div>
                <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-earthora-sand/30">
                  <div
                    className="h-full rounded-full bg-emerald-600 transition-all duration-700"
                    style={{ width: `${Math.min((activeTest.nitrogen / 200) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Phosphorus (P) */}
              <div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-100 font-bold text-amber-800 text-[11px]">
                      P
                    </span>
                    <span className="font-bold text-earthora-charcoal">Plant-Available Phosphorus (Bray-P)</span>
                  </div>
                  <span className="font-bold text-earthora-forest">{activeTest.phosphorus} mg/kg (Target: 40-60)</span>
                </div>
                <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-earthora-sand/30">
                  <div
                    className="h-full rounded-full bg-amber-600 transition-all duration-700"
                    style={{ width: `${Math.min((activeTest.phosphorus / 80) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Potassium (K) */}
              <div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-100 font-bold text-blue-800 text-[11px]">
                      K
                    </span>
                    <span className="font-bold text-earthora-charcoal">Exchangeable Potassium (K)</span>
                  </div>
                  <span className="font-bold text-earthora-forest">{activeTest.potassium} mg/kg (Target: 180-250)</span>
                </div>
                <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-earthora-sand/30">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-700"
                    style={{ width: `${Math.min((activeTest.potassium / 300) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actionable Recommendations */}
          <div className="mt-8 rounded-2xl bg-earthora-sand/20 p-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-earthora-forest">
              <CheckCircle2 className="h-4 w-4 text-earthora-mint" />
              Agronomist Prescriptions &amp; Biological Strategy
            </div>
            <ul className="mt-4 space-y-2">
              {activeTest.recommendations.map((rec, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 rounded-xl bg-white p-3 text-xs leading-relaxed text-earthora-charcoal shadow-sm"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-earthora-forest text-[10px] font-bold text-white">
                    {idx + 1}
                  </span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Soil Test Registry Table */}
        <div className="mt-16">
          <SectionHeading
            eyebrow="Historical Registry"
            title="Monitored Soil Test Archive"
            description="Complete log of certified lab assays and calibrated in-field electronic probe telemetry."
          />

          <div className="mt-6 overflow-hidden rounded-3xl border border-earthora-sand/80 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-earthora-charcoal">
                <thead className="border-b border-earthora-sand/60 bg-earthora-ivory/60 text-[11px] font-bold uppercase tracking-wider text-earthora-forest">
                  <tr>
                    <th className="px-6 py-4">Sample ID</th>
                    <th className="px-6 py-4">Plot / Field</th>
                    <th className="px-6 py-4">pH</th>
                    <th className="px-6 py-4">N (mg/kg)</th>
                    <th className="px-6 py-4">P (mg/kg)</th>
                    <th className="px-6 py-4">K (mg/kg)</th>
                    <th className="px-6 py-4">Organic Carbon</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-earthora-sand/40">
                  {soilTests.map((t) => (
                    <tr
                      key={t._id}
                      onClick={() => setActiveTestId(t._id)}
                      className={`cursor-pointer transition-colors hover:bg-earthora-sand/15 ${
                        activeTestId === t._id ? 'bg-earthora-sand/25 font-semibold' : ''
                      }`}
                    >
                      <td className="px-6 py-4 font-mono font-bold text-earthora-forest">{t.sampleId}</td>
                      <td className="px-6 py-4">{t.fieldName}</td>
                      <td className="px-6 py-4 font-bold">{t.pH}</td>
                      <td className="px-6 py-4">{t.nitrogen}</td>
                      <td className="px-6 py-4">{t.phosphorus}</td>
                      <td className="px-6 py-4">{t.potassium}</td>
                      <td className="px-6 py-4 text-earthora-olive font-bold">{t.organicCarbon}%</td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${getStatusBadge(t.status)}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-earthora-muted">{t.dateTested}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Log Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-earthora-muted hover:bg-earthora-ivory"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 text-earthora-forest">
              <Sprout className="h-6 w-6 text-earthora-mint" />
              <h3 className="font-heading text-xl font-bold">Log Field Soil Test</h3>
            </div>
            <p className="mt-1 text-xs text-earthora-muted">
              Add lab test measurements or electronic NPK probe readings to the living soil ledger.
            </p>

            <form onSubmit={handleAddSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Field / Plot Name *</label>
                  <input
                    type="text"
                    required
                    value={form.fieldName}
                    onChange={(e) => setForm({ ...form, fieldName: e.target.value })}
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Soil Type</label>
                  <input
                    type="text"
                    value={form.soilType}
                    onChange={(e) => setForm({ ...form, soilType: e.target.value })}
                    className="input-field mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Soil pH (5.0 - 8.5) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="4.5"
                    max="9.0"
                    required
                    value={form.pH}
                    onChange={(e) => setForm({ ...form, pH: e.target.value })}
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Organic Carbon %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.organicCarbon}
                    onChange={(e) => setForm({ ...form, organicCarbon: e.target.value })}
                    className="input-field mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Nitrogen (N)</label>
                  <input
                    type="number"
                    value={form.nitrogen}
                    onChange={(e) => setForm({ ...form, nitrogen: e.target.value })}
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Phosphorus (P)</label>
                  <input
                    type="number"
                    value={form.phosphorus}
                    onChange={(e) => setForm({ ...form, phosphorus: e.target.value })}
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Potassium (K)</label>
                  <input
                    type="number"
                    value={form.potassium}
                    onChange={(e) => setForm({ ...form, potassium: e.target.value })}
                    className="input-field mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-earthora-charcoal">Agronomist Recommendation</label>
                <textarea
                  rows="2"
                  value={form.recommendations}
                  onChange={(e) => setForm({ ...form, recommendations: e.target.value })}
                  className="input-field mt-1"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-earthora-sand/50">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-earthora-sand px-4 py-2 text-xs font-semibold text-earthora-charcoal hover:bg-earthora-ivory"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-accent text-xs">
                  Save Sample
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
