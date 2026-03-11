import { Category, CATEGORY_LABELS } from '../../types';

const ALL_CATEGORIES: Category[] = [
  'top', 'world', 'politics', 'business', 'technology',
  'science', 'health', 'sports', 'entertainment', 'environment', 'lifestyle',
];

const CATEGORY_ICONS: Record<Category, string> = {
  top: '\u{1F4F0}',
  world: '\u{1F30D}',
  politics: '\u{1F3DB}',
  business: '\u{1F4BC}',
  technology: '\u{1F4BB}',
  science: '\u{1F52C}',
  health: '\u{2764}',
  sports: '\u{26BD}',
  entertainment: '\u{1F3AC}',
  environment: '\u{1F331}',
  lifestyle: '\u{2615}',
};

interface Props {
  selected: Category[];
  onToggle: (category: Category) => void;
}

export function TopicPicker({ selected, onToggle }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {ALL_CATEGORIES.map((category) => {
        const isSelected = selected.includes(category);
        return (
          <button
            key={category}
            onClick={() => onToggle(category)}
            className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all ${
              isSelected
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/50 dark:border-blue-500 shadow-sm'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <span className="text-2xl">{CATEGORY_ICONS[category]}</span>
            <span className={`font-medium ${isSelected ? 'text-blue-700 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
              {CATEGORY_LABELS[category]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
