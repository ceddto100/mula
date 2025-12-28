// server/src/server.ts
import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";

// Load environment variables first
dotenv.config();

import connectDB from "./config/db";
import passport from "./config/passport";
import { errorHandler, notFound } from "./middleware/errorHandler";

// Routes
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";
import adminRoutes from "./routes/admin.routes";
import paymentRoutes from "./routes/payment.routes";

const app: Express = express();
const PORT = process.env.PORT || 5000;

/**
 * IMPORTANT (Render/any reverse proxy):
 * Allows secure cookies to work correctly behind a proxy (HTTPS termination).
 */
app.set("trust proxy", 1);

/**
 * Connect to MongoDB
 */
connectDB();

/**
 * CORS configuration
 * - For cookie-based auth (sessions), credentials must be true
 * - origin must be an exact string (not "*") when credentials is true
 */
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/**
 * Body parser
 * Stripe webhook requires raw body; keep JSON parsing off for that route.
 */
app.use((req, res, next) => {
  if (req.originalUrl === "/api/payment/webhook") {
    return next();
  }
  return express.json()(req, res, next);
});
app.use(express.urlencoded({ extended: true }));

/**
 * Cookies
 */
app.use(cookieParser(process.env.COOKIE_SECRET));

/**
 * Sessions (stored in MongoDB)
 * Fixes the production MemoryStore warning and prevents random logouts on restart/scale.
 */
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "";
if (!MONGO_URI) {
  console.error(
    "❌ Missing Mongo connection string. Set MONGO_URI or MONGODB_URI in environment variables."
  );
  process.exit(1);
}

const isProd = process.env.NODE_ENV === "production";

app.use(
  session({
    name: "sid", // optional: custom cookie name (default is connect.sid)
    secret: process.env.SESSION_SECRET || "session-secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: MONGO_URI,
      collectionName: "sessions",
      ttl: 24 * 60 * 60, // 24 hours in seconds
    }),
    cookie: {
      secure: isProd, // must be true in production (https)
      httpOnly: true,
      sameSite: isProd ? "none" : "lax", // "none" needed for cross-site cookies (frontend on different domain)
      maxAge: 24 * 60 * 60 * 1000, // 24 hours in ms
    },
  })
);

/**
 * Passport
 */
app.use(passport.initialize());
app.use(passport.session());

/**
 * Health check
 */
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

/**
 * API routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payment", paymentRoutes);

/**
 * Error handling
 */
app.use(notFound);
app.use(errorHandler);

/**
 * Start server
 */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`CORS origin: ${CLIENT_URL}`);
});

export default app;
