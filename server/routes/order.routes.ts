import { Router } from 'express';
import { OrderController } from '../controllers/order.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', OrderController.getMyOrders);
router.get('/:id', OrderController.getOrderById);

export default router;
