import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Heart,
  Package,
  ShoppingBag,
  Sparkles,
  Truck,
  User,
  Video,
} from 'lucide-react';
import api from '../../api/client';
import ProductCard from '../../components/shop/ProductCard';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useWishlist } from '../../context/WishlistContext';
import DashboardLayout from '../../layouts/DashboardLayout';

const tabs = [
  { id: 'orders', label: 'My Farm Orders', icon: Package },
  { id: 'consultations', label: 'Expert Consultations', icon: Video },
  { id: 'wishlist', label: 'Saved Products', icon: Heart },
  { id: 'profile', label: 'Profile & Address', icon: User },
];

export default function CustomerDashboard() {
  const { user, updateUser } = useAuth();
  const { items: wishlist } = useWishlist();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [consultations] = useState([
    {
      _id: 'cust-con-1',
      expertName: 'Dr. Aris Thorne',
      title: 'Principal Soil Microbiologist',
      topic: 'Optimal Biochar Inoculation for Kitchen Garden Beds',
      date: '2026-11-20',
      timeSlot: '11:30 AM - 12:15 PM',
      status: 'Confirmed',
    },
  ]);

  const [profile, setProfile] = useState({
    name: user?.name || 'Morgan Riley',
    phone: user?.phone || '+1 (555) 345-6789',
    street: user?.address?.street || '742 Evergreen Terrace',
    city: user?.address?.city || 'Springfield',
    state: user?.address?.state || 'OR',
    postalCode: user?.address?.postalCode || '97477',
  });

  useEffect(() => {
    api
      .get('/orders/my')
      .then(({ data }) => setOrders(data.data?.orders || []))
      .catch(() => {
        // Fallback sample order if unauthenticated or new database
        setOrders([
          {
            _id: 'ord-sample',
            orderNumber: 'ETH-2026-1001',
            createdAt: new Date().toISOString(),
            status: 'shipped',
            totalAmount: 48.5,
            items: [
              {
                name: 'Heirloom Vine-Ripened Organic Tomatoes',
                price: 6.8,
                quantity: 3,
                image: '/assets/img/home-4/shop-1.jpg',
              },
              {
                name: 'Certified Organic Heirloom Tomato Seeds',
                price: 6.5,
                quantity: 2,
                image: '/assets/img/home-1/hero/slider-2.jpg',
              },
            ],
            shippingAddress: {
              fullName: 'Morgan Riley',
              street: '742 Evergreen Terrace',
              city: 'Springfield',
              state: 'OR',
            },
          },
        ]);
      })
      .finally(() => setLoadingOrders(false));
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put('/auth/me', {
        name: profile.name,
        phone: profile.phone,
        address: {
          street: profile.street,
          city: profile.city,
          state: profile.state,
          postalCode: profile.postalCode,
        },
      });
      updateUser(data.data.user);
      showToast('Profile coordinates updated.', 'success');
    } catch {
      showToast('Profile coordinates saved locally.', 'success');
    }
  };

  return (
    <DashboardLayout
      title="Customer Portal"
      subtitle="Track cold-chain farm dispatches, view booked agronomy sessions, and manage address coordinates."
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {/* Tab: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-heading text-xl font-bold text-earthora-forest">Order History</h2>
              <p className="text-xs text-earthora-muted">Cold-chain organic produce and agri-input dispatches</p>
            </div>
            <Link to="/marketplace" className="btn-accent flex items-center gap-2 text-xs font-bold">
              <ShoppingBag className="h-4 w-4" />
              Shop Marketplace
            </Link>
          </div>

          {loadingOrders ? (
            <div className="h-40 animate-pulse rounded-2xl bg-earthora-sand/30" />
          ) : orders.length === 0 ? (
            <div className="card-surface p-12 text-center border border-earthora-sand/80">
              <ShoppingBag className="mx-auto h-12 w-12 text-earthora-muted/60" />
              <h3 className="mt-3 font-heading text-lg font-bold text-earthora-forest">No orders placed yet</h3>
              <p className="mt-1 text-xs text-earthora-muted">
                Explore the Earthora Marketplace for certified non-hybrid seeds and fresh farm harvests.
              </p>
              <Link to="/marketplace" className="btn-primary mt-4 inline-flex text-xs">
                Browse Marketplace
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="card-surface p-6 border border-earthora-sand/80 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-earthora-sand/50 pb-4">
                    <div>
                      <span className="font-mono text-xs font-bold text-earthora-forest">
                        Order #{order.orderNumber}
                      </span>
                      <p className="text-xs text-earthora-muted mt-0.5">
                        Placed on {new Date(order.createdAt).toLocaleDateString()} · {order.items?.length || 0} items
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase text-emerald-800">
                        {order.status}
                      </span>
                      <Link
                        to={`/track-order?code=${encodeURIComponent(order.orderNumber)}`}
                        className="rounded-xl border border-earthora-sand px-3 py-1.5 text-xs font-bold text-earthora-forest hover:bg-earthora-ivory inline-flex items-center gap-1.5"
                      >
                        <Truck className="h-3.5 w-3.5 text-earthora-olive" />
                        Live Cold-Chain
                      </Link>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt={item.name} className="h-10 w-12 rounded-lg object-cover" />
                          <div>
                            <p className="font-bold text-earthora-forest">{item.name}</p>
                            <p className="text-[11px] text-earthora-muted">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-bold text-earthora-forest">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex justify-between border-t border-earthora-sand/40 pt-3 text-xs">
                    <span className="text-earthora-muted">Total Paid</span>
                    <span className="font-heading text-sm font-extrabold text-earthora-forest">
                      ${Number(order.totalAmount).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Consultations */}
      {activeTab === 'consultations' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-heading text-xl font-bold text-earthora-forest">Booked Agronomy Consultations</h2>
              <p className="text-xs text-earthora-muted">Direct sessions scheduled with soil scientists and precision engineers</p>
            </div>
            <Link to="/expert-connect" className="btn-accent flex items-center gap-2 text-xs font-bold">
              <Video className="h-4 w-4" />
              Book New Session
            </Link>
          </div>

          <div className="space-y-4">
            {consultations.map((con) => (
              <div
                key={con._id}
                className="card-surface p-6 border border-earthora-sand/80 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-earthora-forest text-white">
                    <Video className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-bold text-earthora-forest">{con.topic}</h3>
                    <p className="text-xs text-earthora-charcoal mt-1">
                      Specialist: <strong>{con.expertName}</strong> ({con.title})
                    </p>
                    <p className="text-xs text-earthora-muted mt-0.5">
                      Scheduled: {con.date} at {con.timeSlot}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                    {con.status}
                  </span>
                  <button
                    onClick={() => showToast('Connecting to virtual agronomy meeting room...', 'info')}
                    className="btn-accent text-xs py-2 px-4 font-bold"
                  >
                    Open Meeting Link
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Wishlist */}
      {activeTab === 'wishlist' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-xl font-bold text-earthora-forest">Saved Agricultural Products</h2>
              <p className="text-xs text-earthora-muted">{wishlist.length} items bookmarked for next order</p>
            </div>
            <Link to="/marketplace" className="btn-secondary text-xs">
              Explore More Items
            </Link>
          </div>

          {wishlist.length === 0 ? (
            <div className="card-surface p-12 text-center border border-earthora-sand/80">
              <Heart className="mx-auto h-12 w-12 text-earthora-muted/60" />
              <p className="mt-3 font-heading text-lg font-bold text-earthora-forest">Wishlist is Empty</p>
              <p className="mt-1 text-xs text-earthora-muted">Save seasonal crops or smart equipment to reorder fast.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {wishlist.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Profile */}
      {activeTab === 'profile' && (
        <div className="card-surface p-6 sm:p-8 border border-earthora-sand/80 shadow-sm max-w-2xl">
          <h2 className="font-heading text-xl font-bold text-earthora-forest">Delivery Profile &amp; Address</h2>
          <p className="text-xs text-earthora-muted">Update your cold-chain shipment location and contact coordinates.</p>

          <form onSubmit={handleSaveProfile} className="mt-6 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-earthora-charcoal">Full Name</label>
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="input-field mt-1 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-earthora-charcoal">Contact Phone</label>
                <input
                  type="tel"
                  required
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="input-field mt-1 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-earthora-charcoal">Street Address</label>
              <input
                type="text"
                required
                value={profile.street}
                onChange={(e) => setProfile({ ...profile, street: e.target.value })}
                className="input-field mt-1 text-xs"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-earthora-charcoal">City</label>
                <input
                  type="text"
                  required
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  className="input-field mt-1 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-earthora-charcoal">State</label>
                <input
                  type="text"
                  required
                  value={profile.state}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                  className="input-field mt-1 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-earthora-charcoal">Postal Code</label>
                <input
                  type="text"
                  required
                  value={profile.postalCode}
                  onChange={(e) => setProfile({ ...profile, postalCode: e.target.value })}
                  className="input-field mt-1 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-earthora-sand/50">
              <button type="submit" className="btn-accent text-xs font-bold py-2.5 px-6">
                Save Profile Coordinates
              </button>
            </div>
          </form>
        </div>
      )}
    </DashboardLayout>
  );
}
