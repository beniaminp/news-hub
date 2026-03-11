import { useState, useEffect, useCallback, useRef } from 'react';
import { Article, Category } from '../types';
import { fetchNewsForCategory } from '../services/newsService';

const REFRESH_INTERVAL = 60 * 60 * 1000; // 1 hour

export function useNews(
  category: Category,
  selectedSourceIds?: string[],
  userCategories?: Category[],
) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadNews = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNewsForCategory(category, selectedSourceIds, userCategories, forceRefresh);
      setArticles(data);
    } catch (err) {
      setError('Failed to load news. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [category, selectedSourceIds, userCategories]);

  useEffect(() => {
    loadNews();

    intervalRef.current = setInterval(() => {
      loadNews(true);
    }, REFRESH_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [loadNews]);

  const refresh = useCallback(() => loadNews(true), [loadNews]);

  return { articles, loading, error, refresh };
}
