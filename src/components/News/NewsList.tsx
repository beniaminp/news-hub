import { Article } from '../../types';
import { TopStory } from './TopStory';
import { NewsCard } from './NewsCard';

interface Props {
  articles: Article[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export function NewsList({ articles, loading, error, onRefresh }: Props) {
  if (loading && articles.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="aspect-video bg-gray-200 dark:bg-gray-700" />
              <div className="p-4">
                <div className="mb-2 h-3 w-20 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="mb-2 h-5 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="mb-4 text-gray-500 dark:text-gray-400">{error}</p>
        <button
          onClick={onRefresh}
          className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="text-gray-500 dark:text-gray-400">No articles found. Try selecting different sources or categories.</p>
      </div>
    );
  }

  const [topStory, ...rest] = articles;
  const mainCards = rest.slice(0, 5);
  const sideItems = rest.slice(5, 15);
  const moreCards = rest.slice(15);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Refresh button */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
        >
          <svg className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Top Story */}
      <div className="mb-8">
        <TopStory article={topStory} />
      </div>

      {/* Main grid with sidebar */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main cards - 2 column grid */}
        <div className="lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            {mainCards.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        </div>

        {/* Sidebar - compact list */}
        {sideItems.length > 0 && (
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2">
            <h3 className="px-3 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">More Stories</h3>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {sideItems.map((article) => (
                <NewsCard key={article.id} article={article} variant="compact" />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* More cards below */}
      {moreCards.length > 0 && (
        <div className="mt-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {moreCards.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
