import { useState, useEffect, useCallback, useRef } from 'react';
import { UserPreferences, Category } from '../types';
import { readPreferences, writePreferences, isGitHubConfigured } from '../services/githubStorage';

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

// Debounce writing to GitHub to avoid too many commits
let writeTimeout: ReturnType<typeof setTimeout> | null = null;

function debouncedGitHubWrite(prefs: UserPreferences) {
  if (writeTimeout) clearTimeout(writeTimeout);
  writeTimeout = setTimeout(() => {
    if (isGitHubConfigured()) {
      writePreferences(prefs);
    }
  }, 2000);
}

export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(getLocalPrefs());
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      // Try loading from GitHub first
      if (isGitHubConfigured()) {
        const result = await readPreferences();
        if (result) {
          setPreferences(result.prefs);
          setLocalPrefs(result.prefs);
          initialized.current = true;
          setLoading(false);
          return;
        }
      }
      // Fallback to localStorage
      setPreferences(getLocalPrefs());
      initialized.current = true;
      setLoading(false);
    }
    load();
  }, []);

  const updatePreferences = useCallback(async (updates: Partial<UserPreferences>) => {
    setPreferences(prev => {
      const newPrefs = { ...prev, ...updates };
      setLocalPrefs(newPrefs);
      debouncedGitHubWrite(newPrefs);
      return newPrefs;
    });
  }, []);

  const toggleCategory = useCallback(async (category: Category) => {
    setPreferences(prev => {
      const current = prev.selectedCategories;
      const updated = current.includes(category)
        ? current.filter(c => c !== category)
        : [...current, category];
      const newPrefs = { ...prev, selectedCategories: updated };
      setLocalPrefs(newPrefs);
      debouncedGitHubWrite(newPrefs);
      return newPrefs;
    });
  }, []);

  const toggleSource = useCallback(async (sourceId: string) => {
    setPreferences(prev => {
      const current = prev.selectedSourceIds;
      const updated = current.includes(sourceId)
        ? current.filter(id => id !== sourceId)
        : [...current, sourceId];
      const newPrefs = { ...prev, selectedSourceIds: updated };
      setLocalPrefs(newPrefs);
      debouncedGitHubWrite(newPrefs);
      return newPrefs;
    });
  }, []);

  const completeOnboarding = useCallback(async () => {
    setPreferences(prev => {
      const newPrefs = { ...prev, onboardingComplete: true };
      setLocalPrefs(newPrefs);
      debouncedGitHubWrite(newPrefs);
      return newPrefs;
    });
  }, []);

  return {
    preferences,
    loading,
    updatePreferences,
    toggleCategory,
    toggleSource,
    completeOnboarding,
  };
}
