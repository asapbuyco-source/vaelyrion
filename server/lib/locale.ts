// Language detection for journal articles. The editorial generator encodes the
// locale in the slug suffix (e.g. "...-german", "...-french"); English slugs
// carry no suffix.
const LANGUAGE_BY_SUFFIX: Record<string, string> = {
  norwegian: 'no',
  italian: 'it',
  spanish: 'es',
  german: 'de',
  french: 'fr',
};

export const languageFromSlug = (slug: unknown): string => {
  const match = String(slug || '').toLowerCase().match(/-([a-z]+)$/);
  return (match && LANGUAGE_BY_SUFFIX[match[1]]) || 'en';
};
