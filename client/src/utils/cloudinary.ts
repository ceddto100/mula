/**
 * Cloudinary delivery URL helpers.
 *
 * Every Cloudinary *image* we render is routed through `optimizeCloudinaryImage`,
 * which injects automatic format/quality plus AI-based automatic gravity
 * (`g_auto`). Automatic gravity uses AI to keep the most visually important
 * region of each image in frame when it's cropped to a different aspect ratio.
 *
 * Non-Cloudinary URLs, local assets, and Cloudinary *video* URLs are returned
 * unchanged, so callers can safely pass any media URL.
 */

// Base of a Cloudinary image delivery URL: capture (1) everything up to and
// including `/image/upload/` and (2) the remainder (any existing transforms +
// version + public id). Videos use `/video/upload/` and are intentionally
// excluded — automatic gravity does not apply to them.
const CLOUDINARY_IMAGE_RE =
  /^(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.*)$/;

export type CloudinaryCrop =
  | 'fill'
  | 'lfill'
  | 'fill_pad'
  | 'thumb'
  | 'crop'
  | 'auto'
  | 'fit'
  | 'limit';

export interface CloudinaryImageOptions {
  /** Target width in pixels. */
  width?: number;
  /** Target height in pixels. Pair with `width` so `g_auto` has a crop to make. */
  height?: number;
  /**
   * Target aspect ratio (e.g. `'3:4'` or `1.5`). Preferred over a fixed
   * `height` for responsive `srcSet`s, since the height scales with the width.
   */
  aspectRatio?: string | number;
  /** Crop mode. Defaults to `fill`, which supports automatic gravity. */
  crop?: CloudinaryCrop;
  /**
   * Gravity / focal preference. Defaults to `auto` (AI automatic gravity).
   * Examples: `'auto'`, `'auto:faces'`, `'auto:subject'`.
   */
  gravity?: string;
}

/** True when `url` is a Cloudinary image URL that we can transform. */
export function isCloudinaryImageUrl(url?: string | null): url is string {
  return typeof url === 'string' && CLOUDINARY_IMAGE_RE.test(url);
}

/**
 * Rewrites a Cloudinary image URL to include automatic format, quality, and
 * gravity (`g_auto`). Returns the URL unchanged when it isn't a transformable
 * Cloudinary image (non-Cloudinary host, video, local asset, etc.), and passes
 * through `null`/`undefined` so it's safe to call on optional image fields.
 */
export function optimizeCloudinaryImage(url: string, options?: CloudinaryImageOptions): string;
export function optimizeCloudinaryImage(
  url: string | null | undefined,
  options?: CloudinaryImageOptions,
): string | undefined;
export function optimizeCloudinaryImage(
  url: string | null | undefined,
  options: CloudinaryImageOptions = {},
): string | undefined {
  if (!url) return url ?? undefined;
  const match = url.match(CLOUDINARY_IMAGE_RE);
  if (!match) return url;

  const { width, height, aspectRatio, crop = 'fill', gravity = 'auto' } = options;

  // Drop any transforms that precede the version/public id so we never stack
  // conflicting crops on top of one another.
  const remainder = match[2];
  const versionMatch = remainder.match(/(v\d+\/.+)$/);
  const assetPath = versionMatch ? versionMatch[1] : remainder;

  const transforms = ['f_auto', 'q_auto', `c_${crop}`, `g_${gravity}`];
  if (aspectRatio !== undefined) transforms.push(`ar_${aspectRatio}`);
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);

  return `${match[1]}${transforms.join(',')}/${assetPath}`;
}

/**
 * Builds a responsive `srcSet` string across the given widths, preserving the
 * supplied crop/aspect ratio so automatic gravity applies at every size.
 * Returns `undefined` for non-Cloudinary images (so the caller can omit the
 * `srcSet` attribute entirely).
 */
export function buildCloudinarySrcSet(
  url: string,
  widths: number[],
  options: Omit<CloudinaryImageOptions, 'width'> = {},
): string | undefined {
  if (!isCloudinaryImageUrl(url)) return undefined;
  return widths
    .map((w) => `${optimizeCloudinaryImage(url, { ...options, width: w })} ${w}w`)
    .join(', ');
}
