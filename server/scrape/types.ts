export type ScrapeCategory = 'wigs' | 'bundles' | 'closures' | 'frontals' | 'extensions' | 'accessories';

export interface ScrapedProduct {
  sourceKey: string;
  externalId: string;
  url: string;
  title: string;
  description: string;
  images: string[];
  category: ScrapeCategory;
  priceEur: number;
  compareAtEur: number | null;
  originalCurrency: string;
  textures: string[];
  lengths: string[];
  densities: string[];
  laceTypes: string[];
  colors: string[];
  hairOrigin: string;
  isPreOrder: boolean;
  sku: string | null;
  variantCount: number;
}

export interface SourceConfig {
  key: string;
  name: string;
  type: 'shopify' | 'html';
  baseUrl: string;
  currency: 'USD' | 'EUR' | 'GBP' | 'NOK';
  collectionPaths?: string[];
  excludeTitlePatterns?: string[];
}

export interface ScrapeResult {
  source: SourceConfig;
  products: ScrapedProduct[];
  errors: string[];
}
