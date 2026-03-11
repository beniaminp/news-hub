export const config = { runtime: 'edge' };

const ALLOWED_PROTOCOLS = ['http:', 'https:'];

export default async function handler(request: Request) {
  const { searchParams } = new URL(request.url);
  const feedUrl = searchParams.get('url');

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800',
  };

  if (!feedUrl) {
    return new Response(JSON.stringify({ error: 'Missing ?url= parameter' }), {
      status: 400,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  }

  try {
    const parsed = new URL(feedUrl);
    if (!ALLOWED_PROTOCOLS.includes(parsed.protocol)) {
      return new Response(JSON.stringify({ error: 'Invalid protocol' }), {
        status: 400,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid URL' }), {
      status: 400,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  }

  try {
    const response = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'NewsHub/1.0 RSS Reader',
        'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml, */*',
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: `Upstream ${response.status}` }), {
        status: 502,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }

    const xml = await response.text();

    return new Response(xml, {
      status: 200,
      headers: {
        ...headers,
        'Content-Type': 'text/xml; charset=utf-8',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Fetch failed';
    return new Response(JSON.stringify({ error: message }), {
      status: 502,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  }
}
