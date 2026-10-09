// Lightweight in-memory rate limiter. Serverless instances each keep their own
// window, which is enough to blunt brute-force, spam and scraping at the edge
// without adding an external dependency.
import { Request, Response, NextFunction } from 'express';

interface Bucket {
  count: number;
  resetAt: number;
}

interface RateLimitOptions {
  windowMs: number;
  max: number;
  message?: string;
  keyPrefix?: string;
}

export const rateLimit = ({ windowMs, max, message, keyPrefix = '' }: RateLimitOptions) => {
  const buckets = new Map<string, Bucket>();

  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const forwarded = (req.headers['x-forwarded-for'] as string) || '';
    const ip = forwarded.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
    const key = `${keyPrefix}:${ip}`;
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      if (buckets.size > 5000) {
        for (const [bucketKey, value] of buckets) {
          if (value.resetAt <= now) buckets.delete(bucketKey);
        }
      }
      return next();
    }

    bucket.count += 1;
    if (bucket.count > max) {
      res.setHeader('Retry-After', String(Math.ceil((bucket.resetAt - now) / 1000)));
      return res.status(429).json({ error: message || 'Too many requests. Please try again shortly.' });
    }

    return next();
  };
};
