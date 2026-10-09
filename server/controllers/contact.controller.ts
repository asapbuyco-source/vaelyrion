import { Request, Response } from 'express';
import { supabase } from '../config/supabase.js';
import { sendAdminNotification, getAdminEmail } from '../lib/email.js';
import { renderContactNotification } from '../lib/emailTemplates.js';

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

      if (error) {
        console.error('Error saving contact request to database:', error);
        throw error;
      }

      // Notify Client Services via the Resend engine. Failure never blocks the enquiry.
      const { subject, html, text } = renderContactNotification({
        name,
        email,
        message,
        submittedAt: data.created_at ? new Date(data.created_at).toUTCString() : undefined,
        supportEmail: getAdminEmail(),
      });

      sendAdminNotification({ subject, html, text, replyTo: email }).catch((emailErr) => {
        console.error('Failed to send enquiry notification:', emailErr?.message || emailErr);
      });

      res.status(201).json({ id: data.id, message: 'Your enquiry has been received.' });
    } catch (error: any) {
      res.status(500).json({ error: 'Unable to submit enquiry. Please try again or email us directly.' });
    }
  }
}
