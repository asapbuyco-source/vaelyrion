import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName, phone } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      // Create the user profile record
      if (data.user) {
        const { error: profileError } = await supabase.from('users').insert([{
          auth_user_id: data.user.id,
          email,
          first_name: firstName,
          last_name: lastName,
          phone
        }]);

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }
      }

      res.status(201).json({ user: data.user, session: data.session });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return res.status(401).json({ error: error.message });
      }

      // Supabase can return a user without a session when email confirmation
      // is enabled. Do not let the client treat that as a successful login.
      if (!data.user || !data.session?.access_token) {
        return res.status(403).json({ error: 'Please confirm your email address before signing in.' });
      }

      res.json({ user: data.user, session: data.session });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.json({ message: 'Logged out successfully' });
      }

      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) {
        // The service client has no browser session of its own. Revoke the
        // authenticated user's sessions explicitly instead of calling the
        // unscoped signOut() on the service client.
        await supabase.auth.admin.signOut(user.id, 'global');
      }
      res.json({ message: 'Logged out successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  static async getMe(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      // Fetch profile data
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', user.id)
        .single();

      res.json({ user: { ...user, profile } });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }
}
