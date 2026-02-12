/**
 * Plain-text translation parser
 * Parses the ui-texts.txt file and returns a translations object
 */

export interface TranslationEntry {
  en: string;
  es: string;
}

export type Translations = Record<string, TranslationEntry>;

/**
 * Parse plain-text translations file
 * Format: KEY = English Text | Spanish Text
 * Lines starting with # are comments
 * Empty lines are ignored
 */
export function parseTranslations(plainText: string): Translations {
  const translations: Translations = {};
  const lines = plainText.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip comments and empty lines
    if (trimmed.startsWith('#') || trimmed === '') {
      continue;
    }

    // Parse line: KEY = English | Spanish
    const equalIndex = trimmed.indexOf('=');
    if (equalIndex === -1) {
      continue; // Skip malformed lines
    }

    const key = trimmed.substring(0, equalIndex).trim();
    const values = trimmed.substring(equalIndex + 1).trim();
    
    const pipeIndex = values.indexOf('|');
    if (pipeIndex === -1) {
      continue; // Skip lines without pipe separator
    }

    const english = values.substring(0, pipeIndex).trim();
    const spanish = values.substring(pipeIndex + 1).trim();

    if (key && english && spanish) {
      translations[key] = { en: english, es: spanish };
    }
  }

  return translations;
}

/**
 * Get translation with fallback
 */
export function getTranslation(
  translations: Translations,
  key: string,
  language: 'en' | 'es'
): string {
  const entry = translations[key];
  if (!entry) {
    console.warn(`Translation key not found: ${key}`);
    return key; // Return key as fallback
  }
  return entry[language];
}
