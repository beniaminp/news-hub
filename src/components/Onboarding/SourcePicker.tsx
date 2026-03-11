import { Category, CATEGORY_LABELS, NewsSource } from '../../types';
import { NEWS_SOURCES } from '../../config/sources';

interface Props {
  selectedCategories: Category[];
  selectedSourceIds: string[];
  onToggleSource: (sourceId: string) => void;
  onSelectAll: (sourceIds: string[]) => void;
}

export function SourcePicker({ selectedCategories, selectedSourceIds, onToggleSource, onSelectAll }: Props) {
  const filteredSources = NEWS_SOURCES.filter(s => selectedCategories.includes(s.category));
  const groupedSources = new Map<Category, NewsSource[]>();

  for (const source of filteredSources) {
    const list = groupedSources.get(source.category) || [];
    list.push(source);
    groupedSources.set(source.category, list);
  }

  return (
    <div className="space-y-6">
      {Array.from(groupedSources.entries()).map(([category, sources]) => {
        const allSelected = sources.every(s => selectedSourceIds.includes(s.id));
        const categorySourceIds = sources.map(s => s.id);

        return (
          <div key={category}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                {CATEGORY_LABELS[category]}
              </h3>
              <button
                onClick={() => {
                  if (allSelected) {
                    onSelectAll(selectedSourceIds.filter(id => !categorySourceIds.includes(id)));
                  } else {
                    onSelectAll([...new Set([...selectedSourceIds, ...categorySourceIds])]);
                  }
                }}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {allSelected ? 'Deselect all' : 'Select all'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {sources.map((source) => {
                const isSelected = selectedSourceIds.includes(source.id);
                return (
                  <button
                    key={source.id}
                    onClick={() => onToggleSource(source.id)}
                    className={`rounded-lg border-2 px-3 py-2 text-left text-sm transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className={`font-medium ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                      {source.name}
                    </div>
                    <div className="text-xs text-gray-400">{source.country}</div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
