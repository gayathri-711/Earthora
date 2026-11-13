import { useCallback, useEffect, useState } from 'react';
import {
  BarChart3,
  BookOpen,
  MessageSquare,
  Package,
  ShieldCheck,
  Sprout,
  Trash2,
  Users,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';
import DashboardLayout from '../../layouts/DashboardLayout';

const tabs = [
  { id: 'overview', label: 'Overview & Sales', icon: BarChart3 },
  { id: 'orders', label: 'Orders & Payments', icon: Package },
  { id: 'products', label: 'Products & Inventory', icon: Sprout },
  { id: 'users', label: 'Users & Farmers', icon: Users },
  { id: 'content', label: 'Blogs & Reviews', icon: BookOpen },
  { id: 'messages', label: 'Contact Messages', icon: MessageSquare },
];

export default function AdminDashboard() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [overview, setOverview] = useState({
    stats: {
      totalRevenue: 0,
      totalOrders: 0,
      totalCustomers: 0,
      totalFarmers: 0,
      totalProducts: 0,
      lowStockCount: 0,
    },
    lowStockProducts: [],
    recentOrders: [],
    salesChart: [],
  });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newBlog, setNewBlog] = useState({
    title: '',
    category: 'Soil Science',
    excerpt: '',
    content: '',
    image: '/assets/img/home-4/news-1.jpg',
  });

  const loadAll = useCallback(async () => {
    try {
      const [ovRes, ordRes, prodRes, usrRes, frmRes, blgRes, revRes, msgRes] = await Promise.all([
        api.get('/admin/overview'),
        api.get('/admin/orders'),
        api.get('/products?limit=100'),
        api.get('/admin/users'),
        api.get('/admin/farmers'),
        api.get('/blogs'),
        api.get('/admin/reviews'),
        api.get('/admin/messages'),
      ]);
      setOverview(ovRes.data.data);
      setOrders(ordRes.data.data.orders || []);
      setProducts(prodRes.data.data.products || []);
      setUsers(usrRes.data.data.users || []);
      setFarmers(frmRes.data.data.farmers || []);
      setBlogs(blgRes.data.data.blogs || []);
      setReviews(revRes.data.data.reviews || []);
      setMessages(msgRes.data.data.messages || []);
    } catch {
      // Handled when unauthenticated or offline
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleOrderStatus = async (orderId, status) => {
    try {
      await api.patch(`/admin/orders/${orderId}`, { status });
      showToast('Order status updated.');
      loadAll();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleVerifyFarmer = async (farmerId, verified) => {
    try {
      await api.patch(`/admin/farmers/${farmerId}`, { verified });
      showToast(verified ? 'Farmer verified.' : 'Verification revoked.');
      loadAll();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await api.delete(`/admin/products/${id}`);
      showToast('Product deleted.', 'info');
      loadAll();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/blogs', newBlog);
      showToast('Blog post published.');
      setNewBlog({
        title: '',
        category: 'Soil Science',
        excerpt: '',
        content: '',
        image: '/assets/img/home-4/news-1.jpg',
      });
      loadAll();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteReview = async (id) => {
    try {
      await api.delete(`/admin/reviews/${id}`);
      showToast('Review removed.', 'info');
      loadAll();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const { stats } = overview;

  return (
    <DashboardLayout
      title="Admin Command Center"
      subtitle="Platform analytics, inventory monitoring, farmer verification, and content operations"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {[
              { label: 'Total Revenue', value: `$${Number(stats.totalRevenue || 0).toFixed(2)}` },
              { label: 'Total Orders', value: stats.totalOrders },
              { label: 'Customers', value: stats.totalCustomers },
              { label: 'Farmers', value: stats.totalFarmers },
              { label: 'Products', value: stats.totalProducts },
              { label: 'Low Stock', value: stats.lowStockCount },
            ].map((kpi) => (
              <div key={kpi.label} className="card-surface p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-agriva-muted">
                  {kpi.label}
                </p>
                <p className="mt-1.5 font-display text-2xl font-bold text-agriva-forest">{kpi.value}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-12">
            <div className="card-surface p-6 lg:col-span-7">
              <h2 className="mb-4 font-display text-xl font-semibold text-agriva-ink">
                Revenue Trend
              </h2>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={overview.salesChart || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2DDD0" />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#1B4332" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card-surface p-6 lg:col-span-5">
              <h2 className="mb-4 font-display text-xl font-semibold text-agriva-ink">
                Low-Stock Alerts (&le; 15 units)
              </h2>
              <div className="space-y-3">
                {(overview.lowStockProducts || []).length === 0 ? (
                  <p className="text-sm text-agriva-muted">All products are well stocked.</p>
                ) : (
                  overview.lowStockProducts.map((p) => (
                    <div
                      key={p._id}
                      className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm"
                    >
                      <span className="font-medium text-agriva-ink">{p.name}</span>
                      <span className="font-bold text-amber-800">{p.stock} left</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="card-surface overflow-x-auto p-6">
          <h2 className="mb-4 font-display text-xl font-semibold text-agriva-ink">All Orders</h2>
          <table className="w-full text-left text-sm">
            <thead className="border-b border-agriva-line text-xs uppercase text-agriva-muted">
              <tr>
                <th className="py-2.5">Order #</th>
                <th className="py-2.5">Customer</th>
                <th className="py-2.5">Payment</th>
                <th className="py-2.5">Total</th>
                <th className="py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-agriva-line">
              {orders.map((o) => (
                <tr key={o._id}>
                  <td className="py-3 font-semibold">{o.orderNumber}</td>
                  <td className="py-3">{o.shippingAddress?.fullName || o.user?.name}</td>
                  <td className="py-3 capitalize">
                    {o.paymentMethod} ({o.paymentStatus})
                  </td>
                  <td className="py-3 font-semibold">${Number(o.totalAmount).toFixed(2)}</td>
                  <td className="py-3">
                    <select
                      value={o.status}
                      onChange={(e) => handleOrderStatus(o._id, e.target.value)}
                      className="input-field w-40 py-1.5 text-xs"
                    >
                      <option value="pending">Pending</option>
                      <option value="harvested">Harvested</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="card-surface overflow-x-auto p-6">
          <h2 className="mb-4 font-display text-xl font-semibold text-agriva-ink">
            Catalog &amp; Inventory ({products.length})
          </h2>
          <table className="w-full text-left text-sm">
            <thead className="border-b border-agriva-line text-xs uppercase text-agriva-muted">
              <tr>
                <th className="py-2.5">Product</th>
                <th className="py-2.5">Category</th>
                <th className="py-2.5">Price</th>
                <th className="py-2.5">Stock</th>
                <th className="py-2.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-agriva-line">
              {products.map((p) => (
                <tr key={p._id}>
                  <td className="py-3 font-semibold">{p.name}</td>
                  <td className="py-3 capitalize">{p.categoryLabel || p.category}</td>
                  <td className="py-3">${Number(p.price).toFixed(2)}</td>
                  <td className="py-3">{p.stock}</td>
                  <td className="py-3">
                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(p._id)}
                      className="rounded p-1.5 text-red-700 hover:bg-red-50"
                      aria-label="Delete product"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card-surface p-6">
            <h2 className="mb-4 font-display text-xl font-semibold text-agriva-ink">
              Registered Users ({users.length})
            </h2>
            <div className="space-y-2.5 text-sm">
              {users.map((u) => (
                <div key={u._id} className="flex items-center justify-between rounded-lg border border-agriva-line p-3">
                  <div>
                    <p className="font-semibold text-agriva-ink">{u.name}</p>
                    <p className="text-xs text-agriva-muted">{u.email}</p>
                  </div>
                  <span className="rounded-full bg-agriva-oat px-2.5 py-0.5 text-xs font-semibold capitalize text-agriva-forest">
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card-surface p-6">
            <h2 className="mb-4 font-display text-xl font-semibold text-agriva-ink">
              Partner Farms ({farmers.length})
            </h2>
            <div className="space-y-2.5 text-sm">
              {farmers.map((f) => (
                <div key={f._id} className="flex items-center justify-between rounded-lg border border-agriva-line p-3">
                  <div>
                    <p className="font-semibold text-agriva-ink">{f.farmName}</p>
                    <p className="text-xs text-agriva-muted">
                      {f.name} · {f.location}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleVerifyFarmer(f._id, !f.verified)}
                    className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold ${
                      f.verified
                        ? 'bg-agriva-mint text-agriva-forest'
                        : 'border border-agriva-line bg-white text-agriva-muted'
                    }`}
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {f.verified ? 'Verified' : 'Verify'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'content' && (
        <div className="grid gap-8 lg:grid-cols-12">
          <form onSubmit={handleCreateBlog} className="card-surface space-y-4 p-6 lg:col-span-5">
            <h2 className="font-display text-xl font-semibold text-agriva-ink">Publish Journal Post</h2>
            <input
              type="text"
              required
              value={newBlog.title}
              onChange={(e) => setNewBlog((b) => ({ ...b, title: e.target.value }))}
              placeholder="Article title"
              className="input-field"
            />
            <input
              type="text"
              required
              value={newBlog.category}
              onChange={(e) => setNewBlog((b) => ({ ...b, category: e.target.value }))}
              placeholder="Category"
              className="input-field"
            />
            <textarea
              rows={2}
              required
              value={newBlog.excerpt}
              onChange={(e) => setNewBlog((b) => ({ ...b, excerpt: e.target.value }))}
              placeholder="Short summary..."
              className="input-field"
            />
            <textarea
              rows={4}
              required
              value={newBlog.content}
              onChange={(e) => setNewBlog((b) => ({ ...b, content: e.target.value }))}
              placeholder="Full article content..."
              className="input-field"
            />
            <button type="submit" className="btn-primary w-full">
              Publish Article
            </button>
          </form>

          <div className="space-y-6 lg:col-span-7">
            <div className="card-surface p-6">
              <h2 className="mb-3 font-display text-xl font-semibold text-agriva-ink">
                Journal Articles ({blogs.length})
              </h2>
              <div className="space-y-2 text-sm">
                {blogs.map((b) => (
                  <div key={b._id} className="flex justify-between border-b border-agriva-line py-2">
                    <span className="font-medium">{b.title}</span>
                    <span className="text-xs text-agriva-muted">{b.category}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-surface p-6">
              <h2 className="mb-3 font-display text-xl font-semibold text-agriva-ink">
                Product Reviews ({reviews.length})
              </h2>
              <div className="space-y-2 text-sm">
                {reviews.map((r) => (
                  <div key={r._id} className="flex items-center justify-between border-b border-agriva-line py-2">
                    <div>
                      <p className="font-medium">
                        {r.userName} ({r.rating}★)
                      </p>
                      <p className="text-xs text-agriva-muted">{r.comment}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteReview(r._id)}
                      className="rounded p-1.5 text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="card-surface space-y-3 p-6">
          <h2 className="font-display text-xl font-semibold text-agriva-ink">
            Customer Inquiries ({messages.length})
          </h2>
          {messages.length === 0 ? (
            <p className="text-sm text-agriva-muted">No contact inquiries yet.</p>
          ) : (
            messages.map((m) => (
              <div key={m._id} className="rounded-lg border border-agriva-line p-4">
                <div className="flex justify-between text-xs text-agriva-muted">
                  <strong className="text-agriva-ink">
                    {m.name} ({m.email})
                  </strong>
                  <span>{new Date(m.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="mt-1 text-sm font-semibold text-agriva-pine">{m.subject}</p>
                <p className="mt-1 text-sm text-agriva-muted">{m.message}</p>
              </div>
            ))
          )}
        </div>
      )}
    </DashboardLayout>
  );
}

