import { Router } from 'express';
import { ContentController } from '../controllers/content.controller.js';

const router = Router();
router.get('/articles', ContentController.listArticles);
router.get('/articles/:slug', ContentController.getArticle);
export default router;
