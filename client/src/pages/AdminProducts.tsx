import React, { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiX, FiImage, FiTrash2, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import AdminLayout from '../components/admin/AdminLayout';
import { adminApi } from '../api/admin.api';
import { Product, CreateProductData, ProductVariant, ProductOption, ProductImage } from '../types';
import { formatPrice } from '../utils/formatters';
import {
  PRODUCT_TYPES,
  COLOR_FAMILIES,
  GENDERS,
  SIZES,
  COLORS,
  PRODUCT_STATUSES,
  INVENTORY_POLICIES,
  SEO_CONSTRAINTS,
  slugify,
  generateVariantCombinations,
  generateSKU,
  generateVariantTitle,
} from '../utils/constants';
import toast from 'react-hot-toast';

// Default variant template
const createDefaultVariant = (skuPrefix: string = 'SKU'): ProductVariant => ({
  sku: `${skuPrefix}-001`,
  title: 'Default',
  price: 0,
  compareAtPrice: null,
  inventoryQuantity: 0,
  inventoryPolicy: 'deny',
  options: [],
  barcode: null,
});

// Form state type
interface ProductFormState {
  title: string;
  handle: string;
  status: 'draft' | 'active' | 'archived';
  productType: string;
  descriptionHtml: string;
  images: ProductImage[];
  variants: ProductVariant[];
  options: ProductOption[];
  seoTitle: string;
  seoDescription: string;
  tags: string[];
  collections: string[];
  gender: 'men' | 'women' | 'unisex' | null;
  sizes: string[];
  materials: string[];
  colorFamily: string[];
  customColors: string[];
  requiresShipping: boolean;
}

const initialFormState: ProductFormState = {
  title: '',
  handle: '',
  status: 'draft',
  productType: '',
  descriptionHtml: '',
  images: [],
  variants: [createDefaultVariant()],
  options: [],
  seoTitle: '',
  seoDescription: '',
  tags: [],
  collections: [],
  gender: null,
  sizes: [],
  materials: [],
  colorFamily: [],
  customColors: [],
  requiresShipping: true,
};

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormState>(initialFormState);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    media: true,
    pricing: true,
    options: false,
    organization: true,
    seo: false,
  });

  // Tag/collection inputs
  const [tagInput, setTagInput] = useState('');
  const [collectionInput, setCollectionInput] = useState('');
  const [materialInput, setMaterialInput] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const fetchProducts = async () => {
    try {
      const data = await adminApi.getProducts();
      setProducts(data.products);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = useCallback(() => {
    if (hasUnsavedChanges && !confirm('You have unsaved changes. Are you sure you want to close?')) {
      return;
    }
    setFormData(initialFormState);
    setEditingProduct(null);
    setShowForm(false);
    setHasUnsavedChanges(false);
    setTagInput('');
    setCollectionInput('');
    setMaterialInput('');
  }, [hasUnsavedChanges]);

  const handleEdit = (product: Product) => {
    setFormData({
      title: product.title,
      handle: product.handle,
      status: product.status,
      productType: product.productType || '',
      descriptionHtml: product.descriptionHtml || '',
      images: product.images || [],
      variants: product.variants.length > 0 ? product.variants : [createDefaultVariant()],
      options: product.options || [],
      seoTitle: product.seoTitle || '',
      seoDescription: product.seoDescription || '',
      tags: product.tags || [],
      collections: product.collections || [],
      gender: product.gender,
      sizes: (product as any).sizes || [],
      materials: product.materials || [],
      colorFamily: product.colorFamily || [],
      customColors: (product as any).customColors || [],
      requiresShipping: product.requiresShipping ?? true,
    });
    setEditingProduct(product);
    setShowForm(true);
    setHasUnsavedChanges(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to archive this product?')) return;
    try {
      await adminApi.deleteProduct(id);
      setProducts(products.filter((p) => p._id !== id));
      toast.success('Product archived');
    } catch {
      toast.error('Failed to archive product');
    }
  };

  const updateFormField = <K extends keyof ProductFormState>(field: K, value: ProductFormState[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
    if (field === 'title' && !editingProduct) {
      setFormData((prev) => ({ ...prev, handle: slugify(value as string) }));
    }
  };

  // Image handling
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    try {
      const fileArray = Array.from(files);
      const urls = await adminApi.uploadImages(fileArray);
      const newImages: ProductImage[] = urls.map((url, idx) => ({
        url,
        alt: '',
        position: formData.images.length + idx,
      }));
      updateFormField('images', [...formData.images, ...newImages]);
      toast.success('Images uploaded');
    } catch {
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const updateImageAlt = (index: number, alt: string) => {
    const updated = [...formData.images];
    updated[index] = { ...updated[index], alt };
    updateFormField('images', updated);
  };

  const removeImage = (index: number) => {
    updateFormField('images', formData.images.filter((_, i) => i !== index));
  };

  // Variant handling
  const updateVariant = (index: number, field: keyof ProductVariant, value: unknown) => {
    const updated = [...formData.variants];
    updated[index] = { ...updated[index], [field]: value };
    updateFormField('variants', updated);
  };

  const addVariant = () => {
    const newVariant = createDefaultVariant();
    newVariant.sku = `SKU-${String(formData.variants.length + 1).padStart(3, '0')}`;
    updateFormField('variants', [...formData.variants, newVariant]);
  };

  const removeVariant = (index: number) => {
    if (formData.variants.length <= 1) {
      toast.error('Product must have at least one variant');
      return;
    }
    updateFormField('variants', formData.variants.filter((_, i) => i !== index));
  };

  // Option handling
  const addOption = () => {
    updateFormField('options', [...formData.options, { name: '', values: [] }]);
  };

  const updateOption = (index: number, field: 'name' | 'values', value: string | string[]) => {
    const updated = [...formData.options];
    updated[index] = { ...updated[index], [field]: value };
    updateFormField('options', updated);
  };

  const removeOption = (index: number) => {
    updateFormField('options', formData.options.filter((_, i) => i !== index));
  };

  const generateVariantsFromOptions = () => {
    if (formData.options.length === 0 || formData.options.some(o => !o.name || o.values.length === 0)) {
      toast.error('Please define all options with values first');
      return;
    }
    const combinations = generateVariantCombinations(formData.options);
    const basePrice = formData.variants[0]?.price || 0;
    const skuPrefix = slugify(formData.title).toUpperCase().slice(0, 6) || 'SKU';
    const newVariants: ProductVariant[] = combinations.map((optionCombo, idx) => ({
      sku: generateSKU(skuPrefix, optionCombo, idx),
      title: generateVariantTitle(optionCombo),
      price: basePrice,
      compareAtPrice: null,
      inventoryQuantity: 0,
      inventoryPolicy: 'deny',
      options: optionCombo,
      barcode: null,
    }));
    updateFormField('variants', newVariants);
    toast.success(`Generated ${newVariants.length} variants`);
  };

  // Tags & Collections
  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      updateFormField('tags', [...formData.tags, tag]);
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    updateFormField('tags', formData.tags.filter((t) => t !== tag));
  };

  const addCollection = () => {
    const collection = collectionInput.trim();
    if (collection && !formData.collections.includes(collection)) {
      updateFormField('collections', [...formData.collections, collection]);
    }
    setCollectionInput('');
  };

  const removeCollection = (collection: string) => {
    updateFormField('collections', formData.collections.filter((c) => c !== collection));
  };

  const addMaterial = () => {
    const material = materialInput.trim();
    if (material && !formData.materials.includes(material)) {
      updateFormField('materials', [...formData.materials, material]);
    }
    setMaterialInput('');
  };

  const removeMaterial = (material: string) => {
    updateFormField('materials', formData.materials.filter((m) => m !== material));
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error('Product title is required');
      return;
    }
    if (formData.variants.length === 0 || formData.variants.some(v => !v.sku || v.price < 0)) {
      toast.error('Each variant needs a SKU and valid price');
      return;
    }
    setSubmitting(true);
    try {
      const productData: CreateProductData = {
        title: formData.title,
        handle: formData.handle || undefined,
        status: formData.status,
        productType: formData.productType || undefined,
        descriptionHtml: formData.descriptionHtml || undefined,
        images: formData.images.length > 0 ? formData.images : undefined,
        variants: formData.variants,
        options: formData.options.length > 0 ? formData.options : undefined,
        seoTitle: formData.seoTitle || undefined,
        seoDescription: formData.seoDescription || undefined,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
        collections: formData.collections.length > 0 ? formData.collections : undefined,
        gender: formData.gender,
        materials: formData.materials.length > 0 ? formData.materials : undefined,
        colorFamily: formData.colorFamily.length > 0 ? formData.colorFamily : undefined,
        requiresShipping: formData.requiresShipping,
        ...(formData.sizes.length > 0 && { sizes: formData.sizes }),
        ...(formData.customColors.length > 0 && { customColors: formData.customColors }),
      };
      if (editingProduct) {
        const updated = await adminApi.updateProduct(editingProduct._id, productData);
        setProducts(products.map((p) => (p._id === updated._id ? updated : p)));
        toast.success('Product updated');
      } else {
        const created = await adminApi.createProduct(productData);
        setProducts([created, ...products]);
        toast.success('Product created');
      }
      setHasUnsavedChanges(false);
      resetForm();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const SectionHeader: React.FC<{
    title: string;
    section: keyof typeof expandedSections;
    expanded: boolean;
    description?: string;
  }> = ({ title, section, expanded, description }) => (
    <button
      type="button"
      onClick={() => toggleSection(section)}
      className="w-full flex items-start justify-between gap-3 text-left"
    >
      <div>
        <p className="text-base font-semibold text-gray-900">{title}</p>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <span className="mt-1 text-gray-500">{expanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}</span>
    </button>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Products</h2>
          <button onClick={() => { setFormData(initialFormState); setEditingProduct(null); setShowForm(true); }} className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800">
            <FiPlus size={20} /> Add Product
          </button>
        </div>

        {/* Product List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inventory</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}><td colSpan={6} className="px-6 py-4"><div className="h-12 bg-gray-200 animate-pulse rounded" /></td></tr>
                  ))
                ) : products.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">No products found</td></tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                            {product.images[0]?.url ? (
                              <img src={product.images[0].url} alt={product.images[0].alt || product.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400"><FiImage size={20} /></div>
                            )}
                          </div>
                          <div>
                            <span className="font-medium block">{product.title}</span>
                            <span className="text-sm text-gray-500">/{product.handle}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{product.productType || '-'}</td>
                      <td className="px-6 py-4">
                        {product.priceRange ? (
                          product.priceRange.min === product.priceRange.max ? formatPrice(product.priceRange.min) : `${formatPrice(product.priceRange.min)} - ${formatPrice(product.priceRange.max)}`
                        ) : formatPrice(product.variants[0]?.price || 0)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={product.totalInventory !== undefined && product.totalInventory < 10 ? 'text-red-600' : ''}>
                          {product.totalInventory ?? product.variants.reduce((sum, v) => sum + v.inventoryQuantity, 0)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${product.status === 'active' ? 'bg-green-100 text-green-800' : product.status === 'draft' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'}`}>
                          {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleEdit(product)} className="text-gray-600 hover:text-gray-900 mr-4">Edit</button>
                        <button onClick={() => handleDelete(product._id)} className="text-red-500 hover:text-red-700"><FiTrash2 size={18} /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="p-4"><div className="h-24 bg-gray-200 animate-pulse rounded" /></div>
              ))
            ) : products.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No products found</div>
            ) : (
              products.map((product) => (
                <div key={product._id} className="p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      {product.images[0]?.url ? (
                        <img src={product.images[0].url} alt={product.images[0].alt || product.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400"><FiImage size={20} /></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{product.title}</h3>
                      <p className="text-xs text-gray-500 truncate">/{product.handle}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${product.status === 'active' ? 'bg-green-100 text-green-800' : product.status === 'draft' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'}`}>
                          {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-gray-500">Price</p>
                      <p className="font-medium">
                        {product.priceRange ? (
                          product.priceRange.min === product.priceRange.max ? formatPrice(product.priceRange.min) : `${formatPrice(product.priceRange.min)}-${formatPrice(product.priceRange.max)}`
                        ) : formatPrice(product.variants[0]?.price || 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Inventory</p>
                      <p className={`font-medium ${product.totalInventory !== undefined && product.totalInventory < 10 ? 'text-red-600' : ''}`}>
                        {product.totalInventory ?? product.variants.reduce((sum, v) => sum + v.inventoryQuantity, 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Type</p>
                      <p className="font-medium truncate">{product.productType || '-'}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2 border-t">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-md text-sm hover:bg-gray-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-md text-sm hover:bg-red-100"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Product Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-xl w-full max-w-5xl my-8 shadow-xl">
              <div className="p-6 border-b flex justify-between items-start sticky top-0 bg-white z-10 rounded-t-xl">
                <div>
                  <h3 className="text-lg font-semibold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                  <p className="text-sm text-gray-500">Keep details consistent before saving.</p>
                </div>
                <button onClick={resetForm} className="text-gray-500 hover:text-gray-700"><FiX size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-gray-50">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="border border-gray-200 rounded-xl bg-white p-5 shadow-sm space-y-4">
                      <div className="space-y-1">
                        <p className="text-base font-semibold text-gray-900">Product information</p>
                        <p className="text-sm text-gray-500">Title, handle, and description customers will see.</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                          <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => updateFormField('title', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-gray-50"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Handle (URL)</label>
                          <div className="flex items-center rounded-md border border-gray-300 bg-gray-50 px-3 py-2 focus-within:ring-2 focus-within:ring-gray-900 focus-within:border-transparent">
                            <span className="text-gray-500 text-sm mr-1">/products/</span>
                            <input
                              type="text"
                              value={formData.handle}
                              onChange={(e) => updateFormField('handle', slugify(e.target.value))}
                              className="flex-1 bg-transparent focus:outline-none"
                              placeholder="auto-generated"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          value={formData.descriptionHtml}
                          onChange={(e) => updateFormField('descriptionHtml', e.target.value)}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-gray-50"
                          placeholder="Product description (HTML supported)"
                        />
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-xl bg-white p-5 shadow-sm">
                      <SectionHeader
                        title="Media"
                        description="Upload images to showcase your product."
                        section="media"
                        expanded={expandedSections.media}
                      />
                      {expandedSections.media && (
                        <div className="pt-4 space-y-3">
                          <label className="flex items-center justify-between text-sm text-gray-600">
                            <span>Images</span>
                            {uploading && <span className="text-xs text-gray-500">Uploading...</span>}
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            disabled={uploading}
                            className="mb-2 text-sm"
                          />
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {formData.images.map((img, idx) => (
                              <div key={idx} className="relative group">
                                <img src={img.url} alt={img.alt || ''} className="w-full h-32 object-cover rounded-lg border" />
                                <button
                                  type="button"
                                  onClick={() => removeImage(idx)}
                                  className="absolute top-2 right-2 bg-white text-red-600 rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <FiX size={14} />
                                </button>
                                <input
                                  type="text"
                                  value={img.alt || ''}
                                  onChange={(e) => updateImageAlt(idx, e.target.value)}
                                  placeholder="Alt text"
                                  className="mt-2 w-full px-2 py-1 text-xs border rounded"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="border border-gray-200 rounded-xl bg-white p-5 shadow-sm">
                      <SectionHeader
                        title="Pricing & Inventory"
                        description="Set prices, SKUs, and stock for each variant."
                        section="pricing"
                        expanded={expandedSections.pricing}
                      />
                      {expandedSections.pricing && (
                        <div className="pt-4 space-y-4">
                          {formData.variants.map((variant, idx) => (
                            <div key={idx} className="border rounded-lg p-4 space-y-3 bg-gray-50">
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-sm text-gray-900">{variant.title || `Variant ${idx + 1}`}</span>
                                {formData.variants.length > 1 && (
                                  <button type="button" onClick={() => removeVariant(idx)} className="text-red-500 hover:text-red-700">
                                    <FiTrash2 size={16} />
                                  </button>
                                )}
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">SKU *</label>
                                  <input
                                    type="text"
                                    value={variant.sku}
                                    onChange={(e) => updateVariant(idx, 'sku', e.target.value)}
                                    className="w-full px-3 py-2 border rounded text-sm bg-white"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">Price *</label>
                                  <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={variant.price}
                                    onChange={(e) => updateVariant(idx, 'price', parseFloat(e.target.value) || 0)}
                                    className="w-full px-3 py-2 border rounded text-sm bg-white"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">Compare at</label>
                                  <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={variant.compareAtPrice || ''}
                                    onChange={(e) => updateVariant(idx, 'compareAtPrice', e.target.value ? parseFloat(e.target.value) : null)}
                                    className="w-full px-3 py-2 border rounded text-sm bg-white"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">Quantity</label>
                                  <input
                                    type="number"
                                    min="0"
                                    value={variant.inventoryQuantity}
                                    onChange={(e) => updateVariant(idx, 'inventoryQuantity', parseInt(e.target.value) || 0)}
                                    className="w-full px-3 py-2 border rounded text-sm bg-white"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">Barcode</label>
                                  <input
                                    type="text"
                                    value={variant.barcode || ''}
                                    onChange={(e) => updateVariant(idx, 'barcode', e.target.value || null)}
                                    className="w-full px-3 py-2 border rounded text-sm bg-white"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">Inventory Policy</label>
                                  <select
                                    value={variant.inventoryPolicy}
                                    onChange={(e) => updateVariant(idx, 'inventoryPolicy', e.target.value)}
                                    className="w-full px-3 py-2 border rounded text-sm bg-white"
                                  >
                                    {INVENTORY_POLICIES.map((policy) => (
                                      <option key={policy.value} value={policy.value}>{policy.label}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                          ))}
                          <button type="button" onClick={addVariant} className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
                            <FiPlus size={16} /> Add variant manually
                          </button>
                        </div>
                      )}
                    </div>

                  </div>

                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-xl bg-white p-5 shadow-sm">
                      <SectionHeader
                        title="Organization"
                        description="Categorize and enrich product metadata."
                        section="organization"
                        expanded={expandedSections.organization}
                      />
                      {expandedSections.organization && (
                        <div className="pt-4 space-y-5">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
                              <select
                                value={formData.productType}
                                onChange={(e) => updateFormField('productType', e.target.value)}
                                className="w-full px-4 py-2 border rounded-md bg-gray-50"
                              >
                                <option value="">Select type</option>
                                {PRODUCT_TYPES.map((type) => (
                                  <option key={type} value={type}>{type}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                              <select
                                value={formData.gender || ''}
                                onChange={(e) => updateFormField('gender', e.target.value ? e.target.value as 'men' | 'women' | 'unisex' : null)}
                                className="w-full px-4 py-2 border rounded-md bg-gray-50"
                              >
                                <option value="">Select gender</option>
                                {GENDERS.map((g) => (
                                  <option key={g.value} value={g.value}>{g.label}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Available Sizes</label>
                            <div className="flex flex-wrap gap-2">
                              {SIZES.map((size) => (
                                <button
                                  key={size}
                                  type="button"
                                  onClick={() => {
                                    const updated = formData.sizes.includes(size) ? formData.sizes.filter((s) => s !== size) : [...formData.sizes, size];
                                    updateFormField('sizes', updated);
                                  }}
                                  className={`px-4 py-2 border rounded-md text-sm font-medium transition ${formData.sizes.includes(size) ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-300 hover:border-gray-400'}`}
                                >
                                  {size}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Color Family</label>
                            <div className="flex flex-wrap gap-3">
                              {COLORS.map((color) => (
                                <button
                                  key={color.name}
                                  type="button"
                                  onClick={() => {
                                    const updated = formData.colorFamily.includes(color.name) ? formData.colorFamily.filter((c) => c !== color.name) : [...formData.colorFamily, color.name];
                                    updateFormField('colorFamily', updated);
                                  }}
                                  className={`flex items-center gap-2 px-3 py-2 border rounded-md transition ${formData.colorFamily.includes(color.name) ? 'border-gray-900 ring-2 ring-gray-900' : 'border-gray-300 hover:border-gray-400'}`}
                                  title={color.name}
                                >
                                  <div
                                    className="w-6 h-6 rounded-full border-2 border-gray-300"
                                    style={{ backgroundColor: color.value }}
                                  />
                                  <span className="text-sm">{color.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Custom Colors</label>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {formData.customColors.map((customColor, idx) => (
                                <div key={idx} className="flex items-center gap-2 px-3 py-2 border rounded-md bg-gray-50">
                                  <div
                                    className="w-6 h-6 rounded-full border-2 border-gray-300"
                                    style={{ backgroundColor: customColor }}
                                  />
                                  <span className="text-sm font-mono">{customColor}</span>
                                  <button
                                    type="button"
                                    onClick={() => updateFormField('customColors', formData.customColors.filter((_, i) => i !== idx))}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <FiX size={16} />
                                  </button>
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-2 items-center">
                              <input
                                type="color"
                                id="customColorPicker"
                                className="h-10 w-20 border rounded cursor-pointer"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const colorPicker = document.getElementById('customColorPicker') as HTMLInputElement;
                                  const newColor = colorPicker.value;
                                  if (!formData.customColors.includes(newColor)) {
                                    updateFormField('customColors', [...formData.customColors, newColor]);
                                  }
                                }}
                                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 text-sm"
                              >
                                Add Custom Color
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Materials</label>
                            <div className="flex gap-2 flex-wrap">
                              {formData.materials.map((material) => (
                                <span key={material} className="bg-emerald-50 text-emerald-800 px-2 py-1 rounded text-sm flex items-center gap-1 border border-emerald-100">
                                  {material}
                                  <button type="button" onClick={() => removeMaterial(material)} className="text-emerald-700 hover:text-red-500">
                                    <FiX size={14} />
                                  </button>
                                </span>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={materialInput}
                                onChange={(e) => setMaterialInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addMaterial();
                                  }
                                }}
                                className="flex-1 px-4 py-2 border rounded-md bg-gray-50"
                                placeholder="Add material and press Enter"
                              />
                              <button type="button" onClick={addMaterial} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
                                Add
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Tags</label>
                            <div className="flex gap-2 mb-2 flex-wrap">
                              {formData.tags.map((tag) => (
                                <span key={tag} className="bg-gray-100 px-2 py-1 rounded text-sm flex items-center gap-1 border border-gray-200">
                                  {tag}
                                  <button type="button" onClick={() => removeTag(tag)} className="text-gray-500 hover:text-red-500">
                                    <FiX size={14} />
                                  </button>
                                </span>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addTag();
                                  }
                                }}
                                className="flex-1 px-4 py-2 border rounded-md bg-gray-50"
                                placeholder="Add tag and press Enter"
                              />
                              <button type="button" onClick={addTag} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Add</button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Collections</label>
                            <div className="flex gap-2 mb-2 flex-wrap">
                              {formData.collections.map((col) => (
                                <span key={col} className="bg-blue-50 px-2 py-1 rounded text-sm flex items-center gap-1 border border-blue-100">
                                  {col}
                                  <button type="button" onClick={() => removeCollection(col)} className="text-blue-600 hover:text-red-500">
                                    <FiX size={14} />
                                  </button>
                                </span>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={collectionInput}
                                onChange={(e) => setCollectionInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addCollection();
                                  }
                                }}
                                className="flex-1 px-4 py-2 border rounded-md bg-gray-50"
                                placeholder="Add collection"
                              />
                              <button type="button" onClick={addCollection} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
                                Add
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="border border-gray-200 rounded-xl bg-white p-5 shadow-sm">
                      <SectionHeader
                        title="Search Engine Listing (SEO)"
                        description="Control how your product appears in search results."
                        section="seo"
                        expanded={expandedSections.seo}
                      />
                      {expandedSections.seo && (
                        <div className="pt-4 space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title ({formData.seoTitle.length}/{SEO_CONSTRAINTS.titleMaxLength})</label>
                            <input
                              type="text"
                              value={formData.seoTitle}
                              onChange={(e) => updateFormField('seoTitle', e.target.value.slice(0, SEO_CONSTRAINTS.titleMaxLength))}
                              className="w-full px-4 py-2 border rounded-md bg-gray-50"
                              placeholder={formData.title || 'Page title for search engines'}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description ({formData.seoDescription.length}/{SEO_CONSTRAINTS.descriptionMaxLength})</label>
                            <textarea
                              value={formData.seoDescription}
                              onChange={(e) => updateFormField('seoDescription', e.target.value.slice(0, SEO_CONSTRAINTS.descriptionMaxLength))}
                              rows={3}
                              className="w-full px-4 py-2 border rounded-md bg-gray-50"
                              placeholder="Brief description for search results"
                            />
                          </div>
                          <div className="bg-gray-50 p-4 rounded border border-dashed border-gray-200">
                            <p className="text-sm text-gray-500 mb-2">Search engine preview:</p>
                            <div className="text-blue-600 text-lg">{formData.seoTitle || formData.title || 'Product Title'}</div>
                            <div className="text-green-700 text-sm">/products/{formData.handle || 'product-handle'}</div>
                            <div className="text-gray-600 text-sm mt-1">{formData.seoDescription || 'Product description will appear here...'}</div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="border border-gray-200 rounded-xl bg-white p-5 shadow-sm lg:sticky lg:top-4">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                          <select
                            value={formData.status}
                            onChange={(e) => updateFormField('status', e.target.value as 'draft' | 'active' | 'archived')}
                            className="w-full px-4 py-2 border rounded-md bg-gray-50"
                          >
                            {PRODUCT_STATUSES.map((s) => (
                              <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex gap-3 justify-end">
                          <button type="button" onClick={resetForm} className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
                          >
                            {submitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
