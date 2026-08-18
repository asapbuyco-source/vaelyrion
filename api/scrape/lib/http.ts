const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 TaneliaCatalogBot/1.0 (respectful; contact: ops@tanelia.shop)';

let lastRequestAt = 0;
const MIN_INTERVAL_MS = 700;

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

async function throttle() {
  const now = Date.now();
  const wait = Math.max(0, MIN_INTERVAL_MS - (now - lastRequestAt));
  lastRequestAt = now + wait;
  if (wait > 0) await sleep(wait);
}

export async function fetchWithRetry(url: string, attempts = 3): Promise<{ status: number; text: string; url: string }> {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    await throttle();
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 20000);
      const res = await fetch(url, {
        headers: { 'User-Agent': USER_AGENT, Accept: 'text/html,application/json,*/*' },
        signal: controller.signal,
        redirect: 'follow',
      });
      clearTimeout(timer);
      if (res.status === 429 || res.status >= 500) {
        await sleep(2000 * attempt);
        continue;
      }
      return { status: res.status, text: await res.text(), url: res.url };
    } catch (err: any) {
      if (attempt === attempts) throw new Error(`Request failed for ${url}: ${err.message}`);
      await sleep(1500 * attempt);
    }
  }
  throw new Error(`Request failed for ${url}: max retries exceeded`);
}

export async function fetchJson<T>(url: string): Promise<T> {
  const { status, text } = await fetchWithRetry(url);
  if (status !== 200) throw new Error(`GET ${url} -> HTTP ${status}`);
  return JSON.parse(text) as T;
}

const disallowed: string[] = [];

export async function checkRobots(origin: string): Promise<void> {
  try {
    const { status, text } = await fetchWithRetry(`${origin}/robots.txt`, 1);
    if (status !== 200) return;
    let currentAgent = '*';
    for (const raw of text.split(/\r?\n/)) {
      const line = raw.trim();
      if (!line || line.startsWith('#')) continue;
      const [field, ...rest] = line.split(':');
      const value = rest.join(':').trim();
      if (field.toLowerCase() === 'user-agent') currentAgent = value;
      else if (field.toLowerCase() === 'disallow' && (currentAgent === '*' || currentAgent.includes('TaneliaCatalogBot'))) {
        if (value) disallowed.push(value);
      }
    }
  } catch {
    // robots.txt unreachable — proceed with caution
  }
}

export function isDisallowed(pathname: string): boolean {
  return disallowed.some(rule => pathname.startsWith(rule));
}
