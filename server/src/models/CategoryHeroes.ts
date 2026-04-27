import { Schema, model } from 'mongoose';

export interface ICategoryHeroMedia {
  mediaUrl: string;
  mediaType: 'image' | 'video';
  title: string;
  subtitle: string;
}

export interface ICategoryHeroes {
  men: ICategoryHeroMedia;
  women: ICategoryHeroMedia;
  denim: ICategoryHeroMedia;
  sale: ICategoryHeroMedia;
  hoodies: ICategoryHeroMedia;
  all: ICategoryHeroMedia;
}

export const DEFAULT_CATEGORY_HEROES: ICategoryHeroes = {
  men: {
    mediaUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=80',
    mediaType: 'image',
    title: "THE MEN'S EDIT",
    subtitle: 'Fresh drops. Bold moves. No excuses.',
  },
  women: {
    mediaUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1920&q=80',
    mediaType: 'image',
    title: "THE WOMEN'S SHOP",
    subtitle: 'Trending fits for your soft-life era.',
  },
  denim: {
    mediaUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1920&q=80',
    mediaType: 'image',
    title: 'THE DENIM SHOP',
    subtitle: 'Lived-in. Broken-in. Built different.',
  },
  sale: {
    mediaUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1920&q=80',
    mediaType: 'image',
    title: 'THE SALE',
    subtitle: "Last call. Major steals. Shop before it's gone.",
  },
  hoodies: {
    mediaUrl: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?auto=format&fit=crop&w=1920&q=80',
    mediaType: 'image',
    title: 'THE HOODIE DROP',
    subtitle: 'Layer up. Stand out.',
  },
  all: {
    mediaUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1920&q=80',
    mediaType: 'image',
    title: 'ALL PRODUCTS',
    subtitle: 'The full collection. Nothing held back.',
  },
};

const heroMediaSchema = new Schema<ICategoryHeroMedia>(
  {
    mediaUrl: { type: String, required: true },
    mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
  },
  { _id: false }
);

const categoryHeroesSchema = new Schema<ICategoryHeroes>(
  {
    men: { type: heroMediaSchema, default: () => ({ ...DEFAULT_CATEGORY_HEROES.men }) },
    women: { type: heroMediaSchema, default: () => ({ ...DEFAULT_CATEGORY_HEROES.women }) },
    denim: { type: heroMediaSchema, default: () => ({ ...DEFAULT_CATEGORY_HEROES.denim }) },
    sale: { type: heroMediaSchema, default: () => ({ ...DEFAULT_CATEGORY_HEROES.sale }) },
    hoodies: { type: heroMediaSchema, default: () => ({ ...DEFAULT_CATEGORY_HEROES.hoodies }) },
    all: { type: heroMediaSchema, default: () => ({ ...DEFAULT_CATEGORY_HEROES.all }) },
  },
  { timestamps: true }
);

export default model<ICategoryHeroes>('CategoryHeroes', categoryHeroesSchema);
