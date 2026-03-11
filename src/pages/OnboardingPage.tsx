import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopicPicker } from '../components/Onboarding/TopicPicker';
import { SourcePicker } from '../components/Onboarding/SourcePicker';
import { usePreferences } from '../hooks/usePreferences';
import { Category } from '../types';

export function OnboardingPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const { preferences, updatePreferences, completeOnboarding } = usePreferences();
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(preferences.selectedCategories);
  const [selectedSourceIds, setSelectedSourceIds] = useState<string[]>(preferences.selectedSourceIds);
  const navigate = useNavigate();

  const toggleCategory = (category: Category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleSource = (sourceId: string) => {
    setSelectedSourceIds(prev =>
      prev.includes(sourceId)
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const handleNext = async () => {
    if (step === 1) {
      await updatePreferences({ selectedCategories });
      setStep(2);
    } else {
      await updatePreferences({ selectedSourceIds });
      await completeOnboarding();
      navigate('/');
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
    navigate('/');
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Progress */}
      <div className="mb-8 flex items-center gap-3">
        <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
        <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
      </div>

      {step === 1 ? (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">What topics interest you?</h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">Choose at least 3 topics to personalize your feed</p>
          </div>
          <TopicPicker selected={selectedCategories} onToggle={toggleCategory} />
        </>
      ) : (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Choose your news sources</h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">Select the sources you trust. Leave empty to see all sources.</p>
          </div>
          <SourcePicker
            selectedCategories={selectedCategories}
            selectedSourceIds={selectedSourceIds}
            onToggleSource={toggleSource}
            onSelectAll={setSelectedSourceIds}
          />
        </>
      )}

      <div className="mt-8 flex items-center justify-between">
        <div>
          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              className="rounded-lg px-6 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Back
            </button>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSkip}
            className="rounded-lg px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Skip
          </button>
          <button
            onClick={handleNext}
            disabled={step === 1 && selectedCategories.length < 1}
            className="rounded-lg bg-blue-600 px-8 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {step === 1 ? 'Next' : 'Start Reading'}
          </button>
        </div>
      </div>
    </div>
  );
}
