import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Credentials stay on the server — never exposed to the frontend
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── Product image upload storage ────────────────────────────────────────────
// Two-step transform: resize to fit within 1200×1200, then apply format/quality
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mula-store',
    use_filename: true,
    unique_filename: true,
    overwrite: true,
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 1200, height: 1200, crop: 'limit' },
      { fetch_format: 'auto', quality: 'auto' },
    ],
  } as any,
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB per file
  },
});

// ─── Category hero media upload storage ──────────────────────────────────────
// Supports images AND videos via resource_type: auto
const heroMediaStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mula-store/category-heroes',
    resource_type: 'auto',
    use_filename: true,
    unique_filename: true,
    overwrite: true,
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'mov', 'webm', 'avi'],
    transformation: [
      { width: 2400, height: 1200, crop: 'limit' },
      { fetch_format: 'auto', quality: 'auto' },
    ],
  } as any,
});

export const uploadHeroMedia = multer({
  storage: heroMediaStorage,
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB for video
  },
});

// ─── SDK-generated delivery URLs (matches the Node.js quickstart pattern) ────

/** 1200×1200 square delivery URL — for ProductCard grid images */
export function buildProductImageUrl(publicId: string): string {
  return cloudinary.url(publicId, {
    transformation: [
      { width: 1200, height: 1200, crop: 'fill', gravity: 'auto' },
      { fetch_format: 'auto', quality: 'auto' },
    ],
    secure: true,
  });
}

/** 2400×1200 wide delivery URL — for CategoryHero banner images */
export function buildHeroImageUrl(publicId: string): string {
  return cloudinary.url(publicId, {
    transformation: [
      { width: 2400, height: 1200, crop: 'fill', gravity: 'auto' },
      { fetch_format: 'auto', quality: 'auto' },
    ],
    secure: true,
  });
}

export { cloudinary };
