import { Schema, model } from 'mongoose';

export interface IHomePageImages {
  heroImage: string;
  menImage: string;
  womenImage: string;
  collectionImage: string;
  accessoryImage: string;
  saleImage: string;
  // Promo split (two large side-by-side tiles)
  promoLeftImage: string;
  promoRightImage: string;
  // Services row (three tiles)
  serviceImage1: string;
  serviceImage2: string;
  serviceImage3: string;
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
    promoLeftImage: {
      type: String,
      default: '',
    },
    promoRightImage: {
      type: String,
      default: '',
    },
    serviceImage1: {
      type: String,
      default: '',
    },
    serviceImage2: {
      type: String,
      default: '',
    },
    serviceImage3: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default model<IHomePageImages>('HomePageImages', homePageImagesSchema);
