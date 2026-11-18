import { useCallback, useEffect, useState } from 'react';
import {
  BarChart3,
  BookOpen,
  Boxes,
  Building,
  Calendar,
  Check,
  CheckCircle,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Cpu,
  DollarSign,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Layers,
  Mail,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  Plus,
  Radio,
  Search,
  ShieldCheck,
  Sprout,
  Trash2,
  Truck,
  UserCheck,
  Users,
  Wheat,
  X,
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

  const [orders, setOrders] = useState([
    {
      _id: 'ETH-2026-1001',
      orderNumber: 'ETH-2026-1001',
      customerName: 'Claire Bennett',
      customerEmail: 'customer@earthora.io',
      customerPhone: '+1 555 010 2233',
      shippingAddress: {
        fullName: 'Claire Bennett',
        email: 'customer@earthora.io',
        phone: '+1 555 010 2233',
        street: '742 Evergreen Terrace',
        city: 'Portland',
        state: 'OR',
        postalCode: '97205',
        country: 'USA',
        deliverySlot: 'Standard Delivery (2-3 business days)',
      },
      items: [
        { name: 'Organic Heirloom Tomato Seeds', price: 349, quantity: 2 },
        { name: 'Cold-Pressed Mustard Oil (1L)', price: 420, quantity: 2 },
      ],
      totalAmount: 1538,
      paymentMethod: 'card',
      paymentStatus: 'paid',
      status: 'Dispatched',
      courierPartner: 'BlueDart Agri-Logistics',
      trackingNumber: 'TRK-982410-IN',
      createdAt: '2026-11-16T10:00:00Z',
      dispatchedAt: '2026-11-17T14:30:00Z',
    },
    {
      _id: 'ETH-2026-1002',
      orderNumber: 'ETH-2026-1002',
      customerName: 'Marcus Miller',
      customerEmail: 'marcus.miller@gmail.com',
      customerPhone: '+91 98450 11223',
      shippingAddress: {
        fullName: 'Marcus Miller',
        email: 'marcus.miller@gmail.com',
        phone: '+91 98450 11223',
        street: '45 Lake View Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560001',
        country: 'India',
        deliverySlot: 'Express Morning Delivery',
      },
      items: [
        { name: 'Biochar Enriched Compost (25kg)', price: 899, quantity: 1 },
        { name: 'Solar Drip Irrigation Solenoid Valve', price: 2199, quantity: 1 },
      ],
      totalAmount: 3098,
      paymentMethod: 'card',
      paymentStatus: 'paid',
      status: 'Delivered',
      courierPartner: 'Local Farm Courier',
      trackingNumber: 'TRK-541290-IN',
      createdAt: '2026-11-15T09:15:00Z',
      dispatchedAt: '2026-11-15T16:00:00Z',
      deliveredAt: '2026-11-17T11:20:00Z',
    },
  ]);
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);

  const [supplyReceipts, setSupplyReceipts] = useState([
    {
      _id: 'rec-001',
      receiptNumber: 'REC-2026-1001',
      productName: 'Organic Heirloom Tomato Seeds',
      category: 'seeds',
      supplierName: 'Elena Vance - Green Valley Farm',
      supplierContact: '+1 555 014 8899',
      supplierLocation: 'Sonoma County, CA',
      quantityReceived: 100,
      unit: 'boxes',
      unitCost: 180,
      totalCost: 18000,
      batchNumber: 'BATCH-2026-TOM-01',
      receivedAt: '2026-11-15T08:30:00Z',
      receivedBy: 'Earthora Central Sorting Hub',
      qualityStatus: 'Passed - Grade A Organic',
      warehouseLocation: 'Central Cold Storage Hub A',
      notes: 'Certified USDA Organic harvested at peak firmness. High germination rate confirmed.',
    },
    {
      _id: 'rec-002',
      receiptNumber: 'REC-2026-1002',
      productName: 'Biochar Enriched Compost (25kg)',
      category: 'fertilizers',
      supplierName: 'Marcus Thorne - Sunridge Agro',
      supplierContact: '+1 555 019 4411',
      supplierLocation: 'Willamette Valley, OR',
      quantityReceived: 40,
      unit: 'bags',
      unitCost: 550,
      totalCost: 22000,
      batchNumber: 'BATCH-2026-BIO-09',
      receivedAt: '2026-11-17T11:00:00Z',
      receivedBy: 'Earthora Central Sorting Hub',
      qualityStatus: 'Passed - Grade A Organic',
      warehouseLocation: 'Dry Storage Bay 3',
      notes: 'Pyrolyzed hardwood feedstock with active mycorrhizal inoculation.',
    },
    {
      _id: 'rec-003',
      receiptNumber: 'REC-2026-1003',
      productName: 'Cold-Pressed Mustard Oil (1L)',
      category: 'produce',
      supplierName: 'Kaveri Organic Growers Cooperative',
      supplierContact: '+91 94432 87654',
      supplierLocation: 'Erode, Tamil Nadu',
      quantityReceived: 75,
      unit: 'bottles',
      unitCost: 280,
      totalCost: 21000,
      batchNumber: 'BATCH-2026-OIL-03',
      receivedAt: '2026-11-18T07:15:00Z',
      receivedBy: 'Earthora Regional Hub - Coimbatore',
      qualityStatus: 'Passed - Grade A Organic',
      warehouseLocation: 'Storage Bay 1 - Ambient',
      notes: 'Single-origin wood-pressed mustard seed oil. Zero chemical additives.',
    },
  ]);
  const [receiptSearchTerm, setReceiptSearchTerm] = useState('');
  const [receiptFilter, setReceiptFilter] = useState('all');
  const [isRecordReceiptOpen, setIsRecordReceiptOpen] = useState(false);
  const [selectedReceiptDetail, setSelectedReceiptDetail] = useState(null);
  const [newReceipt, setNewReceipt] = useState({
    productName: '',
    category: 'produce',
    supplierName: '',
    supplierContact: '',
    supplierLocation: '',
    quantityReceived: '',
    unit: 'kg',
    unitCost: '',
    batchNumber: '',
    qualityStatus: 'Passed - Grade A Organic',
    warehouseLocation: 'Central Cold Storage Hub A',
    notes: '',
    updateStock: true,
  });
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

  const [users, setUsers] = useState([
    {
      _id: 'usr-1',
      name: 'Claire Bennett',
      email: 'customer@earthora.io',
      role: 'customer',
      phone: '+1 555 010 2233',
      address: {
        street: '742 Evergreen Terrace',
        city: 'Portland',
        state: 'OR',
        postalCode: '97205',
        country: 'USA',
      },
      isActive: true,
      createdAt: '2026-11-01T10:00:00.000Z',
    },
    {
      _id: 'usr-2',
      name: 'Elena Vance',
      email: 'farmer@earthora.io',
      role: 'farmer',
      phone: '+1 555 014 8899',
      organization: 'Green Valley Regenerative Farm',
      address: { city: 'Sonoma County', state: 'CA', country: 'USA' },
      isActive: true,
      createdAt: '2026-11-02T11:30:00.000Z',
    },
    {
      _id: 'usr-3',
      name: 'Marcus Thorne',
      email: 'marcus@earthora.io',
      role: 'farmer',
      phone: '+1 555 019 4411',
      organization: 'Sunridge Agro-Ecosystems',
      address: { city: 'Willamette Valley', state: 'OR', country: 'USA' },
      isActive: true,
      createdAt: '2026-11-03T14:15:00.000Z',
    },
    {
      _id: 'usr-4',
      name: 'Dr. Aris Thorne',
      email: 'expert@earthora.io',
      role: 'expert',
      phone: '+1 555 017 9900',
      title: 'Principal Soil Microbiologist',
      organization: 'Earthora Agronomy Advisory',
      address: { city: 'Davis', state: 'CA', country: 'USA' },
      isApproved: true,
      approvalStatus: 'approved',
      isActive: true,
      createdAt: '2026-11-04T09:00:00.000Z',
    },
    {
      _id: 'usr-5',
      name: 'Sofia Al-Mansoor',
      email: 'sofia@earthora.io',
      role: 'expert',
      phone: '+1 555 018 7744',
      title: 'Precision Irrigation Engineer',
      organization: 'Global Smart Water Systems',
      address: { city: 'Fresno', state: 'CA', country: 'USA' },
      isApproved: true,
      approvalStatus: 'approved',
      isActive: true,
      createdAt: '2026-11-05T16:45:00.000Z',
    },
    {
      _id: 'usr-6',
      name: 'Earthora Admin',
      email: 'admin@earthora.io',
      role: 'admin',
      phone: '+1 800 555 0194',
      organization: 'EARTHORA Headquarters',
      isActive: true,
      createdAt: '2026-10-25T08:00:00.000Z',
    },
  ]);
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);

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
      const [ovRes, ordRes, prodRes, frmRes, expRes, msgRes, usrRes, recRes] = await Promise.all([
        api.get('/admin/overview').catch(() => ({ data: {} })),
        api.get('/admin/orders').catch(() => ({ data: {} })),
        api.get('/products?limit=100').catch(() => ({ data: {} })),
        api.get('/admin/farmers').catch(() => ({ data: {} })),
        api.get('/admin/experts').catch(() => ({ data: {} })),
        api.get('/admin/messages').catch(() => ({ data: {} })),
        api.get('/admin/users').catch(() => ({ data: {} })),
        api.get('/admin/supply-receipts').catch(() => ({ data: {} })),
      ]);
      if (ovRes.data?.data?.stats) setOverview(ovRes.data.data);
      const fetchedOrders = ordRes.data?.data?.orders || ordRes.data?.orders;
      if (Array.isArray(fetchedOrders) && fetchedOrders.length > 0) setOrders(fetchedOrders);

      const fetchedProducts = prodRes.data?.data?.products || prodRes.data?.products;
      if (Array.isArray(fetchedProducts) && fetchedProducts.length > 0) setProducts(fetchedProducts);

      const fetchedFarmers = frmRes.data?.data?.farmers || frmRes.data?.farmers;
      if (Array.isArray(fetchedFarmers) && fetchedFarmers.length > 0) setFarmers(fetchedFarmers);

      const fetchedExperts = expRes.data?.data?.experts || expRes.data?.experts;
      if (Array.isArray(fetchedExperts) && fetchedExperts.length > 0) setExperts(fetchedExperts);

      const fetchedMessages = msgRes.data?.data?.messages || msgRes.data?.messages;
      if (Array.isArray(fetchedMessages) && fetchedMessages.length > 0) setMessages(fetchedMessages);

      const fetchedUsers = usrRes.data?.data?.users || usrRes.data?.users;
      if (Array.isArray(fetchedUsers) && fetchedUsers.length > 0) setUsers(fetchedUsers);

      const fetchedReceipts = recRes.data?.data?.receipts || recRes.data?.receipts;
      if (Array.isArray(fetchedReceipts) && fetchedReceipts.length > 0) setSupplyReceipts(fetchedReceipts);
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

  const handleOrderStatus = async (orderId, newStatus) => {
    try {
      const { data } = await api.patch(`/admin/orders/${orderId}`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId || o.orderNumber === orderId ? { ...o, ...data.data.order } : o
        )
      );
      showToast(`Order status updated to: ${newStatus}`, 'success');
    } catch {
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId || o.orderNumber === orderId ? { ...o, status: newStatus } : o
        )
      );
      showToast(`Order status updated to: ${newStatus}`, 'success');
    }
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

  const handleCreateSupplyReceipt = async (e) => {
    e.preventDefault();
    if (!newReceipt.productName || !newReceipt.supplierName || !newReceipt.quantityReceived) {
      showToast('Please fill in product name, supplier/farmer name, and quantity', 'error');
      return;
    }
    try {
      const { data } = await api.post('/admin/supply-receipts', newReceipt);
      setSupplyReceipts((prev) => [data.data.receipt, ...prev]);
      setIsRecordReceiptOpen(false);
      setNewReceipt({
        productName: '',
        category: 'produce',
        supplierName: '',
        supplierContact: '',
        supplierLocation: '',
        quantityReceived: '',
        unit: 'kg',
        unitCost: '',
        batchNumber: '',
        qualityStatus: 'Passed - Grade A Organic',
        warehouseLocation: 'Central Cold Storage Hub A',
        notes: '',
        updateStock: true,
      });
      showToast('Inbound supply shipment recorded into database!', 'success');
      const prodRes = await api.get('/products?limit=100').catch(() => ({ data: {} }));
      if (prodRes.data?.data?.products?.length > 0) setProducts(prodRes.data.data.products);
    } catch (err) {
      showToast(err.message || 'Failed to record supply receipt', 'error');
    }
  };

  const handleDeleteSupplyReceipt = async (receiptId) => {
    try {
      await api.delete(`/admin/supply-receipts/${receiptId}`);
      setSupplyReceipts((prev) => prev.filter((r) => r._id !== receiptId));
      showToast('Supply receipt removed from database', 'info');
    } catch {
      setSupplyReceipts((prev) => prev.filter((r) => r._id !== receiptId));
      showToast('Supply receipt removed', 'info');
    }
  };

  const exportOrdersCSV = () => {
    if (!orders || orders.length === 0) {
      showToast('No order records to export', 'error');
      return;
    }
    const headers = [
      'Order Number',
      'Customer Name',
      'Customer Email',
      'Customer Phone',
      'Delivery Street',
      'Delivery City',
      'Delivery State',
      'Delivery Country',
      'Delivery Postal Code',
      'Items Ordered',
      'Total Amount (INR)',
      'Payment Method',
      'Payment Status',
      'Fulfillment Status',
      'Date Placed',
      'Date Dispatched',
      'Date Delivered',
      'Courier Partner',
      'Tracking Number',
    ];

    const rows = filteredOrders.map((o) => {
      const itemsStr = Array.isArray(o.items)
        ? o.items.map((i) => `${i.quantity}x ${i.name} (₹${i.price})`).join('; ')
        : 'N/A';
      return [
        `"${o.orderNumber || o._id || ''}"`,
        `"${(o.customerName || o.shippingAddress?.fullName || o.user?.name || '').replace(/"/g, '""')}"`,
        `"${(o.customerEmail || o.shippingAddress?.email || o.user?.email || '').replace(/"/g, '""')}"`,
        `"${(o.customerPhone || o.shippingAddress?.phone || o.user?.phone || '').replace(/"/g, '""')}"`,
        `"${(o.shippingAddress?.street || '').replace(/"/g, '""')}"`,
        `"${(o.shippingAddress?.city || '').replace(/"/g, '""')}"`,
        `"${(o.shippingAddress?.state || '').replace(/"/g, '""')}"`,
        `"${(o.shippingAddress?.country || 'India').replace(/"/g, '""')}"`,
        `"${(o.shippingAddress?.postalCode || '').replace(/"/g, '""')}"`,
        `"${itemsStr.replace(/"/g, '""')}"`,
        o.totalAmount || 0,
        `"${o.paymentMethod || 'card'}"`,
        `"${o.paymentStatus || 'paid'}"`,
        `"${o.status || 'Placed'}"`,
        `"${o.createdAt ? new Date(o.createdAt).toLocaleString() : ''}"`,
        `"${o.dispatchedAt ? new Date(o.dispatchedAt).toLocaleString() : 'Not Yet Dispatched'}"`,
        `"${o.deliveredAt ? new Date(o.deliveredAt).toLocaleString() : 'In Transit / Pending'}"`,
        `"${(o.courierPartner || 'BlueDart Agri-Logistics').replace(/"/g, '""')}"`,
        `"${(o.trackingNumber || '').replace(/"/g, '""')}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `earthora-customer-orders-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Orders registry exported to CSV', 'success');
  };

  const exportReceiptsCSV = () => {
    if (!supplyReceipts || supplyReceipts.length === 0) {
      showToast('No supply receipt records to export', 'error');
      return;
    }
    const headers = [
      'Receipt Number',
      'Product Name',
      'Category',
      'Supplier / Farmer Name',
      'Supplier Contact',
      'Supplier Location',
      'Quantity Received',
      'Unit',
      'Unit Procurement Cost (INR)',
      'Total Cost (INR)',
      'Batch Number',
      'Date Received',
      'Received By',
      'Quality Status',
      'Warehouse Location',
      'Notes',
    ];

    const rows = filteredReceipts.map((r) => [
      `"${r.receiptNumber || r._id || ''}"`,
      `"${(r.productName || '').replace(/"/g, '""')}"`,
      `"${(r.category || '').replace(/"/g, '""')}"`,
      `"${(r.supplierName || '').replace(/"/g, '""')}"`,
      `"${(r.supplierContact || '').replace(/"/g, '""')}"`,
      `"${(r.supplierLocation || '').replace(/"/g, '""')}"`,
      r.quantityReceived || 0,
      `"${r.unit || 'kg'}"`,
      r.unitCost || 0,
      r.totalCost || 0,
      `"${(r.batchNumber || '').replace(/"/g, '""')}"`,
      `"${r.receivedAt ? new Date(r.receivedAt).toLocaleString() : ''}"`,
      `"${(r.receivedBy || '').replace(/"/g, '""')}"`,
      `"${(r.qualityStatus || '').replace(/"/g, '""')}"`,
      `"${(r.warehouseLocation || '').replace(/"/g, '""')}"`,
      `"${(r.notes || '').replace(/"/g, '""')}"`,
    ].join(','));

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `earthora-inbound-receipts-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Inbound supply receipts exported to CSV', 'success');
  };

  const exportUsersCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Role', 'Phone', 'City', 'State', 'Country', 'Street', 'Organization', 'Status', 'CreatedAt'];
    const rows = filteredUsers.map((u) => [
      u._id,
      `"${u.name || ''}"`,
      u.email,
      u.role,
      `"${u.phone || ''}"`,
      `"${u.address?.city || u.location || ''}"`,
      `"${u.address?.state || ''}"`,
      `"${u.address?.country || ''}"`,
      `"${u.address?.street || ''}"`,
      `"${u.organization || u.title || u.farmName || ''}"`,
      u.approvalStatus || (u.isActive ? 'Active' : 'Inactive'),
      u.createdAt || '',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `earthora_users_customers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Customer & user database records exported to CSV!', 'success');
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    const term = userSearchTerm.toLowerCase().trim();
    if (!term) return matchesRole;
    const nameMatch = (u.name || '').toLowerCase().includes(term);
    const emailMatch = (u.email || '').toLowerCase().includes(term);
    const phoneMatch = (u.phone || '').toLowerCase().includes(term);
    const cityMatch = (u.address?.city || u.location || '').toLowerCase().includes(term);
    const orgMatch = (u.organization || u.farmName || u.title || '').toLowerCase().includes(term);
    return matchesRole && (nameMatch || emailMatch || phoneMatch || cityMatch || orgMatch);
  });

  const filteredOrders = orders.filter((o) => {
    const statusMatch = orderStatusFilter === 'all' || (o.status || '').toLowerCase() === orderStatusFilter.toLowerCase();
    const term = orderSearchTerm.toLowerCase().trim();
    if (!term) return statusMatch;
    const numMatch = (o.orderNumber || o._id || '').toLowerCase().includes(term);
    const custNameMatch = (o.customerName || o.shippingAddress?.fullName || o.user?.name || '').toLowerCase().includes(term);
    const custEmailMatch = (o.customerEmail || o.shippingAddress?.email || o.user?.email || '').toLowerCase().includes(term);
    const cityMatch = (o.shippingAddress?.city || '').toLowerCase().includes(term);
    const itemMatch = Array.isArray(o.items) && o.items.some((i) => (i.name || '').toLowerCase().includes(term));
    return statusMatch && (numMatch || custNameMatch || custEmailMatch || cityMatch || itemMatch);
  });

  const filteredReceipts = supplyReceipts.filter((r) => {
    const statusMatch = receiptFilter === 'all' || (r.qualityStatus || '').toLowerCase().includes(receiptFilter.toLowerCase());
    const term = receiptSearchTerm.toLowerCase().trim();
    if (!term) return statusMatch;
    const numMatch = (r.receiptNumber || r._id || '').toLowerCase().includes(term);
    const prodMatch = (r.productName || '').toLowerCase().includes(term);
    const suppMatch = (r.supplierName || '').toLowerCase().includes(term);
    const locMatch = (r.supplierLocation || r.warehouseLocation || '').toLowerCase().includes(term);
    const batchMatch = (r.batchNumber || '').toLowerCase().includes(term);
    return statusMatch && (numMatch || prodMatch || suppMatch || locMatch || batchMatch);
  });

  const pendingExpertCount = experts.filter(
    (e) => e.approvalStatus === 'pending' || !e.verified
  ).length;

  const dynamicTabs = [
    { id: 'overview', label: 'Overview & Analytics', icon: BarChart3 },
    { id: 'users', label: 'Customers & Users DB', icon: Users, badge: users.length > 0 ? users.length : null },
    { id: 'orders', label: 'Customer Orders (Outbound)', icon: Package, badge: orders.length > 0 ? orders.length : null },
    { id: 'receipts', label: 'Products Received (Inbound)', icon: Truck, badge: supplyReceipts.length > 0 ? supplyReceipts.length : null },
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
                ₹{Number(overview.stats.totalRevenue || 128500).toLocaleString('en-IN')}
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
                Revenue by Agriculture Sector (₹)
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

      {/* Customers & Users Master Database Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Top Metric Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card-surface p-5 border border-blue-200 bg-gradient-to-br from-blue-50/50 to-white shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-900">Total Customers</span>
                <span className="rounded-xl bg-blue-100 p-2 text-blue-700">
                  <Users className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-3 font-heading text-3xl font-extrabold text-blue-950">
                {users.filter((u) => u.role === 'customer').length}
              </p>
              <p className="mt-1 text-[11px] text-blue-700">Registered retail &amp; commercial buyers</p>
            </div>

            <div className="card-surface p-5 border border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-white shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">Farmers &amp; Producers</span>
                <span className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
                  <Sprout className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-3 font-heading text-3xl font-extrabold text-emerald-950">
                {users.filter((u) => u.role === 'farmer').length}
              </p>
              <p className="mt-1 text-[11px] text-emerald-700">Registered agro-ecosystem stewards</p>
            </div>

            <div className="card-surface p-5 border border-amber-200 bg-gradient-to-br from-amber-50/50 to-white shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900">Agricultural Experts</span>
                <span className="rounded-xl bg-amber-100 p-2 text-amber-700">
                  <UserCheck className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-3 font-heading text-3xl font-extrabold text-amber-950">
                {users.filter((u) => u.role === 'expert').length}
              </p>
              <p className="mt-1 text-[11px] text-amber-700">Accredited agronomists &amp; soil scientists</p>
            </div>

            <div className="card-surface p-5 border border-earthora-sand/80 bg-white shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-earthora-forest">Total System Accounts</span>
                <span className="rounded-xl bg-earthora-ivory p-2 text-earthora-forest">
                  <Layers className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-3 font-heading text-3xl font-extrabold text-earthora-forest">
                {users.length}
              </p>
              <p className="mt-1 text-[11px] text-earthora-muted">Active database user profiles</p>
            </div>
          </div>

          {/* Database Control Bar */}
          <div className="card-surface p-6 border border-earthora-sand/80 shadow-sm space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-heading text-lg font-bold text-earthora-forest flex items-center gap-2">
                  <Users className="h-5 w-5 text-earthora-olive" />
                  Customer &amp; User Master Database
                </h3>
                <p className="text-xs text-earthora-muted">
                  Full directory of all accounts registered on the Earthora platform with complete address, contact, and credential telemetry.
                </p>
              </div>

              <button
                type="button"
                onClick={exportUsersCSV}
                className="btn-secondary py-2 px-4 text-xs font-bold flex items-center gap-2 self-start sm:self-auto shrink-0 shadow-2xs"
              >
                <Download className="h-4 w-4" />
                Export CSV Records
              </button>
            </div>

            {/* Filter Pills & Search Input */}
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-1.5 text-xs">
                {[
                  { id: 'all', label: `All Accounts (${users.length})` },
                  { id: 'customer', label: `Customers (${users.filter((u) => u.role === 'customer').length})` },
                  { id: 'farmer', label: `Farmers (${users.filter((u) => u.role === 'farmer').length})` },
                  { id: 'expert', label: `Experts (${users.filter((u) => u.role === 'expert').length})` },
                  { id: 'admin', label: `Admins (${users.filter((u) => u.role === 'admin').length})` },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setUserRoleFilter(f.id)}
                    className={`rounded-lg px-3 py-1.5 font-bold transition-all text-xs ${
                      userRoleFilter === f.id
                        ? 'bg-earthora-forest text-white shadow-xs'
                        : 'bg-earthora-ivory/80 text-earthora-charcoal hover:bg-earthora-sand/50'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-earthora-muted" />
                <input
                  type="text"
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  placeholder="Search by name, email, city, phone..."
                  className="input-field pl-9 pr-3 py-1.5 text-xs w-full"
                />
              </div>
            </div>

            {/* Users Directory Table */}
            <div className="overflow-x-auto rounded-2xl border border-earthora-sand/60">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-earthora-sand/60 bg-earthora-ivory/60 text-earthora-muted uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3.5">User / Contact</th>
                    <th className="p-3.5">Role</th>
                    <th className="p-3.5">Phone &amp; Email</th>
                    <th className="p-3.5">Location / Address</th>
                    <th className="p-3.5">Organization / Discipline</th>
                    <th className="p-3.5">Registered Date</th>
                    <th className="p-3.5">Account Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-earthora-sand/40">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-xs text-earthora-muted">
                        No user records found matching "{userSearchTerm}".
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const initials = (u.name || 'User')
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2);

                      const roleBadge = {
                        customer: 'border-blue-200 bg-blue-50 text-blue-700',
                        farmer: 'border-emerald-200 bg-emerald-50 text-emerald-800',
                        expert: 'border-amber-200 bg-amber-50 text-amber-800',
                        admin: 'border-purple-200 bg-purple-50 text-purple-700',
                      }[u.role] || 'border-gray-200 bg-gray-50 text-gray-700';

                      const formattedLoc = u.address?.city
                        ? `${u.address.city}${u.address.state ? `, ${u.address.state}` : ''}${u.address.country ? ` (${u.address.country})` : ''}`
                        : (u.location || 'Location Not Specified');

                      return (
                        <tr key={u._id} className="hover:bg-earthora-ivory/30 transition-colors">
                          <td className="p-3.5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-earthora-forest font-heading font-extrabold text-earthora-mint text-xs">
                                {initials}
                              </div>
                              <div>
                                <span className="font-bold text-earthora-forest block text-xs">{u.name}</span>
                                <span className="text-[10px] text-earthora-muted font-mono">{u._id?.slice(-8) || u._id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold capitalize ${roleBadge}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <div className="space-y-0.5">
                              <a href={`mailto:${u.email}`} className="text-earthora-forest hover:underline block font-medium">
                                {u.email}
                              </a>
                              {u.phone ? (
                                <a href={`tel:${u.phone}`} className="text-earthora-muted text-[11px] hover:text-earthora-forest block">
                                  {u.phone}
                                </a>
                              ) : (
                                <span className="text-[10px] text-earthora-sand-dark">No phone</span>
                              )}
                            </div>
                          </td>
                          <td className="p-3.5">
                            <div className="flex items-start gap-1.5 text-earthora-charcoal max-w-[200px]">
                              <MapPin className="h-3.5 w-3.5 text-earthora-olive shrink-0 mt-0.5" />
                              <span className="line-clamp-2 text-[11px] leading-tight">
                                {u.address?.street ? `${u.address.street}, ` : ''}{formattedLoc}
                              </span>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <span className="text-[11px] text-earthora-charcoal font-medium block">
                              {u.organization || u.title || u.farmName || (u.role === 'customer' ? 'Individual Consumer' : '—')}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <div className="flex items-center gap-1.5 text-earthora-forest font-medium text-[11px]">
                              <Calendar className="h-3.5 w-3.5 text-earthora-olive shrink-0" />
                              <div>
                                <span className="block font-bold">
                                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Nov 18, 2026'}
                                </span>
                                <span className="text-[10px] text-earthora-muted block">
                                  {u.createdAt ? new Date(u.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live'}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5">
                            {u.role === 'expert' && (u.approvalStatus === 'pending' || !u.isApproved) ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                                <Clock className="h-3 w-3" />
                                Pending Review
                              </span>
                            ) : u.isActive ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                                <CheckCircle2 className="h-3 w-3" />
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-800">
                                <XCircle className="h-3 w-3" />
                                Inactive
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedUserDetail(u)}
                              className="rounded-lg border border-earthora-sand bg-white px-2.5 py-1 text-[11px] font-bold text-earthora-forest hover:bg-earthora-forest hover:text-white transition-all shadow-2xs inline-flex items-center gap-1"
                            >
                              <Eye className="h-3 w-3" />
                              Details
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab (Outbound Customer Dispatches) */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Metrics */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card-surface p-5 border border-earthora-sand/80 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-earthora-muted">Total Orders</span>
                <Package className="h-5 w-5 text-earthora-forest" />
              </div>
              <p className="mt-2 font-heading text-2xl font-extrabold text-earthora-forest">{orders.length}</p>
              <p className="mt-1 text-xs text-earthora-muted">Customer checkout orders</p>
            </div>
            <div className="card-surface p-5 border border-earthora-sand/80 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-earthora-muted">Dispatched / Transit</span>
                <Truck className="h-5 w-5 text-amber-600" />
              </div>
              <p className="mt-2 font-heading text-2xl font-extrabold text-amber-700">
                {orders.filter((o) => ['dispatched', 'shipped'].includes((o.status || '').toLowerCase())).length}
              </p>
              <p className="mt-1 text-xs text-amber-700">En route to customers</p>
            </div>
            <div className="card-surface p-5 border border-earthora-sand/80 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-earthora-muted">Delivered</span>
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <p className="mt-2 font-heading text-2xl font-extrabold text-emerald-700">
                {orders.filter((o) => (o.status || '').toLowerCase() === 'delivered').length}
              </p>
              <p className="mt-1 text-xs text-emerald-700">Confirmed delivery</p>
            </div>
            <div className="card-surface p-5 border border-earthora-sand/80 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-earthora-muted">Outbound Gross</span>
                <DollarSign className="h-5 w-5 text-earthora-forest" />
              </div>
              <p className="mt-2 font-heading text-2xl font-extrabold text-earthora-forest">
                ₹{orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0).toLocaleString('en-IN')}
              </p>
              <p className="mt-1 text-xs text-emerald-700">Total order revenue</p>
            </div>
          </div>

          {/* Search, Filter & Export */}
          <div className="card-surface p-6 border border-earthora-sand/80 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h3 className="font-heading text-lg font-bold text-earthora-forest">Customer Orders &amp; Delivery Tracking</h3>
                <p className="text-xs text-earthora-muted">
                  Full records of which products were sent to whom, delivery address, date ordered, and dispatch status
                </p>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-earthora-muted" />
                  <input
                    type="text"
                    placeholder="Search by order #, customer, city, item..."
                    value={orderSearchTerm}
                    onChange={(e) => setOrderSearchTerm(e.target.value)}
                    className="input-field pl-9 py-1.5 text-xs w-full"
                  />
                </div>
                <button
                  onClick={exportOrdersCSV}
                  className="btn-outline py-1.5 px-3 text-xs flex items-center gap-1.5 whitespace-nowrap"
                  title="Download CSV spreadsheet of all customer orders"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 mb-4 text-xs">
              {['all', 'Placed', 'Processing', 'Harvested', 'Dispatched', 'Delivered', 'Cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3 py-1 rounded-full font-semibold transition-colors capitalize ${
                    orderStatusFilter.toLowerCase() === st.toLowerCase()
                      ? 'bg-earthora-forest text-white'
                      : 'bg-earthora-sand/40 text-earthora-forest hover:bg-earthora-sand/70'
                  }`}
                >
                  {st === 'all' ? 'All Orders' : st}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-earthora-sand/60 bg-earthora-ivory/60 text-[11px] font-bold uppercase tracking-wider text-earthora-forest">
                  <tr>
                    <th className="px-4 py-3">Order Code</th>
                    <th className="px-4 py-3">Customer &amp; Destination</th>
                    <th className="px-4 py-3">Products Sent</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Fulfillment Status</th>
                    <th className="px-4 py-3">Dispatched / Delivered</th>
                    <th className="px-4 py-3">Order Slip</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-earthora-sand/40">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-earthora-muted">
                        No orders match your search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((o) => (
                      <tr key={o._id || o.orderNumber} className="hover:bg-earthora-sand/15">
                        <td className="px-4 py-3">
                          <p className="font-mono font-bold text-earthora-forest">{o.orderNumber || o._id}</p>
                          <p className="text-[10px] text-earthora-muted">
                            {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'N/A'}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-bold text-earthora-forest">
                            {o.customerName || o.shippingAddress?.fullName || o.user?.name || 'Customer'}
                          </p>
                          <p className="text-[11px] text-earthora-muted">
                            {o.shippingAddress?.city || 'City N/A'}{o.shippingAddress?.state ? `, ${o.shippingAddress.state}` : ''}
                          </p>
                          <p className="text-[10px] text-earthora-muted font-mono">
                            {o.customerPhone || o.shippingAddress?.phone || 'No Phone'}
                          </p>
                        </td>
                        <td className="px-4 py-3 max-w-[200px]">
                          {Array.isArray(o.items) && o.items.length > 0 ? (
                            <div className="space-y-0.5">
                              {o.items.map((item, idx) => (
                                <p key={idx} className="truncate text-earthora-forest font-medium">
                                  <span className="font-bold text-earthora-forest">{item.quantity}x</span> {item.name}
                                </p>
                              ))}
                            </div>
                          ) : (
                            <span className="text-earthora-muted">Standard Package</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-bold text-earthora-forest">₹{Number(o.totalAmount || 0).toLocaleString('en-IN')}</p>
                          <p className="text-[10px] capitalize text-emerald-800 font-semibold">
                            {o.paymentMethod || 'card'} ({o.paymentStatus || 'paid'})
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={o.status || 'Placed'}
                            onChange={(e) => handleOrderStatus(o._id || o.orderNumber, e.target.value)}
                            className="input-field py-1 text-xs w-36 font-semibold"
                          >
                            <option value="Placed">Placed</option>
                            <option value="Processing">Processing</option>
                            <option value="Harvested">Harvested</option>
                            <option value="Dispatched">Dispatched</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-[11px]">
                          {o.deliveredAt ? (
                            <p className="text-emerald-700 font-semibold">
                              Delivered: {new Date(o.deliveredAt).toLocaleDateString()}
                            </p>
                          ) : o.dispatchedAt ? (
                            <p className="text-amber-700 font-semibold">
                              Dispatched: {new Date(o.dispatchedAt).toLocaleDateString()}
                            </p>
                          ) : (
                            <p className="text-earthora-muted">Pending dispatch</p>
                          )}
                          <p className="text-[10px] text-earthora-muted">{o.courierPartner || 'BlueDart Logistics'}</p>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setSelectedOrderDetail(o)}
                            className="btn-outline py-1 px-2.5 text-xs flex items-center gap-1 text-earthora-forest hover:bg-earthora-sand/40"
                            title="View shipping slip and full order breakdown"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View Slip
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Receipts Tab (Inbound Products Received from Farmers & Suppliers) */}
      {activeTab === 'receipts' && (
        <div className="space-y-6">
          {/* Metrics */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card-surface p-5 border border-earthora-sand/80 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-earthora-muted">Inbound Shipments</span>
                <Truck className="h-5 w-5 text-earthora-forest" />
              </div>
              <p className="mt-2 font-heading text-2xl font-extrabold text-earthora-forest">{supplyReceipts.length}</p>
              <p className="mt-1 text-xs text-earthora-muted">Total supply batches received</p>
            </div>
            <div className="card-surface p-5 border border-earthora-sand/80 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-earthora-muted">Units Received</span>
                <Boxes className="h-5 w-5 text-emerald-600" />
              </div>
              <p className="mt-2 font-heading text-2xl font-extrabold text-emerald-700">
                {supplyReceipts.reduce((sum, r) => sum + (Number(r.quantityReceived) || 0), 0).toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-emerald-700">Kg, bags, boxes &amp; units</p>
            </div>
            <div className="card-surface p-5 border border-earthora-sand/80 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-earthora-muted">Procurement Value</span>
                <DollarSign className="h-5 w-5 text-earthora-forest" />
              </div>
              <p className="mt-2 font-heading text-2xl font-extrabold text-earthora-forest">
                ₹{supplyReceipts.reduce((sum, r) => sum + (Number(r.totalCost) || 0), 0).toLocaleString('en-IN')}
              </p>
              <p className="mt-1 text-xs text-earthora-muted">Paid to growers / suppliers</p>
            </div>
            <div className="card-surface p-5 border border-earthora-sand/80 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-earthora-muted">Organic Quality Pass</span>
                <ClipboardCheck className="h-5 w-5 text-emerald-600" />
              </div>
              <p className="mt-2 font-heading text-2xl font-extrabold text-emerald-700">100%</p>
              <p className="mt-1 text-xs text-emerald-700">Inspection grade verified</p>
            </div>
          </div>

          {/* Table Container */}
          <div className="card-surface p-6 border border-earthora-sand/80 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h3 className="font-heading text-lg font-bold text-earthora-forest">
                  Inbound Products Received (Farm Supply Inward Log)
                </h3>
                <p className="text-xs text-earthora-muted">
                  Permanent record of which products were received, from which farmer, quantity, inspection grade, and receiving date
                </p>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-earthora-muted" />
                  <input
                    type="text"
                    placeholder="Search by receipt #, product, farmer..."
                    value={receiptSearchTerm}
                    onChange={(e) => setReceiptSearchTerm(e.target.value)}
                    className="input-field pl-9 py-1.5 text-xs w-full"
                  />
                </div>
                <button
                  onClick={() => setIsRecordReceiptOpen(true)}
                  className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Plus className="h-4 w-4" />
                  Record Inbound Receipt
                </button>
                <button
                  onClick={exportReceiptsCSV}
                  className="btn-outline py-1.5 px-3 text-xs flex items-center gap-1.5 whitespace-nowrap"
                  title="Download CSV spreadsheet of all supply receipts"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 mb-4 text-xs">
              {['all', 'Grade A Organic', 'Grade B', 'Pending Inspection'].map((st) => (
                <button
                  key={st}
                  onClick={() => setReceiptFilter(st)}
                  className={`px-3 py-1 rounded-full font-semibold transition-colors capitalize ${
                    receiptFilter.toLowerCase() === st.toLowerCase()
                      ? 'bg-earthora-forest text-white'
                      : 'bg-earthora-sand/40 text-earthora-forest hover:bg-earthora-sand/70'
                  }`}
                >
                  {st === 'all' ? 'All Received Shipments' : st}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-earthora-sand/60 bg-earthora-ivory/60 text-[11px] font-bold uppercase tracking-wider text-earthora-forest">
                  <tr>
                    <th className="px-4 py-3">Receipt Code</th>
                    <th className="px-4 py-3">Product &amp; Qty Received</th>
                    <th className="px-4 py-3">Received From (Farmer/Supplier)</th>
                    <th className="px-4 py-3">Date &amp; Time Received</th>
                    <th className="px-4 py-3">Quality Inspection</th>
                    <th className="px-4 py-3">Warehouse Hub</th>
                    <th className="px-4 py-3">Total Value</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-earthora-sand/40">
                  {filteredReceipts.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-earthora-muted">
                        No supply receipts match your search. Click &quot;Record Inbound Receipt&quot; to log new inward stock.
                      </td>
                    </tr>
                  ) : (
                    filteredReceipts.map((r) => (
                      <tr key={r._id || r.receiptNumber} className="hover:bg-earthora-sand/15">
                        <td className="px-4 py-3">
                          <p className="font-mono font-bold text-earthora-forest">{r.receiptNumber || r._id}</p>
                          <p className="text-[10px] text-earthora-muted font-mono">{r.batchNumber || 'Batch N/A'}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-bold text-earthora-forest">{r.productName}</p>
                          <p className="text-[11px] font-semibold text-emerald-800">
                            {r.quantityReceived} {r.unit || 'units'}
                          </p>
                          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-earthora-sand/50 text-earthora-forest capitalize">
                            {r.category || 'produce'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-bold text-earthora-forest">{r.supplierName}</p>
                          <p className="text-[10px] text-earthora-muted">{r.supplierLocation || 'Location N/A'}</p>
                          {r.supplierContact && (
                            <p className="text-[10px] text-earthora-muted font-mono">{r.supplierContact}</p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-[11px]">
                          <p className="font-medium text-earthora-forest">
                            {r.receivedAt ? new Date(r.receivedAt).toLocaleDateString() : 'Today'}
                          </p>
                          <p className="text-[10px] text-earthora-muted">
                            {r.receivedAt ? new Date(r.receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              (r.qualityStatus || '').includes('Grade A') || (r.qualityStatus || '').includes('Passed')
                                ? 'bg-emerald-100 text-emerald-800'
                                : (r.qualityStatus || '').includes('Pending')
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {r.qualityStatus || 'Passed - Grade A'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[11px] text-earthora-muted">
                          {r.warehouseLocation || 'Central Cold Storage'}
                        </td>
                        <td className="px-4 py-3 font-bold text-earthora-forest">
                          ₹{Number(r.totalCost || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setSelectedReceiptDetail(r)}
                              className="btn-outline py-1 px-2 text-xs flex items-center gap-1 text-earthora-forest hover:bg-earthora-sand/40"
                              title="View full receipt details"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteSupplyReceipt(r._id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Delete receipt"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrderDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="card-surface max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 border border-earthora-sand shadow-xl rounded-xl">
            <div className="flex justify-between items-start pb-4 border-b border-earthora-sand/60">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-earthora-muted">Customer Order Breakdown</span>
                <h3 className="font-heading text-xl font-bold text-earthora-forest mt-0.5">
                  Order #{selectedOrderDetail.orderNumber || selectedOrderDetail._id}
                </h3>
                <p className="text-xs text-earthora-muted">
                  Placed on {selectedOrderDetail.createdAt ? new Date(selectedOrderDetail.createdAt).toLocaleString() : 'N/A'}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrderDetail(null)}
                className="p-1.5 text-earthora-muted hover:text-earthora-forest rounded-lg hover:bg-earthora-sand/30"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="py-5 space-y-5 text-xs">
              {/* Customer & Shipping Address */}
              <div className="bg-earthora-ivory/80 p-4 rounded-lg border border-earthora-sand/60">
                <h4 className="font-bold text-earthora-forest mb-2 flex items-center gap-1.5 text-sm">
                  <MapPin className="h-4 w-4 text-emerald-700" />
                  Delivery &amp; Customer Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-earthora-muted text-[11px]">Customer Name:</span>
                    <p className="font-bold text-earthora-forest">
                      {selectedOrderDetail.customerName || selectedOrderDetail.shippingAddress?.fullName || selectedOrderDetail.user?.name || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="text-earthora-muted text-[11px]">Email Address:</span>
                    <p className="font-mono text-earthora-forest">
                      {selectedOrderDetail.customerEmail || selectedOrderDetail.shippingAddress?.email || selectedOrderDetail.user?.email || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="text-earthora-muted text-[11px]">Phone Number:</span>
                    <p className="font-mono text-earthora-forest">
                      {selectedOrderDetail.customerPhone || selectedOrderDetail.shippingAddress?.phone || selectedOrderDetail.user?.phone || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="text-earthora-muted text-[11px]">Delivery Slot:</span>
                    <p className="font-medium text-earthora-forest">
                      {selectedOrderDetail.shippingAddress?.deliverySlot || 'Standard Delivery'}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-earthora-muted text-[11px]">Street Address:</span>
                    <p className="font-medium text-earthora-forest">
                      {selectedOrderDetail.shippingAddress?.street || 'N/A'}, {selectedOrderDetail.shippingAddress?.city || ''}{' '}
                      {selectedOrderDetail.shippingAddress?.state || ''} {selectedOrderDetail.shippingAddress?.postalCode || ''},{' '}
                      {selectedOrderDetail.shippingAddress?.country || 'India'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h4 className="font-bold text-earthora-forest mb-2 text-sm flex items-center gap-1.5">
                  <Package className="h-4 w-4 text-emerald-700" />
                  Products Dispatched in this Order
                </h4>
                <div className="border border-earthora-sand/60 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-earthora-sand/30 font-bold text-earthora-forest border-b border-earthora-sand/60">
                      <tr>
                        <th className="px-3 py-2">Product Name</th>
                        <th className="px-3 py-2">Unit Price</th>
                        <th className="px-3 py-2">Quantity</th>
                        <th className="px-3 py-2 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-earthora-sand/30">
                      {Array.isArray(selectedOrderDetail.items) && selectedOrderDetail.items.length > 0 ? (
                        selectedOrderDetail.items.map((item, idx) => (
                          <tr key={idx} className="hover:bg-earthora-sand/15">
                            <td className="px-3 py-2 font-medium text-earthora-forest">{item.name}</td>
                            <td className="px-3 py-2">₹{Number(item.price).toFixed(2)}</td>
                            <td className="px-3 py-2 font-bold">{item.quantity}</td>
                            <td className="px-3 py-2 text-right font-bold text-earthora-forest">
                              ₹{(Number(item.price) * Number(item.quantity)).toFixed(2)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-3 py-4 text-center text-earthora-muted">
                            Order items details logged.
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot className="bg-earthora-sand/20 font-bold border-t border-earthora-sand/60">
                      <tr>
                        <td colSpan={3} className="px-3 py-2 text-right">Total Order Value:</td>
                        <td className="px-3 py-2 text-right text-earthora-forest text-sm font-extrabold">
                          ₹{Number(selectedOrderDetail.totalAmount || 0).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Timeline & Dispatch Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-earthora-sand/20 p-4 rounded-lg">
                <div>
                  <span className="text-earthora-muted text-[11px]">Courier Partner:</span>
                  <p className="font-semibold text-earthora-forest">
                    {selectedOrderDetail.courierPartner || 'BlueDart Agri-Logistics'}
                  </p>
                </div>
                <div>
                  <span className="text-earthora-muted text-[11px]">Tracking Number:</span>
                  <p className="font-mono text-earthora-forest">
                    {selectedOrderDetail.trackingNumber || selectedOrderDetail.orderNumber || 'ETH-TRK-PENDING'}
                  </p>
                </div>
                <div>
                  <span className="text-earthora-muted text-[11px]">Dispatched At:</span>
                  <p className="font-medium text-earthora-forest">
                    {selectedOrderDetail.dispatchedAt ? new Date(selectedOrderDetail.dispatchedAt).toLocaleString() : 'Not Yet Dispatched'}
                  </p>
                </div>
                <div>
                  <span className="text-earthora-muted text-[11px]">Delivered At:</span>
                  <p className="font-medium text-earthora-forest">
                    {selectedOrderDetail.deliveredAt ? new Date(selectedOrderDetail.deliveredAt).toLocaleString() : 'In Transit / Pending'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-earthora-sand/60">
              <button onClick={() => setSelectedOrderDetail(null)} className="btn-primary py-1.5 px-4 text-xs">
                Close Slip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Inbound Shipment Receipt Modal */}
      {isRecordReceiptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="card-surface max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 border border-earthora-sand shadow-xl rounded-xl">
            <div className="flex justify-between items-start pb-4 border-b border-earthora-sand/60">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-earthora-muted">Farm Supply Inward</span>
                <h3 className="font-heading text-lg font-bold text-earthora-forest mt-0.5">
                  Record Inbound Product Receipt
                </h3>
                <p className="text-xs text-earthora-muted">
                  Log produce and products received from growers into the Earthora database
                </p>
              </div>
              <button
                onClick={() => setIsRecordReceiptOpen(false)}
                className="p-1.5 text-earthora-muted hover:text-earthora-forest rounded-lg hover:bg-earthora-sand/30"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSupplyReceipt} className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-earthora-forest mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Heirloom Vine Tomatoes"
                    value={newReceipt.productName}
                    onChange={(e) => setNewReceipt({ ...newReceipt, productName: e.target.value })}
                    className="input-field py-1.5 text-xs w-full"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-earthora-forest mb-1">Category</label>
                  <select
                    value={newReceipt.category}
                    onChange={(e) => setNewReceipt({ ...newReceipt, category: e.target.value })}
                    className="input-field py-1.5 text-xs w-full"
                  >
                    <option value="produce">Organic Produce</option>
                    <option value="seeds">Certified Seeds</option>
                    <option value="fertilizers">Bio-Fertilizers &amp; Soil</option>
                    <option value="irrigation">Irrigation Systems</option>
                    <option value="equipment">Farm Equipment</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-earthora-forest mb-1">Farmer / Supplier Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Elena Vance - Green Valley Farm"
                    value={newReceipt.supplierName}
                    onChange={(e) => setNewReceipt({ ...newReceipt, supplierName: e.target.value })}
                    className="input-field py-1.5 text-xs w-full"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-earthora-forest mb-1">Supplier Contact (Phone/Email)</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 98765 43210"
                    value={newReceipt.supplierContact}
                    onChange={(e) => setNewReceipt({ ...newReceipt, supplierContact: e.target.value })}
                    className="input-field py-1.5 text-xs w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-earthora-forest mb-1">Quantity Received *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="e.g. 50"
                    value={newReceipt.quantityReceived}
                    onChange={(e) => setNewReceipt({ ...newReceipt, quantityReceived: e.target.value })}
                    className="input-field py-1.5 text-xs w-full"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-earthora-forest mb-1">Unit</label>
                  <select
                    value={newReceipt.unit}
                    onChange={(e) => setNewReceipt({ ...newReceipt, unit: e.target.value })}
                    className="input-field py-1.5 text-xs w-full"
                  >
                    <option value="kg">kg (Kilograms)</option>
                    <option value="boxes">Boxes</option>
                    <option value="bags">Bags (25kg/50kg)</option>
                    <option value="liters">Liters</option>
                    <option value="units">Units</option>
                    <option value="crates">Crates</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-earthora-forest mb-1">Unit Cost (₹ Paid)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 180"
                    value={newReceipt.unitCost}
                    onChange={(e) => setNewReceipt({ ...newReceipt, unitCost: e.target.value })}
                    className="input-field py-1.5 text-xs w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-earthora-forest mb-1">Batch / Lot Number</label>
                  <input
                    type="text"
                    placeholder="e.g. BATCH-2026-TOM-04"
                    value={newReceipt.batchNumber}
                    onChange={(e) => setNewReceipt({ ...newReceipt, batchNumber: e.target.value })}
                    className="input-field py-1.5 text-xs w-full"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-earthora-forest mb-1">Quality Inspection Status</label>
                  <select
                    value={newReceipt.qualityStatus}
                    onChange={(e) => setNewReceipt({ ...newReceipt, qualityStatus: e.target.value })}
                    className="input-field py-1.5 text-xs w-full"
                  >
                    <option value="Passed - Grade A Organic">Passed - Grade A Organic</option>
                    <option value="Passed - Grade B">Passed - Grade B Standard</option>
                    <option value="Pending Inspection">Pending Inspection</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-earthora-forest mb-1">Warehouse / Storage Hub</label>
                  <input
                    type="text"
                    placeholder="e.g. Central Cold Storage Hub A"
                    value={newReceipt.warehouseLocation}
                    onChange={(e) => setNewReceipt({ ...newReceipt, warehouseLocation: e.target.value })}
                    className="input-field py-1.5 text-xs w-full"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-earthora-forest mb-1">Farm / Supplier Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Sonoma County / Coimbatore"
                    value={newReceipt.supplierLocation}
                    onChange={(e) => setNewReceipt({ ...newReceipt, supplierLocation: e.target.value })}
                    className="input-field py-1.5 text-xs w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-earthora-forest mb-1">Inspection Notes &amp; Moisture/Brix</label>
                <textarea
                  rows={2}
                  placeholder="e.g. High firmness, Brix 6.8 confirmed, zero synthetic pesticide residues detected."
                  value={newReceipt.notes}
                  onChange={(e) => setNewReceipt({ ...newReceipt, notes: e.target.value })}
                  className="input-field py-1.5 text-xs w-full"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="updateStockCheck"
                  checked={newReceipt.updateStock}
                  onChange={(e) => setNewReceipt({ ...newReceipt, updateStock: e.target.checked })}
                  className="rounded border-earthora-sand text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <label htmlFor="updateStockCheck" className="text-earthora-forest font-semibold cursor-pointer">
                  Automatically add this quantity to Marketplace Live Stock inventory
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-earthora-sand/60">
                <button
                  type="button"
                  onClick={() => setIsRecordReceiptOpen(false)}
                  className="btn-outline py-1.5 px-4 text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary py-1.5 px-4 text-xs flex items-center gap-1.5">
                  <Check className="h-4 w-4" />
                  Save Inbound Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Detail Modal */}
      {selectedReceiptDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="card-surface max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 border border-earthora-sand shadow-xl rounded-xl">
            <div className="flex justify-between items-start pb-4 border-b border-earthora-sand/60">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-earthora-muted">Supply Receipt Breakdown</span>
                <h3 className="font-heading text-xl font-bold text-earthora-forest mt-0.5">
                  Receipt #{selectedReceiptDetail.receiptNumber || selectedReceiptDetail._id}
                </h3>
                <p className="text-xs text-earthora-muted font-mono">
                  Batch: {selectedReceiptDetail.batchNumber || 'N/A'}
                </p>
              </div>
              <button
                onClick={() => setSelectedReceiptDetail(null)}
                className="p-1.5 text-earthora-muted hover:text-earthora-forest rounded-lg hover:bg-earthora-sand/30"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="bg-earthora-ivory/80 p-4 rounded-lg border border-earthora-sand/60 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-earthora-muted text-[11px]">Product Received:</span>
                    <p className="font-bold text-earthora-forest text-sm">{selectedReceiptDetail.productName}</p>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] bg-earthora-sand/50 text-earthora-forest capitalize">
                      {selectedReceiptDetail.category || 'produce'}
                    </span>
                  </div>
                  <div>
                    <span className="text-earthora-muted text-[11px]">Quantity:</span>
                    <p className="font-heading text-lg font-extrabold text-emerald-800">
                      {selectedReceiptDetail.quantityReceived} {selectedReceiptDetail.unit || 'units'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-earthora-sand/40">
                  <div>
                    <span className="text-earthora-muted text-[11px]">Supplier / Grower:</span>
                    <p className="font-bold text-earthora-forest">{selectedReceiptDetail.supplierName}</p>
                    <p className="text-[10px] text-earthora-muted">{selectedReceiptDetail.supplierLocation || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-earthora-muted text-[11px]">Contact:</span>
                    <p className="font-mono text-earthora-forest">{selectedReceiptDetail.supplierContact || 'N/A'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-earthora-sand/40">
                  <div>
                    <span className="text-earthora-muted text-[11px]">Procurement Cost:</span>
                    <p className="font-bold text-earthora-forest">
                      ₹{selectedReceiptDetail.unitCost || 0} / {selectedReceiptDetail.unit || 'unit'}
                    </p>
                    <p className="text-[11px] text-emerald-800 font-extrabold">
                      Total: ₹{Number(selectedReceiptDetail.totalCost || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <span className="text-earthora-muted text-[11px]">Quality Inspection:</span>
                    <p className="font-bold text-emerald-700">{selectedReceiptDetail.qualityStatus}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-earthora-sand/40">
                  <span className="text-earthora-muted text-[11px]">Warehouse Storage Bay:</span>
                  <p className="font-medium text-earthora-forest">{selectedReceiptDetail.warehouseLocation}</p>
                </div>

                {selectedReceiptDetail.notes && (
                  <div className="pt-2 border-t border-earthora-sand/40">
                    <span className="text-earthora-muted text-[11px]">Notes:</span>
                    <p className="text-earthora-forest italic">{selectedReceiptDetail.notes}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-earthora-sand/60">
              <button onClick={() => setSelectedReceiptDetail(null)} className="btn-primary py-1.5 px-4 text-xs">
                Close
              </button>
            </div>
          </div>
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
                  <td className="px-4 py-3 font-bold">₹{Number(p.price).toFixed(2)}</td>
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
                <th className="px-4 py-3">Registered Date</th>
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
                  <td className="px-4 py-3 text-[11px] text-earthora-forest font-medium">
                    {f.createdAt ? new Date(f.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Nov 18, 2026'}
                  </td>
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
                  <th className="px-4 py-3">Application Date</th>
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
                          <div className="flex items-center gap-3">
                            <img
                              src={e.image || '/assets/img/experts/expert-aris-thorne.jpg'}
                              alt={e.name}
                              className="h-10 w-10 shrink-0 rounded-xl object-cover border border-earthora-sand/80 shadow-xs"
                              onError={(err) => {
                                err.currentTarget.onerror = null;
                                err.currentTarget.src = '/assets/img/experts/expert-aris-thorne.jpg';
                              }}
                            />
                            <div>
                              <div className="font-bold text-earthora-forest">{e.name}</div>
                              <div className="text-[11px] text-earthora-muted">{e.title}</div>
                              <div className="text-[10px] text-earthora-olive mt-0.5">
                                {e.user?.email || 'Registered Expert'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="font-semibold text-earthora-charcoal">{e.fieldOfStudy}</div>
                          <div className="text-[11px] text-earthora-muted">{e.organization}</div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="font-semibold text-earthora-charcoal">{e.experienceYears || 5} Years exp</div>
                          <div className="text-[11px] text-earthora-muted">₹{e.consultationFee || 1500}/session</div>
                        </td>
                        <td className="px-4 py-3.5 text-earthora-muted">{e.location || 'USA'}</td>
                        <td className="px-4 py-3.5 text-[11px] text-earthora-forest font-medium">
                          {e.createdAt ? new Date(e.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Nov 18, 2026'}
                        </td>
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

          {/* Published Articles Roster */}
          <div className="card-surface p-6 border border-earthora-sand/80 shadow-sm space-y-4">
            <h4 className="font-heading text-base font-bold text-earthora-forest">Published Field Guides &amp; Whitepapers</h4>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((art) => (
                <div key={art._id} className="rounded-2xl border border-earthora-sand/70 overflow-hidden bg-white shadow-xs flex flex-col">
                  <div className="relative aspect-[16/10] overflow-hidden bg-earthora-forest">
                    <img
                      src={art.image || '/assets/img/knowledge/precision-drip-irrigation.jpg'}
                      alt={art.title}
                      className="h-full w-full object-cover"
                      onError={(err) => {
                        err.currentTarget.onerror = null;
                        err.currentTarget.src = '/assets/img/knowledge/precision-drip-irrigation.jpg';
                      }}
                    />
                    <div className="absolute top-2 left-2">
                      <span className="rounded-md bg-earthora-forest/90 px-2 py-0.5 text-[10px] font-bold text-earthora-mint">
                        {art.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h5 className="font-heading text-xs font-bold text-earthora-forest line-clamp-2">{art.title}</h5>
                      <p className="text-[11px] text-earthora-muted mt-1">Author: {art.author}</p>
                    </div>
                    <span className="text-[10px] text-earthora-olive font-semibold mt-2 block">Status: Published · Live</span>
                  </div>
                </div>
              ))}
            </div>
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

      {/* User Record Detail Modal */}
      {selectedUserDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fade-in">
          <div className="card-surface w-full max-w-lg border border-earthora-sand p-6 shadow-2xl relative sm:p-8">
            <button
              type="button"
              onClick={() => setSelectedUserDetail(null)}
              className="absolute right-4 top-4 rounded-xl p-1.5 text-earthora-muted hover:bg-earthora-ivory hover:text-earthora-forest transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-earthora-forest font-heading text-lg font-extrabold text-earthora-mint">
                {(selectedUserDetail.name || 'User').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="font-heading text-lg font-extrabold text-earthora-forest">
                  {selectedUserDetail.name}
                </h4>
                <span className="inline-flex items-center rounded-full border border-earthora-sand bg-earthora-ivory px-2 py-0.5 text-[10px] font-bold capitalize text-earthora-forest">
                  {selectedUserDetail.role} Account
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-3 rounded-2xl border border-earthora-sand/60 bg-earthora-ivory/40 p-4 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-earthora-muted">Email</span>
                  <p className="font-semibold text-earthora-forest">{selectedUserDetail.email}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-earthora-muted">Phone</span>
                  <p className="font-semibold text-earthora-charcoal">{selectedUserDetail.phone || 'Not provided'}</p>
                </div>
              </div>

              <div className="border-t border-earthora-sand/50 pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-earthora-muted">Delivery Address / Location</span>
                <p className="font-semibold text-earthora-charcoal mt-0.5">
                  {selectedUserDetail.address?.street ? `${selectedUserDetail.address.street}, ` : ''}
                  {selectedUserDetail.address?.city || selectedUserDetail.location || 'City not specified'}
                  {selectedUserDetail.address?.state ? `, ${selectedUserDetail.address.state}` : ''}
                  {selectedUserDetail.address?.postalCode ? ` - ${selectedUserDetail.address.postalCode}` : ''}
                  {selectedUserDetail.address?.country ? `, ${selectedUserDetail.address.country}` : ''}
                </p>
              </div>

              <div className="border-t border-earthora-sand/50 pt-2 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-earthora-muted">Organization / Farm</span>
                  <p className="font-semibold text-earthora-charcoal">{selectedUserDetail.organization || selectedUserDetail.farmName || '—'}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-earthora-muted">Title / Discipline</span>
                  <p className="font-semibold text-earthora-charcoal">{selectedUserDetail.title || selectedUserDetail.fieldOfStudy || '—'}</p>
                </div>
              </div>

              <div className="border-t border-earthora-sand/50 pt-2 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-earthora-muted">Account Status</span>
                  <p className="font-semibold text-earthora-forest capitalize">
                    {selectedUserDetail.approvalStatus || (selectedUserDetail.isActive ? 'Active' : 'Deactivated')}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-earthora-muted">Registration Timestamp</span>
                  <p className="font-semibold text-earthora-charcoal">
                    {selectedUserDetail.createdAt ? new Date(selectedUserDetail.createdAt).toLocaleString() : 'System Seeded'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedUserDetail(null)}
                className="btn-accent py-2 px-5 text-xs font-bold"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
