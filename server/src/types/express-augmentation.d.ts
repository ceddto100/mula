// Safe Express Request augmentation
// Using express-serve-static-core to avoid module shadowing
import "express-serve-static-core";
import { IUser } from "./index";

declare module "express-serve-static-core" {
  interface Request {
    user?: IUser;
  }
}

export {};
