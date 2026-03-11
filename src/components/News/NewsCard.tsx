import { formatDistanceToNow } from 'date-fns';
import { Article } from '../../types';

interface Props {
  article: Article;
  variant?: 'default' | 'compact';
}

export function NewsCard({ article, variant = 'default' }: Props) {
  if (variant === 'compact') {
    return (
      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex gap-3 rounded-lg p-3 transition-colors hover:bg-gray-50"
      >
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-xs font-medium text-blue-600">{article.source}</span>
            <span className="text-xs text-gray-400">
              {formatDistanceToNow(article.pubDate, { addSuffix: true })}
            </span>
          </div>
          <h3 className="line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-blue-600">
            {article.title}
          </h3>
        </div>
        {article.imageUrl && (
          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
            <img
              src={article.imageUrl}
              alt=""
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
      </a>
    );
  }

  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md"
    >
      {article.imageUrl ? (
        <div className="aspect-video overflow-hidden bg-gray-100">
          <img
            src={article.imageUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      ) : (
        <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <svg className="h-10 w-10 text-gray-200" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z" />
          </svg>
        </div>
      )}
      <div className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xs font-medium text-blue-600">{article.source}</span>
          <span className="text-xs text-gray-400">
            {formatDistanceToNow(article.pubDate, { addSuffix: true })}
          </span>
        </div>
        <h3 className="mb-2 line-clamp-2 font-semibold text-gray-900 group-hover:text-blue-600">
          {article.title}
        </h3>
        {article.description && (
          <p className="line-clamp-2 text-sm text-gray-500">{article.description}</p>
        )}
      </div>
    </a>
  );
}
