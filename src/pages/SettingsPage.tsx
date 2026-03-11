import { useNavigate } from 'react-router-dom';
import { TopicPicker } from '../components/Onboarding/TopicPicker';
import { SourcePicker } from '../components/Onboarding/SourcePicker';
import { usePreferences } from '../hooks/usePreferences';
import { clearAllCache } from '../services/newsService';
import { Category } from '../types';

export function SettingsPage() {
  const { preferences, toggleCategory, toggleSource, updatePreferences } = usePreferences();
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <button
          onClick={() => navigate('/')}
          className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
        >
          Done
        </button>
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Topics</h2>
        <TopicPicker
          selected={preferences.selectedCategories}
          onToggle={(category: Category) => toggleCategory(category)}
        />
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Sources</h2>
        <SourcePicker
          selectedCategories={preferences.selectedCategories}
          selectedSourceIds={preferences.selectedSourceIds}
          onToggleSource={(sourceId: string) => toggleSource(sourceId)}
          onSelectAll={(ids: string[]) => updatePreferences({ selectedSourceIds: ids })}
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-2 text-lg font-semibold text-gray-800">Cache</h2>
        <p className="mb-4 text-sm text-gray-500">
          News is cached for 1 hour. Clear the cache to fetch fresh articles.
        </p>
        <button
          onClick={() => {
            clearAllCache();
            navigate('/');
          }}
          className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          Clear cache & refresh
        </button>
      </div>
    </div>
  );
}
