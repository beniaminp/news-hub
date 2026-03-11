import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CategoryTabs } from '../components/Layout/CategoryTabs';
import { NewsList } from '../components/News/NewsList';
import { useNews } from '../hooks/useNews';
import { usePreferences } from '../hooks/usePreferences';
import { Category } from '../types';

export function HomePage() {
  const { preferences } = usePreferences();
  const navigate = useNavigate();

  const categories = preferences.selectedCategories.length > 0
    ? preferences.selectedCategories
    : (['top', 'world', 'technology', 'business', 'science'] as Category[]);

  const [activeCategory, setActiveCategory] = useState<Category>(categories[0]);

  useEffect(() => {
    if (!preferences.onboardingComplete) {
      navigate('/onboarding');
    }
  }, [preferences.onboardingComplete, navigate]);

  useEffect(() => {
    if (!categories.includes(activeCategory)) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  const sourceIds = preferences.selectedSourceIds.length > 0
    ? preferences.selectedSourceIds
    : undefined;

  const { articles, loading, error, refresh } = useNews(activeCategory, sourceIds);

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
