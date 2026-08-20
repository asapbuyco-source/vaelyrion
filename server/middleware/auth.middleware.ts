// api/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

export interface AuthRequest extends Request {
  user?: any;
  userProfile?: any;
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Fetch the profile from our users table
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('auth_user_id', user.id)
      .single();

    req.user = user;
    req.userProfile = profile;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};

export const requireAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  await requireAuth(req, res, () => {
    if (!req.userProfile || !['admin', 'staff'].includes(req.userProfile.role)) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  });
};
