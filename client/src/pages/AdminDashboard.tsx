import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiShoppingCart, FiUsers, FiDollarSign, FiAlertTriangle, FiUpload } from 'react-icons/fi';
import toast from 'react-hot-toast';
import AdminLayout from '../components/admin/AdminLayout';
import { adminApi } from '../api/admin.api';
import { DashboardStats, HomePageImages } from '../types';
import { formatPrice, formatDate } from '../utils/formatters';

const imageFieldConfig: Array<{ key: keyof HomePageImages; label: string; recommendedSize: string }> = [
  { key: 'heroImage', label: 'Hero Section Image', recommendedSize: '16x9' },
  { key: 'menImage', label: "Men's Image", recommendedSize: '16x9' },
  { key: 'womenImage', label: "Women's Image", recommendedSize: '9x16' },
  { key: 'collectionImage', label: 'Collection Image', recommendedSize: '1x1' },
  { key: 'accessoryImage', label: 'Accessory Image', recommendedSize: '1x1' },
  { key: 'saleImage', label: 'Sale Image', recommendedSize: '1x1' },
];

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [homePageImages, setHomePageImages] = useState<HomePageImages | null>(null);
  const [originalHomePageImages, setOriginalHomePageImages] = useState<HomePageImages | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingField, setUploadingField] = useState<keyof HomePageImages | null>(null);
  const [savingImages, setSavingImages] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, imageData] = await Promise.all([
          adminApi.getDashboardStats(),
          adminApi.getHomePageImages(),
        ]);
        setStats(statsData);
        setHomePageImages(imageData);
        setOriginalHomePageImages(imageData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);


  const isDirty = Boolean(
    homePageImages
    && originalHomePageImages
    && imageFieldConfig.some((item) => homePageImages[item.key] !== originalHomePageImages[item.key])
  );

  const handleImageUpload = async (
    field: keyof HomePageImages,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !homePageImages) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      event.target.value = '';
      return;
    }

    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      toast.error('Please upload an image under 5MB');
      event.target.value = '';
      return;
    }

    try {
      setUploadingField(field);
      const imageUrl = await adminApi.uploadImage(file);
      setHomePageImages((prev) => (prev ? { ...prev, [field]: imageUrl } : prev));
      toast.success(`${imageFieldConfig.find((item) => item.key === field)?.label} uploaded`);
    } catch (error) {
      console.error(`Failed to upload ${field}:`, error);
      toast.error('Image upload failed');
    } finally {
      setUploadingField(null);
      event.target.value = '';
    }
  };

  const saveHomePageImages = async () => {
    if (!homePageImages) return;

    try {
      setSavingImages(true);
      const updated = await adminApi.updateHomePageImages({
        heroImage: homePageImages.heroImage,
        menImage: homePageImages.menImage,
        womenImage: homePageImages.womenImage,
        collectionImage: homePageImages.collectionImage,
        accessoryImage: homePageImages.accessoryImage,
        saleImage: homePageImages.saleImage,
      });
      setHomePageImages(updated);
      setOriginalHomePageImages(updated);
      toast.success('Home page images updated');
    } catch (error) {
      console.error('Failed to save home page images:', error);
      toast.error('Failed to save home page images');
    } finally {
      setSavingImages(false);
    }
  };


  const resetHomePageImages = () => {
    if (!originalHomePageImages) return;
    setHomePageImages(originalHomePageImages);
    toast.success('Changes reset');
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                <div className="h-8 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>

        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold">Home Page Image Manager</h3>
              <p className="text-sm text-gray-500">
                Upload images for hero, men, women, collection, accessory, and sale sections.
              </p>
              <p className={`text-xs mt-2 ${isDirty ? 'text-amber-600' : 'text-emerald-600'}`}>
                {isDirty ? 'You have unsaved image changes.' : 'All image changes are saved.'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={resetHomePageImages}
                disabled={!isDirty || savingImages}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md font-medium disabled:opacity-60"
              >
                Reset
              </button>
              <button
                onClick={saveHomePageImages}
                disabled={savingImages || !homePageImages || !isDirty}
                className="px-4 py-2 bg-gray-900 text-white rounded-md font-medium disabled:opacity-60"
              >
                {savingImages ? 'Saving...' : 'Save Home Images'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {imageFieldConfig.map((item) => (
              <div key={item.key} className="border rounded-lg p-4 space-y-3">
                <div>
                  <div className="text-sm font-medium text-gray-700">{item.label}</div>
                  <div className="text-xs text-gray-500">Recommended: {item.recommendedSize}</div>
                </div>
                <div className="aspect-[4/3] bg-gray-100 rounded-md overflow-hidden">
                  {homePageImages?.[item.key] ? (
                    <img
                      src={homePageImages[item.key]}
                      alt={item.label}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                      No image uploaded
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2">
                  {homePageImages?.[item.key] ? (
                    <a
                      href={homePageImages[item.key]}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Open current image
                    </a>
                  ) : <span />}
                </div>
                <label className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-md text-sm cursor-pointer hover:bg-gray-200">
                  <FiUpload size={14} />
                  {uploadingField === item.key ? 'Uploading...' : 'Upload Image'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => handleImageUpload(item.key, event)}
                    disabled={uploadingField === item.key}
                  />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold">{formatPrice(stats?.revenue || 0)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FiDollarSign className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold">{stats?.totalOrders || 0}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FiShoppingCart className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Products</p>
                <p className="text-2xl font-bold">{stats?.totalProducts || 0}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <FiPackage className="text-purple-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Customers</p>
                <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <FiUsers className="text-orange-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="font-semibold">Recent Orders</h3>
              <Link to="/admin/orders" className="text-sm text-gray-600 hover:text-gray-900">
                View All
              </Link>
            </div>
            <div className="divide-y">
              {stats?.recentOrders?.map((order: any) => (
                <div key={order._id} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="text-sm text-gray-500">
                      {order.userId?.name || 'Guest'} - {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(order.totalAmount)}</p>
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        order.paymentStatus === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              )) || (
                <p className="p-4 text-gray-500">No recent orders</p>
              )}
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="font-semibold flex items-center gap-2">
                <FiAlertTriangle className="text-yellow-500" />
                Low Stock Alert
              </h3>
              <Link to="/admin/products" className="text-sm text-gray-600 hover:text-gray-900">
                View All
              </Link>
            </div>
            <div className="divide-y">
              {stats?.lowStockProducts?.length ? (
                stats.lowStockProducts.map((product: any, idx: number) => (
                  <div key={idx} className="p-4 flex justify-between items-center">
                    <p className="font-medium">{product.name}</p>
                    <span className="text-red-600 font-medium">{product.stock} left</span>
                  </div>
                ))
              ) : (
                <p className="p-4 text-gray-500">All products are well stocked</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
