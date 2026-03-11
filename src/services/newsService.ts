import { Article, CachedFeed, Category, NewsSource } from '../types';
import { NEWS_SOURCES } from '../config/sources';
import { fetchRSSFeed } from './rssParser';

const CACHE_KEY_PREFIX = 'newshub_cache_';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in ms

function getCacheKey(category: Category): string {
  return `${CACHE_KEY_PREFIX}${category}`;
}

function getCachedArticles(category: Category): Article[] | null {
  try {
    const raw = localStorage.getItem(getCacheKey(category));
    if (!raw) return null;
    const cached: CachedFeed = JSON.parse(raw);
    if (Date.now() - cached.fetchedAt > CACHE_DURATION) return null;
    // Restore Date objects
    return cached.articles.map(a => ({ ...a, pubDate: new Date(a.pubDate) }));
  } catch {
    return null;
  }
}

function setCachedArticles(category: Category, articles: Article[]): void {
  try {
    const cached: CachedFeed = { articles, fetchedAt: Date.now() };
    localStorage.setItem(getCacheKey(category), JSON.stringify(cached));
  } catch {
    // localStorage full, ignore
  }
}

export async function fetchNewsForCategory(
  category: Category,
  selectedSourceIds?: string[],
  forceRefresh = false,
): Promise<Article[]> {
  if (!forceRefresh) {
    const cached = getCachedArticles(category);
    if (cached) return cached;
  }

  let sources = NEWS_SOURCES.filter(s => s.category === category);
  if (selectedSourceIds && selectedSourceIds.length > 0) {
    sources = sources.filter(s => selectedSourceIds.includes(s.id));
  }

  // Fetch all feeds in parallel with a timeout
  const results = await Promise.allSettled(
    sources.map(source =>
      Promise.race([
        fetchRSSFeed(source.rssUrl, source.id, source.name, source.category),
        new Promise<Article[]>((resolve) => setTimeout(() => resolve([]), 10000)),
      ])
    )
  );

  const articles: Article[] = [];
  for (const result of results) {
    if (result.status === 'fulfilled') {
      articles.push(...result.value);
    }
  }

  // Sort by date, newest first
  articles.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  // Deduplicate by similar titles
  const seen = new Set<string>();
  const unique = articles.filter(article => {
    const key = article.title.toLowerCase().substring(0, 60);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  setCachedArticles(category, unique);
  return unique;
}

export async function fetchNewsForSources(
  sources: NewsSource[],
  forceRefresh = false,
): Promise<Article[]> {
  const byCategory = new Map<Category, NewsSource[]>();
  for (const source of sources) {
    const list = byCategory.get(source.category) || [];
    list.push(source);
    byCategory.set(source.category, list);
  }

  const allArticles: Article[] = [];
  const fetches = Array.from(byCategory.entries()).map(async ([category, categorySources]) => {
    const sourceIds = categorySources.map(s => s.id);
    const articles = await fetchNewsForCategory(category, sourceIds, forceRefresh);
    allArticles.push(...articles);
  });

  await Promise.allSettled(fetches);
  allArticles.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
  return allArticles;
}

export function getLastFetchTime(category: Category): number | null {
  try {
    const raw = localStorage.getItem(getCacheKey(category));
    if (!raw) return null;
    const cached: CachedFeed = JSON.parse(raw);
    return cached.fetchedAt;
  } catch {
    return null;
  }
}

export function clearAllCache(): void {
  const keys = Object.keys(localStorage).filter(k => k.startsWith(CACHE_KEY_PREFIX));
  keys.forEach(k => localStorage.removeItem(k));
}
