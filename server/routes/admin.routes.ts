import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();
router.use(requireAdmin);
router.get('/overview', AdminController.overview);
router.get('/products', AdminController.products);
router.patch('/products/:id', AdminController.updateProduct);
router.get('/orders', AdminController.orders);
router.patch('/orders/:id', AdminController.updateOrder);
router.get('/customers', AdminController.customers);
router.get('/contacts', AdminController.contacts);
router.patch('/contacts/:id', AdminController.updateContact);
router.get('/articles', AdminController.articles);
router.post('/articles', AdminController.saveArticle);
router.patch('/articles/:id', (req, res, next) => { req.body.id = req.params.id; return AdminController.saveArticle(req as any, res); });
router.post('/ai/article-draft', AdminController.generateArticle);
export default router;
