import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  AlertCircle,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Droplets,
  Filter,
  Layers,
  Leaf,
  Plus,
  RefreshCw,
  Sparkles,
  Sprout,
  TrendingUp,
  X,
} from 'lucide-react';
import SectionHeading from '../../components/common/SectionHeading';
import { EARTHORA_CROPS } from '../../data/catalogData';
import { useToast } from '../../context/ToastContext';

export default function CropManagementPage() {
  const [crops, setCrops] = useState(EARTHORA_CROPS);
  const [selectedStage, setSelectedStage] = useState('All');
  const [expandedCropId, setExpandedCropId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [targetCrop, setTargetCrop] = useState(null);
  const { showToast } = useToast();

  const [newCropForm, setNewCropForm] = useState({
    name: '',
    variety: '',
    farmName: 'Green Valley Regenerative Farm',
    fieldName: 'Plot Alpha 01',
    acreage: 5,
    plantingDate: new Date().toISOString().split('T')[0],
    estimatedHarvestDate: '',
    status: 'Seedling',
    growthProgress: 15,
    expectedYieldKg: 2500,
    soilHealthScore: 91,
    notes: 'Inoculated with mycorrhizae and mulched with clean oat straw.',
  });

  const [logForm, setLogForm] = useState({
    type: 'irrigation', // or fertilizer
    amountLiters: 1200,
    method: 'Precision Drip',
    fertilizerType: 'Biochar & Compost Tea',
    quantityKg: 30,
  });

  const stages = ['All', 'Seedling', 'Vegetative', 'Flowering', 'Maturing', 'Harvested'];

  const filteredCrops = crops.filter((crop) =>
    selectedStage === 'All' ? true : crop.status.toLowerCase() === selectedStage.toLowerCase()
  );

  const getStageColor = (status) => {
    switch (status.toLowerCase()) {
      case 'seedling':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'vegetative':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'flowering':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'maturing':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'harvested':
        return 'bg-gray-200 text-gray-800 border-gray-400';
      default:
        return 'bg-earthora-sand text-earthora-forest border-earthora-sand';
    }
  };

  const handleAddCropSubmit = (e) => {
    e.preventDefault();
    if (!newCropForm.name || !newCropForm.variety) {
      showToast('Please provide crop name and variety.', 'error');
      return;
    }

    const createdCrop = {
      _id: `crop-${Date.now()}`,
      ...newCropForm,
      acreage: Number(newCropForm.acreage),
      expectedYieldKg: Number(newCropForm.expectedYieldKg),
      soilHealthScore: Number(newCropForm.soilHealthScore),
      growthProgress: Number(newCropForm.growthProgress),
      irrigationLogs: [
        {
          date: newCropForm.plantingDate,
          amountLiters: 1000,
          method: 'Establishment Drip',
        },
      ],
      fertilizerLogs: [
        {
          date: newCropForm.plantingDate,
          type: 'Living Humus Inoculation',
          quantityKg: 25,
          organic: true,
        },
      ],
    };

    setCrops([createdCrop, ...crops]);
    setShowAddModal(false);
    showToast(`New crop cycle "${createdCrop.name}" registered successfully!`, 'success');
  };

  const handleAddLogSubmit = (e) => {
    e.preventDefault();
    if (!targetCrop) return;

    const today = new Date().toISOString().split('T')[0];
    const updated = crops.map((c) => {
      if (c._id === targetCrop._id) {
        if (logForm.type === 'irrigation') {
          return {
            ...c,
            irrigationLogs: [
              {
                date: today,
                amountLiters: Number(logForm.amountLiters),
                method: logForm.method,
              },
              ...(c.irrigationLogs || []),
            ],
          };
        } else {
          return {
            ...c,
            fertilizerLogs: [
              {
                date: today,
                type: logForm.fertilizerType,
                quantityKg: Number(logForm.quantityKg),
                organic: true,
              },
              ...(c.fertilizerLogs || []),
            ],
          };
        }
      }
      return c;
    });

    setCrops(updated);
    setShowLogModal(false);
    showToast(
      logForm.type === 'irrigation'
        ? `Logged ${logForm.amountLiters}L irrigation for ${targetCrop.name}.`
        : `Logged ${logForm.quantityKg}kg biological amendment for ${targetCrop.name}.`,
      'success'
    );
  };

  return (
    <div className="bg-earthora-ivory min-h-screen">
      {/* Header */}
      <section className="relative overflow-hidden bg-earthora-forest py-20 text-white lg:py-24">
        <div className="absolute inset-0 opacity-15">
          <img
            src="/assets/img/home-1/hero/slider-2.jpg"
            alt="Crops"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-earthora-forest via-earthora-forest/90 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-earthora-mint/30 bg-earthora-mint/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-earthora-mint uppercase">
                <Leaf className="h-4 w-4" />
                Autonomous Telemetry &amp; Crop Phenology
              </div>
              <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl">
                Crop Lifecycle Management
              </h1>
              <p className="mt-4 text-base leading-relaxed text-earthora-sand/90 sm:text-lg">
                Track biological growth stages, root-zone irrigation logs, organic fertility inputs, and yield
                projections across monitored acreage in real time.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-accent flex items-center gap-2 shadow-lg shadow-earthora-mint/20"
              >
                <Plus className="h-5 w-5" />
                Add New Crop Cycle
              </button>
              <Link
                to="/soil-insights"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                <Sprout className="h-5 w-5 text-earthora-mint" />
                Soil Health Analytics
              </Link>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="mt-12 grid grid-cols-2 gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md sm:grid-cols-4">
            <div>
              <div className="font-heading text-3xl font-extrabold text-white">{crops.length}</div>
              <div className="text-xs text-earthora-sand/75">Active Monitored Plots</div>
            </div>
            <div>
              <div className="font-heading text-3xl font-extrabold text-earthora-mint">
                {crops.reduce((acc, c) => acc + (c.acreage || 0), 0)} Acres
              </div>
              <div className="text-xs text-earthora-sand/75">Bio-Intensive Acreage</div>
            </div>
            <div>
              <div className="font-heading text-3xl font-extrabold text-earthora-gold">91/100</div>
              <div className="text-xs text-earthora-sand/75">Avg Soil Vigor Score</div>
            </div>
            <div>
              <div className="font-heading text-3xl font-extrabold text-white">
                {(crops.reduce((acc, c) => acc + (c.expectedYieldKg || 0), 0) / 1000).toFixed(1)}t
              </div>
              <div className="text-xs text-earthora-sand/75">Projected Harvest Yield</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Stage Filter */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SectionHeading
            eyebrow="Active Phenological Stages"
            title="Field Crop Roster"
            description="Continuous vegetative index updates synced with localized soil sensors."
          />

          <div className="flex flex-wrap gap-2">
            {stages.map((stage) => (
              <button
                key={stage}
                onClick={() => setSelectedStage(stage)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  selectedStage === stage
                    ? 'bg-earthora-forest text-white shadow-md'
                    : 'border border-earthora-sand bg-white text-earthora-charcoal hover:border-earthora-forest'
                }`}
              >
                {stage}
              </button>
            ))}
          </div>
        </div>

        {/* Crops List */}
        <div className="mt-10 space-y-6">
          {filteredCrops.map((crop) => {
            const isExpanded = expandedCropId === crop._id;

            return (
              <div
                key={crop._id}
                className="card-surface overflow-hidden border border-earthora-sand/80 transition-all hover:border-earthora-sage"
              >
                <div className="p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-earthora-sand/40 text-earthora-forest">
                        <Sprout className="h-6 w-6 text-earthora-olive" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-heading text-xl font-bold text-earthora-forest">
                            {crop.name}
                          </h3>
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStageColor(
                              crop.status
                            )}`}
                          >
                            {crop.status}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-earthora-muted">
                          Variety: <strong className="text-earthora-charcoal">{crop.variety}</strong> ·{' '}
                          Farm: <strong className="text-earthora-charcoal">{crop.farmName}</strong> ({crop.fieldName})
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar & Vitals */}
                    <div className="flex flex-1 max-w-md flex-col gap-1.5 lg:px-6">
                      <div className="flex items-center justify-between text-xs font-semibold text-earthora-charcoal">
                        <span>Biological Maturity</span>
                        <span className="text-earthora-forest">{crop.growthProgress}%</span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-earthora-sand/40">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-earthora-olive to-earthora-mint transition-all duration-700"
                          style={{ width: `${crop.growthProgress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-earthora-muted">
                        <span>Planted: {crop.plantingDate}</span>
                        <span>Est. Harvest: {crop.estimatedHarvestDate || 'In 18 days'}</span>
                      </div>
                    </div>

                    {/* Metrics & Actions */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs text-earthora-muted">Expected Yield</div>
                        <div className="font-heading text-lg font-bold text-earthora-forest">
                          {crop.expectedYieldKg?.toLocaleString()} kg
                        </div>
                      </div>

                      <div className="border-l border-earthora-sand pl-4">
                        <div className="text-xs text-earthora-muted">Soil Health</div>
                        <div className="font-heading text-lg font-bold text-emerald-700">
                          {crop.soilHealthScore || 90}/100
                        </div>
                      </div>

                      <button
                        onClick={() => setExpandedCropId(isExpanded ? null : crop._id)}
                        className="rounded-xl border border-earthora-sand p-2 text-earthora-charcoal hover:border-earthora-forest hover:bg-earthora-ivory"
                        title={isExpanded ? 'Collapse telemetry logs' : 'Expand telemetry logs'}
                      >
                        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Field Notes */}
                  {crop.notes && (
                    <div className="mt-4 rounded-xl bg-earthora-ivory/80 px-4 py-2.5 text-xs text-earthora-charcoal border border-earthora-sand/40 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-earthora-gold shrink-0" />
                      <span>{crop.notes}</span>
                    </div>
                  )}
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="border-t border-earthora-sand/60 bg-earthora-sand/15 p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-4">
                      <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-earthora-forest">
                        Root-Zone Inputs &amp; Agronomic Ledger
                      </h4>
                      <button
                        onClick={() => {
                          setTargetCrop(crop);
                          setShowLogModal(true);
                        }}
                        className="btn-accent flex items-center gap-1.5 py-1.5 px-3 text-xs"
                      >
                        <Plus className="h-4 w-4" />
                        Log Input Event
                      </button>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Irrigation Log */}
                      <div className="rounded-2xl border border-earthora-sand/80 bg-white p-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-earthora-forest uppercase tracking-wider">
                          <Droplets className="h-4 w-4 text-blue-500" />
                          Irrigation Records
                        </div>
                        <div className="mt-3 space-y-2">
                          {crop.irrigationLogs && crop.irrigationLogs.length > 0 ? (
                            crop.irrigationLogs.map((log, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between rounded-lg bg-earthora-ivory px-3 py-2 text-xs"
                              >
                                <div>
                                  <span className="font-semibold text-earthora-charcoal">{log.method}</span>
                                  <span className="text-[11px] text-earthora-muted ml-2">({log.date})</span>
                                </div>
                                <span className="font-bold text-blue-700">{log.amountLiters} Liters</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-earthora-muted">No irrigation events logged yet.</p>
                          )}
                        </div>
                      </div>

                      {/* Fertilizer & Soil Amendments */}
                      <div className="rounded-2xl border border-earthora-sand/80 bg-white p-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-earthora-forest uppercase tracking-wider">
                          <Leaf className="h-4 w-4 text-emerald-600" />
                          Biological Amendments &amp; Fertilizers
                        </div>
                        <div className="mt-3 space-y-2">
                          {crop.fertilizerLogs && crop.fertilizerLogs.length > 0 ? (
                            crop.fertilizerLogs.map((log, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between rounded-lg bg-earthora-ivory px-3 py-2 text-xs"
                              >
                                <div>
                                  <span className="font-semibold text-earthora-charcoal">{log.type}</span>
                                  <span className="text-[11px] text-earthora-muted ml-2">({log.date})</span>
                                </div>
                                <span className="font-bold text-emerald-800">{log.quantityKg} kg</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-earthora-muted">No amendments logged yet.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Add Crop Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-earthora-muted hover:bg-earthora-ivory"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 text-earthora-forest">
              <Sprout className="h-6 w-6 text-earthora-mint" />
              <h3 className="font-heading text-xl font-bold">Register New Crop Cycle</h3>
            </div>
            <p className="mt-1 text-xs text-earthora-muted">
              Add plot telemetry, variety data, and growth tracking to the Earthora agro-cloud.
            </p>

            <form onSubmit={handleAddCropSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Crop Name *</label>
                  <input
                    type="text"
                    required
                    value={newCropForm.name}
                    onChange={(e) => setNewCropForm({ ...newCropForm, name: e.target.value })}
                    placeholder="e.g. Heirloom Carrots"
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Variety *</label>
                  <input
                    type="text"
                    required
                    value={newCropForm.variety}
                    onChange={(e) => setNewCropForm({ ...newCropForm, variety: e.target.value })}
                    placeholder="e.g. Bolero F1 / Nantes Organic"
                    className="input-field mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Plot / Field Name</label>
                  <input
                    type="text"
                    value={newCropForm.fieldName}
                    onChange={(e) => setNewCropForm({ ...newCropForm, fieldName: e.target.value })}
                    placeholder="West Terrace 03"
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Acreage</label>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={newCropForm.acreage}
                    onChange={(e) => setNewCropForm({ ...newCropForm, acreage: e.target.value })}
                    className="input-field mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Planting Date</label>
                  <input
                    type="date"
                    value={newCropForm.plantingDate}
                    onChange={(e) => setNewCropForm({ ...newCropForm, plantingDate: e.target.value })}
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Est. Harvest Date</label>
                  <input
                    type="date"
                    value={newCropForm.estimatedHarvestDate}
                    onChange={(e) => setNewCropForm({ ...newCropForm, estimatedHarvestDate: e.target.value })}
                    className="input-field mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Initial Growth Stage</label>
                  <select
                    value={newCropForm.status}
                    onChange={(e) => setNewCropForm({ ...newCropForm, status: e.target.value })}
                    className="input-field mt-1"
                  >
                    <option>Seedling</option>
                    <option>Vegetative</option>
                    <option>Flowering</option>
                    <option>Maturing</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Est. Yield (kg)</label>
                  <input
                    type="number"
                    value={newCropForm.expectedYieldKg}
                    onChange={(e) => setNewCropForm({ ...newCropForm, expectedYieldKg: e.target.value })}
                    className="input-field mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-earthora-charcoal">Field Notes / Seed Source</label>
                <textarea
                  rows="2"
                  value={newCropForm.notes}
                  onChange={(e) => setNewCropForm({ ...newCropForm, notes: e.target.value })}
                  placeholder="Notes on seed inoculation, cover crop history, bed prep..."
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
                  Create Crop Cycle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Event Modal */}
      {showLogModal && targetCrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <button
              onClick={() => setShowLogModal(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-earthora-muted hover:bg-earthora-ivory"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="font-heading text-lg font-bold text-earthora-forest">
              Log Input: {targetCrop.name}
            </h3>
            <p className="text-xs text-earthora-muted">Record irrigation or biological amendment.</p>

            <form onSubmit={handleAddLogSubmit} className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-earthora-charcoal">Input Category</label>
                <div className="mt-1 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setLogForm({ ...logForm, type: 'irrigation' })}
                    className={`flex-1 rounded-xl py-2 text-xs font-bold ${
                      logForm.type === 'irrigation'
                        ? 'bg-blue-600 text-white'
                        : 'border border-earthora-sand bg-white text-earthora-charcoal'
                    }`}
                  >
                    Irrigation
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogForm({ ...logForm, type: 'fertilizer' })}
                    className={`flex-1 rounded-xl py-2 text-xs font-bold ${
                      logForm.type === 'fertilizer'
                        ? 'bg-emerald-700 text-white'
                        : 'border border-earthora-sand bg-white text-earthora-charcoal'
                    }`}
                  >
                    Soil Amendment
                  </button>
                </div>
              </div>

              {logForm.type === 'irrigation' ? (
                <>
                  <div>
                    <label className="text-xs font-semibold text-earthora-charcoal">Amount (Liters)</label>
                    <input
                      type="number"
                      value={logForm.amountLiters}
                      onChange={(e) => setLogForm({ ...logForm, amountLiters: e.target.value })}
                      className="input-field mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-earthora-charcoal">Delivery Method</label>
                    <select
                      value={logForm.method}
                      onChange={(e) => setLogForm({ ...logForm, method: e.target.value })}
                      className="input-field mt-1"
                    >
                      <option>Precision Drip</option>
                      <option>Sub-surface Drip</option>
                      <option>Micro-sprinklers</option>
                      <option>Gravity-fed Flood</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-xs font-semibold text-earthora-charcoal">Amendment Description</label>
                    <input
                      type="text"
                      value={logForm.fertilizerType}
                      onChange={(e) => setLogForm({ ...logForm, fertilizerType: e.target.value })}
                      className="input-field mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-earthora-charcoal">Quantity (kg)</label>
                    <input
                      type="number"
                      value={logForm.quantityKg}
                      onChange={(e) => setLogForm({ ...logForm, quantityKg: e.target.value })}
                      className="input-field mt-1"
                    />
                  </div>
                </>
              )}

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-earthora-sand/50">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="rounded-xl border border-earthora-sand px-4 py-2 text-xs font-semibold text-earthora-charcoal hover:bg-earthora-ivory"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-accent text-xs">
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

