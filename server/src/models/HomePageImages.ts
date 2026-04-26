import { Schema, model } from 'mongoose';

export interface IHomePageImages {
  heroImage: string;
  menImage: string;
  womenImage: string;
  collectionImage: string;
  accessoryImage: string;
  saleImage: string;
}

const homePageImagesSchema = new Schema<IHomePageImages>(
  {
    heroImage: {
      type: String,
      required: true,
      default: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2070',
    },
    menImage: {
      type: String,
      required: true,
      default: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=1200',
    },
    womenImage: {
      type: String,
      required: true,
      default: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&q=80&w=600',
    },
    collectionImage: {
      type: String,
      required: true,
      default: 'https://images.unsplash.com/photo-1558769132-cb1aea1f8cf5?auto=format&fit=crop&q=80&w=600',
    },
    accessoryImage: {
      type: String,
      required: true,
      default: 'https://images.unsplash.com/photo-1523359346063-d879354c0ea5?auto=format&fit=crop&q=80&w=600',
    },
    saleImage: {
      type: String,
      required: true,
      default: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600',
    },
  },
  { timestamps: true }
);

export default model<IHomePageImages>('HomePageImages', homePageImagesSchema);
