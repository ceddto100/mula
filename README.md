# MULA E-Commerce Store

A full-stack e-commerce store built with React, Node.js, Express, MongoDB, Stripe, and Cloudinary.

## Tech Stack

### Frontend
- **React 18** with Vite
- **TypeScript**
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **React Hot Toast** for notifications

### Backend
- **Node.js** with Express
- **TypeScript**
- **MongoDB** with Mongoose
- **Passport.js** for authentication (Google OAuth + Local)
- **JWT** for token-based auth
- **Stripe** for payment processing
- **Cloudinary** for image storage

## Project Structure

```
mula/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/           # API service layer
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context providers
│   │   ├── hooks/         # Custom hooks
│   │   ├── pages/         # Page components
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   └── package.json
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Express middleware
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   └── package.json
│
└── README.md
```

## Features

### Customer Features
- Browse products by category
- Filter products by size, color, and price
- Product detail pages with image gallery
- Shopping cart functionality
- Secure checkout with Stripe
- Order history
- Google OAuth sign-in
- Email/password registration

### Admin Features
- Dashboard with sales analytics
- Product management (CRUD)
- Image upload to Cloudinary
- Order management
- Low stock alerts

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Google Cloud Console project (for OAuth)
- Stripe account
- Cloudinary account

### Environment Setup

#### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-jwt-secret
JWT_EXPIRE=7d
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLIENT_URL=http://localhost:5173
SESSION_SECRET=your-session-secret
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd mula
```

2. Install backend dependencies
```bash
cd server
npm install
```

3. Install frontend dependencies
```bash
cd ../client
npm install
```

4. Start development servers

Backend:
```bash
cd server
npm run dev
```

Frontend:
```bash
cd client
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:5000`.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register with email/password
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `GET /api/products/category/:cat` - Get products by category
- `GET /api/products/featured` - Get featured products
- `GET /api/products/categories` - Get all categories

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove item from cart

### Orders
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get single order

### Payment
- `POST /api/payment/create-checkout-session` - Create Stripe checkout
- `POST /api/payment/webhook` - Stripe webhook

### Admin
- `GET /api/admin/dashboard` - Get dashboard stats
- `GET /api/admin/products` - Get all products (admin)
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id` - Update order status
- `POST /api/admin/upload` - Upload image

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set the root directory to `client`
3. Add environment variables in Vercel dashboard
4. Deploy

### Backend (Render)
1. Connect your GitHub repository to Render
2. Set the root directory to `server`
3. Set build command: `npm install && npm run build`
4. Set start command: `npm start`
5. Add environment variables in Render dashboard
6. Deploy

### Post-Deployment
1. Update CORS settings in backend to allow Vercel domain
2. Update Google OAuth redirect URIs
3. Update Stripe webhook endpoint URL
4. Whitelist Render IPs in MongoDB Atlas

## Testing

### Stripe Test Cards
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires Auth: `4000 0025 0000 3155`

Use any future expiry date and any 3-digit CVC.

## Creating an Admin User

1. Register a new user through the app
2. Open MongoDB Atlas or use MongoDB Compass
3. Find the user document in the `users` collection
4. Update the `role` field from `customer` to `admin`

## License

MIT
