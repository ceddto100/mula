# Website Audit — MULA/Cualquier Platform

**Date:** 2026-04-25  
**Scope:** Full-stack review of React client + Node/Express API for production readiness as a direct-to-consumer clothing brand site.

## Executive Summary

Current status: **Partially ready**.

The platform has a solid base (TypeScript, build passing, product filtering, admin area), but it is **not fully production-ready** yet for reliable brand operations due to security hardening gaps, route/feature inconsistencies, and one critical model mismatch in payment flow.

## What is working well

- Both frontend and backend compile successfully in this environment.
- Core product catalog and filtering architecture is strong and fairly extensible.
- Backend includes request validation in many routes and has a clear route/controller organization.
- Stripe webhook is set to use raw body parsing on its own route (correct pattern).

## Highest-priority issues (fix before launch)

### 1) Critical data-model mismatch in checkout/payment flow

The Stripe checkout and post-payment stock updates still reference legacy product fields (`name`, `price`, `stock`, `images`) while the active Product model is variant-based (`title`, `variants`, `inventoryQuantity`). This can break checkout totals, stock checks, and post-payment inventory updates.

**Impact:** High (broken orders/inventory integrity).  
**Priority:** P0.

### 2) JWT token handling exposes avoidable risk

- Auth token is stored in `localStorage`.
- Google OAuth callback places token in URL query string during redirect.

Both patterns increase risk in XSS and token leakage scenarios (browser history, logs, referrers).

**Impact:** High (auth/session security).  
**Priority:** P0/P1.

### 3) Missing baseline API hardening

Server currently lacks standard production protections such as `helmet`, rate limiting, and brute-force controls on login/auth endpoints.

**Impact:** Medium-high (abuse and exploit surface).  
**Priority:** P1.

### 4) Navigation points to non-existent pages

Header contains links/actions for `/search` and `/wishlist`, but app routes do not define those pages.

**Impact:** Medium (UX trust loss, user dead ends).  
**Priority:** P1.

### 5) Linting pipeline is currently broken

`npm run lint` fails in both client and server because ESLint v9 expects flat config (`eslint.config.*`) and repository does not provide it.

**Impact:** Medium (code quality regression risk).  
**Priority:** P1.

## Product/brand fit observations (for a non-marketplace clothing brand)

If this site is intended as your primary digital storefront (not a physical store), it should emphasize:

- Brand storytelling pages (About, Lookbook, Campaigns, Materials, Sustainability, Press).
- Trust/operations pages (Shipping, Returns, Sizing, FAQ, Contact).
- Conversion utilities (wishlist, back-in-stock alerts, reviews/UGC, email/SMS capture).

Right now, the app is more e-commerce-engine focused than brand-experience optimized.

## Recommended roadmap

### Phase 1 — Launch blockers (1–2 weeks)

1. Refactor payment/cart/order flow to use the current variant product schema end-to-end.
2. Move auth from localStorage/query-token to secure HTTP-only cookie strategy (or equivalent secure token transport).
3. Add baseline API security middleware (helmet, rate-limit, stricter CORS origin list, auth endpoint throttling).
4. Fix or remove dead navigation routes (`/search`, `/wishlist`).
5. Restore linting with ESLint v9 flat config and enforce in CI.

### Phase 2 — Business readiness (2–4 weeks)

1. Add SEO route-level metadata (dynamic title/description/canonical + OG tags).
2. Implement analytics events/funnels (landing → PDP → add-to-cart → checkout → purchase).
3. Add operational pages (Shipping, Returns, Contact, FAQ, Size Guide content).
4. Add abandoned cart and newsletter capture touchpoints.
5. Create incident-safe deployment checklist (env var validation + health and monitoring checks).

### Phase 3 — Growth features (4+ weeks)

1. Wishlist and back-in-stock alerts.
2. Search page with typo tolerance and facets.
3. Social proof modules (reviews, UGC gallery, “as seen on”).
4. Performance pass (image optimization, lazy-loading strategy, bundle split, CWV targets).

## Final verdict

- **Go-live now?** **No** (not yet).
- **After Phase 1 fixes?** **Yes**, for controlled launch.
- **After Phase 2?** Strongly launch-ready for a clothing brand-led digital storefront.

