import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  CheckCircle2,
  ChevronRight,
  Compass,
  Droplets,
  Filter,
  MapPin,
  PlusCircle,
  Search,
  ShieldCheck,
  Sprout,
  Tractor,
  Users,
  Wheat,
  X,
} from 'lucide-react';
import SectionHeading from '../../components/common/SectionHeading';
import { EARTHORA_FARMERS } from '../../data/catalogData';
import { useToast } from '../../context/ToastContext';

export default function FarmerHubPage() {
  const [farmers, setFarmers] = useState(EARTHORA_FARMERS);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFarmer, setActiveFarmer] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const { showToast } = useToast();

  const [applyForm, setApplyForm] = useState({
    farmName: '',
    farmerName: '',
    email: '',
    location: '',
    totalAcres: '',
    primaryCrops: '',
    certifications: 'USDA Organic',
    irrigationType: 'Drip Irrigation',
  });

  const regions = [
    { id: 'all', label: 'All Regions' },
    { id: 'Sonoma', label: 'Sonoma County, CA' },
    { id: 'Willamette', label: 'Willamette Valley, OR' },
    { id: 'Lancaster', label: 'Lancaster, PA' },
    { id: 'Hudson', label: 'Hudson Valley, NY' },
  ];

  const filteredFarmers = farmers.filter((farmer) => {
    const matchesRegion =
      selectedRegion === 'all' || farmer.location.toLowerCase().includes(selectedRegion.toLowerCase());
    const matchesSearch =
      farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farmer.farmName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farmer.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farmer.primaryCrops.some((crop) => crop.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRegion && matchesSearch;
  });

  const handleApplySubmit = (e) => {
    e.preventDefault();
    if (!applyForm.farmName || !applyForm.farmerName || !applyForm.email) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    const newFarmer = {
      _id: `farmer-${Date.now()}`,
      name: applyForm.farmerName,
      farmName: applyForm.farmName,
      specialty: applyForm.primaryCrops || 'Regenerative Agriculture',
      location: applyForm.location || 'Sonoma County, CA',
      coordinates: { lat: 38.3, lng: -122.5 },
      totalAcres: Number(applyForm.totalAcres) || 40,
      cultivatedAcres: Math.round((Number(applyForm.totalAcres) || 40) * 0.85),
      primaryCrops: applyForm.primaryCrops
        ? applyForm.primaryCrops.split(',').map((c) => c.trim())
        : ['Organic Crops'],
      soilType: 'Living Loam',
      irrigationType: applyForm.irrigationType,
      experience: '5+ Years',
      certifications: [applyForm.certifications, 'Earthora Partner Pending'],
      image: '/assets/img/home-3/team/01.jpg',
      coverImage: '/assets/img/hero/farmer-hero.jpg',
      bio: `Applying to join the Earthora Regenerative Farming Ecosystem from ${applyForm.location || 'our regional hub'}.`,
    };

    setFarmers((prev) => [newFarmer, ...prev]);
    setShowApplyModal(false);
    setApplyForm({
      farmName: '',
      farmerName: '',
      email: '',
      location: '',
      totalAcres: '',
      primaryCrops: '',
      certifications: 'USDA Organic',
      irrigationType: 'Drip Irrigation',
    });
    showToast('Application submitted! Your farm is now listed in the registry review queue.', 'success');
  };

  return (
    <div className="bg-earthora-ivory min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-earthora-forest py-20 text-white lg:py-28">
        <div className="absolute inset-0 opacity-20">
          <img
            src="/assets/img/hero/farmer-hero.jpg"
            alt="Farming"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-earthora-forest via-earthora-forest/90 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-earthora-mint/40 bg-earthora-mint/15 px-4 py-1.5 text-xs sm:text-sm font-black tracking-[0.2em] text-earthora-mint uppercase shadow-xs">
              <Sprout className="h-4.5 w-4.5" />
              EARTHORA GROWER HUB
            </div>
            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]">
              Farmer Hub &amp; Grower Network
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-earthora-sand/90 sm:text-xl">
              Connecting certified regenerative growers, independent family farms, and precision agronomists.
              Explore our verified producer directory, field metrics, and crop rotations.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => setShowApplyModal(true)}
                className="btn-accent flex items-center gap-2 shadow-lg shadow-earthora-mint/20"
              >
                <PlusCircle className="h-5 w-5" />
                Register Your Farm as Partner
              </button>
              <Link
                to="/crop-management"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                <Wheat className="h-5 w-5 text-earthora-mint" />
                Live Crop Cycles
              </Link>
            </div>
          </div>

          {/* Metric Bar */}
          <div className="mt-14 grid grid-cols-2 gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md sm:grid-cols-4">
            <div>
              <div className="font-heading text-3xl font-extrabold text-white">1,420+</div>
              <div className="text-xs text-earthora-sand/75">Regenerative Acres Managed</div>
            </div>
            <div>
              <div className="font-heading text-3xl font-extrabold text-earthora-mint">100%</div>
              <div className="text-xs text-earthora-sand/75">Zero Synthetic Chemicals</div>
            </div>
            <div>
              <div className="font-heading text-3xl font-extrabold text-white">42</div>
              <div className="text-xs text-earthora-sand/75">Verified Partner Farms</div>
            </div>
            <div>
              <div className="font-heading text-3xl font-extrabold text-earthora-gold">24 hrs</div>
              <div className="text-xs text-earthora-sand/75">Harvest-to-Dispatch Window</div>
            </div>
          </div>
        </div>
      </section>

      {/* Directory & Filter Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <SectionHeading
              eyebrow="Verified Directory"
              title="Our Partner Farms"
              description="Direct-trade relationships built on transparent soil stewardship and bio-intensive integrity."
            />
          </div>

          {/* Search Box */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-earthora-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by farm, grower, or crop..."
              className="w-full rounded-xl border border-earthora-sand bg-white py-2.5 pl-10 pr-4 text-sm text-earthora-charcoal placeholder-earthora-muted focus:border-earthora-forest focus:outline-none focus:ring-2 focus:ring-earthora-forest/10"
            />
          </div>
        </div>

        {/* Region Filter Pills */}
        <div className="mt-8 flex flex-wrap gap-2">
          {regions.map((region) => (
            <button
              key={region.id}
              onClick={() => setSelectedRegion(region.id)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                selectedRegion === region.id
                  ? 'bg-earthora-forest text-white shadow-md'
                  : 'border border-earthora-sand bg-white text-earthora-charcoal hover:border-earthora-forest hover:bg-earthora-sand/20'
              }`}
            >
              {region.label}
            </button>
          ))}
        </div>

        {/* Farmers Grid */}
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {filteredFarmers.map((farmer) => (
            <div
              key={farmer._id}
              className="card-surface group overflow-hidden border border-earthora-sand/80 transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-48 w-full overflow-hidden bg-earthora-forest">
                <img
                  src={farmer.coverImage || '/assets/img/farmers/farm-green-valley.jpg'}
                  alt={farmer.farmName}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/assets/img/farmers/farm-green-valley.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-earthora-forest/90 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                  <div className="flex items-center gap-1.5 text-xs font-medium">
                    <MapPin className="h-3.5 w-3.5 text-earthora-mint" />
                    {farmer.location}
                  </div>
                  <span className="rounded-full bg-earthora-forest/80 px-2.5 py-1 text-[11px] font-semibold text-earthora-mint backdrop-blur-sm">
                    {farmer.totalAcres} Total Acres
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start gap-4">
                  <img
                    src={farmer.image || '/assets/img/farmers/farmer-elena.jpg'}
                    alt={farmer.name}
                    className="h-14 w-14 rounded-2xl border-2 border-white object-cover shadow-md"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/assets/img/farmers/farmer-elena.jpg';
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading text-lg font-bold text-earthora-forest">
                        {farmer.farmName}
                      </h3>
                      <ShieldCheck className="h-5 w-5 text-earthora-mint" title="Earthora Verified" />
                    </div>
                    <p className="text-xs font-medium text-earthora-muted">
                      Lead Grower: <strong className="text-earthora-charcoal">{farmer.name}</strong> ·{' '}
                      {farmer.experience}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-xs leading-relaxed text-earthora-muted">
                  {farmer.bio}
                </p>

                {/* Agronomic Specs */}
                <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-earthora-ivory p-3 text-[11px]">
                  <div>
                    <span className="text-earthora-muted">Soil Classification:</span>
                    <p className="font-semibold text-earthora-forest">{farmer.soilType}</p>
                  </div>
                  <div>
                    <span className="text-earthora-muted">Irrigation Method:</span>
                    <p className="font-semibold text-earthora-forest">{farmer.irrigationType}</p>
                  </div>
                </div>

                {/* Primary Crops */}
                <div className="mt-4">
                  <span className="text-[11px] font-bold text-earthora-charcoal uppercase tracking-wider">
                    Primary Harvests:
                  </span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {farmer.primaryCrops.map((crop) => (
                      <span
                        key={crop}
                        className="rounded-md bg-earthora-sand/50 px-2.5 py-1 text-[11px] font-semibold text-earthora-forest"
                      >
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-earthora-sand/50 pt-3">
                  {farmer.certifications.map((cert) => (
                    <span
                      key={cert}
                      className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-medium text-emerald-800"
                    >
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      {cert}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between pt-2">
                  <button
                    onClick={() => setActiveFarmer(farmer)}
                    className="text-xs font-bold text-earthora-forest hover:text-earthora-mint inline-flex items-center gap-1"
                  >
                    View Field Dossier <ChevronRight className="h-4 w-4" />
                  </button>
                  <Link
                    to={`/marketplace?search=${encodeURIComponent(farmer.farmName)}`}
                    className="rounded-lg bg-earthora-forest px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-earthora-olive"
                  >
                    Explore Produce
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredFarmers.length === 0 && (
          <div className="rounded-2xl border border-dashed border-earthora-sand bg-white p-12 text-center">
            <Sprout className="mx-auto h-12 w-12 text-earthora-muted/60" />
            <h4 className="mt-4 font-heading text-lg font-bold text-earthora-charcoal">
              No matching farms found
            </h4>
            <p className="mt-1 text-sm text-earthora-muted">
              Try adjusting your region filter or search terms.
            </p>
            <button
              onClick={() => {
                setSelectedRegion('all');
                setSearchQuery('');
              }}
              className="mt-4 text-xs font-bold text-earthora-forest underline"
            >
              Reset filters
            </button>
          </div>
        )}
      </section>

      {/* Partner Benefits Section */}
      <section className="bg-earthora-sand/30 border-y border-earthora-sand/60 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Ecosystem Advantages"
            title="Why Family Farms Partner with Earthora"
            description="We eliminate predatory middleman markups and equip independent growers with smart agronomy technology."
            centered
          />

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card-surface p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-earthora-forest text-white">
                <Tractor className="h-6 w-6" />
              </div>
              <h4 className="mt-5 font-heading text-lg font-bold text-earthora-forest">
                Guaranteed Fair-Trade Margins
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-earthora-muted">
                Receive 82% of retail price directly to your account. No seasonal broker commissions or payment delays.
              </p>
            </div>

            <div className="card-surface p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-earthora-forest text-white">
                <Droplets className="h-6 w-6" />
              </div>
              <h4 className="mt-5 font-heading text-lg font-bold text-earthora-forest">
                Free IoT Soil &amp; Weather Hardware
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-earthora-muted">
                Qualified regenerative farms receive subsidised LoRaWAN soil moisture probes and automated valve actuators.
              </p>
            </div>

            <div className="card-surface p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-earthora-forest text-white">
                <Award className="h-6 w-6" />
              </div>
              <h4 className="mt-5 font-heading text-lg font-bold text-earthora-forest">
                On-Demand Agronomy Advisory
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-earthora-muted">
                Direct access to our network of certified soil microbiologists and precision irrigation engineers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      {activeFarmer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <button
              onClick={() => setActiveFarmer(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-earthora-muted hover:bg-earthora-ivory"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-4">
              <img
                src={activeFarmer.image || '/assets/img/farmers/farmer-elena.jpg'}
                alt={activeFarmer.name}
                className="h-16 w-16 rounded-2xl object-cover shadow"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/assets/img/farmers/farmer-elena.jpg';
                }}
              />
              <div>
                <h3 className="font-heading text-xl font-bold text-earthora-forest">
                  {activeFarmer.farmName}
                </h3>
                <p className="text-xs text-earthora-muted">
                  Managed by <strong className="text-earthora-charcoal">{activeFarmer.name}</strong> ·{' '}
                  {activeFarmer.location}
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-earthora-charcoal">
              {activeFarmer.bio}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl bg-earthora-ivory p-4 text-xs">
              <div>
                <span className="text-earthora-muted">Total Acreage:</span>
                <p className="font-bold text-earthora-forest">{activeFarmer.totalAcres} Acres ({activeFarmer.cultivatedAcres} Active)</p>
              </div>
              <div>
                <span className="text-earthora-muted">Soil Profile:</span>
                <p className="font-bold text-earthora-forest">{activeFarmer.soilType}</p>
              </div>
              <div>
                <span className="text-earthora-muted">Irrigation Infrastructure:</span>
                <p className="font-bold text-earthora-forest">{activeFarmer.irrigationType}</p>
              </div>
              <div>
                <span className="text-earthora-muted">Experience:</span>
                <p className="font-bold text-earthora-forest">{activeFarmer.experience}</p>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-earthora-charcoal">
                Active Crop Rotations
              </h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {activeFarmer.primaryCrops.map((c) => (
                  <span
                    key={c}
                    className="rounded-lg bg-earthora-forest/10 px-3 py-1 text-xs font-semibold text-earthora-forest"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <Link
                to={`/marketplace?search=${encodeURIComponent(activeFarmer.farmName)}`}
                onClick={() => setActiveFarmer(null)}
                className="btn-primary flex-1 text-center"
              >
                Browse Harvested Products
              </Link>
              <button
                onClick={() => {
                  setActiveFarmer(null);
                  showToast(`Connected with ${activeFarmer.farmName} registry desk.`, 'info');
                }}
                className="btn-secondary"
              >
                Contact Farmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <button
              onClick={() => setShowApplyModal(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-earthora-muted hover:bg-earthora-ivory"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 text-earthora-forest">
              <Sprout className="h-6 w-6 text-earthora-mint" />
              <h3 className="font-heading text-xl font-bold">Apply as an Earthora Partner Farm</h3>
            </div>
            <p className="mt-1 text-xs text-earthora-muted">
              Join our regional farm directory and gain direct access to eco-conscious consumers and agronomy tools.
            </p>

            <form onSubmit={handleApplySubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-earthora-charcoal">Farm Name *</label>
                <input
                  type="text"
                  required
                  value={applyForm.farmName}
                  onChange={(e) => setApplyForm({ ...applyForm, farmName: e.target.value })}
                  placeholder="e.g. Oakridge Regenerative Farm"
                  className="input-field mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Lead Grower Name *</label>
                  <input
                    type="text"
                    required
                    value={applyForm.farmerName}
                    onChange={(e) => setApplyForm({ ...applyForm, farmerName: e.target.value })}
                    placeholder="e.g. Jordan Hayes"
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={applyForm.email}
                    onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                    placeholder="jordan@oakridgefarm.com"
                    className="input-field mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Location (Region/State) *</label>
                  <input
                    type="text"
                    required
                    value={applyForm.location}
                    onChange={(e) => setApplyForm({ ...applyForm, location: e.target.value })}
                    placeholder="Sonoma County, CA"
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Total Acreage *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={applyForm.totalAcres}
                    onChange={(e) => setApplyForm({ ...applyForm, totalAcres: e.target.value })}
                    placeholder="55"
                    className="input-field mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-earthora-charcoal">Primary Crops (comma separated)</label>
                <input
                  type="text"
                  value={applyForm.primaryCrops}
                  onChange={(e) => setApplyForm({ ...applyForm, primaryCrops: e.target.value })}
                  placeholder="Heirloom Tomatoes, Cover Crops, Sweet Corn"
                  className="input-field mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Certification</label>
                  <select
                    value={applyForm.certifications}
                    onChange={(e) => setApplyForm({ ...applyForm, certifications: e.target.value })}
                    className="input-field mt-1"
                  >
                    <option>USDA Organic</option>
                    <option>Regenerative Organic Certified</option>
                    <option>Certified Naturally Grown</option>
                    <option>In Transition to Organic</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Irrigation</label>
                  <select
                    value={applyForm.irrigationType}
                    onChange={(e) => setApplyForm({ ...applyForm, irrigationType: e.target.value })}
                    className="input-field mt-1"
                  >
                    <option>Precision Drip Irrigation</option>
                    <option>Micro-sprinklers</option>
                    <option>Sub-surface Drip</option>
                    <option>Rain-fed with Swales</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-earthora-sand/50">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="rounded-xl border border-earthora-sand px-4 py-2 text-xs font-semibold text-earthora-charcoal hover:bg-earthora-ivory"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-accent text-xs">
                  Submit Farm Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

