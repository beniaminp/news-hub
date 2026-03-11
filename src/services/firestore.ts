import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { UserPreferences, Category } from '../types';

const COLLECTION = 'users';

const DEFAULT_PREFERENCES: UserPreferences = {
  selectedCategories: ['top', 'world', 'technology', 'business', 'science'],
  selectedSourceIds: [],
  onboardingComplete: false,
};

export async function getUserPreferences(userId: string): Promise<UserPreferences> {
  try {
    const ref = doc(db, COLLECTION, userId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return snap.data() as UserPreferences;
    }
    // Create default preferences
    await setDoc(ref, DEFAULT_PREFERENCES);
    return DEFAULT_PREFERENCES;
  } catch (error) {
    console.warn('Firestore error, using defaults:', error);
    return DEFAULT_PREFERENCES;
  }
}

export async function saveUserPreferences(
  userId: string,
  prefs: Partial<UserPreferences>,
): Promise<void> {
  try {
    const ref = doc(db, COLLECTION, userId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await updateDoc(ref, prefs);
    } else {
      await setDoc(ref, { ...DEFAULT_PREFERENCES, ...prefs });
    }
  } catch (error) {
    console.error('Failed to save preferences:', error);
  }
}

export async function updateSelectedCategories(
  userId: string,
  categories: Category[],
): Promise<void> {
  await saveUserPreferences(userId, { selectedCategories: categories });
}

export async function updateSelectedSources(
  userId: string,
  sourceIds: string[],
): Promise<void> {
  await saveUserPreferences(userId, { selectedSourceIds: sourceIds });
}

export async function completeOnboarding(userId: string): Promise<void> {
  await saveUserPreferences(userId, { onboardingComplete: true });
}
