export interface NewsSource {
  id: string;
  name: string;
  category: Category;
  rssUrl: string;
  homepage: string;
  logo?: string;
  country: string;
}

export type Category =
  | 'top'
  | 'world'
  | 'politics'
  | 'business'
  | 'technology'
  | 'science'
  | 'health'
  | 'sports'
  | 'entertainment'
  | 'environment'
  | 'lifestyle';

export const CATEGORY_LABELS: Record<Category, string> = {
  top: 'Top Stories',
  world: 'World',
  politics: 'Politics',
  business: 'Business',
  technology: 'Technology',
  science: 'Science',
  health: 'Health',
  sports: 'Sports',
  entertainment: 'Entertainment',
  environment: 'Environment',
  lifestyle: 'Lifestyle',
};

export interface Article {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: Date;
  imageUrl?: string;
  source: string;
  sourceId: string;
  category: Category;
}

export interface UserPreferences {
  selectedCategories: Category[];
  selectedSourceIds: string[];
  onboardingComplete: boolean;
}

export interface CachedFeed {
  articles: Article[];
  fetchedAt: number;
}
