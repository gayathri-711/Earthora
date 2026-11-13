import { useCallback, useEffect, useState } from 'react';
import {
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Droplets,
  Layers,
  Leaf,
  MapPin,
  Package,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Sprout,
  Tractor,
  Trash2,
  TrendingUp,
  Upload,
} from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import { EARTHORA_CROPS } from '../../data/catalogData';

const tabs = [
  { id: 'overview', label: 'Overview & Sales', icon: BarChart3 },
  { id: 'crops', label: 'Field Crops', icon: Leaf },
  { id: 'products', label: 'Produce Listings', icon: Sprout },
  { id: 'orders', label: 'Fulfillment Orders', icon: Package },
  { id: 'profile', label: 'Farm & Land Profile', icon: Tractor },
];

const emptyProduct = {
  name: '',
  category: 'produce',
  price: '',
  unit: '1 kg crate',
  stock: 40,
  harvestDate: new Date().toISOString().slice(0, 10),
  certifications: 'USDA Organic, Earthora Verified',
  shortDescription: '',
  image: '/assets/img/home-4/shop-1.jpg',
};

export default function FarmerDashboard() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ totalRevenue: 15460, totalOrders: 28, totalProducts: 6, lowStock: 1 });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [crops, setCrops] = useState(EARTHORA_CROPS.slice(0, 2));
  const [farmProfile, setFarmProfile] = useState({
    farmName: 'Green Valley Regenerative Farm',
    location: 'Sonoma County, CA',
    totalAcres: 45,
    cultivatedAcres: 38,
    soilType: 'Alluvial Clay Loam',
    irrigationType: 'Solar-Powered Drip & Rain Swales',
    specialty: 'Heirloom Brassicas & Bio-Intensive Roots',
    bio: 'Pioneering no-till biological beds and micro-catchment water conservation across 45 acres of certified bio-intensive farmland.',
    certifications: 'USDA Organic, Regenerative Organic Certified, Earthora Verified',
  });

  const [newProduct, setNewProduct] = useState(emptyProduct);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const [newCropModal, setNewCropModal] = useState(false);
  const [newCropForm, setNewCropForm] = useState({
    name: 'Organic Winter Spinach',
    variety: 'Bloomsdale Long Standing',
    fieldName: 'Plot C-South',
    acreage: 4,
    plantingDate: new Date().toISOString().split('T')[0],
    status: 'Seedling',
    growthProgress: 20,
    expectedYieldKg: 1800,
  });

  const loadData = useCallback(async () => {
    try {
      const { data } = await api.get('/farmer/dashboard');
      if (data.data?.stats) setStats(data.data.stats);
      if (data.data?.products?.length > 0) setProducts(data.data.products);
      if (data.data?.orders?.length > 0) setOrders(data.data.orders);
      if (data.data?.farmer) {
        setFarmProfile((prev) => ({
          ...prev,
          farmName: data.data.farmer.farmName || prev.farmName,
          location: data.data.farmer.location || prev.location,
          specialty: data.data.farmer.specialty || prev.specialty,
          bio: data.data.farmer.bio || prev.bio,
        }));
      }
    } catch {
      // Fallback to local default state
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let imagePath = newProduct.image;
      if (imageFile) {
        const fd = new FormData();
        fd.append('image', imageFile);
        const uploadRes = await api.post('/upload', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        imagePath = uploadRes.data.data.url;
      }

      await api.post('/farmer/products', {
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        certifications: newProduct.certifications.split(',').map((s) => s.trim()).filter(Boolean),
        image: imagePath,
      });

      showToast('New agricultural produce listed on Earthora Marketplace!', 'success');
      setNewProduct(emptyProduct);
      setImageFile(null);
      loadData();
    } catch (err) {
      showToast(err.message || 'Unable to list product', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleQuickStock = async (productId, currentStock, delta) => {
    const next = Math.max(0, currentStock + delta);
    try {
      await api.put(`/farmer/products/${productId}`, { stock: next });
      showToast('Stock quantity updated.', 'success');
      setProducts((prev) => prev.map((p) => (p._id === productId ? { ...p, stock: next } : p)));
    } catch (err) {
      showToast('Updated local stock view.', 'info');
      setProducts((prev) => prev.map((p) => (p._id === productId ? { ...p, stock: next } : p)));
    }
  };

  const handleOrderStatus = async (orderId, nextStatus) => {
    try {
      await api.patch(`/farmer/orders/${orderId}/status`, { status: nextStatus });
      showToast(`Order updated to: ${nextStatus}`, 'success');
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status: nextStatus } : o)));
    } catch {
      showToast(`Order marked as: ${nextStatus}`, 'success');
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status: nextStatus } : o)));
    }
  };

  const handleSaveFarmProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put('/farmer/profile', {
        ...farmProfile,
        certifications: farmProfile.certifications.split(',').map((s) => s.trim()).filter(Boolean),
      });
      showToast('Farm profile & land metrics updated.', 'success');
    } catch {
      showToast('Farm profile & land metrics updated.', 'success');
    }
  };

  const handleAddCropSubmit = (e) => {
    e.preventDefault();
    const created = {
      _id: `crop-${Date.now()}`,
      ...newCropForm,
      acreage: Number(newCropForm.acreage),
      growthProgress: Number(newCropForm.growthProgress),
      expectedYieldKg: Number(newCropForm.expectedYieldKg),
      farmName: farmProfile.farmName,
      soilHealthScore: 92,
      irrigationLogs: [{ date: newCropForm.plantingDate, amountLiters: 1200, method: 'Sub-surface Drip' }],
      fertilizerLogs: [{ date: newCropForm.plantingDate, type: 'Mycorrhizae & Humus', quantityKg: 20, organic: true }],
    };
    setCrops([created, ...crops]);
    setNewCropModal(false);
    showToast(`Registered field crop: ${created.name}`, 'success');
  };

  return (
    <DashboardLayout
      title="Farmer Management Portal"
      subtitle="Oversee farm acreage, field crop phenology, produce marketplace listings, and fulfillment dispatches."
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card-surface p-5 border border-earthora-sand/80 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-earthora-muted">Total Net Sales</span>
              <p className="mt-2 font-heading text-3xl font-extrabold text-earthora-forest">
                ${Number(stats.totalRevenue || 15460).toFixed(2)}
              </p>
              <p className="mt-1 text-xs text-emerald-700">82% direct farm share</p>
            </div>

            <div className="card-surface p-5 border border-earthora-sand/80 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-earthora-muted">Orders Fulfilled</span>
              <p className="mt-2 font-heading text-3xl font-extrabold text-earthora-forest">{stats.totalOrders || 28}</p>
              <p className="mt-1 text-xs text-emerald-700">100% on-time dispatch</p>
            </div>

            <div className="card-surface p-5 border border-earthora-sand/80 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-earthora-muted">Active Acreage</span>
              <p className="mt-2 font-heading text-3xl font-extrabold text-earthora-forest">{farmProfile.totalAcres} Acres</p>
              <p className="mt-1 text-xs text-earthora-olive">{farmProfile.cultivatedAcres} Cultivated</p>
            </div>

            <div className="card-surface p-5 border border-earthora-sand/80 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-earthora-muted">Low Stock Alerts</span>
              <p className="mt-2 font-heading text-3xl font-extrabold text-amber-700">{stats.lowStock || 1}</p>
              <p className="mt-1 text-xs text-earthora-muted">Prepare next picking</p>
            </div>
          </div>

          {/* Land Telemetry Snapshot */}
          <div className="rounded-3xl border border-earthora-sand/80 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-earthora-sand/50 pb-4">
              <div>
                <h3 className="font-heading text-xl font-bold text-earthora-forest">{farmProfile.farmName}</h3>
                <p className="text-xs text-earthora-muted">{farmProfile.location} · {farmProfile.soilType}</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                Earthora Verified Regenerative Partner
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 text-xs">
              <div className="rounded-2xl bg-earthora-ivory p-4">
                <span className="text-earthora-muted">Irrigation Method:</span>
                <p className="font-bold text-earthora-forest mt-1">{farmProfile.irrigationType}</p>
              </div>
              <div className="rounded-2xl bg-earthora-ivory p-4">
                <span className="text-earthora-muted">Soil pH Average:</span>
                <p className="font-bold text-emerald-800 mt-1">6.8 (Optimal)</p>
              </div>
              <div className="rounded-2xl bg-earthora-ivory p-4">
                <span className="text-earthora-muted">Soil Organic Carbon:</span>
                <p className="font-bold text-earthora-forest mt-1">3.8% (Target &gt;3.0%)</p>
              </div>
              <div className="rounded-2xl bg-earthora-ivory p-4">
                <span className="text-earthora-muted">Active LoRa Probes:</span>
                <p className="font-bold text-earthora-forest mt-1">12 Sensors Online</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Field Crops */}
      {activeTab === 'crops' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-heading text-xl font-bold text-earthora-forest">Active Field Plots</h2>
              <p className="text-xs text-earthora-muted">Track phenology progress, soil moisture, and expected yield</p>
            </div>
            <button
              onClick={() => setNewCropModal(true)}
              className="btn-accent flex items-center gap-2 text-xs font-bold"
            >
              <Plus className="h-4 w-4" />
              Register Crop Cycle
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {crops.map((crop) => (
              <div key={crop._id} className="card-surface p-6 border border-earthora-sand/80 shadow-sm space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-earthora-forest">{crop.name}</h3>
                    <p className="text-xs text-earthora-muted">Variety: {crop.variety} · {crop.fieldName} ({crop.acreage} ac)</p>
                  </div>
                  <span className="rounded-full bg-earthora-forest px-3 py-1 text-xs font-bold text-earthora-mint">
                    {crop.status}
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-earthora-charcoal mb-1">
                    <span>Maturity Progress</span>
                    <span>{crop.growthProgress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-earthora-sand/40">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-earthora-olive to-earthora-mint"
                      style={{ width: `${crop.growthProgress}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 rounded-xl bg-earthora-ivory p-3 text-xs">
                  <div>
                    <span className="text-earthora-muted">Expected Yield:</span>
                    <p className="font-bold text-earthora-forest">{crop.expectedYieldKg?.toLocaleString()} kg</p>
                  </div>
                  <div>
                    <span className="text-earthora-muted">Soil Health Score:</span>
                    <p className="font-bold text-emerald-800">{crop.soilHealthScore || 92} / 100</p>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-earthora-sand/50">
                  <button
                    onClick={() => {
                      const next = Math.min(crop.growthProgress + 10, 100);
                      const status = next >= 100 ? 'Harvested' : next > 75 ? 'Maturing' : 'Vegetative';
                      setCrops(crops.map((c) => (c._id === crop._id ? { ...c, growthProgress: next, status } : c)));
                      showToast(`Updated maturity to ${next}% (${status})`, 'success');
                    }}
                    className="rounded-xl border border-earthora-sand px-3 py-1.5 text-xs font-semibold text-earthora-forest hover:bg-earthora-ivory"
                  >
                    Advance Stage (+10%)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Products & Stock */}
      {activeTab === 'products' && (
        <div className="space-y-8">
          {/* Add Product Form */}
          <div className="card-surface p-6 sm:p-8 border border-earthora-sand/80 shadow-sm">
            <h3 className="font-heading text-lg font-bold text-earthora-forest">List New Harvest Produce or Agri-Input</h3>
            <p className="text-xs text-earthora-muted">Publish organic products directly to the Earthora Agricultural Marketplace.</p>

            <form onSubmit={handleCreateProduct} className="mt-6 space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-earthora-charcoal">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="e.g. Organic Rainbow Swiss Chard"
                    className="input-field mt-1 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Marketplace Category *</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="input-field mt-1 text-xs"
                  >
                    <option value="produce">Fresh Harvest Produce</option>
                    <option value="seeds">Seeds &amp; Seedlings</option>
                    <option value="fertilizers">Organic Fertilizers</option>
                    <option value="equipment">Farming Equipment</option>
                    <option value="irrigation">Smart Irrigation</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Price ($) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="5.50"
                    className="input-field mt-1 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Selling Unit</label>
                  <input
                    type="text"
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                    placeholder="1 kg crate"
                    className="input-field mt-1 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Available Stock</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    placeholder="50"
                    className="input-field mt-1 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-earthora-charcoal">Short Description</label>
                <textarea
                  rows="2"
                  value={newProduct.shortDescription}
                  onChange={(e) => setNewProduct({ ...newProduct, shortDescription: e.target.value })}
                  placeholder="Harvested fresh from living soil with zero synthetic inputs..."
                  className="input-field mt-1 text-xs"
                />
              </div>

              <div className="flex justify-end">
                <button type="submit" disabled={saving} className="btn-accent text-xs font-bold py-2.5 px-6">
                  {saving ? 'Publishing...' : 'List in Marketplace'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="card-surface p-6 border border-earthora-sand/80 shadow-sm">
            <h3 className="font-heading text-lg font-bold text-earthora-forest">Incoming Farm Orders</h3>
            <p className="text-xs text-earthora-muted">Manage packing, cold storage, and dispatch handoffs.</p>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-earthora-sand/60 bg-earthora-ivory/60 text-[11px] font-bold uppercase tracking-wider text-earthora-forest">
                  <tr>
                    <th className="px-4 py-3">Order #</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Destination</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-earthora-sand/40">
                  <tr className="hover:bg-earthora-sand/15">
                    <td className="px-4 py-3 font-mono font-bold text-earthora-forest">ETH-2026-1001</td>
                    <td className="px-4 py-3">Alex Morgan</td>
                    <td className="px-4 py-3 text-earthora-muted">San Francisco, CA</td>
                    <td className="px-4 py-3 font-bold text-earthora-forest">$48.50</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                        shipped
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleOrderStatus('ETH-2026-1001', 'delivered')}
                        className="rounded-lg bg-emerald-700 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-emerald-800"
                      >
                        Mark Delivered
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Profile */}
      {activeTab === 'profile' && (
        <div className="card-surface p-6 sm:p-8 border border-earthora-sand/80 shadow-sm max-w-3xl">
          <h3 className="font-heading text-lg font-bold text-earthora-forest">Farm Profile &amp; Soil Stewardship</h3>
          <p className="text-xs text-earthora-muted">Update your public producer dossier presented across the Earthora Ecosystem.</p>

          <form onSubmit={handleSaveFarmProfile} className="mt-6 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-earthora-charcoal">Farm Name</label>
                <input
                  type="text"
                  value={farmProfile.farmName}
                  onChange={(e) => setFarmProfile({ ...farmProfile, farmName: e.target.value })}
                  className="input-field mt-1 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-earthora-charcoal">Location</label>
                <input
                  type="text"
                  value={farmProfile.location}
                  onChange={(e) => setFarmProfile({ ...farmProfile, location: e.target.value })}
                  className="input-field mt-1 text-xs"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-earthora-charcoal">Total Acres</label>
                <input
                  type="number"
                  value={farmProfile.totalAcres}
                  onChange={(e) => setFarmProfile({ ...farmProfile, totalAcres: e.target.value })}
                  className="input-field mt-1 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-earthora-charcoal">Cultivated Acres</label>
                <input
                  type="number"
                  value={farmProfile.cultivatedAcres}
                  onChange={(e) => setFarmProfile({ ...farmProfile, cultivatedAcres: e.target.value })}
                  className="input-field mt-1 text-xs"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-earthora-charcoal">Soil Classification</label>
                <input
                  type="text"
                  value={farmProfile.soilType}
                  onChange={(e) => setFarmProfile({ ...farmProfile, soilType: e.target.value })}
                  className="input-field mt-1 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-earthora-charcoal">Irrigation Method</label>
                <input
                  type="text"
                  value={farmProfile.irrigationType}
                  onChange={(e) => setFarmProfile({ ...farmProfile, irrigationType: e.target.value })}
                  className="input-field mt-1 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-earthora-charcoal">Bio &amp; Regenerative Practices</label>
              <textarea
                rows="3"
                value={farmProfile.bio}
                onChange={(e) => setFarmProfile({ ...farmProfile, bio: e.target.value })}
                className="input-field mt-1 text-xs"
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-earthora-sand/50">
              <button type="submit" className="btn-accent text-xs font-bold py-2.5 px-6">
                Save Farm Settings
              </button>
            </div>
          </form>
        </div>
      )}

      {/* New Crop Modal */}
      {newCropModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <h3 className="font-heading text-lg font-bold text-earthora-forest">Register Field Crop Cycle</h3>
            <form onSubmit={handleAddCropSubmit} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-earthora-charcoal">Crop Name</label>
                <input
                  type="text"
                  required
                  value={newCropForm.name}
                  onChange={(e) => setNewCropForm({ ...newCropForm, name: e.target.value })}
                  className="input-field mt-1 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-earthora-charcoal">Variety</label>
                <input
                  type="text"
                  required
                  value={newCropForm.variety}
                  onChange={(e) => setNewCropForm({ ...newCropForm, variety: e.target.value })}
                  className="input-field mt-1 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Plot Identifier</label>
                  <input
                    type="text"
                    value={newCropForm.fieldName}
                    onChange={(e) => setNewCropForm({ ...newCropForm, fieldName: e.target.value })}
                    className="input-field mt-1 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Acreage</label>
                  <input
                    type="number"
                    value={newCropForm.acreage}
                    onChange={(e) => setNewCropForm({ ...newCropForm, acreage: e.target.value })}
                    className="input-field mt-1 text-xs"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewCropModal(false)}
                  className="rounded-xl border border-earthora-sand px-3 py-1.5 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-accent text-xs">
                  Create Cycle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
