import React, { useState } from 'react';

/**
 * Curated, always-available fallbacks so a broken source (e.g. an expired
 * Shopify CDN link) never leaves an empty box. Original sources are kept —
 * we only swap in a fallback if the primary source fails to load.
 */
const FALLBACKS: Record<string, string> = {
  hair: 'https://cdn.shopify.com/s/files/1/2465/8681/files/2085320188886065153v1aY413AR8x3UMJ1_9579f0ac-9a49-4d31-a5d7-1c0927f72b21.png?width=1200',
  portrait: 'https://cdn.shopify.com/s/files/1/2465/8681/files/2085704652057288704Xp9vRzsMdgUsmQaX_3483a27a-35e4-469a-a27c-a8669c3694ec.jpg?width=1200',
  bundles: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=82',
  editorial: 'https://cdn.shopify.com/s/files/1/2465/8681/files/2085705268292820992dfqmuuvWSGHYdU39_230f3642-ec06-4fba-a81c-30bcca57938c.jpg?width=1200',
  care: 'https://cdn.shopify.com/s/files/1/2465/8681/files/2x_1_55d74548-0357-4f47-8390-65501ff65e04.png?width=1200',
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
