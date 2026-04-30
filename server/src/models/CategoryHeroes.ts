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
    mediaUrl: '',
    mediaType: 'image',
    title: "THE MEN'S EDIT",
    subtitle: 'Fresh drops. Bold moves. No excuses.',
  },
  women: {
    mediaUrl: '',
    mediaType: 'image',
    title: "THE WOMEN'S SHOP",
    subtitle: 'Trending fits for your soft-life era.',
  },
  denim: {
    mediaUrl: '',
    mediaType: 'image',
    title: 'THE DENIM SHOP',
    subtitle: 'Lived-in. Broken-in. Built different.',
  },
  sale: {
    mediaUrl: '',
    mediaType: 'image',
    title: 'THE SALE',
    subtitle: "Last call. Major steals. Shop before it's gone.",
  },
  hoodies: {
    mediaUrl: '',
    mediaType: 'image',
    title: 'THE HOODIE DROP',
    subtitle: 'Layer up. Stand out.',
  },
  all: {
    mediaUrl: '',
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
