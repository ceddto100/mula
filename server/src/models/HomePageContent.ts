import { Schema, model } from 'mongoose';

export interface IHeroContent {
  badge: string;
  headline1: string;
  headline2: string;
  subheading: string;
  ctaPrimary: string;
  ctaSecondary: string;
  scrollLabel: string;
}

export interface ICategoryCard {
  badge?: string;
  title: string;
  description?: string;
  linkText: string;
}

export interface IShopByStyleContent {
  sectionTitle: string;
  men: ICategoryCard;
  women: ICategoryCard;
  accessories: ICategoryCard;
  sale: ICategoryCard;
  collections: ICategoryCard;
}

export interface IFreshDropsContent {
  badge: string;
  sectionTitle: string;
  viewAllLink: string;
}

export interface IBrandStatementContent {
  headlineLine1: string;
  headlineLine2: string;
  description: string;
  ctaButton: string;
}

export interface INewsletterContent {
  title: string;
  description: string;
  emailPlaceholder: string;
  submitButton: string;
}

export interface IHomePageContent {
  hero: IHeroContent;
  shopByStyle: IShopByStyleContent;
  freshDrops: IFreshDropsContent;
  brandStatement: IBrandStatementContent;
  newsletter: INewsletterContent;
}

const heroSchema = new Schema<IHeroContent>(
  {
    badge: { type: String, default: 'NEW COLLECTION 2025' },
    headline1: { type: String, default: 'URBAN' },
    headline2: { type: String, default: 'EVOLUTION' },
    subheading: {
      type: String,
      default:
        'Street-inspired designs meet contemporary fashion. Bold statements for the modern individual.',
    },
    ctaPrimary: { type: String, default: 'SHOP NOW' },
    ctaSecondary: { type: String, default: 'EXPLORE' },
    scrollLabel: { type: String, default: 'SCROLL' },
  },
  { _id: false }
);

const categoryCardSchema = new Schema<ICategoryCard>(
  {
    badge: { type: String, default: '' },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    linkText: { type: String, default: '' },
  },
  { _id: false }
);

const shopByStyleSchema = new Schema<IShopByStyleContent>(
  {
    sectionTitle: { type: String, default: 'SHOP BY STYLE' },
    men: {
      type: categoryCardSchema,
      default: () => ({
        badge: 'TRENDING',
        title: "MEN'S",
        description: 'Bold. Confident. Urban.',
        linkText: 'DISCOVER',
      }),
    },
    women: {
      type: categoryCardSchema,
      default: () => ({
        badge: '',
        title: "WOMEN'S",
        description: 'Fierce & Elegant',
        linkText: 'SHOP',
      }),
    },
    accessories: {
      type: categoryCardSchema,
      default: () => ({
        badge: '',
        title: 'ACCESSORIES',
        description: '',
        linkText: 'VIEW',
      }),
    },
    sale: {
      type: categoryCardSchema,
      default: () => ({
        badge: '',
        title: 'SALE',
        description: 'UP TO 50% OFF',
        linkText: 'SHOP DEALS',
      }),
    },
    collections: {
      type: categoryCardSchema,
      default: () => ({
        badge: '',
        title: 'COLLECTIONS',
        description: 'Curated Style Sets',
        linkText: 'EXPLORE',
      }),
    },
  },
  { _id: false }
);

const freshDropsSchema = new Schema<IFreshDropsContent>(
  {
    badge: { type: String, default: 'NEW ARRIVALS' },
    sectionTitle: { type: String, default: 'FRESH DROPS' },
    viewAllLink: { type: String, default: 'VIEW ALL' },
  },
  { _id: false }
);

const brandStatementSchema = new Schema<IBrandStatementContent>(
  {
    headlineLine1: { type: String, default: 'DEFINE YOUR' },
    headlineLine2: { type: String, default: 'STYLE' },
    description: {
      type: String,
      default:
        "Cualquier isn't just fashion—it's a statement. We create pieces that blend urban edge with contemporary design, giving you the confidence to stand out.",
    },
    ctaButton: { type: String, default: 'OUR STORY' },
  },
  { _id: false }
);

const newsletterSchema = new Schema<INewsletterContent>(
  {
    title: { type: String, default: 'STAY CONNECTED' },
    description: {
      type: String,
      default:
        'Get exclusive access to new drops, special offers, and style inspiration.',
    },
    emailPlaceholder: { type: String, default: 'Enter your email' },
    submitButton: { type: String, default: 'SUBSCRIBE →' },
  },
  { _id: false }
);

const homePageContentSchema = new Schema<IHomePageContent>(
  {
    hero: { type: heroSchema, default: () => ({}) },
    shopByStyle: { type: shopByStyleSchema, default: () => ({}) },
    freshDrops: { type: freshDropsSchema, default: () => ({}) },
    brandStatement: { type: brandStatementSchema, default: () => ({}) },
    newsletter: { type: newsletterSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export default model<IHomePageContent>('HomePageContent', homePageContentSchema);
