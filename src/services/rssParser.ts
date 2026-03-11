import { Article, Category } from '../types';

// rss2json.com is a dedicated RSS-to-JSON service with CORS support
// Free tier: 10,000 requests/day — more than enough
const RSS2JSON_URL = 'https://api.rss2json.com/v1/api.json';

interface Rss2JsonResponse {
  status: string;
  feed: { title: string; link: string; image: string };
  items: Array<{
    title: string;
    pubDate: string;
    link: string;
    description: string;
    thumbnail: string;
    enclosure?: { link: string; type: string };
    content?: string;
  }>;
}

async function fetchViaRss2Json(
  rssUrl: string,
  sourceId: string,
  sourceName: string,
  category: Category,
): Promise<Article[]> {
  const url = `${RSS2JSON_URL}?rss_url=${encodeURIComponent(rssUrl)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const data: Rss2JsonResponse = await response.json();
  if (data.status !== 'ok') throw new Error(`rss2json: ${data.status}`);

  return data.items
    .filter(item => item.title)
    .map(item => {
      // Find best image
      let imageUrl = item.thumbnail || undefined;
      if (!imageUrl && item.enclosure?.type?.startsWith('image')) {
        imageUrl = item.enclosure.link;
      }
      if (!imageUrl && item.content) {
        const match = item.content.match(/<img[^>]+src=["']([^"']+)["']/);
        if (match) imageUrl = match[1];
      }
      if (!imageUrl && item.description) {
        const match = item.description.match(/<img[^>]+src=["']([^"']+)["']/);
        if (match) imageUrl = match[1];
      }

      const cleanDesc = (item.description || '')
        .replace(/<[^>]*>/g, '')
        .substring(0, 300)
        .trim();

      return {
        id: `${sourceId}-${btoa(unescape(encodeURIComponent(item.link || item.title))).substring(0, 20)}`,
        title: item.title,
        description: cleanDesc,
        link: item.link,
        pubDate: new Date(item.pubDate),
        imageUrl,
        source: sourceName,
        sourceId,
        category,
      };
    });
}

// Fallback: CORS proxy + manual XML parse
async function fetchViaCorsProxy(
  rssUrl: string,
  sourceId: string,
  sourceName: string,
  category: Category,
): Promise<Article[]> {
  const proxies = [
    `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`,
    `https://corsproxy.io/?${encodeURIComponent(rssUrl)}`,
  ];

  for (const proxyUrl of proxies) {
    try {
      const response = await fetch(proxyUrl);
      if (!response.ok) continue;

      let xml: string;
      // allorigins returns JSON with .contents
      if (proxyUrl.includes('allorigins')) {
        const data = await response.json();
        xml = data?.contents;
      } else {
        xml = await response.text();
      }

      if (!xml || xml.length < 100) continue;

      const articles = parseXml(xml, sourceId, sourceName, category);
      if (articles.length > 0) return articles;
    } catch {
      continue;
    }
  }

  return [];
}

function parseXml(xml: string, sourceId: string, sourceName: string, category: Category): Article[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');
  if (doc.querySelector('parsererror')) return [];

  const articles: Article[] = [];

  // RSS 2.0
  const items = doc.querySelectorAll('item');
  items.forEach((item) => {
    const title = item.querySelector('title')?.textContent?.trim() || '';
    const link = item.querySelector('link')?.textContent?.trim() || '';
    const description = item.querySelector('description')?.textContent?.trim() || '';
    const pubDateStr = item.querySelector('pubDate')?.textContent?.trim();
    const pubDate = pubDateStr ? new Date(pubDateStr) : new Date();

    let imageUrl: string | undefined;
    const mt = item.getElementsByTagNameNS('http://search.yahoo.com/mrss/', 'thumbnail')[0];
    if (mt) imageUrl = mt.getAttribute('url') || undefined;
    if (!imageUrl) {
      const mc = item.getElementsByTagNameNS('http://search.yahoo.com/mrss/', 'content')[0];
      if (mc?.getAttribute('url')) imageUrl = mc.getAttribute('url') || undefined;
    }
    if (!imageUrl) {
      const enc = item.querySelector('enclosure');
      if (enc?.getAttribute('type')?.startsWith('image')) imageUrl = enc.getAttribute('url') || undefined;
    }
    if (!imageUrl) {
      const match = description.match(/<img[^>]+src=["']([^"']+)["']/);
      if (match) imageUrl = match[1];
    }

    const cleanDesc = description.replace(/<[^>]*>/g, '').substring(0, 300);
    if (title) {
      articles.push({
        id: `${sourceId}-${btoa(unescape(encodeURIComponent(link || title))).substring(0, 20)}`,
        title, description: cleanDesc, link, pubDate, imageUrl,
        source: sourceName, sourceId, category,
      });
    }
  });

  if (articles.length > 0) return articles;

  // Atom
  doc.querySelectorAll('entry').forEach((entry) => {
    const title = entry.querySelector('title')?.textContent?.trim() || '';
    const linkEl = entry.querySelector('link[rel="alternate"]') || entry.querySelector('link');
    const link = linkEl?.getAttribute('href') || '';
    const summary = entry.querySelector('summary')?.textContent?.trim() || entry.querySelector('content')?.textContent?.trim() || '';
    const pubDateStr = entry.querySelector('published')?.textContent?.trim() || entry.querySelector('updated')?.textContent?.trim();
    const pubDate = pubDateStr ? new Date(pubDateStr) : new Date();
    const cleanDesc = summary.replace(/<[^>]*>/g, '').substring(0, 300);
    let imageUrl: string | undefined;
    const match = summary.match(/<img[^>]+src=["']([^"']+)["']/);
    if (match) imageUrl = match[1];

    if (title) {
      articles.push({
        id: `${sourceId}-${btoa(unescape(encodeURIComponent(link || title))).substring(0, 20)}`,
        title, description: cleanDesc, link, pubDate, imageUrl,
        source: sourceName, sourceId, category,
      });
    }
  });

  return articles;
}

// Our own Vercel proxy — no CORS issues, no third-party dependency
async function fetchViaOwnProxy(
  rssUrl: string,
  sourceId: string,
  sourceName: string,
  category: Category,
): Promise<Article[]> {
  const response = await fetch(`/api/rss?url=${encodeURIComponent(rssUrl)}`);
  if (!response.ok) throw new Error(`Proxy ${response.status}`);
  const xml = await response.text();
  if (!xml || xml.length < 100) throw new Error('Empty response');
  return parseXml(xml, sourceId, sourceName, category);
}

export async function fetchRSSFeed(
  rssUrl: string,
  sourceId: string,
  sourceName: string,
  category: Category,
): Promise<Article[]> {
  // 1. Own proxy (Vercel edge function)
  try {
    const articles = await fetchViaOwnProxy(rssUrl, sourceId, sourceName, category);
    if (articles.length > 0) return articles;
  } catch {
    // fall through
  }

  // 2. rss2json.com as fallback
  try {
    const articles = await fetchViaRss2Json(rssUrl, sourceId, sourceName, category);
    if (articles.length > 0) return articles;
  } catch {
    // fall through
  }

  // 3. CORS proxies as last resort
  try {
    return await fetchViaCorsProxy(rssUrl, sourceId, sourceName, category);
  } catch {
    return [];
  }
}
