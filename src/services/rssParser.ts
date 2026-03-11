import { Article, Category } from '../types';

const CORS_PROXIES = [
  (url: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
];

async function fetchWithProxy(url: string): Promise<string> {
  for (const proxy of CORS_PROXIES) {
    try {
      const proxyUrl = proxy(url);
      const response = await fetch(proxyUrl);
      if (!response.ok) continue;

      const data = await response.json().catch(() => null);
      // allorigins returns { contents: "..." }
      if (data?.contents) return data.contents;

      // corsproxy returns raw text
      const text = await response.text().catch(() => null);
      if (text) return text;
    } catch {
      continue;
    }
  }
  // Last resort: direct fetch (works if CORS is allowed)
  const response = await fetch(url);
  return response.text();
}

function extractImageFromContent(content: string): string | undefined {
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/);
  if (imgMatch) return imgMatch[1];

  const mediaMatch = content.match(/<media:content[^>]+url=["']([^"']+)["']/);
  if (mediaMatch) return mediaMatch[1];

  return undefined;
}

function parseRSSXml(xml: string, sourceId: string, sourceName: string, category: Category): Article[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');

  const articles: Article[] = [];

  // Try RSS 2.0 format
  const items = doc.querySelectorAll('item');
  if (items.length > 0) {
    items.forEach((item) => {
      const title = item.querySelector('title')?.textContent?.trim() || '';
      const link = item.querySelector('link')?.textContent?.trim() || '';
      const description = item.querySelector('description')?.textContent?.trim() || '';
      const pubDateStr = item.querySelector('pubDate')?.textContent?.trim();
      const pubDate = pubDateStr ? new Date(pubDateStr) : new Date();

      // Try multiple image sources
      let imageUrl: string | undefined;
      const mediaContent = item.querySelector('content');
      if (mediaContent?.getAttribute('url')) {
        imageUrl = mediaContent.getAttribute('url') || undefined;
      }
      const enclosure = item.querySelector('enclosure');
      if (!imageUrl && enclosure?.getAttribute('type')?.startsWith('image')) {
        imageUrl = enclosure.getAttribute('url') || undefined;
      }
      if (!imageUrl) {
        const mediaThumbnail = item.getElementsByTagNameNS('http://search.yahoo.com/mrss/', 'thumbnail')[0];
        if (mediaThumbnail) {
          imageUrl = mediaThumbnail.getAttribute('url') || undefined;
        }
      }
      if (!imageUrl) {
        const mediaContentNS = item.getElementsByTagNameNS('http://search.yahoo.com/mrss/', 'content')[0];
        if (mediaContentNS) {
          imageUrl = mediaContentNS.getAttribute('url') || undefined;
        }
      }
      if (!imageUrl) {
        imageUrl = extractImageFromContent(description);
      }

      // Clean description of HTML tags
      const cleanDesc = description.replace(/<[^>]*>/g, '').substring(0, 300);

      if (title) {
        articles.push({
          id: `${sourceId}-${btoa(link || title).substring(0, 20)}`,
          title,
          description: cleanDesc,
          link,
          pubDate,
          imageUrl,
          source: sourceName,
          sourceId,
          category,
        });
      }
    });
    return articles;
  }

  // Try Atom format
  const entries = doc.querySelectorAll('entry');
  entries.forEach((entry) => {
    const title = entry.querySelector('title')?.textContent?.trim() || '';
    const linkEl = entry.querySelector('link[rel="alternate"]') || entry.querySelector('link');
    const link = linkEl?.getAttribute('href') || '';
    const summary = entry.querySelector('summary')?.textContent?.trim() || entry.querySelector('content')?.textContent?.trim() || '';
    const pubDateStr = entry.querySelector('published')?.textContent?.trim() || entry.querySelector('updated')?.textContent?.trim();
    const pubDate = pubDateStr ? new Date(pubDateStr) : new Date();

    const cleanDesc = summary.replace(/<[^>]*>/g, '').substring(0, 300);
    const imageUrl = extractImageFromContent(summary);

    if (title) {
      articles.push({
        id: `${sourceId}-${btoa(link || title).substring(0, 20)}`,
        title,
        description: cleanDesc,
        link,
        pubDate,
        imageUrl,
        source: sourceName,
        sourceId,
        category,
      });
    }
  });

  return articles;
}

export async function fetchRSSFeed(
  rssUrl: string,
  sourceId: string,
  sourceName: string,
  category: Category,
): Promise<Article[]> {
  try {
    const xml = await fetchWithProxy(rssUrl);
    return parseRSSXml(xml, sourceId, sourceName, category);
  } catch (error) {
    console.warn(`Failed to fetch RSS from ${sourceName}:`, error);
    return [];
  }
}
