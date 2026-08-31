// Privacy-first analytics. Tracks high-level commerce events only.
// No emails, names, addresses, or card data are ever sent.
export const track = (event: string, data: Record<string, unknown> = {}) => {
  try {
    const token = localStorage.getItem('tanelia_token');
    fetch('/api/v1/analytics/event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        event,
        ...data,
        path: data.path || window.location.pathname,
      }),
      keepalive: true,
    }).catch(() => { /* analytics must never break the experience */ });
  } catch { /* ignore */ }
};
