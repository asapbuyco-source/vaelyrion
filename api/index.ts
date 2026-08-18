import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load env vars first
dotenv.config();

// Route imports
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import cartRoutes from './routes/cart.routes';
import checkoutRoutes from './routes/checkout.routes';
import orderRoutes from './routes/order.routes';

const app = express();
const port = process.env.PORT || 3001;

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Stripe webhook needs RAW body for signature verification — register BEFORE express.json()
app.use('/api/v1/checkout/webhook', express.raw({ type: 'application/json' }), (req: any, _res, next) => {
  req.rawBody = req.body;
  next();
});

// Standard JSON body parser for all other routes
app.use(express.json());

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/checkout', checkoutRoutes);
app.use('/api/v1/orders', orderRoutes);

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Tanelia backend is running', timestamp: new Date().toISOString() });
});

// 404 fallback
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`\n🚀 Tanelia backend running on http://localhost:${port}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Supabase: ${process.env.SUPABASE_URL ? '✓ Connected' : '✗ Missing URL'}\n`);
  });
}

export default app;
