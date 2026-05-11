import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface ProductImageGalleryProps {
  media: Array<{ url: string; mediaType: 'image' | 'video'; alt?: string }>;
  productName: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ media, productName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (media.length === 0) return <div className="aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">No media available</div>;
  const current = media[currentIndex];

  return (
    <div className="space-y-4">
      <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
        {current.mediaType === 'video' ? (
          <video src={current.url} controls className="w-full h-full object-cover" />
        ) : (
          <img src={current.url} alt={current.alt || `${productName} - media ${currentIndex + 1}`} className="w-full h-full object-cover" />
        )}
        {media.length > 1 && <>
          <button onClick={() => setCurrentIndex((p) => (p === 0 ? media.length - 1 : p - 1))} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md"><FiChevronLeft size={24} /></button>
          <button onClick={() => setCurrentIndex((p) => (p === media.length - 1 ? 0 : p + 1))} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md"><FiChevronRight size={24} /></button>
        </>}
      </div>
    </div>
  );
};

export default ProductImageGallery;
