const WISHLIST_KEY = 'wishlist_product_ids';

const readWishlist = (): string[] => {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
};

const writeWishlist = (items: string[]): void => {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify([...new Set(items)]));
};

export const wishlistStore = {
  getAll: (): string[] => readWishlist(),
  has: (productId: string): boolean => readWishlist().includes(productId),
  toggle: (productId: string): boolean => {
    const current = readWishlist();
    const exists = current.includes(productId);
    const next = exists ? current.filter((id) => id !== productId) : [...current, productId];
    writeWishlist(next);
    return !exists;
  },
  remove: (productId: string): void => {
    writeWishlist(readWishlist().filter((id) => id !== productId));
  },
};
