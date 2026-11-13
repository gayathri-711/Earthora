import { useCallback, useEffect, useState } from 'react';
import { BarChart3, Package, Plus, Sprout, Trash2, Upload } from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';
import DashboardLayout from '../../layouts/DashboardLayout';

const tabs = [
  { id: 'overview', label: 'Sales & Overview', icon: BarChart3 },
  { id: 'products', label: 'My Produce & Stock', icon: Sprout },
  { id: 'orders', label: 'Incoming Orders', icon: Package },
  { id: 'profile', label: 'Farm Profile', icon: Upload },
];

const emptyProduct = {
  name: '',
  category: 'vegetables',
  price: '',
  unit: '1 kg',
  stock: 25,
  harvestDate: new Date().toISOString().slice(0, 10),
  certifications: 'USDA Organic',
  shortDescription: '',
  image: '/assets/img/home-4/shop-1.jpg',
};

export default function FarmerDashboard() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, totalProducts: 0, lowStock: 0 });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [farmProfile, setFarmProfile] = useState({
    farmName: '',
    location: '',
    specialty: '',
    bio: '',
    certifications: 'USDA Organic',
  });

  const [newProduct, setNewProduct] = useState(emptyProduct);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const { data } = await api.get('/farmer/dashboard');
      setStats(data.data.stats || {});
      setProducts(data.data.products || []);
      setOrders(data.data.orders || []);
      if (data.data.farmer) {
        setFarmProfile({
          farmName: data.data.farmer.farmName || '',
          location: data.data.farmer.location || '',
          specialty: data.data.farmer.specialty || '',
          bio: data.data.farmer.bio || '',
          certifications: (data.data.farmer.certifications || ['USDA Organic']).join(', '),
        });
      }
    } catch {
      // Initial empty state before login/seed
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

      showToast('Organic product listed!');
      setNewProduct(emptyProduct);
      setImageFile(null);
      loadData();
    } catch (err) {
      showToast(err.message || 'Unable to add product', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleQuickUpdate = async (productId, patch) => {
    try {
      await api.put(`/farmer/products/${productId}`, patch);
      showToast('Product inventory updated.');
      loadData();
    } catch (err) {
      showToast(err.message || 'Update failed', 'error');
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await api.delete(`/farmer/products/${productId}`);
      showToast('Product removed.', 'info');
      loadData();
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const handleOrderStatus = async (orderId, status) => {
    try {
      await api.patch(`/farmer/orders/${orderId}/status`, { status });
      showToast(`Order marked as ${status}.`);
      loadData();
    } catch (err) {
      showToast(err.message || 'Unable to update order', 'error');
    }
  };

  const handleSaveFarmProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put('/farmer/profile', {
        ...farmProfile,
        certifications: farmProfile.certifications.split(',').map((s) => s.trim()).filter(Boolean),
      });
      showToast('Farm profile saved.');
      loadData();
    } catch (err) {
      showToast(err.message || 'Unable to save profile', 'error');
    }
  };

  return (
    <DashboardLayout
      title="Farmer Portal"
      subtitle="Manage harvest listings, live inventory, harvest dates, and order fulfillment"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Total Sales', value: `$${Number(stats.totalRevenue || 0).toFixed(2)}` },
              { label: 'Orders Received', value: stats.totalOrders || 0 },
              { label: 'Active Listings', value: stats.totalProducts || 0 },
              { label: 'Low Stock Alerts', value: stats.lowStock || 0 },
            ].map((card) => (
              <div key={card.label} className="card-surface p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-agriva-muted">
                  {card.label}
                </p>
                <p className="mt-2 font-display text-3xl font-bold text-agriva-forest">{card.value}</p>
              </div>
            ))}
          </div>

          <div className="card-surface p-6">
            <h2 className="font-display text-xl font-semibold text-agriva-ink">Recent Farm Orders</h2>
            {orders.length === 0 ? (
              <p className="mt-3 text-sm text-agriva-muted">No customer orders assigned to your farm yet.</p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-agriva-line text-xs uppercase text-agriva-muted">
                    <tr>
                      <th className="py-2.5">Order #</th>
                      <th className="py-2.5">Customer</th>
                      <th className="py-2.5">Total</th>
                      <th className="py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-agriva-line">
                    {orders.slice(0, 5).map((o) => (
                      <tr key={o._id}>
                        <td className="py-3 font-semibold text-agriva-ink">{o.orderNumber}</td>
                        <td className="py-3 text-agriva-muted">{o.shippingAddress?.fullName || 'Customer'}</td>
                        <td className="py-3 font-medium">${Number(o.totalAmount).toFixed(2)}</td>
                        <td className="py-3 capitalize text-agriva-pine">{o.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="grid gap-8 lg:grid-cols-12">
          <form onSubmit={handleCreateProduct} className="card-surface h-fit space-y-4 p-6 lg:col-span-5">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-agriva-ink">
              <Plus className="h-5 w-5 text-agriva-forest" />
              Add Organic Product
            </h2>
            <div>
              <label className="mb-1 block text-xs font-semibold">Product Name</label>
              <input
                type="text"
                required
                value={newProduct.name}
                onChange={(e) => setNewProduct((p) => ({ ...p, name: e.target.value }))}
                placeholder="Organic Baby Kale"
                className="input-field"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold">Category</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct((p) => ({ ...p, category: e.target.value }))}
                  className="input-field"
                >
                  <option value="vegetables">Fresh Vegetables</option>
                  <option value="fruits">Orchard Fruits</option>
                  <option value="grains">Heritage Grains</option>
                  <option value="dairy-honey">Raw Honey &amp; Dairy</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.5"
                  required
                  value={newProduct.price}
                  onChange={(e) => setNewProduct((p) => ({ ...p, price: e.target.value }))}
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold">Unit</label>
                <input
                  type="text"
                  required
                  value={newProduct.unit}
                  onChange={(e) => setNewProduct((p) => ({ ...p, unit: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold">Stock</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct((p) => ({ ...p, stock: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold">Harvest Date</label>
                <input
                  type="date"
                  required
                  value={newProduct.harvestDate}
                  onChange={(e) => setNewProduct((p) => ({ ...p, harvestDate: e.target.value }))}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold">Short Description</label>
              <textarea
                rows={2}
                required
                value={newProduct.shortDescription}
                onChange={(e) => setNewProduct((p) => ({ ...p, shortDescription: e.target.value }))}
                className="input-field"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold">Upload Product Image (optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="text-xs text-agriva-muted"
              />
            </div>

            <button type="submit" disabled={saving} className="btn-primary w-full">
              {saving ? 'Publishing...' : 'Publish Harvest Listing'}
            </button>
          </form>

          <div className="space-y-4 lg:col-span-7">
            <h2 className="font-display text-xl font-semibold text-agriva-ink">
              My Listings ({products.length})
            </h2>
            {products.map((prod) => (
              <div key={prod._id} className="card-surface flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <img src={prod.image} alt={prod.name} className="h-16 w-16 rounded-lg object-cover" />
                  <div>
                    <p className="font-display text-base font-semibold text-agriva-ink">{prod.name}</p>
                    <p className="text-xs text-agriva-muted">
                      ${Number(prod.price).toFixed(2)} / {prod.unit} · Harvest{' '}
                      {prod.harvestDate?.slice(0, 10)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <label className="text-xs text-agriva-muted">Stock:</label>
                  <input
                    type="number"
                    min="0"
                    defaultValue={prod.stock}
                    onBlur={(e) => handleQuickUpdate(prod._id, { stock: Number(e.target.value) })}
                    className="input-field w-20 py-1 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteProduct(prod._id)}
                    className="rounded-lg p-2 text-red-700 hover:bg-red-50"
                    aria-label="Delete product"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h2 className="font-display text-2xl font-semibold text-agriva-ink">Fulfill Customer Orders</h2>
          {orders.length === 0 ? (
            <div className="card-surface p-8 text-center text-sm text-agriva-muted">
              No incoming orders yet.
            </div>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="card-surface flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                  <p className="font-display text-lg font-semibold text-agriva-ink">#{order.orderNumber}</p>
                  <p className="text-xs text-agriva-muted">
                    {order.shippingAddress?.fullName} · {order.shippingAddress?.city} · $
                    {Number(order.totalAmount).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={order.status}
                    onChange={(e) => handleOrderStatus(order._id, e.target.value)}
                    className="input-field w-44 py-2 text-xs"
                  >
                    <option value="pending">Pending</option>
                    <option value="harvested">Harvested &amp; Packed</option>
                    <option value="shipped">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'profile' && (
        <form onSubmit={handleSaveFarmProfile} className="card-surface max-w-2xl space-y-4 p-6">
          <h2 className="font-display text-2xl font-semibold text-agriva-ink">Farm Profile</h2>
          <div>
            <label className="mb-1 block text-xs font-semibold">Farm Name</label>
            <input
              type="text"
              required
              value={farmProfile.farmName}
              onChange={(e) => setFarmProfile((f) => ({ ...f, farmName: e.target.value }))}
              className="input-field"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold">Location</label>
              <input
                type="text"
                required
                value={farmProfile.location}
                onChange={(e) => setFarmProfile((f) => ({ ...f, location: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold">Specialty</label>
              <input
                type="text"
                value={farmProfile.specialty}
                onChange={(e) => setFarmProfile((f) => ({ ...f, specialty: e.target.value }))}
                className="input-field"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold">Certifications (comma-separated)</label>
            <input
              type="text"
              value={farmProfile.certifications}
              onChange={(e) => setFarmProfile((f) => ({ ...f, certifications: e.target.value }))}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold">Farm Story &amp; Soil Practices</label>
            <textarea
              rows={4}
              value={farmProfile.bio}
              onChange={(e) => setFarmProfile((f) => ({ ...f, bio: e.target.value }))}
              className="input-field"
            />
          </div>
          <button type="submit" className="btn-primary">
            Save Farm Profile
          </button>
        </form>
      )}
    </DashboardLayout>
  );
}

