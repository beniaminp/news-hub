import { NewsSource } from '../types';

export const NEWS_SOURCES: NewsSource[] = [
  // ===== TOP / GENERAL NEWS =====
  { id: 'reuters', name: 'Reuters', category: 'top', rssUrl: 'https://feeds.reuters.com/reuters/topNews', homepage: 'https://reuters.com', country: 'US' },
  { id: 'bbc-news', name: 'BBC News', category: 'top', rssUrl: 'https://feeds.bbci.co.uk/news/rss.xml', homepage: 'https://bbc.co.uk/news', country: 'UK' },
  { id: 'guardian', name: 'The Guardian', category: 'top', rssUrl: 'https://www.theguardian.com/international/rss', homepage: 'https://theguardian.com', country: 'UK' },
  { id: 'npr', name: 'NPR', category: 'top', rssUrl: 'https://feeds.npr.org/1001/rss.xml', homepage: 'https://npr.org', country: 'US' },
  { id: 'aljazeera', name: 'Al Jazeera', category: 'top', rssUrl: 'https://www.aljazeera.com/xml/rss/all.xml', homepage: 'https://aljazeera.com', country: 'QA' },
  { id: 'associated-press', name: 'Associated Press', category: 'top', rssUrl: 'https://rsshub.app/apnews/topics/apf-topnews', homepage: 'https://apnews.com', country: 'US' },
  { id: 'abc-au', name: 'ABC News (AU)', category: 'top', rssUrl: 'https://www.abc.net.au/news/feed/2942460/rss.xml', homepage: 'https://abc.net.au/news', country: 'AU' },
  { id: 'cbc', name: 'CBC News', category: 'top', rssUrl: 'https://rss.cbc.ca/lineup/topstories.xml', homepage: 'https://cbc.ca/news', country: 'CA' },
  { id: 'france24', name: 'France 24', category: 'top', rssUrl: 'https://www.france24.com/en/rss', homepage: 'https://france24.com', country: 'FR' },
  { id: 'dw', name: 'DW News', category: 'top', rssUrl: 'https://rss.dw.com/rdf/rss-en-all', homepage: 'https://dw.com', country: 'DE' },

  // ===== WORLD NEWS =====
  { id: 'bbc-world', name: 'BBC World', category: 'world', rssUrl: 'https://feeds.bbci.co.uk/news/world/rss.xml', homepage: 'https://bbc.co.uk/news/world', country: 'UK' },
  { id: 'guardian-world', name: 'The Guardian World', category: 'world', rssUrl: 'https://www.theguardian.com/world/rss', homepage: 'https://theguardian.com/world', country: 'UK' },
  { id: 'reuters-world', name: 'Reuters World', category: 'world', rssUrl: 'https://feeds.reuters.com/Reuters/worldNews', homepage: 'https://reuters.com/world', country: 'US' },
  { id: 'cnn', name: 'CNN', category: 'world', rssUrl: 'http://rss.cnn.com/rss/edition_world.rss', homepage: 'https://cnn.com', country: 'US' },
  { id: 'nyt-world', name: 'NY Times World', category: 'world', rssUrl: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', homepage: 'https://nytimes.com/section/world', country: 'US' },
  { id: 'independent', name: 'The Independent', category: 'world', rssUrl: 'https://www.independent.co.uk/news/world/rss', homepage: 'https://independent.co.uk', country: 'UK' },
  { id: 'euronews', name: 'Euronews', category: 'world', rssUrl: 'https://www.euronews.com/rss?level=theme&name=news', homepage: 'https://euronews.com', country: 'FR' },
  { id: 'japan-times', name: 'Japan Times', category: 'world', rssUrl: 'https://www.japantimes.co.jp/feed/', homepage: 'https://japantimes.co.jp', country: 'JP' },
  { id: 'hindu', name: 'The Hindu', category: 'world', rssUrl: 'https://www.thehindu.com/news/international/feeder/default.rss', homepage: 'https://thehindu.com', country: 'IN' },

  // ===== US POLITICS =====
  { id: 'politico', name: 'Politico', category: 'politics', rssUrl: 'https://rss.politico.com/politics-news.xml', homepage: 'https://politico.com', country: 'US' },
  { id: 'hill', name: 'The Hill', category: 'politics', rssUrl: 'https://thehill.com/feed/', homepage: 'https://thehill.com', country: 'US' },
  { id: 'nyt-politics', name: 'NY Times Politics', category: 'politics', rssUrl: 'https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml', homepage: 'https://nytimes.com/section/politics', country: 'US' },
  { id: 'wapo-politics', name: 'Washington Post', category: 'politics', rssUrl: 'https://feeds.washingtonpost.com/rss/politics', homepage: 'https://washingtonpost.com/politics', country: 'US' },
  { id: 'cnn-politics', name: 'CNN Politics', category: 'politics', rssUrl: 'http://rss.cnn.com/rss/cnn_allpolitics.rss', homepage: 'https://cnn.com/politics', country: 'US' },
  { id: 'bbc-politics', name: 'BBC UK Politics', category: 'politics', rssUrl: 'https://feeds.bbci.co.uk/news/politics/rss.xml', homepage: 'https://bbc.co.uk/news/politics', country: 'UK' },
  { id: 'guardian-politics', name: 'Guardian Politics', category: 'politics', rssUrl: 'https://www.theguardian.com/politics/rss', homepage: 'https://theguardian.com/politics', country: 'UK' },
  { id: 'axios', name: 'Axios', category: 'politics', rssUrl: 'https://api.axios.com/feed/', homepage: 'https://axios.com', country: 'US' },
  { id: 'realclearpolitics', name: 'RealClearPolitics', category: 'politics', rssUrl: 'https://feeds.feedburner.com/realclearpolitics/qlMj', homepage: 'https://realclearpolitics.com', country: 'US' },

  // ===== BUSINESS & FINANCE =====
  { id: 'cnbc', name: 'CNBC', category: 'business', rssUrl: 'https://www.cnbc.com/id/100003114/device/rss/rss.html', homepage: 'https://cnbc.com', country: 'US' },
  { id: 'reuters-business', name: 'Reuters Business', category: 'business', rssUrl: 'https://feeds.reuters.com/reuters/businessNews', homepage: 'https://reuters.com/business', country: 'US' },
  { id: 'nyt-business', name: 'NY Times Business', category: 'business', rssUrl: 'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml', homepage: 'https://nytimes.com/section/business', country: 'US' },
  { id: 'forbes', name: 'Forbes', category: 'business', rssUrl: 'https://www.forbes.com/innovation/feed2', homepage: 'https://forbes.com', country: 'US' },
  { id: 'marketwatch', name: 'MarketWatch', category: 'business', rssUrl: 'http://feeds.marketwatch.com/marketwatch/topstories/', homepage: 'https://marketwatch.com', country: 'US' },
  { id: 'fortune', name: 'Fortune', category: 'business', rssUrl: 'https://fortune.com/feed/', homepage: 'https://fortune.com', country: 'US' },
  { id: 'business-insider', name: 'Business Insider', category: 'business', rssUrl: 'https://www.businessinsider.com/rss', homepage: 'https://businessinsider.com', country: 'US' },
  { id: 'ft', name: 'Financial Times', category: 'business', rssUrl: 'https://www.ft.com/?format=rss', homepage: 'https://ft.com', country: 'UK' },
  { id: 'economist', name: 'The Economist', category: 'business', rssUrl: 'https://www.economist.com/latest/rss.xml', homepage: 'https://economist.com', country: 'UK' },
  { id: 'bloomberg-markets', name: 'Bloomberg Markets', category: 'business', rssUrl: 'https://feeds.bloomberg.com/markets/news.rss', homepage: 'https://bloomberg.com/markets', country: 'US' },

  // ===== TECHNOLOGY =====
  { id: 'techcrunch', name: 'TechCrunch', category: 'technology', rssUrl: 'https://techcrunch.com/feed/', homepage: 'https://techcrunch.com', country: 'US' },
  { id: 'verge', name: 'The Verge', category: 'technology', rssUrl: 'https://www.theverge.com/rss/index.xml', homepage: 'https://theverge.com', country: 'US' },
  { id: 'ars-technica', name: 'Ars Technica', category: 'technology', rssUrl: 'https://feeds.arstechnica.com/arstechnica/index', homepage: 'https://arstechnica.com', country: 'US' },
  { id: 'wired', name: 'Wired', category: 'technology', rssUrl: 'https://www.wired.com/feed/rss', homepage: 'https://wired.com', country: 'US' },
  { id: 'engadget', name: 'Engadget', category: 'technology', rssUrl: 'https://www.engadget.com/rss.xml', homepage: 'https://engadget.com', country: 'US' },
  { id: 'cnet', name: 'CNET', category: 'technology', rssUrl: 'https://www.cnet.com/rss/all/', homepage: 'https://cnet.com', country: 'US' },
  { id: 'zdnet', name: 'ZDNet', category: 'technology', rssUrl: 'https://www.zdnet.com/news/rss.xml', homepage: 'https://zdnet.com', country: 'US' },
  { id: 'mit-tech-review', name: 'MIT Tech Review', category: 'technology', rssUrl: 'https://www.technologyreview.com/feed/', homepage: 'https://technologyreview.com', country: 'US' },
  { id: 'mashable', name: 'Mashable', category: 'technology', rssUrl: 'https://mashable.com/feeds/rss/all', homepage: 'https://mashable.com', country: 'US' },
  { id: 'guardian-tech', name: 'Guardian Tech', category: 'technology', rssUrl: 'https://www.theguardian.com/uk/technology/rss', homepage: 'https://theguardian.com/technology', country: 'UK' },
  { id: 'hacker-news', name: 'Hacker News', category: 'technology', rssUrl: 'https://hnrss.org/frontpage', homepage: 'https://news.ycombinator.com', country: 'US' },
  { id: 'thenextweb', name: 'The Next Web', category: 'technology', rssUrl: 'https://thenextweb.com/feed/', homepage: 'https://thenextweb.com', country: 'NL' },

  // ===== SCIENCE =====
  { id: 'science-daily', name: 'ScienceDaily', category: 'science', rssUrl: 'https://www.sciencedaily.com/rss/all.xml', homepage: 'https://sciencedaily.com', country: 'US' },
  { id: 'nature', name: 'Nature', category: 'science', rssUrl: 'https://www.nature.com/nature.rss', homepage: 'https://nature.com', country: 'UK' },
  { id: 'new-scientist', name: 'New Scientist', category: 'science', rssUrl: 'https://www.newscientist.com/feed/home/', homepage: 'https://newscientist.com', country: 'UK' },
  { id: 'scientific-american', name: 'Scientific American', category: 'science', rssUrl: 'http://rss.sciam.com/ScientificAmerican-Global', homepage: 'https://scientificamerican.com', country: 'US' },
  { id: 'space-com', name: 'Space.com', category: 'science', rssUrl: 'https://www.space.com/feeds/all', homepage: 'https://space.com', country: 'US' },
  { id: 'phys-org', name: 'Phys.org', category: 'science', rssUrl: 'https://phys.org/rss-feed/', homepage: 'https://phys.org', country: 'UK' },
  { id: 'nasa', name: 'NASA', category: 'science', rssUrl: 'https://www.nasa.gov/rss/dyn/breaking_news.rss', homepage: 'https://nasa.gov', country: 'US' },
  { id: 'guardian-science', name: 'Guardian Science', category: 'science', rssUrl: 'https://www.theguardian.com/science/rss', homepage: 'https://theguardian.com/science', country: 'UK' },
  { id: 'nyt-science', name: 'NY Times Science', category: 'science', rssUrl: 'https://rss.nytimes.com/services/xml/rss/nyt/Science.xml', homepage: 'https://nytimes.com/section/science', country: 'US' },

  // ===== HEALTH =====
  { id: 'bbc-health', name: 'BBC Health', category: 'health', rssUrl: 'https://feeds.bbci.co.uk/news/health/rss.xml', homepage: 'https://bbc.co.uk/news/health', country: 'UK' },
  { id: 'nyt-health', name: 'NY Times Health', category: 'health', rssUrl: 'https://rss.nytimes.com/services/xml/rss/nyt/Health.xml', homepage: 'https://nytimes.com/section/health', country: 'US' },
  { id: 'cnn-health', name: 'CNN Health', category: 'health', rssUrl: 'http://rss.cnn.com/rss/cnn_health.rss', homepage: 'https://cnn.com/health', country: 'US' },
  { id: 'medical-news-today', name: 'Medical News Today', category: 'health', rssUrl: 'https://www.medicalnewstoday.com/newsfeeds/rss/medical_news_today.xml', homepage: 'https://medicalnewstoday.com', country: 'US' },
  { id: 'guardian-health', name: 'Guardian Health', category: 'health', rssUrl: 'https://www.theguardian.com/society/health/rss', homepage: 'https://theguardian.com/society/health', country: 'UK' },
  { id: 'reuters-health', name: 'Reuters Health', category: 'health', rssUrl: 'https://feeds.reuters.com/reuters/healthNews', homepage: 'https://reuters.com/business/healthcare-pharmaceuticals', country: 'US' },
  { id: 'stat-news', name: 'STAT News', category: 'health', rssUrl: 'https://www.statnews.com/feed/', homepage: 'https://statnews.com', country: 'US' },
  { id: 'webmd', name: 'WebMD', category: 'health', rssUrl: 'https://rssfeeds.webmd.com/rss/rss.aspx?RSSSource=RSS_PUBLIC', homepage: 'https://webmd.com', country: 'US' },

  // ===== SPORTS =====
  { id: 'espn', name: 'ESPN', category: 'sports', rssUrl: 'https://www.espn.com/espn/rss/news', homepage: 'https://espn.com', country: 'US' },
  { id: 'bbc-sport', name: 'BBC Sport', category: 'sports', rssUrl: 'https://feeds.bbci.co.uk/sport/rss.xml', homepage: 'https://bbc.co.uk/sport', country: 'UK' },
  { id: 'guardian-sport', name: 'Guardian Sport', category: 'sports', rssUrl: 'https://www.theguardian.com/uk/sport/rss', homepage: 'https://theguardian.com/sport', country: 'UK' },
  { id: 'cbssports', name: 'CBS Sports', category: 'sports', rssUrl: 'https://www.cbssports.com/rss/headlines/', homepage: 'https://cbssports.com', country: 'US' },
  { id: 'bleacher-report', name: 'Bleacher Report', category: 'sports', rssUrl: 'https://bleacherreport.com/articles/feed', homepage: 'https://bleacherreport.com', country: 'US' },
  { id: 'sky-sports', name: 'Sky Sports', category: 'sports', rssUrl: 'https://www.skysports.com/rss/12040', homepage: 'https://skysports.com', country: 'UK' },
  { id: 'nyt-sports', name: 'NY Times Sports', category: 'sports', rssUrl: 'https://rss.nytimes.com/services/xml/rss/nyt/Sports.xml', homepage: 'https://nytimes.com/section/sports', country: 'US' },
  { id: 'reuters-sports', name: 'Reuters Sports', category: 'sports', rssUrl: 'https://feeds.reuters.com/reuters/sportsNews', homepage: 'https://reuters.com/sports', country: 'US' },
  { id: 'athletic', name: 'The Athletic', category: 'sports', rssUrl: 'https://theathletic.com/feeds/rss/news/', homepage: 'https://theathletic.com', country: 'US' },

  // ===== ENTERTAINMENT =====
  { id: 'variety', name: 'Variety', category: 'entertainment', rssUrl: 'https://variety.com/feed/', homepage: 'https://variety.com', country: 'US' },
  { id: 'hollywood-reporter', name: 'Hollywood Reporter', category: 'entertainment', rssUrl: 'https://www.hollywoodreporter.com/feed/', homepage: 'https://hollywoodreporter.com', country: 'US' },
  { id: 'deadline', name: 'Deadline', category: 'entertainment', rssUrl: 'https://deadline.com/feed/', homepage: 'https://deadline.com', country: 'US' },
  { id: 'ew', name: 'Entertainment Weekly', category: 'entertainment', rssUrl: 'https://ew.com/feed/', homepage: 'https://ew.com', country: 'US' },
  { id: 'bbc-entertainment', name: 'BBC Entertainment', category: 'entertainment', rssUrl: 'https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml', homepage: 'https://bbc.co.uk/news/entertainment_and_arts', country: 'UK' },
  { id: 'rolling-stone', name: 'Rolling Stone', category: 'entertainment', rssUrl: 'https://www.rollingstone.com/feed/', homepage: 'https://rollingstone.com', country: 'US' },
  { id: 'pitchfork', name: 'Pitchfork', category: 'entertainment', rssUrl: 'https://pitchfork.com/feed/feed-news/rss', homepage: 'https://pitchfork.com', country: 'US' },
  { id: 'guardian-culture', name: 'Guardian Culture', category: 'entertainment', rssUrl: 'https://www.theguardian.com/uk/culture/rss', homepage: 'https://theguardian.com/culture', country: 'UK' },
  { id: 'nyt-arts', name: 'NY Times Arts', category: 'entertainment', rssUrl: 'https://rss.nytimes.com/services/xml/rss/nyt/Arts.xml', homepage: 'https://nytimes.com/section/arts', country: 'US' },

  // ===== ENVIRONMENT =====
  { id: 'guardian-environment', name: 'Guardian Environment', category: 'environment', rssUrl: 'https://www.theguardian.com/uk/environment/rss', homepage: 'https://theguardian.com/environment', country: 'UK' },
  { id: 'bbc-environment', name: 'BBC Environment', category: 'environment', rssUrl: 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml', homepage: 'https://bbc.co.uk/news/science_and_environment', country: 'UK' },
  { id: 'nyt-climate', name: 'NY Times Climate', category: 'environment', rssUrl: 'https://rss.nytimes.com/services/xml/rss/nyt/Climate.xml', homepage: 'https://nytimes.com/section/climate', country: 'US' },
  { id: 'grist', name: 'Grist', category: 'environment', rssUrl: 'https://grist.org/feed/', homepage: 'https://grist.org', country: 'US' },
  { id: 'treehugger', name: 'Treehugger', category: 'environment', rssUrl: 'https://www.treehugger.com/feeds/all', homepage: 'https://treehugger.com', country: 'US' },
  { id: 'carbon-brief', name: 'Carbon Brief', category: 'environment', rssUrl: 'https://www.carbonbrief.org/feed/', homepage: 'https://carbonbrief.org', country: 'UK' },
  { id: 'ecowatch', name: 'EcoWatch', category: 'environment', rssUrl: 'https://www.ecowatch.com/rss', homepage: 'https://ecowatch.com', country: 'US' },
  { id: 'mongabay', name: 'Mongabay', category: 'environment', rssUrl: 'https://news.mongabay.com/feed/', homepage: 'https://mongabay.com', country: 'US' },

  // ===== LIFESTYLE =====
  { id: 'nyt-food', name: 'NY Times Food', category: 'lifestyle', rssUrl: 'https://rss.nytimes.com/services/xml/rss/nyt/DiningandWine.xml', homepage: 'https://nytimes.com/section/food', country: 'US' },
  { id: 'nyt-travel', name: 'NY Times Travel', category: 'lifestyle', rssUrl: 'https://rss.nytimes.com/services/xml/rss/nyt/Travel.xml', homepage: 'https://nytimes.com/section/travel', country: 'US' },
  { id: 'guardian-lifestyle', name: 'Guardian Lifestyle', category: 'lifestyle', rssUrl: 'https://www.theguardian.com/uk/lifeandstyle/rss', homepage: 'https://theguardian.com/lifeandstyle', country: 'UK' },
  { id: 'bbc-travel', name: 'BBC Travel', category: 'lifestyle', rssUrl: 'https://feeds.bbci.co.uk/news/rss.xml?edition=int#checks', homepage: 'https://bbc.com/travel', country: 'UK' },
  { id: 'vogue', name: 'Vogue', category: 'lifestyle', rssUrl: 'https://www.vogue.com/feed/rss', homepage: 'https://vogue.com', country: 'US' },
  { id: 'curbed', name: 'Curbed', category: 'lifestyle', rssUrl: 'https://www.curbed.com/rss/index.xml', homepage: 'https://curbed.com', country: 'US' },
  { id: 'lonely-planet', name: 'Lonely Planet', category: 'lifestyle', rssUrl: 'https://www.lonelyplanet.com/feed.xml', homepage: 'https://lonelyplanet.com', country: 'AU' },
  { id: 'dezeen', name: 'Dezeen', category: 'lifestyle', rssUrl: 'https://www.dezeen.com/feed/', homepage: 'https://dezeen.com', country: 'UK' },
  { id: 'bon-appetit', name: 'Bon Appetit', category: 'lifestyle', rssUrl: 'https://www.bonappetit.com/feed/rss', homepage: 'https://bonappetit.com', country: 'US' },
];

export function getSourcesByCategory(category: string): NewsSource[] {
  return NEWS_SOURCES.filter(s => s.category === category);
}

export function getCategories(): string[] {
  return [...new Set(NEWS_SOURCES.map(s => s.category))];
}

export function getSourceById(id: string): NewsSource | undefined {
  return NEWS_SOURCES.find(s => s.id === id);
}
