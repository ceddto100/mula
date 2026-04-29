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
const clientOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || clientOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS origin not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  next();
});

type RateLimitBucket = { count: number; resetAt: number };
const globalRateLimit = new Map<string, RateLimitBucket>();
const authRateLimit = new Map<string, RateLimitBucket>();

const buildLimiter =
  (store: Map<string, RateLimitBucket>, windowMs: number, max: number) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const key = req.ip || "unknown";
    const now = Date.now();
    const bucket = store.get(key);

    if (!bucket || bucket.resetAt < now) {
      store.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (bucket.count >= max) {
      res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later.",
      });
      return;
    }

    bucket.count += 1;
    next();
  };

app.use(
  buildLimiter(
    globalRateLimit,
    Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
    Number(process.env.RATE_LIMIT_MAX_REQUESTS || 300)
  )
);

app.use(
  "/api/auth",
  buildLimiter(
    authRateLimit,
    Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
    Number(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS || 20)
  )
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
app.get("/auth/google", (req, res) => {
  const query = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
  res.redirect(`/api/auth/google${query}`);
});

app.get("/auth/google/callback", (req, res) => {
  const query = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
  res.redirect(`/api/auth/google/callback${query}`);
});

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
  console.log(`CORS origins: ${clientOrigins.join(", ")}`);
});

export default app;
