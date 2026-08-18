import { SourceConfig } from './types';

export const SOURCES: SourceConfig[] = [
  {
    key: 'luvmehair',
    name: 'Luvme Hair',
    type: 'shopify',
    baseUrl: 'https://www.luvmehair.com',
    currency: 'USD',
  },
  {
    key: 'curlyme',
    name: 'CurlyMe',
    type: 'shopify',
    baseUrl: 'https://curlyme.com',
    currency: 'USD',
  },
  {
    key: 'truegloryhair',
    name: 'True Glory Hair',
    type: 'shopify',
    baseUrl: 'https://www.truegloryhair.com',
    currency: 'USD',
  },
  {
    key: 'hairvivi',
    name: 'Hairvivi',
    type: 'shopify',
    baseUrl: 'https://www.hairvivi.com',
    currency: 'USD',
  },
  {
    key: 'mayvenn',
    name: 'Mayvenn',
    type: 'shopify',
    baseUrl: 'https://www.mayvenn.com',
    currency: 'USD',
  },
];

export function selectSources(filter?: string[]): SourceConfig[] {
  if (!filter || filter.length === 0) return SOURCES;
  const keys = new Set(filter);
  return SOURCES.filter(s => keys.has(s.key));
}
