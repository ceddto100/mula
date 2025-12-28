// Augment Express Request with user property
import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role?: string;
        email?: string;
        _id?: any;
      };
    }
  }
}

export {};
