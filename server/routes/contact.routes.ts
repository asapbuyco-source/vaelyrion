import { Router } from 'express';
import { ContactController } from '../controllers/contact.controller.js';
import { rateLimit } from '../middleware/rateLimit.middleware.js';

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  keyPrefix: 'contact',
  message: 'Too many enquiries from this address. Please try again in a few minutes.',
});

router.post('/', contactLimiter, ContactController.createRequest);

export default router;
