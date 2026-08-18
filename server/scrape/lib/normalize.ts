import { load } from 'cheerio';
import { ScrapeCategory } from '../types';

export const CURRENCY_TO_EUR: Record<string, number> = {
  USD: 0.92,
  EUR: 1,
  GBP: 1.17,
  NOK: 0.086,
};

const TITLE_BLACKLIST: RegExp[] = [
  /gift\s*card/i,
  /test data/i,
  /synthetic/i,
  /gift\s*box/i,
  /travel\s*case/i,
];

export function isNoiseTitle(title: string, extraPatterns: RegExp[] = []): boolean {
  return [...TITLE_BLACKLIST, ...extraPatterns].some(re => re.test(title));
}

export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

export const htmlToText = (html: string): string => {
  try {
    return load(html).text().replace(/\s+/g, ' ').trim();
  } catch {
    return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }
};

export function detectCategory(text: string): ScrapeCategory {
  const t = text.toLowerCase();
  if (/bundle/.test(t)) return 'bundles';
  if (/clip.?in|tape.?in|weft|i.?tip|u.?tip|ponytail/.test(t)) return 'extensions';
  if (/(?<!for\s)wig|(?<!for\s)glueless/.test(t)) return 'wigs';
  if (/closure/.test(t)) return 'closures';
  if (/frontal/.test(t)) return 'frontals';
  return 'accessories';
}

const TEXTURE_RULES: Array<[RegExp, string]> = [
  [/silky\s*(blunt)?\s*cut/i, 'Silky Blunt Cut'],
  [/body\s*wave/i, 'Body Wave'],
  [/deep\s*wave/i, 'Deep Wave'],
  [/water\s*wave/i, 'Water Wave'],
  [/kinky\s*curly|afro\s*kinky|kinky/i, 'Kinky Curly'],
  [/loose\s*wave|loose\s*deep|loose\s*curly/i, 'Loose Wave'],
  [/jerry\s*curly|curly/i, 'Kinky Curly'],
  [/straight/i, 'Straight'],
  [/wave/i, 'Body Wave'],
];

export function detectTextures(text: string): string[] {
  const found: string[] = [];
  for (const [re, label] of TEXTURE_RULES) {
    if (re.test(text) && !found.includes(label)) found.push(label);
  }
  return found.length > 0 ? found : ['Body Wave'];
}

export function detectLengths(text: string): string[] {
  const out = new Set<string>();
  const re = /(\d{1,2})\s*(?:-|–|to|—)\s*(\d{1,2})?\s*(?:inch|"|''|in\b)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const min = parseInt(m[1]);
    const max = m[2] ? parseInt(m[2]) : min;
    if (min < 6 || max > 50) continue;
    out.add(`${min} inch`);
    if (max > min) out.add(`${max} inch`);
  }
  if (out.size === 0) {
    const single = /(\d{1,2})\s*(?:inch|"|''|in\b)/gi;
    while ((m = single.exec(text)) !== null) {
      const n = parseInt(m[1]);
      if (n >= 6 && n <= 50) out.add(`${n} inch`);
    }
  }
  return out.size > 0 ? [...out] : ['20 inch'];
}

const DENSITY_MAP: Record<string, string> = {
  '130': '150%', '140': '150%', '150': '150%',
  '160': '180%', '170': '180%', '180': '180%',
  '200': '200%', '250': '250%',
};

export function detectDensities(text: string): string[] {
  const out = new Set<string>();
  const re = /(1[3-8]0|200|250)\s*%/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const mapped = DENSITY_MAP[m[1]];
    if (mapped) out.add(mapped);
  }
  return out.size > 0 ? [...out] : ['180%'];
}

export function detectLaceTypes(text: string): string[] {
  const out: string[] = [];
  if (/13\s*[x×]\s*4/.test(text)) out.push('13x4 HD Swiss Lace');
  if (/13\s*[x×]\s*6/.test(text)) out.push('13x6 HD Lace');
  if (/5\s*[x×]\s*5/.test(text)) out.push('5x5 HD Closure');
  if (/full\s*lace/.test(text)) out.push('Full Lace Invisible');
  if (/transparent|invisible\s*lace|hd\s*lace|swiss\s*lace|lace\b/i.test(text)) out.push('Transparent Lace');
  if (out.length === 0) out.push('13x4 HD Swiss Lace');
  return [...new Set(out)];
}

const COLOR_RULES: Array<[RegExp, string]> = [
  [/#?1b\b|natural\s*black|off\s*black|1b\s*black/i, 'Natural Black (#1B)'],
  [/613|platinum|ash\s*blonde/i, 'Platinum Ash 613'],
  [/99j|burgundy/i, 'Burgundy (#99J)'],
  [/p4\/27|honey\s*blonde/i, 'Honey Blonde Mix (#P4/27)'],
  [/chestnut|brown/i, 'Rich Chestnut Brown'],
  [/(?:^|[^a-z])27\b/i, 'Honey Blonde Mix (#P4/27)'],
  [/jet\s*black|(?:^|[^a-z#])1\b|black/i, 'Jet Black (#1)'],
];

export function detectColors(text: string): string[] {
  const found: string[] = [];
  for (const [re, label] of COLOR_RULES) {
    if (re.test(text) && !found.includes(label)) found.push(label);
  }
  return found.length > 0 ? found : ['Natural Black (#1B)'];
}

const ORIGIN_RULES: Array<[RegExp, string]> = [
  [/cambodian/i, '100% Raw Cambodian Hair'],
  [/brazilian/i, '100% Raw Brazilian Hair'],
  [/peruvian/i, '100% Raw Peruvian Hair'],
  [/vietnamese/i, '100% Raw Vietnamese Hair'],
  [/indian/i, '100% Raw Indian Hair'],
  [/malaysian/i, '100% Raw Malaysian Hair'],
  [/burmese/i, '100% Raw Burmese Hair'],
];

export function detectHairOrigin(text: string): string {
  for (const [re, label] of ORIGIN_RULES) {
    if (re.test(text)) return label;
  }
  return '100% Raw Virgin Human Hair';
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
