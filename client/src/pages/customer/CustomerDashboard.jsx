import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Package, ShoppingBasket, User } from 'lucide-react';
import api from '../../api/client';
import ProductCard from '../../components/shop/ProductCard';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useWishlist } from '../../context/WishlistContext';
import DashboardLayout from '../../layouts/DashboardLayout';

const tabs = [
  { id: 'orders', label: 'My Orders', icon: Package },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'profile', label: 'Profile & Address', icon: User },
];

export default function CustomerDashboard() {
  const { user, updateUser } = useAuth();
  const { items: wishlist } = useWishlist();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [profile, setProfile] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    postalCode: user?.address?.postalCode || '',
  });

  useEffect(() => {
    api
      .get('/orders/my')
      .then(({ data }) => setOrders(data.data?.orders || []))
      .catch(() => {})
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
      showToast('Profile updated.');
    } catch (err) {
      showToast(err.message || 'Unable to update profile', 'error');
    }
  };

  return (
    <DashboardLayout
      title="Customer Portal"
      subtitle="Track deliveries, manage saved harvests, and update shipping details"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold text-agriva-ink">Order History</h2>
            <Link to="/products" className="btn-primary text-xs">
              <ShoppingBasket className="h-4 w-4" />
              Shop Fresh Produce
            </Link>
          </div>

          {loadingOrders ? (
            <div className="h-40 animate-pulse rounded-xl bg-agriva-oat" />
          ) : orders.length === 0 ? (
            <div className="card-surface p-10 text-center">
              <p className="font-display text-lg font-semibold text-agriva-ink">No orders placed yet</p>
              <p className="mt-1 text-sm text-agriva-muted">
                Place an order from our organic catalog to track farm-to-home progress here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="card-surface p-5">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-agriva-line pb-3">
                    <div>
                      <p className="font-display text-lg font-semibold text-agriva-ink">
                        #{order.orderNumber}
                      </p>
                      <p className="text-xs text-agriva-muted">
                        {new Date(order.createdAt).toLocaleDateString()} · {order.items?.length || 0} items
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-agriva-mint px-3 py-1 text-xs font-bold uppercase text-agriva-forest">
                        {order.status}
                      </span>
                      <span className="font-bold text-agriva-forest">
                        ${Number(order.totalAmount).toFixed(2)}
                      </span>
                      <Link
                        to={`/track-order?code=${encodeURIComponent(order.orderNumber)}`}
                        className="btn-secondary py-1.5 text-xs"
                      >
                        Track
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'wishlist' && (
        <div>
          <h2 className="mb-4 font-display text-2xl font-semibold text-agriva-ink">
            Saved Harvests ({wishlist.length})
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {wishlist.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="card-surface max-w-2xl space-y-4 p-6">
          <h2 className="font-display text-2xl font-semibold text-agriva-ink">Profile &amp; Address</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold">Full Name</label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold">Phone</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                className="input-field"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold">Street Address</label>
              <input
                type="text"
                value={profile.street}
                onChange={(e) => setProfile((p) => ({ ...p, street: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold">City</label>
              <input
                type="text"
                value={profile.city}
                onChange={(e) => setProfile((p) => ({ ...p, city: e.target.value }))}
                className="input-field"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold">State</label>
                <input
                  type="text"
                  value={profile.state}
                  onChange={(e) => setProfile((p) => ({ ...p, state: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold">ZIP</label>
                <input
                  type="text"
                  value={profile.postalCode}
                  onChange={(e) => setProfile((p) => ({ ...p, postalCode: e.target.value }))}
                  className="input-field"
                />
              </div>
            </div>
          </div>
          <button type="submit" className="btn-primary">
            Save Changes
          </button>
        </form>
      )}
    </DashboardLayout>
  );
}

