import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiPackage, FiMapPin, FiLogOut, FiEdit, FiTrash2 } from 'react-icons/fi';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import { ordersApi } from '../api/orders.api';
import { authApi } from '../api/auth.api';
import { Order, Address } from '../types';
import { formatPrice, formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';

const AccountPage: React.FC = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const data = await ordersApi.getOrders();
      setOrders(data.orders);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authApi.updateProfile({ name });
      await refreshUser();
      setIsEditing(false);
      toast.success('Profile updated');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      await authApi.deleteAddress(addressId);
      await refreshUser();
      toast.success('Address deleted');
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'orders', label: 'Orders', icon: FiPackage },
    { id: 'addresses', label: 'Addresses', icon: FiMapPin },
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">My Account</h1>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Sidebar */}
          <aside className="mb-8 lg:mb-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon size={20} />
                  {tab.label}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-left text-red-600 hover:bg-red-50 transition-colors"
              >
                <FiLogOut size={20} />
                Logout
              </button>
            </nav>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-lg font-semibold mb-6">Profile Information</h2>

                {isEditing ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50"
                      />
                    </div>
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-500">Name</label>
                      <p className="font-medium">{user?.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500">Email</label>
                      <p className="font-medium">{user?.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500">Role</label>
                      <p className="font-medium capitalize">{user?.role}</p>
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                    >
                      <FiEdit size={16} />
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg border">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-semibold">Order History</h2>
                </div>

                {isLoadingOrders ? (
                  <div className="p-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mx-auto" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="p-6 text-center">
                    <FiPackage className="mx-auto text-gray-300" size={48} />
                    <p className="text-gray-500 mt-4">No orders yet</p>
                    <Link
                      to="/"
                      className="inline-block mt-4 text-gray-900 hover:underline"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y">
                    {orders.map((order) => (
                      <div key={order._id} className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="font-medium">{order.orderNumber}</p>
                            <p className="text-sm text-gray-500">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatPrice(order.totalAmount)}</p>
                            <span
                              className={`inline-block px-2 py-1 text-xs rounded-full ${
                                order.paymentStatus === 'paid'
                                  ? 'bg-green-100 text-green-800'
                                  : order.paymentStatus === 'failed'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {order.paymentStatus}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 overflow-x-auto">
                          {order.items.slice(0, 4).map((item, idx) => (
                            <div
                              key={idx}
                              className="w-16 h-20 bg-gray-100 rounded flex-shrink-0 overflow-hidden"
                            >
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                  No img
                                </div>
                              )}
                            </div>
                          ))}
                          {order.items.length > 4 && (
                            <div className="w-16 h-20 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center text-gray-500 text-sm">
                              +{order.items.length - 4}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-lg border">
                <div className="p-6 border-b flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Saved Addresses</h2>
                </div>

                {!user?.addresses || user.addresses.length === 0 ? (
                  <div className="p-6 text-center">
                    <FiMapPin className="mx-auto text-gray-300" size={48} />
                    <p className="text-gray-500 mt-4">No saved addresses</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {user.addresses.map((address: Address) => (
                      <div key={address._id} className="p-6 flex justify-between items-start">
                        <div>
                          {address.isDefault && (
                            <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded mb-2">
                              Default
                            </span>
                          )}
                          <p>{address.street}</p>
                          <p className="text-gray-600">
                            {address.city}, {address.state} {address.zipCode}
                          </p>
                        </div>
                        <button
                          onClick={() => address._id && handleDeleteAddress(address._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AccountPage;
