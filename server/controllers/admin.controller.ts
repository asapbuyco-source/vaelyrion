import { Request, Response } from 'express';
import { supabase } from '../config/supabase.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

const clean = (value: unknown, max = 5000) => String(value ?? '').trim().slice(0, max);

const EDITORIAL_SYSTEM_PROMPT =
  'You are Tanelia\'s senior editorial assistant. Tanelia is a premium Oslo hair house. Write precise, tactile, original editorial copy. Never invent certifications, customer results, suppliers, medical claims, prices, guarantees, or delivery promises. Avoid generic AI phrases, hype, keyword stuffing, and repetitive headings. Return valid JSON with exactly: title, excerpt, content, seo_title, seo_description, focus_keyword. Content should be 700-1000 words in Markdown with useful subheadings.';

// OpenAI-compatible LLM backend (OpenRouter). JSON structured output is requested
// via the `response_format` hint and validated by the caller.
const LLM_API_KEY = process.env.OPENROUTER_API_KEY || '';
const LLM_BASE = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
const LLM_MODEL = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct';

interface LLMResult { ok: boolean; error?: string; content?: string; }
const callOpenRouter = async (systemPrompt: string, userPrompt: string): Promise<LLMResult> => {
  try {
    const response = await fetch(`${LLM_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LLM_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.SITE_URL || 'https://www.tanelia.shop',
        'X-Title': 'Tanelia',
      },
      body: JSON.stringify({
        model: LLM_MODEL,
        temperature: 0.65,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });
    const payload: any = await response.json().catch(() => ({}));
    if (!response.ok) return { ok: false, error: payload?.error?.message || 'The AI drafting service was unavailable.' };
    const raw = payload?.choices?.[0]?.message?.content;
    if (!raw) return { ok: false, error: 'The AI drafting service returned no content.' };
    return { ok: true, content: raw };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'The AI drafting service was unavailable.' };
  }
};

// Models sometimes wrap their JSON in markdown code fences and/or emit RAW
// control characters (literal newlines/tabs) inside string values. Strip fences,
// then JSON-escape stray control chars ONLY inside string literals so that
// JSON.parse succeeds without corrupting structural whitespace.
const parseLLMJson = (content: string): any => {
  let target = String(content || '').trim();
  const fenced = target.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) target = fenced[1].trim();

  let inString = false;
  let escaped = false;
  let clean = '';
  for (let i = 0; i < target.length; i++) {
    const ch = target[i];
    if (inString) {
      if (escaped) { clean += ch; escaped = false; continue; }
      if (ch === '\\') { clean += ch; escaped = true; continue; }
      if (ch === '"') { inString = false; clean += ch; continue; }
      const code = ch.charCodeAt(0);
      if (code < 0x20 || code === 0x7f) {
        clean += '\\u' + code.toString(16).padStart(4, '0');
        continue;
      }
      clean += ch;
    } else {
      if (ch === '"') { inString = true; clean += ch; continue; }
      clean += ch;
    }
  }
  return JSON.parse(clean || '{}');
};

export class AdminController {
  static async generateScheduledDraft(req: Request, res: Response) {
    try {
      const configuredSecret = process.env.CRON_SECRET;
      const suppliedSecret = req.headers.authorization?.replace(/^Bearer\s+/i, '') || req.headers['x-cron-secret'];
      if (!configuredSecret || suppliedSecret !== configuredSecret) return res.status(401).json({ error: 'Unauthorized cron request' });
      if (!LLM_API_KEY) return res.status(503).json({ error: 'OPENROUTER_API_KEY is not configured' });

      const { data: topics, error: topicError } = await supabase
        .from('content_topics')
        .select('id, topic, focus_keyword, last_generated_at')
        .eq('active', true)
        .order('last_generated_at', { ascending: true, nullsFirst: true })
        .limit(1);
      if (topicError) throw topicError;
      const topic = topics?.[0];
      if (!topic) return res.status(200).json({ skipped: true, message: 'No active content topics available' });
      if (topic.last_generated_at && Date.now() - new Date(topic.last_generated_at).getTime() < 6 * 24 * 60 * 60 * 1000) {
        return res.status(200).json({ skipped: true, message: 'The selected topic was generated recently' });
      }

      const result = await callOpenRouter(
        EDITORIAL_SYSTEM_PROMPT,
        `Create a draft Journal article about: ${topic.topic}. Primary SEO phrase: ${topic.focus_keyword || 'choose a natural phrase'}. The reader should learn something genuinely useful while feeling the Tanelia point of view.`
      );
      if (!result.ok) return res.status(502).json({ error: result.error || 'Article generation failed' });
      const draft = parseLLMJson(result.content || '{}');
      const title = clean(draft.title, 255);
      if (!title) return res.status(502).json({ error: 'The AI editor returned an empty article' });

      const { data: article, error: articleError } = await supabase.from('journal_articles').insert({
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + `-${Date.now().toString(36)}`,
        excerpt: clean(draft.excerpt, 1000),
        content: clean(draft.content, 50000),
        category: 'Journal',
        author: 'Tanelia Editorial',
        status: 'draft',
        seo_title: clean(draft.seo_title, 255),
        seo_description: clean(draft.seo_description, 320),
        focus_keyword: clean(draft.focus_keyword || topic.focus_keyword, 160),
      }).select('id, title, status').single();
      if (articleError) throw articleError;
      await supabase.from('content_topics').update({ last_generated_at: new Date().toISOString() }).eq('id', topic.id);
      res.status(201).json({ created: true, article });
    } catch (error: any) {
      res.status(502).json({ error: error.message || 'Unable to generate scheduled draft' });
    }
  }

  static async generateArticle(req: Request, res: Response) {
    try {
      if (!LLM_API_KEY) return res.status(503).json({ error: 'AI drafting is not configured. Add OPENROUTER_API_KEY on the server.' });
      const topic = clean(req.body?.topic, 240);
      const keyword = clean(req.body?.focus_keyword, 160);
      if (!topic) return res.status(400).json({ error: 'Enter an article topic first.' });

      const result = await callOpenRouter(
        EDITORIAL_SYSTEM_PROMPT,
        `Create a draft Journal article about: ${topic}. Primary SEO phrase: ${keyword || 'choose a natural phrase'}. The reader should learn something genuinely useful while feeling the Tanelia point of view.`
      );
      if (!result.ok) return res.status(502).json({ error: result.error || 'The AI drafting service was unavailable.' });
      const draft = parseLLMJson(result.content || '{}');
      res.json({
        title: clean(draft.title, 255),
        excerpt: clean(draft.excerpt, 1000),
        content: clean(draft.content, 50000),
        seo_title: clean(draft.seo_title, 255),
        seo_description: clean(draft.seo_description, 320),
        focus_keyword: clean(draft.focus_keyword, 160),
        status: 'draft',
      });
    } catch (error: any) {
      res.status(502).json({ error: error.message || 'Unable to generate article draft.' });
    }
  }

  static async overview(_req: AuthRequest, res: Response) {
    try {
      const [products, orders, customers, contacts, drafts] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('orders').select('id, total, payment_status, status, created_at').order('created_at', { ascending: false }).limit(10),
        supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'customer'),
        supabase.from('contact_requests').select('id', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('journal_articles').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
      ]);
      const paidOrders = (orders.data || []).filter((order: any) => order.payment_status === 'paid');
      res.json({
        counts: {
          products: products.count || 0,
          customers: customers.count || 0,
          newContacts: contacts.count || 0,
          drafts: drafts.count || 0,
          paidOrders: paidOrders.length,
        },
        recentOrders: orders.data || [],
        revenue: paidOrders.reduce((sum: number, order: any) => sum + Number(order.total || 0), 0),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Unable to load dashboard' });
    }
  }

  static async products(req: Request, res: Response) {
    try {
      const search = clean(req.query.search, 120);
      let query = supabase.from('products').select('id, name, slug, selling_price, currency, status, is_preorder, updated_at, product_images(image_url, sort_order)').order('updated_at', { ascending: false }).limit(100);
      if (search) query = query.ilike('name', `%${search}%`);
      const { data, error } = await query;
      if (error) throw error;
      res.json(data || []);
    } catch (error: any) { res.status(500).json({ error: error.message || 'Unable to load products' }); }
  }

  static async updateProduct(req: Request, res: Response) {
    try {
      const id = clean(req.params.id, 80);
      const allowed = ['name', 'description', 'selling_price', 'compare_at_price', 'status', 'is_preorder', 'estimated_min_days', 'estimated_max_days', 'seo_title', 'seo_description'];
      const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
      for (const key of allowed) if (req.body?.[key] !== undefined) update[key] = req.body[key];
      const { data, error } = await supabase.from('products').update(update).eq('id', id).select().single();
      if (error) throw error;
      res.json(data);
    } catch (error: any) { res.status(500).json({ error: error.message || 'Unable to update product' }); }
  }

  static async orders(_req: Request, res: Response) {
    try {
      const { data, error } = await supabase.from('orders').select('*, users(email, first_name, last_name)').order('created_at', { ascending: false }).limit(100);
      if (error) throw error;
      res.json(data || []);
    } catch (error: any) { res.status(500).json({ error: error.message || 'Unable to load orders' }); }
  }

  static async updateOrder(req: Request, res: Response) {
    try {
      const status = clean(req.body?.status, 40);
      if (!status) return res.status(400).json({ error: 'Order status is required' });
      const { data, error } = await supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', req.params.id).select().single();
      if (error) throw error;
      res.json(data);
    } catch (error: any) { res.status(500).json({ error: error.message || 'Unable to update order' }); }
  }

  static async customers(_req: Request, res: Response) {
    try {
      const { data, error } = await supabase.from('users').select('id, email, first_name, last_name, phone, role, status, created_at').order('created_at', { ascending: false }).limit(100);
      if (error) throw error;
      res.json(data || []);
    } catch (error: any) { res.status(500).json({ error: error.message || 'Unable to load customers' }); }
  }

  static async contacts(_req: Request, res: Response) {
    try {
      const { data, error } = await supabase.from('contact_requests').select('*').order('created_at', { ascending: false }).limit(100);
      if (error) throw error;
      res.json(data || []);
    } catch (error: any) { res.status(500).json({ error: error.message || 'Unable to load enquiries' }); }
  }

  static async updateContact(req: Request, res: Response) {
    try {
      const status = clean(req.body?.status, 40);
      if (!['new', 'in_progress', 'resolved'].includes(status)) return res.status(400).json({ error: 'Invalid enquiry status' });
      const { data, error } = await supabase.from('contact_requests').update({ status, updated_at: new Date().toISOString() }).eq('id', req.params.id).select().single();
      if (error) throw error;
      res.json(data);
    } catch (error: any) { res.status(500).json({ error: error.message || 'Unable to update enquiry' }); }
  }

  static async articles(_req: Request, res: Response) {
    try {
      const { data, error } = await supabase.from('journal_articles').select('*').order('updated_at', { ascending: false }).limit(100);
      if (error) throw error;
      res.json(data || []);
    } catch (error: any) { res.status(500).json({ error: error.message || 'Unable to load journal drafts. Apply migration 00004 first.' }); }
  }

  static async saveArticle(req: AuthRequest, res: Response) {
    try {
      const body = req.body || {};
      const title = clean(body.title, 255);
      if (!title) return res.status(400).json({ error: 'Article title is required' });
      const payload = {
        title,
        slug: clean(body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''), 255),
        excerpt: clean(body.excerpt, 1000),
        content: clean(body.content, 50000),
        cover_image_url: clean(body.cover_image_url, 500),
        category: clean(body.category || 'Journal', 100),
        author: clean(body.author || 'Tanelia Editorial', 160),
        status: ['draft', 'published', 'archived'].includes(body.status) ? body.status : 'draft',
        seo_title: clean(body.seo_title, 255),
        seo_description: clean(body.seo_description, 320),
        focus_keyword: clean(body.focus_keyword, 160),
        published_at: body.status === 'published' ? (body.published_at || new Date().toISOString()) : null,
        created_by: req.userProfile?.id,
        updated_at: new Date().toISOString(),
      };
      const query = body.id
        ? supabase.from('journal_articles').update(payload).eq('id', body.id).select().single()
        : supabase.from('journal_articles').insert(payload).select().single();
      const { data, error } = await query;
      if (error) throw error;
      res.json(data);
    } catch (error: any) { res.status(500).json({ error: error.message || 'Unable to save article' }); }
  }
}
