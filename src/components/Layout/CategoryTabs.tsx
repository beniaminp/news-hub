import { Category, CATEGORY_LABELS } from '../../types';

interface Props {
  categories: Category[];
  activeCategory: Category;
  onSelect: (category: Category) => void;
}

export function CategoryTabs({ categories, activeCategory, onSelect }: Props) {
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <nav className="-mb-px flex gap-1 overflow-x-auto scrollbar-hide" aria-label="Categories">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onSelect(category)}
              className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {CATEGORY_LABELS[category]}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
