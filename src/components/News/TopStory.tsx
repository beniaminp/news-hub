import { formatDistanceToNow } from 'date-fns';
import { Article } from '../../types';

interface Props {
  article: Article;
}

export function TopStory({ article }: Props) {
  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg"
    >
      <div className="grid gap-0 md:grid-cols-2">
        {article.imageUrl ? (
          <div className="aspect-video overflow-hidden bg-gray-100 md:aspect-auto md:min-h-[300px]">
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
          <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 md:aspect-auto md:min-h-[300px]">
            <svg className="h-16 w-16 text-blue-200" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z" />
            </svg>
          </div>
        )}
        <div className="flex flex-col justify-center p-6">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-sm font-medium text-blue-600">{article.source}</span>
            <span className="text-xs text-gray-400">
              {formatDistanceToNow(article.pubDate, { addSuffix: true })}
            </span>
          </div>
          <h2 className="mb-3 text-2xl font-bold leading-tight text-gray-900 group-hover:text-blue-600">
            {article.title}
          </h2>
          {article.description && (
            <p className="line-clamp-3 text-gray-600">{article.description}</p>
          )}
        </div>
      </div>
    </a>
  );
}
