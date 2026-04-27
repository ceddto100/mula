import React, { useEffect, useRef, useState } from 'react';
import { FiUploadCloud, FiVideo, FiImage, FiSave, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { adminApi } from '../../api/admin.api';
import { CategoryHeroConfig, CategoryHeroMedia } from '../../types';

const CATEGORY_TABS = [
  { key: 'men', label: 'Men' },
  { key: 'women', label: 'Women' },
  { key: 'denim', label: 'Denim' },
  { key: 'sale', label: 'Sale' },
  { key: 'hoodies', label: 'Hoodies' },
  { key: 'all', label: 'All' },
] as const;

type CategoryKey = typeof CATEGORY_TABS[number]['key'];

const EMPTY_MEDIA: CategoryHeroMedia = {
  mediaUrl: '',
  mediaType: 'image',
  title: '',
  subtitle: '',
};

const CategoryHeroEditor: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CategoryKey>('men');
  const [heroData, setHeroData] = useState<CategoryHeroConfig | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    adminApi
      .getCategoryHeroes()
      .then(setHeroData)
      .catch(() => toast.error('Failed to load hero config'));
  }, []);

  const current: CategoryHeroMedia = heroData?.[activeTab] ?? EMPTY_MEDIA;

  const updateCurrent = (patch: Partial<CategoryHeroMedia>) => {
    if (!heroData) return;
    setHeroData({ ...heroData, [activeTab]: { ...current, ...patch } });
  };

  const handleMediaFile = async (file: File) => {
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    if (!isVideo && !isImage) {
      toast.error('Only image or video files are supported');
      return;
    }

    try {
      setUploading(true);
      const result = await adminApi.uploadHeroMedia(file);
      updateCurrent({ mediaUrl: result.url, mediaType: result.mediaType });
      toast.success(`${result.mediaType === 'video' ? 'Video' : 'Image'} uploaded`);
    } catch {
      toast.error('Upload failed — check file size and format');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleMediaFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleMediaFile(file);
  };

  const handleSave = async () => {
    if (!heroData) return;
    try {
      setSaving(true);
      const updated = await adminApi.updateCategoryHeroes(heroData);
      setHeroData(updated);
      toast.success('Category heroes saved');
    } catch {
      toast.error('Failed to save — please try again');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-6 border-b">
        <div>
          <h3 className="text-lg font-semibold">Category Hero Manager</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Upload images or videos for each category page hero. Videos loop automatically.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !heroData}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-md disabled:opacity-50 hover:bg-gray-700 transition-colors"
        >
          {saving ? <FiLoader size={15} className="animate-spin" /> : <FiSave size={15} />}
          {saving ? 'Saving…' : 'Save All Changes'}
        </button>
      </div>

      {/* Category Tab strip */}
      <div className="flex border-b overflow-x-auto scrollbar-hide">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-shrink-0 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Editor panel */}
      <div className="p-6 space-y-6">
        {!heroData ? (
          <div className="animate-pulse space-y-4">
            <div className="aspect-[16/7] bg-gray-200 rounded-lg" />
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded" />
          </div>
        ) : (
          <>
            {/* Media preview + upload zone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hero Media
                {current.mediaType === 'video' && (
                  <span className="ml-2 inline-flex items-center gap-1 text-xs text-purple-600 font-normal">
                    <FiVideo size={12} /> Video
                  </span>
                )}
                {current.mediaType === 'image' && current.mediaUrl && (
                  <span className="ml-2 inline-flex items-center gap-1 text-xs text-blue-600 font-normal">
                    <FiImage size={12} /> Image
                  </span>
                )}
              </label>

              {/* Preview area */}
              <div
                className={`relative aspect-[16/7] rounded-lg overflow-hidden border-2 border-dashed transition-colors ${
                  dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50'
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                {current.mediaUrl ? (
                  current.mediaType === 'video' ? (
                    <video
                      key={current.mediaUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    >
                      <source src={current.mediaUrl} />
                    </video>
                  ) : (
                    <img
                      src={current.mediaUrl}
                      alt="Hero preview"
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                    <FiUploadCloud size={40} className="mb-2" />
                    <p className="text-sm">No media uploaded</p>
                  </div>
                )}

                {/* Drag overlay */}
                {dragOver && (
                  <div className="absolute inset-0 flex items-center justify-center bg-blue-500/20 backdrop-blur-sm">
                    <p className="text-blue-700 font-semibold text-lg">Drop to upload</p>
                  </div>
                )}

                {/* Upload progress overlay */}
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <div className="text-center text-white">
                      <FiLoader size={32} className="animate-spin mx-auto mb-2" />
                      <p className="text-sm font-medium">Uploading to Cloudinary…</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Upload controls */}
              <div className="flex items-center gap-3 mt-3">
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md text-sm cursor-pointer hover:bg-gray-200 transition-colors">
                  <FiUploadCloud size={15} />
                  {uploading ? 'Uploading…' : 'Upload Image or Video'}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={handleFileInput}
                    disabled={uploading}
                  />
                </label>
                <span className="text-xs text-gray-400">
                  Images: JPG, PNG, WebP · Videos: MP4, MOV, WebM · Max 200 MB
                </span>
              </div>
            </div>

            {/* Title input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Hero Title
              </label>
              <input
                type="text"
                value={current.title}
                onChange={(e) => updateCurrent({ title: e.target.value })}
                placeholder="e.g. THE DENIM SHOP"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 font-medium tracking-wide uppercase"
              />
              <p className="text-xs text-gray-400 mt-1">
                Displayed in Bebas Neue — use ALL CAPS for best results
              </p>
            </div>

            {/* Subtitle input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Subtitle
              </label>
              <input
                type="text"
                value={current.subtitle}
                onChange={(e) => updateCurrent({ subtitle: e.target.value })}
                placeholder="e.g. Lived-in. Broken-in. Built different."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            {/* Live preview chip */}
            <div className="p-4 bg-gray-900 rounded-lg">
              <p className="text-gray-500 text-xs mb-3 tracking-widest uppercase">Live Preview</p>
              <div className="font-display text-white text-4xl tracking-widest leading-none mb-1">
                {current.title || 'HERO TITLE'}
              </div>
              <div className="font-grotesk text-gray-400 text-sm">
                {current.subtitle || 'Your subtitle goes here.'}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryHeroEditor;
