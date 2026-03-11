import { useNavigate } from 'react-router-dom';
import { TopicPicker } from '../components/Onboarding/TopicPicker';
import { SourcePicker } from '../components/Onboarding/SourcePicker';
import { usePreferences } from '../hooks/usePreferences';
import { useTheme } from '../hooks/useTheme';
import { clearAllCache } from '../services/newsService';
import { Category } from '../types';

export function SettingsPage() {
  const { preferences, toggleCategory, toggleSource, updatePreferences } = usePreferences();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
        <button
          onClick={() => navigate('/')}
          className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Done
        </button>
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">Theme</h2>
        <div className="flex gap-2">
          {(['system', 'light', 'dark'] as const).map((option) => (
            <button
              key={option}
              onClick={() => setTheme(option)}
              className={`rounded-lg px-5 py-2.5 text-sm font-medium transition-all ${
                theme === option
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">Topics</h2>
        <TopicPicker
          selected={preferences.selectedCategories}
          onToggle={(category: Category) => toggleCategory(category)}
        />
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">Sources</h2>
        <SourcePicker
          selectedCategories={preferences.selectedCategories}
          selectedSourceIds={preferences.selectedSourceIds}
          onToggleSource={(sourceId: string) => toggleSource(sourceId)}
          onSelectAll={(ids: string[]) => updatePreferences({ selectedSourceIds: ids })}
        />
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <h2 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-100">Cache</h2>
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          News is cached for 1 hour. Clear the cache to fetch fresh articles.
        </p>
        <button
          onClick={() => {
            clearAllCache();
            navigate('/');
          }}
          className="rounded-lg bg-gray-100 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          Clear cache & refresh
        </button>
      </div>
    </div>
  );
}
