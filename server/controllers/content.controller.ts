import { Request, Response } from 'express';
import { supabase } from '../config/supabase.js';

const formatArticle = (article: any) => ({
  id: article.id,
  title: article.title,
  subtitle: article.excerpt || '',
  category: article.category || 'Editorial',
  readTime: `${Math.max(3, Math.ceil((article.content || '').split(/\s+/).length / 220))} min read`,
  image: article.cover_image_url || '/brand/tanelia-care-kit.svg',
  author: article.author || 'Tanelia Editorial',
  date: article.published_at ? new Date(article.published_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : '',
  featuredProductIds: [],
  content: String(article.content || '').split(/\n\s*\n/).map((paragraph: string) => paragraph.replace(/^#{1,6}\s+/gm, '').trim()).filter(Boolean),
  quote: undefined,
  tags: article.focus_keyword ? [article.focus_keyword] : [],
  slug: article.slug,
  seoTitle: article.seo_title,
  seoDescription: article.seo_description,
});

export class ContentController {
  static async listArticles(_req: Request, res: Response) {
    try {
      const { data, error } = await supabase.from('journal_articles').select('*').eq('status', 'published').order('published_at', { ascending: false }).limit(50);
      if (error) throw error;
      res.json((data || []).map(formatArticle));
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Unable to load journal' });
    }
  }

  static async getArticle(req: Request, res: Response) {
    try {
      const { data, error } = await supabase.from('journal_articles').select('*').eq('status', 'published').eq('slug', req.params.slug).single();
      if (error || !data) return res.status(404).json({ error: 'Article not found' });
      res.json(formatArticle(data));
    } catch (error: any) { res.status(500).json({ error: error.message || 'Unable to load article' }); }
  }
}
