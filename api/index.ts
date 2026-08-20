import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load env vars first
dotenv.config();

// Route imports
import authRoutes from '../server/routes/auth.routes.js';
import productRoutes from '../server/routes/product.routes.js';
import cartRoutes from '../server/routes/cart.routes.js';
import checkoutRoutes from '../server/routes/checkout.routes.js';
import orderRoutes from '../server/routes/order.routes.js';
import contactRoutes from '../server/routes/contact.routes.js';
import adminRoutes from '../server/routes/admin.routes.js';
import contentRoutes from '../server/routes/content.routes.js';
import { AdminController } from '../server/controllers/admin.controller.js';
import { supabase } from '../server/config/supabase.js';

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
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/content', contentRoutes);
app.post('/api/cron/generate-content', AdminController.generateScheduledDraft);
app.get('/api/cron/generate-content', AdminController.generateScheduledDraft);

// Health check
app.get('/api/health', async (_req: Request, res: Response) => {
  let database: 'ok' | 'error' = 'ok';
  let databaseError: string | undefined;

  try {
    const { error } = await supabase.from('products').select('id', { count: 'exact', head: true });
    if (error) throw error;
  } catch (error: any) {
    database = 'error';
    databaseError = process.env.NODE_ENV === 'production' ? 'Database unavailable' : error.message;
  }

  res.status(database === 'ok' ? 200 : 503).json({
    status: database === 'ok' ? 'ok' : 'degraded',
    service: 'Tanelia API',
    database,
    ...(databaseError ? { databaseError } : {}),
    timestamp: new Date().toISOString()
  });
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
