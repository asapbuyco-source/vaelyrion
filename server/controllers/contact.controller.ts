import { Request, Response } from 'express';
import { supabase } from '../config/supabase.js';

export class ContactController {
  static async createRequest(req: Request, res: Response) {
    try {
      const name = String(req.body?.name || '').trim();
      const email = String(req.body?.email || '').trim().toLowerCase();
      const message = String(req.body?.message || '').trim();

      if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email, and message are required.' });
      }
      if (name.length > 160 || email.length > 255 || message.length > 5000) {
        return res.status(400).json({ error: 'Please keep your enquiry within the allowed length.' });
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Please provide a valid email address.' });
      }

      const { data, error } = await supabase
        .from('contact_requests')
        .insert({ name, email, message })
        .select('id, created_at')
        .single();

      if (error) throw error;
      res.status(201).json({ id: data.id, message: 'Your enquiry has been received.' });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Unable to submit enquiry.' });
    }
  }
}
