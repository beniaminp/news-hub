import { useState, useCallback } from 'react';
import { UserPreferences, Category } from '../types';

const LOCAL_PREFS_KEY = 'newshub_preferences';

const DEFAULT_PREFS: UserPreferences = {
  selectedCategories: ['top', 'world', 'technology', 'business', 'science'],
  selectedSourceIds: [],
  onboardingComplete: false,
};

function getLocalPrefs(): UserPreferences {
  try {
    const raw = localStorage.getItem(LOCAL_PREFS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_PREFS;
}

function setLocalPrefs(prefs: UserPreferences) {
  localStorage.setItem(LOCAL_PREFS_KEY, JSON.stringify(prefs));
}

export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(getLocalPrefs);

  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    setPreferences(prev => {
      const newPrefs = { ...prev, ...updates };
      setLocalPrefs(newPrefs);
      return newPrefs;
    });
  }, []);

  const toggleCategory = useCallback((category: Category) => {
    setPreferences(prev => {
      const current = prev.selectedCategories;
      const updated = current.includes(category)
        ? current.filter(c => c !== category)
        : [...current, category];
      const newPrefs = { ...prev, selectedCategories: updated };
      setLocalPrefs(newPrefs);
      return newPrefs;
    });
  }, []);

  const toggleSource = useCallback((sourceId: string) => {
    setPreferences(prev => {
      const current = prev.selectedSourceIds;
      const updated = current.includes(sourceId)
        ? current.filter(id => id !== sourceId)
        : [...current, sourceId];
      const newPrefs = { ...prev, selectedSourceIds: updated };
      setLocalPrefs(newPrefs);
      return newPrefs;
    });
  }, []);

  const completeOnboarding = useCallback(() => {
    setPreferences(prev => {
      const newPrefs = { ...prev, onboardingComplete: true };
      setLocalPrefs(newPrefs);
      return newPrefs;
    });
  }, []);

  return {
    preferences,
    loading: false,
    updatePreferences,
    toggleCategory,
    toggleSource,
    completeOnboarding,
  };
}
