import React, { useState } from 'react';

/**
 * Curated, always-available fallbacks so a broken source (e.g. an expired
 * Shopify CDN link) never leaves an empty box. Original sources are kept —
 * we only swap in a fallback if the primary source fails to load.
 */
const FALLBACKS: Record<string, string> = {
  hair: 'https://images.unsplash.com/photo-1522337660859-02fbefca4d79?auto=format&fit=crop&w=1200&q=85',
  portrait: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
  bundles: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85',
  editorial: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=1200&q=85',
  care: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=85',
};

export type FallbackKind = keyof typeof FALLBACKS;

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  /** Which curated fallback to use if the primary source fails. */
  fallbackKind?: FallbackKind;
}

export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  fallbackKind = 'hair',
  className,
  loading = 'lazy',
  ...rest
}) => {
  const [errored, setErrored] = useState(false);
  const resolved = errored ? FALLBACKS[fallbackKind] : src;

  return (
    <img
      src={resolved}
      alt={alt}
      loading={loading}
      onError={() => {
        if (!errored) setErrored(true);
      }}
      className={className}
      {...rest}
    />
  );
};
