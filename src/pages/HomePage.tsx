import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CategoryTabs } from '../components/Layout/CategoryTabs';
import { NewsList } from '../components/News/NewsList';
import { useNews } from '../hooks/useNews';
import { usePreferences } from '../hooks/usePreferences';
import { useAuth } from '../context/AuthContext';
import { Category } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export function HomePage() {
  const { user } = useAuth();
  const { preferences, loading: prefsLoading } = usePreferences();
  const navigate = useNavigate();

  const categories = preferences.selectedCategories.length > 0
    ? preferences.selectedCategories
    : (['top', 'world', 'technology', 'business', 'science'] as Category[]);

  const [activeCategory, setActiveCategory] = useState<Category>(categories[0]);

  // Redirect to onboarding if not completed
  useEffect(() => {
    if (user && !prefsLoading && !preferences.onboardingComplete) {
      navigate('/onboarding');
    }
  }, [user, prefsLoading, preferences.onboardingComplete, navigate]);

  // Reset active category if it's not in the list
  useEffect(() => {
    if (!categories.includes(activeCategory)) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  const sourceIds = preferences.selectedSourceIds.length > 0
    ? preferences.selectedSourceIds
    : undefined;

  const { articles, loading, error, refresh } = useNews(activeCategory, sourceIds);

  if (prefsLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />
      <NewsList
        articles={articles}
        loading={loading}
        error={error}
        onRefresh={refresh}
      />
    </div>
  );
}
