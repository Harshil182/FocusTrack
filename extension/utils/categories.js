// Simple domain -> category classifier used by the extension.
// This is intentionally lightweight — server-side categories are the source
// of truth, but the extension needs a fast client-side fallback to tag
// domains before they reach the backend.

const RULES = [
  {
    name: "Social",
    patterns: [
      /facebook\.com$/,
      /twitter\.com$/,
      /instagram\.com$/,
      /tiktok\.com$/,
      /linkedin\.com$/,
    ],
  },
  {
    name: "Productivity",
    patterns: [
      /github\.com$/,
      /gitlab\.com$/,
      /stackoverflow\.com$/,
      /notion\.so$/,
    ],
  },
  {
    name: "News",
    patterns: [/nytimes\.com$/, /cnn\.com$/, /bbc\.co/, /theguardian\.com/],
  },
  { name: "Video", patterns: [/youtube\.com$/, /vimeo\.com$/, /twitch\.tv$/] },
  { name: "Shopping", patterns: [/amazon\.com$/, /ebay\.com$/, /etsy\.com$/] },
  { name: "Search", patterns: [/google\./, /bing\.com$/, /duckduckgo\.com$/] },
];

export function classifyDomain(domain) {
  if (!domain || typeof domain !== "string") return "Uncategorized";
  const d = domain.toLowerCase();
  for (const rule of RULES) {
    for (const re of rule.patterns) {
      if (re.test(d)) return rule.name;
    }
  }
  // Fallback categories by simple TLD heuristics
  if (d.endsWith(".gov") || d.endsWith(".edu")) return "Work";
  return "Uncategorized";
}

export default classifyDomain;
