import { Article, Category } from '../types';

const CORS_PROXIES = [
  {
    name: 'allorigins',
    url: (feedUrl: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`,
    parse: async (response: Response) => {
      const data = await response.json();
      return data?.contents as string | undefined;
    },
  },
  {
    name: 'corsproxy',
    url: (feedUrl: string) => `https://corsproxy.io/?url=${encodeURIComponent(feedUrl)}`,
    parse: async (response: Response) => {
      return await response.text();
    },
  },
];

async function fetchWithProxy(url: string): Promise<string> {
  for (const proxy of CORS_PROXIES) {
    try {
      const proxyUrl = proxy.url(url);
      const response = await fetch(proxyUrl);
      if (!response.ok) continue;
      const text = await proxy.parse(response);
      if (text && text.length > 50) return text;
    } catch {
      continue;
    }
  }
  // Last resort: direct fetch (works if source allows CORS)
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

  // Check for parse error
  const parseError = doc.querySelector('parsererror');
  if (parseError) return [];

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

      let imageUrl: string | undefined;

      // media:thumbnail
      const mediaThumbnail = item.getElementsByTagNameNS('http://search.yahoo.com/mrss/', 'thumbnail')[0];
      if (mediaThumbnail) {
        imageUrl = mediaThumbnail.getAttribute('url') || undefined;
      }
      // media:content
      if (!imageUrl) {
        const mediaContentNS = item.getElementsByTagNameNS('http://search.yahoo.com/mrss/', 'content')[0];
        if (mediaContentNS?.getAttribute('url')) {
          imageUrl = mediaContentNS.getAttribute('url') || undefined;
        }
      }
      // enclosure
      if (!imageUrl) {
        const enclosure = item.querySelector('enclosure');
        if (enclosure?.getAttribute('type')?.startsWith('image')) {
          imageUrl = enclosure.getAttribute('url') || undefined;
        }
      }
      // image in description HTML
      if (!imageUrl) {
        imageUrl = extractImageFromContent(description);
      }
      // content:encoded
      if (!imageUrl) {
        const contentEncoded = item.getElementsByTagNameNS('http://purl.org/rss/1.0/modules/content/', 'encoded')[0];
        if (contentEncoded?.textContent) {
          imageUrl = extractImageFromContent(contentEncoded.textContent);
        }
      }

      const cleanDesc = description.replace(/<[^>]*>/g, '').substring(0, 300);

      if (title) {
        articles.push({
          id: `${sourceId}-${btoa(unescape(encodeURIComponent(link || title))).substring(0, 20)}`,
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
    let imageUrl = extractImageFromContent(summary);

    // media:thumbnail in Atom
    if (!imageUrl) {
      const mediaThumbnail = entry.getElementsByTagNameNS('http://search.yahoo.com/mrss/', 'thumbnail')[0];
      if (mediaThumbnail) {
        imageUrl = mediaThumbnail.getAttribute('url') || undefined;
      }
    }

    if (title) {
      articles.push({
        id: `${sourceId}-${btoa(unescape(encodeURIComponent(link || title))).substring(0, 20)}`,
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
