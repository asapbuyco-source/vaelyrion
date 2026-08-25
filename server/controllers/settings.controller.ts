import { Request, Response } from 'express';
import { supabase } from '../config/supabase.js';

const DEFAULTS: Record<string, string> = {
  announcement_primary: 'The Current Atelier Collection',
  announcement_secondary: 'Complimentary insured delivery over €250 · Europe & Norway',
  preorder_batch_label: 'Batch #003',
  newsletter_batch_label: 'Batch #004',
};

export class SettingsController {
  static async getSettings(_req: Request, res: Response) {
    try {
      const { data, error } = await supabase.from('site_settings').select('key, value');
      if (error) throw error;
      const map: Record<string, string> = { ...DEFAULTS };
      for (const row of data || []) map[row.key] = row.value;
      res.json(map);
    } catch (error: any) {
      res.json(DEFAULTS);
    }
  }
}
