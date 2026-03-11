import { useState, useEffect, useCallback } from 'react';
import { UserPreferences, Category } from '../types';
import { getUserPreferences, saveUserPreferences } from '../services/firestore';
import { useAuth } from '../context/AuthContext';

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
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(getLocalPrefs());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      if (user) {
        const prefs = await getUserPreferences(user.uid);
        setPreferences(prefs);
        setLocalPrefs(prefs);
      } else {
        setPreferences(getLocalPrefs());
      }
      setLoading(false);
    }
    load();
  }, [user]);

  const updatePreferences = useCallback(async (updates: Partial<UserPreferences>) => {
    const newPrefs = { ...preferences, ...updates };
    setPreferences(newPrefs);
    setLocalPrefs(newPrefs);
    if (user) {
      await saveUserPreferences(user.uid, updates);
    }
  }, [preferences, user]);

  const toggleCategory = useCallback(async (category: Category) => {
    const current = preferences.selectedCategories;
    const updated = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category];
    await updatePreferences({ selectedCategories: updated });
  }, [preferences.selectedCategories, updatePreferences]);

  const toggleSource = useCallback(async (sourceId: string) => {
    const current = preferences.selectedSourceIds;
    const updated = current.includes(sourceId)
      ? current.filter(id => id !== sourceId)
      : [...current, sourceId];
    await updatePreferences({ selectedSourceIds: updated });
  }, [preferences.selectedSourceIds, updatePreferences]);

  const completeOnboarding = useCallback(async () => {
    await updatePreferences({ onboardingComplete: true });
  }, [updatePreferences]);

  return {
    preferences,
    loading,
    updatePreferences,
    toggleCategory,
    toggleSource,
    completeOnboarding,
  };
}
