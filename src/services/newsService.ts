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

// Keywords that signal an article belongs to a specific category.
// Used to filter out off-topic articles from general/top feeds.
const CATEGORY_KEYWORDS: Partial<Record<Category, RegExp>> = {
  sports: /\b(nfl|nba|mlb|nhl|fifa|premier league|champions league|serie a|la liga|bundesliga|tennis|golf|f1|formula|cricket|rugby|boxing|ufc|mma|quarterback|touchdown|goalkeeper|medal|olympic|athlete|playoff|championship|match day|halftime|striker|midfielder|slam dunk|grand prix|world cup)\b/i,
  entertainment: /\b(movie|film|album|concert|grammy|oscar|emmy|tony award|box office|trailer|celebrity|red carpet|netflix series|disney|blockbuster|soundtrack)\b/i,
};

// If user didn't select a category, filter out articles that clearly belong to it
function filterOffTopicArticles(
  articles: Article[],
  activeCategory: Category,
  userCategories: Category[],
): Article[] {
  // Build list of categories to exclude
  const excludePatterns: RegExp[] = [];
  for (const [cat, pattern] of Object.entries(CATEGORY_KEYWORDS)) {
    if (!userCategories.includes(cat as Category) && cat !== activeCategory) {
      excludePatterns.push(pattern);
    }
  }
  if (excludePatterns.length === 0) return articles;

  return articles.filter(article => {
    const text = `${article.title} ${article.description}`.toLowerCase();
    return !excludePatterns.some(p => p.test(text));
  });
}

export async function fetchNewsForCategory(
  category: Category,
  selectedSourceIds?: string[],
  userCategories?: Category[],
  forceRefresh = false,
): Promise<Article[]> {
  if (!forceRefresh) {
    const cached = getCachedArticles(category);
    if (cached) return cached;
  }

  const allCategorySources = NEWS_SOURCES.filter(s => s.category === category);

  // Only filter by selectedSourceIds if user picked specific sources in THIS category
  let sources = allCategorySources;
  if (selectedSourceIds && selectedSourceIds.length > 0) {
    const filtered = allCategorySources.filter(s => selectedSourceIds.includes(s.id));
    // If user selected sources in this category, use those; otherwise show all
    if (filtered.length > 0) {
      sources = filtered;
    }
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
  const deduped = articles.filter(article => {
    const key = article.title.toLowerCase().substring(0, 60);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Interleave sources: round-robin pick from each source's queue
  // so no single source dominates the feed
  const bySource = new Map<string, Article[]>();
  for (const article of deduped) {
    const list = bySource.get(article.sourceId) || [];
    list.push(article);
    bySource.set(article.sourceId, list);
  }

  const queues = Array.from(bySource.values());
  const unique: Article[] = [];
  let maxLen = Math.max(...queues.map(q => q.length), 0);
  for (let i = 0; i < maxLen; i++) {
    for (const queue of queues) {
      if (i < queue.length) {
        unique.push(queue[i]);
      }
    }
  }

  // Filter out off-topic articles (e.g. sports from "top" feeds when user didn't select sports)
  const filtered = userCategories
    ? filterOffTopicArticles(unique, category, userCategories)
    : unique;

  setCachedArticles(category, filtered);
  return filtered;
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
    const articles = await fetchNewsForCategory(category, sourceIds, undefined, forceRefresh);
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
