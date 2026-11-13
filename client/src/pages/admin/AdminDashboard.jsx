import { useCallback, useEffect, useState } from 'react';
import {
  BarChart3,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  Cpu,
  Layers,
  MessageSquare,
  Package,
  Plus,
  Radio,
  ShieldCheck,
  Sprout,
  Trash2,
  UserCheck,
  Users,
  Wheat,
  XCircle,
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
import { EARTHORA_PRODUCTS } from '../../data/catalogData';

export default function AdminDashboard() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [overview, setOverview] = useState({
    stats: {
      totalRevenue: 42850,
      totalOrders: 64,
      totalCustomers: 180,
      totalFarmers: 42,
      totalExperts: 2,
      totalProducts: 12,
      lowStockCount: 2,
    },
    lowStockProducts: [
      { _id: 'eth-prod-3', name: 'Precision Broadfork & No-Till Soil Aerator', stock: 22 },
      { _id: 'eth-prod-4', name: 'Solar LoRaWAN Smart Drip Valve Controller', stock: 35 },
    ],
    salesChart: [
      { name: 'Produce', sales: 18850 },
      { name: 'Irrigation', sales: 11140 },
      { name: 'Fertilizers', sales: 7710 },
      { name: 'Seeds', sales: 5150 },
    ],
  });

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState(EARTHORA_PRODUCTS);
  const [farmers, setFarmers] = useState([
    {
      _id: 'frm-1',
      farmName: 'Green Valley Regenerative Farm',
      farmerName: 'Elena Vance',
      location: 'Sonoma County, CA',
      totalAcres: 45,
      verified: true,
    },
    {
      _id: 'frm-2',
      farmName: 'Sunridge Agro-Ecosystems',
      farmerName: 'Marcus Thorne',
      location: 'Willamette Valley, OR',
      totalAcres: 78,
      verified: true,
    },
    {
      _id: 'frm-3',
      farmName: 'Oakridge Regenerative Co-op',
      farmerName: 'Jordan Hayes',
      location: 'Hudson Valley, NY',
      totalAcres: 55,
      verified: false,
    },
  ]);

  const [experts, setExperts] = useState([
    {
      _id: 'exp-1',
      name: 'Dr. Aris Thorne',
      title: 'Principal Soil Microbiologist',
      fieldOfStudy: 'Rhizosphere Ecology & Nitrogen Fixation',
      organization: 'Earthora Agronomy Advisory',
      location: 'Davis, CA',
      consultationFee: 85,
      experienceYears: 16,
      verified: true,
      approvalStatus: 'approved',
      user: { email: 'expert@earthora.io', phone: '+1 555 017 9900' },
    },
    {
      _id: 'exp-2',
      name: 'Sofia Al-Mansoor',
      title: 'Precision Irrigation Engineer',
      fieldOfStudy: 'IoT Moisture Sensors & Water Efficiency',
      organization: 'Global Smart Water Systems',
      location: 'Fresno, CA',
      consultationFee: 75,
      experienceYears: 11,
      verified: true,
      approvalStatus: 'approved',
      user: { email: 'sofia@earthora.io', phone: '+1 555 018 7744' },
    },
  ]);
  const [expertFilter, setExpertFilter] = useState('all');

  const [articles, setArticles] = useState([
    {
      _id: 'art-1',
      title: 'How Precision Drip & LoRaWAN Sensors Cut Agricultural Water Usage by 42%',
      category: 'Smart Irrigation',
      author: 'Sofia Al-Mansoor',
      published: true,
    },
    {
      _id: 'art-2',
      title: 'The Living Soil Standard: Why Mycorrhizal Networks Are the True Yield Multiplier',
      category: 'Soil Regeneration',
      author: 'Dr. Aris Thorne',
      published: true,
    },
  ]);

  const [messages, setMessages] = useState([
    {
      _id: 'msg-1',
      name: 'Claire Jenkins',
      email: 'claire@pacificorchard.com',
      subject: 'Farmer Hub Partnership Application',
      message: 'We manage 60 acres in Hood River transitioning to organic honeycrisp apples. Requesting soil telemetry probe setup.',
      createdAt: '2026-11-12',
    },
  ]);

  const [newArticle, setNewArticle] = useState({
    title: '',
    category: 'Soil Regeneration',
    author: 'Earthora Agronomy Board',
    readTime: '5 min read',
    excerpt: '',
  });

  const loadAll = useCallback(async () => {
    try {
      const [ovRes, ordRes, prodRes, frmRes, expRes, msgRes] = await Promise.all([
        api.get('/admin/overview'),
        api.get('/admin/orders'),
        api.get('/products?limit=100'),
        api.get('/admin/farmers'),
        api.get('/admin/experts'),
        api.get('/admin/messages'),
      ]);
      if (ovRes.data.data?.stats) setOverview(ovRes.data.data);
      if (ordRes.data.data?.orders?.length > 0) setOrders(ordRes.data.data.orders);
      if (prodRes.data.data?.products?.length > 0) setProducts(prodRes.data.data.products);
      if (frmRes.data.data?.farmers?.length > 0) setFarmers(frmRes.data.data.farmers);
      if (expRes.data.data?.experts?.length > 0) setExperts(expRes.data.data.experts);
      if (msgRes.data.data?.messages?.length > 0) setMessages(msgRes.data.data.messages);
    } catch {
      // Fallback to local default data
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleApproveExpert = async (expertId) => {
    try {
      const { data } = await api.patch(`/admin/experts/${expertId}/approve`);
      setExperts((prev) =>
        prev.map((e) => (e._id === expertId ? data.data.expert : e))
      );
      showToast('Agriculture Expert accepted and verified! Login access granted.', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to approve expert', 'error');
    }
  };

  const handleRejectExpert = async (expertId) => {
    try {
      const { data } = await api.patch(`/admin/experts/${expertId}/reject`);
      setExperts((prev) =>
        prev.map((e) => (e._id === expertId ? data.data.expert : e))
      );
      showToast('Agriculture Expert application rejected.', 'info');
    } catch (err) {
      showToast(err.message || 'Failed to reject expert', 'error');
    }
  };

  const handleToggleFarmerVerification = (farmerId) => {
    setFarmers((prev) =>
      prev.map((f) => (f._id === farmerId ? { ...f, verified: !f.verified } : f))
    );
    showToast('Farmer verification status updated.', 'success');
  };

  const handleOrderStatus = (orderId, status) => {
    setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status } : o)));
    showToast(`Order status updated to: ${status}`, 'success');
  };

  const handleDeleteProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p._id !== productId));
    showToast('Product removed from catalog.', 'info');
  };

  const handleCreateArticle = (e) => {
    e.preventDefault();
    if (!newArticle.title) return;
    const art = {
      _id: `art-${Date.now()}`,
      ...newArticle,
      published: true,
    };
    setArticles([art, ...articles]);
    setNewArticle({ title: '', category: 'Soil Regeneration', author: 'Earthora Agronomy Board', readTime: '5 min read', excerpt: '' });
    showToast('Knowledge Hub guide published!', 'success');
  };

  const pendingExpertCount = experts.filter(
    (e) => e.approvalStatus === 'pending' || !e.verified
  ).length;

  const dynamicTabs = [
    { id: 'overview', label: 'Overview & Analytics', icon: BarChart3 },
    { id: 'orders', label: 'Orders & Logistics', icon: Package },
    { id: 'marketplace', label: 'Marketplace Inventory', icon: Sprout },
    { id: 'farmers', label: 'Farmers & Verification', icon: ShieldCheck },
    {
      id: 'experts',
      label: 'Expert Approvals',
      icon: UserCheck,
      badge: pendingExpertCount > 0 ? pendingExpertCount : null,
    },
    { id: 'knowledge', label: 'Knowledge Hub Articles', icon: BookOpen },
    { id: 'messages', label: 'Contact Messages', icon: MessageSquare },
  ];

  return (
    <DashboardLayout
      title="Earthora Platform Administration"
      subtitle="Ecosystem governance, producer verifications, expert credentials, orders, and marketplace control."
      tabs={dynamicTabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card-surface p-6 border border-earthora-sand/80 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-earthora-muted">Total Gross Volume</span>
              <p className="mt-2 font-heading text-3xl font-extrabold text-earthora-forest">
                ${Number(overview.stats.totalRevenue).toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-emerald-700">+22.4% vs last quarter</p>
            </div>

            <div className="card-surface p-6 border border-earthora-sand/80 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-earthora-muted">Verified Producers</span>
              <p className="mt-2 font-heading text-3xl font-extrabold text-earthora-forest">
                {overview.stats.totalFarmers || 42}
              </p>
              <p className="mt-1 text-xs text-emerald-700">100% Organic certified</p>
            </div>

            <div className="card-surface p-6 border border-earthora-sand/80 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-earthora-muted">Active Customers</span>
              <p className="mt-2 font-heading text-3xl font-extrabold text-earthora-forest">
                {overview.stats.totalCustomers || 180}
              </p>
              <p className="mt-1 text-xs text-earthora-olive">Direct-trade subscribers</p>
            </div>

            <div className="card-surface p-6 border border-earthora-sand/80 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-earthora-muted">Marketplace Listings</span>
              <p className="mt-2 font-heading text-3xl font-extrabold text-earthora-forest">
                {products.length}
              </p>
              <p className="mt-1 text-xs text-amber-700">{overview.stats.lowStockCount || 2} low-stock warnings</p>
            </div>
          </div>

          {/* Chart & Low Stock alerts */}
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="card-surface p-6 border border-earthora-sand/80 lg:col-span-8 shadow-sm">
              <h3 className="font-heading text-base font-bold text-earthora-forest">
                Revenue by Agriculture Sector ($)
              </h3>
              <p className="text-xs text-earthora-muted mb-6">Distribution across organic produce, IoT drip, compost, and seed stock</p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={overview.salesChart || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EDE8DC" />
                    <XAxis dataKey="name" stroke="#7E9F83" fontSize={12} />
                    <YAxis stroke="#7E9F83" fontSize={12} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0D2B1D', borderRadius: '12px', color: '#FAF8F2' }}
                    />
                    <Bar dataKey="sales" fill="#10B981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card-surface p-6 border border-earthora-sand/80 lg:col-span-4 shadow-sm">
              <h3 className="font-heading text-base font-bold text-earthora-forest">Inventory Health</h3>
              <p className="text-xs text-earthora-muted mb-4">Stock thresholds &lt; 40 units</p>

              <div className="space-y-3">
                {overview.lowStockProducts.map((p) => (
                  <div key={p._id} className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs">
                    <p className="font-bold text-amber-950">{p.name}</p>
                    <p className="mt-1 text-amber-800 font-semibold">{p.stock} units remaining in cold vault</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="card-surface p-6 border border-earthora-sand/80 shadow-sm overflow-x-auto">
          <h3 className="font-heading text-lg font-bold text-earthora-forest">Ecosystem Orders &amp; Dispatches</h3>
          <p className="text-xs text-earthora-muted mb-6">Live cold-chain tracking codes and payment settlement</p>

          <table className="w-full text-left text-xs">
            <thead className="border-b border-earthora-sand/60 bg-earthora-ivory/60 text-[11px] font-bold uppercase tracking-wider text-earthora-forest">
              <tr>
                <th className="px-4 py-3">Order Code</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Total Amount</th>
                <th className="px-4 py-3">Fulfillment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earthora-sand/40">
              <tr className="hover:bg-earthora-sand/15">
                <td className="px-4 py-3 font-mono font-bold text-earthora-forest">ETH-2026-1001</td>
                <td className="px-4 py-3 font-semibold">Alex Morgan</td>
                <td className="px-4 py-3 capitalize text-emerald-800 font-bold">card (paid)</td>
                <td className="px-4 py-3 font-bold text-earthora-forest">$48.50</td>
                <td className="px-4 py-3">
                  <select
                    defaultValue="shipped"
                    onChange={(e) => handleOrderStatus('ETH-2026-1001', e.target.value)}
                    className="input-field py-1 text-xs w-36"
                  >
                    <option value="pending">Pending</option>
                    <option value="harvested">Harvested</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Marketplace Tab */}
      {activeTab === 'marketplace' && (
        <div className="card-surface p-6 border border-earthora-sand/80 shadow-sm overflow-x-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-heading text-lg font-bold text-earthora-forest">Marketplace Inventory Control</h3>
              <p className="text-xs text-earthora-muted">Manage all 5 agricultural sectors: seeds, fertilizers, equipment, irrigation, produce</p>
            </div>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="border-b border-earthora-sand/60 bg-earthora-ivory/60 text-[11px] font-bold uppercase tracking-wider text-earthora-forest">
              <tr>
                <th className="px-4 py-3">Item Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Unit Price</th>
                <th className="px-4 py-3">In Stock</th>
                <th className="px-4 py-3">Supplier</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earthora-sand/40">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-earthora-sand/15">
                  <td className="px-4 py-3 font-bold text-earthora-forest">{p.name}</td>
                  <td className="px-4 py-3 capitalize text-earthora-olive font-semibold">{p.categoryLabel || p.category}</td>
                  <td className="px-4 py-3 font-bold">${Number(p.price).toFixed(2)}</td>
                  <td className="px-4 py-3 font-mono">{p.stock}</td>
                  <td className="px-4 py-3 text-earthora-muted">{p.supplierName}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDeleteProduct(p._id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete item"
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

      {/* Farmers Verification Tab */}
      {activeTab === 'farmers' && (
        <div className="card-surface p-6 border border-earthora-sand/80 shadow-sm overflow-x-auto">
          <h3 className="font-heading text-lg font-bold text-earthora-forest">Partner Grower Verification Queue</h3>
          <p className="text-xs text-earthora-muted mb-6">Review regenerative land credentials and grant Earthora Verified status.</p>

          <table className="w-full text-left text-xs">
            <thead className="border-b border-earthora-sand/60 bg-earthora-ivory/60 text-[11px] font-bold uppercase tracking-wider text-earthora-forest">
              <tr>
                <th className="px-4 py-3">Farm Name</th>
                <th className="px-4 py-3">Lead Grower</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Acreage</th>
                <th className="px-4 py-3">Verification Badge</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earthora-sand/40">
              {farmers.map((f) => (
                <tr key={f._id} className="hover:bg-earthora-sand/15">
                  <td className="px-4 py-3 font-bold text-earthora-forest">{f.farmName}</td>
                  <td className="px-4 py-3 font-semibold">{f.farmerName || f.name}</td>
                  <td className="px-4 py-3 text-earthora-muted">{f.location}</td>
                  <td className="px-4 py-3">{f.totalAcres} Acres</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        f.verified
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {f.verified ? 'Earthora Verified' : 'Under Review'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleFarmerVerification(f._id)}
                      className={`rounded-lg px-3 py-1 text-xs font-semibold ${
                        f.verified
                          ? 'border border-earthora-sand text-earthora-charcoal hover:bg-earthora-ivory'
                          : 'bg-emerald-700 text-white hover:bg-emerald-800'
                      }`}
                    >
                      {f.verified ? 'Revoke Status' : 'Approve Partner'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Agriculture Expert Approvals & Verification Tab */}
      {activeTab === 'experts' && (
        <div className="space-y-6">
          <div className="card-surface p-6 border border-earthora-sand/80 shadow-sm overflow-x-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-heading text-lg font-bold text-earthora-forest flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-earthora-olive" />
                  Agriculture Expert Verification &amp; Access Control
                </h3>
                <p className="text-xs text-earthora-muted mt-0.5">
                  Review agronomist registrations, verify academic credentials &amp; consultation fees, and accept or reject account access.
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1 rounded-xl border border-earthora-sand/80 bg-earthora-sand/20 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setExpertFilter('all')}
                  className={`rounded-lg px-3 py-1 font-semibold transition ${
                    expertFilter === 'all'
                      ? 'bg-white text-earthora-forest shadow-sm'
                      : 'text-earthora-muted hover:text-earthora-forest'
                  }`}
                >
                  All Experts ({experts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setExpertFilter('pending')}
                  className={`rounded-lg px-3 py-1 font-semibold transition ${
                    expertFilter === 'pending'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-earthora-muted hover:text-earthora-forest'
                  }`}
                >
                  Pending Review ({experts.filter((e) => e.approvalStatus === 'pending' || !e.verified).length})
                </button>
                <button
                  type="button"
                  onClick={() => setExpertFilter('approved')}
                  className={`rounded-lg px-3 py-1 font-semibold transition ${
                    expertFilter === 'approved'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-earthora-muted hover:text-earthora-forest'
                  }`}
                >
                  Approved ({experts.filter((e) => e.approvalStatus === 'approved' && e.verified).length})
                </button>
              </div>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="border-b border-earthora-sand/60 bg-earthora-ivory/60 text-[11px] font-bold uppercase tracking-wider text-earthora-forest">
                <tr>
                  <th className="px-4 py-3">Expert / Agronomist</th>
                  <th className="px-4 py-3">Discipline &amp; Organization</th>
                  <th className="px-4 py-3">Experience &amp; Fee</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Registration Status</th>
                  <th className="px-4 py-3 text-right">Administrative Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-earthora-sand/40">
                {experts
                  .filter((e) => {
                    if (expertFilter === 'pending') return e.approvalStatus === 'pending' || !e.verified;
                    if (expertFilter === 'approved') return e.approvalStatus === 'approved' && e.verified;
                    return true;
                  })
                  .map((e) => {
                    const isPending = e.approvalStatus === 'pending' || !e.verified;
                    const isApproved = e.approvalStatus === 'approved' && e.verified;
                    const isRejected = e.approvalStatus === 'rejected';

                    return (
                      <tr key={e._id} className="hover:bg-earthora-sand/15 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="font-bold text-earthora-forest">{e.name}</div>
                          <div className="text-[11px] text-earthora-muted">{e.title}</div>
                          <div className="text-[10px] text-earthora-olive mt-0.5">
                            {e.user?.email || 'Registered Expert'}
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="font-semibold text-earthora-charcoal">{e.fieldOfStudy}</div>
                          <div className="text-[11px] text-earthora-muted">{e.organization}</div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="font-semibold text-earthora-charcoal">{e.experienceYears || 5} Years exp</div>
                          <div className="text-[11px] text-earthora-muted">${e.consultationFee || 75}/session</div>
                        </td>
                        <td className="px-4 py-3.5 text-earthora-muted">{e.location || 'USA'}</td>
                        <td className="px-4 py-3.5">
                          {isPending && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-900 border border-amber-300">
                              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                              Pending Approval
                            </span>
                          )}
                          {isApproved && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800 border border-emerald-300">
                              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                              Approved &amp; Verified
                            </span>
                          )}
                          {isRejected && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-2.5 py-1 text-[11px] font-bold text-rose-800 border border-rose-300">
                              <XCircle className="h-3.5 w-3.5 text-rose-600" />
                              Rejected
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="inline-flex items-center gap-2 justify-end">
                            {isPending && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleApproveExpert(e._id)}
                                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-800 transition"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                  Accept &amp; Approve
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRejectExpert(e._id)}
                                  className="inline-flex items-center gap-1 rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 transition"
                                >
                                  <XCircle className="h-3.5 w-3.5" />
                                  Reject
                                </button>
                              </>
                            )}
                            {isApproved && (
                              <button
                                type="button"
                                onClick={() => handleRejectExpert(e._id)}
                                className="rounded-lg border border-earthora-sand px-3 py-1 text-xs font-semibold text-earthora-muted hover:border-rose-300 hover:text-rose-600 transition"
                              >
                                Revoke Approval
                              </button>
                            )}
                            {isRejected && (
                              <button
                                type="button"
                                onClick={() => handleApproveExpert(e._id)}
                                className="rounded-lg bg-emerald-700 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-800 transition"
                              >
                                Re-approve
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Knowledge Hub Publisher Tab */}
      {activeTab === 'knowledge' && (
        <div className="space-y-6">
          <div className="card-surface p-6 sm:p-8 border border-earthora-sand/80 shadow-sm max-w-2xl">
            <h3 className="font-heading text-lg font-bold text-earthora-forest">Publish Knowledge Hub Guide</h3>
            <p className="text-xs text-earthora-muted">Publish peer-reviewed guides and field research whitepapers.</p>

            <form onSubmit={handleCreateArticle} className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-earthora-charcoal">Article Title *</label>
                <input
                  type="text"
                  required
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                  placeholder="e.g. Biological Nematode Introductions for Root Protection"
                  className="input-field mt-1 text-xs"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Category</label>
                  <select
                    value={newArticle.category}
                    onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                    className="input-field mt-1 text-xs"
                  >
                    <option>Soil Regeneration</option>
                    <option>Smart Irrigation</option>
                    <option>Precision Farming</option>
                    <option>Organic Pest Control</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-earthora-charcoal">Author / Council</label>
                  <input
                    type="text"
                    value={newArticle.author}
                    onChange={(e) => setNewArticle({ ...newArticle, author: e.target.value })}
                    className="input-field mt-1 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-earthora-charcoal">Short Abstract / Excerpt</label>
                <textarea
                  rows="3"
                  value={newArticle.excerpt}
                  onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })}
                  placeholder="Summary of findings and actionable takeaways for growers..."
                  className="input-field mt-1 text-xs"
                />
              </div>

              <div className="flex justify-end">
                <button type="submit" className="btn-accent text-xs font-bold py-2.5 px-6">
                  Publish to Knowledge Hub
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <div className="card-surface p-6 border border-earthora-sand/80 shadow-sm space-y-4">
          <h3 className="font-heading text-lg font-bold text-earthora-forest">Contact Dispatches</h3>
          <p className="text-xs text-earthora-muted">Inbound requests from farmers, researchers, and wholesale partners.</p>

          <div className="space-y-3 mt-4">
            {messages.map((m) => (
              <div key={m._id} className="rounded-2xl border border-earthora-sand/60 bg-earthora-ivory/40 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-earthora-forest text-xs">{m.name} ({m.email})</span>
                  <span className="text-[10px] text-earthora-muted">{m.createdAt}</span>
                </div>
                <p className="text-xs font-semibold text-earthora-olive mt-1">Subject: {m.subject}</p>
                <p className="text-xs text-earthora-charcoal mt-2 leading-relaxed">{m.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
