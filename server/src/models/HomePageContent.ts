import { Schema, model } from 'mongoose';

export interface IAnnouncementBarContent {
  enabled: boolean;
  text: string;
}

export interface IHeroContent {
  badge: string;
  headline1: string;
  headline2: string;
  subheading: string;
  ctaPrimary: string;
  ctaSecondary: string;
  scrollLabel: string;
}

export interface IPromoTile {
  title: string;
  linkText: string;
}

export interface IPromoSplitContent {
  left: IPromoTile;
  right: IPromoTile;
}

export interface IServiceItem {
  title: string;
  linkText: string;
}

export interface IServicesContent {
  sectionTitle: string;
  items: IServiceItem[];
}

export interface ICategoryCard {
  badge?: string;
  title: string;
  description?: string;
  linkText: string;
}

export interface IShopByStyleContent {
  sectionTitle: string;
  panels: ICategoryCard[];
  men: ICategoryCard;
  women: ICategoryCard;
  accessories: ICategoryCard;
  sale: ICategoryCard;
  collections: ICategoryCard;
  womenPants: ICategoryCard;
  womenShirts: ICategoryCard;
  menPants: ICategoryCard;
  menShirts: ICategoryCard;
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

export interface IBrandThemeContent {
  accentColor: string;
  heroOverlayEnabled: boolean;
  heroOverlayColor: string;
  headingFont: string;
}

export interface IHomePageContent {
  announcementBar: IAnnouncementBarContent;
  hero: IHeroContent;
  shopByStyle: IShopByStyleContent;
  promoSplit: IPromoSplitContent;
  freshDrops: IFreshDropsContent;
  brandStatement: IBrandStatementContent;
  services: IServicesContent;
  newsletter: INewsletterContent;
  brandTheme: IBrandThemeContent;
}

const announcementBarSchema = new Schema<IAnnouncementBarContent>(
  {
    enabled: { type: Boolean, default: true },
    text: { type: String, default: 'COMPLIMENTARY SHIPPING ON ALL ORDERS' },
  },
  { _id: false }
);

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
    panels: {
      type: [categoryCardSchema],
      default: () => ([
        { badge: 'TRENDING', title: "MEN'S", description: 'Bold. Confident. Urban.', linkText: 'DISCOVER' },
        { badge: '', title: "WOMEN'S", description: 'Fierce & Elegant', linkText: 'SHOP' },
        { badge: '', title: 'ACCESSORIES', description: '', linkText: 'VIEW' },
        { badge: '', title: 'SALE', description: 'UP TO 50% OFF', linkText: 'SHOP DEALS' },
        { badge: '', title: 'COLLECTIONS', description: 'Curated Style Sets', linkText: 'EXPLORE' },
      ]),
    },
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
    womenPants: {
      type: categoryCardSchema,
      default: () => ({
        badge: '',
        title: "WOMEN'S PANTS",
        description: '',
        linkText: 'SHOP',
      }),
    },
    womenShirts: {
      type: categoryCardSchema,
      default: () => ({
        badge: '',
        title: "WOMEN'S SHIRTS",
        description: '',
        linkText: 'SHOP',
      }),
    },
    menPants: {
      type: categoryCardSchema,
      default: () => ({
        badge: '',
        title: "MEN'S PANTS",
        description: '',
        linkText: 'SHOP',
      }),
    },
    menShirts: {
      type: categoryCardSchema,
      default: () => ({
        badge: '',
        title: "MEN'S SHIRTS",
        description: '',
        linkText: 'SHOP',
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

const brandThemeSchema = new Schema<IBrandThemeContent>(
  {
    accentColor: { type: String, default: '#00E5FF' },
    heroOverlayEnabled: { type: Boolean, default: true },
    heroOverlayColor: { type: String, default: '#00AFC2' },
    headingFont: { type: String, default: 'Inter' },
  },
  { _id: false }
);

const promoTileSchema = new Schema<IPromoTile>(
  {
    title: { type: String, default: '' },
    linkText: { type: String, default: 'SHOP NOW' },
  },
  { _id: false }
);

const promoSplitSchema = new Schema<IPromoSplitContent>(
  {
    left: {
      type: promoTileSchema,
      default: () => ({ title: 'NEW ARRIVALS', linkText: 'SHOP NOW' }),
    },
    right: {
      type: promoTileSchema,
      default: () => ({ title: 'SALE', linkText: 'SHOP NOW' }),
    },
  },
  { _id: false }
);

const serviceItemSchema = new Schema<IServiceItem>(
  {
    title: { type: String, default: '' },
    linkText: { type: String, default: '' },
  },
  { _id: false }
);

const servicesSchema = new Schema<IServicesContent>(
  {
    sectionTitle: { type: String, default: 'OUR SERVICES' },
    items: {
      type: [serviceItemSchema],
      default: () => ([
        { title: 'BOOK AN APPOINTMENT', linkText: 'Reserve a personal styling session.' },
        { title: 'PERSONALIZATION', linkText: 'Make it uniquely yours.' },
        { title: 'COLLECT IN STORE', linkText: 'Order online, pick up nearby.' },
      ]),
    },
  },
  { _id: false }
);

const homePageContentSchema = new Schema<IHomePageContent>(
  {
    announcementBar: { type: announcementBarSchema, default: () => ({}) },
    hero: { type: heroSchema, default: () => ({}) },
    shopByStyle: { type: shopByStyleSchema, default: () => ({}) },
    promoSplit: { type: promoSplitSchema, default: () => ({}) },
    freshDrops: { type: freshDropsSchema, default: () => ({}) },
    brandStatement: { type: brandStatementSchema, default: () => ({}) },
    services: { type: servicesSchema, default: () => ({}) },
    newsletter: { type: newsletterSchema, default: () => ({}) },
    brandTheme: { type: brandThemeSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export default model<IHomePageContent>('HomePageContent', homePageContentSchema);
