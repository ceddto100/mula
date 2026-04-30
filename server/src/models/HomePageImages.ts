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
      default: '',
    },
    menImage: {
      type: String,
      required: true,
      default: '',
    },
    womenImage: {
      type: String,
      required: true,
      default: '',
    },
    collectionImage: {
      type: String,
      required: true,
      default: '',
    },
    accessoryImage: {
      type: String,
      required: true,
      default: '',
    },
    saleImage: {
      type: String,
      required: true,
      default: '',
    },
  },
  { timestamps: true }
);

export default model<IHomePageImages>('HomePageImages', homePageImagesSchema);
