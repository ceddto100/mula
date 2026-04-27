import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Shared transform options — used both for upload storage and SDK-generated delivery URLs
const PRODUCT_TRANSFORM = {
  width: 1200,
  height: 1200,
  crop: 'fill' as const,
  gravity: 'auto',
  fetch_format: 'auto',
  quality: 'auto',
};

const HERO_TRANSFORM = {
  width: 2400,
  height: 1200,
  crop: 'fill' as const,
  gravity: 'auto',
  fetch_format: 'auto',
  quality: 'auto',
};

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mula-store',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [PRODUCT_TRANSFORM],
  } as any,
});

export const upload = multer({
  storage,
  limits: {
    // Allow larger product images to be uploaded through the admin UI
    fileSize: 20 * 1024 * 1024, // 20MB per file limit
  },
});

// Separate storage for category hero media — supports images AND videos via resource_type: auto
const heroMediaStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mula-store/category-heroes',
    resource_type: 'auto',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'mov', 'webm', 'avi'],
    transformation: [HERO_TRANSFORM],
  } as any,
});

export const uploadHeroMedia = multer({
  storage: heroMediaStorage,
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB to accommodate video
  },
});

/**
 * Generate a Cloudinary delivery URL for a product image (1200×1200, c_fill, g_auto, f_auto, q_auto).
 * Pass the public_id returned by Cloudinary on upload (req.file.filename).
 */
export function buildProductImageUrl(publicId: string): string {
  return cloudinary.url(publicId, { ...PRODUCT_TRANSFORM, secure: true });
}

/**
 * Generate a Cloudinary delivery URL for a category hero image (2400×1200, c_fill, g_auto, f_auto, q_auto).
 * Pass the public_id returned by Cloudinary on upload (req.file.filename).
 */
export function buildHeroImageUrl(publicId: string): string {
  return cloudinary.url(publicId, { ...HERO_TRANSFORM, secure: true });
}

export { cloudinary };
