import { readFileSync } from 'fs';
import { join } from 'path';

export interface StringToStringMap {
  [key: string]: string;
}

export type Translations = StringToStringMap;

let _locale: string;
let _translations: Translations;
let _supportedLocales: ReadonlyArray<string>;
const _localeCache: any[] = [];

export function containsNormalized(
  arr: ReadonlyArray<string>,
  item: string,
): boolean {
  const normalizedItem = normalize(item);

  return !!find(arr, (curr) => normalize(curr) === normalizedItem);
}

export function normalize(locale: string): string {
  return locale.replace('_', '-').toLowerCase();
}

export function languageCode(locale: string): string {
  return locale.split('-')[0];
}

export function find<T>(
  array: ReadonlyArray<T> | Array<T>,
  predicate: (
    item: T,
    index?: number,
    obj?: ReadonlyArray<T> | Array<T>,
  ) => boolean,
): T | undefined {
  if (typeof Array.prototype.find === 'function') {
    return (array as Array<T>).find(predicate);
  }

  // Cover Internet Explorer
  for (let i = 0; i < array.length; i += 1) {
    const item = array[i];

    if (predicate(item, i, array)) {
      return item;
    }
  }
}

export const gab = {
  init(options: { supportedLocales: string[]; locale: string }): string {
    if (!options.supportedLocales || options.supportedLocales.length === 0) {
      throw new Error(
        'No supported locales given. Please provide ' + 'supported locales.',
      );
    }

    _supportedLocales = Object.freeze(options.supportedLocales.map(normalize));

    _locale = normalize(options.locale);

    loadAndSet(_locale);
    return _locale;
  },

  /**
   * Normalized array of given supported locales
   * e.g. `['en-us', 'ar', 'fr']`.
   */
  get supportedLocales(): ReadonlyArray<string> {
    return _supportedLocales;
  },

  /**
   * Check if the given locale is supported.
   *
   * @param locale The locale to check.
   */
  isSupported(locale: string): boolean {
    return containsNormalized(gab.supportedLocales, locale);
  },

  /**
   * The current locale code e.g. 'en-us'
   */
  get locale() {
    return _locale;
  },

  /**
   * Set the current locale, reloading translations.
   *
   * @param locale The locale to set.
   */
  setLocale(locale: string): void {
    return loadAndSet(locale);
  },

  t(key: string, ...replace: Array<number | string>): string {
    if (!_translations) {
      return;
    }
    const templ = _translations[key] || key;

    let str = templ;
    if (replace.length > 0) {
      replace.forEach((value, i) => {
        str = str.replace(RegExp('\\{' + i + '\\}', 'g'), replace[i] + '');
      });
    }
    return str;
  },
};

export const t = gab.t;

// Private
function loadAndSet(locale: string): void {
  if (!gab.isSupported(locale)) {
    throw new Error(
      `Locale ${locale} is not in supported ` +
        `locales given: [${_supportedLocales.join(', ')}].`,
    );
  }

  const normalizedLocale = normalize(locale);

  const json = load(normalizedLocale);
  _locale = normalizedLocale;
  _translations = json;
  return;
}
function load(locale: string) {
  if (_localeCache[locale]) return _localeCache[locale];
  const url = join(__dirname, 'lang', locale + '.json');

  console.log(url);
  const json = JSON.parse(readFileSync(url, 'utf-8'));
  _localeCache[locale] = json;
  return json;
}
