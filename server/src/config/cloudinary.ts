import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mula-store',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 1200, height: 1200, crop: 'fill', gravity: 'auto', fetch_format: 'auto', quality: 'auto' },
    ],
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
    transformation: [
      { width: 2400, height: 1200, crop: 'fill', gravity: 'auto', fetch_format: 'auto', quality: 'auto' },
    ],
  } as any,
});

export const uploadHeroMedia = multer({
  storage: heroMediaStorage,
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB to accommodate video
  },
});

export { cloudinary };
