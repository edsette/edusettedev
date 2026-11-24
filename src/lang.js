export const LANGS = ['pt', 'es', 'en', 'it', 'de'];
export const DEFAULT_LANG = 'pt';
export const HTML_LANG = { pt: 'pt-BR', es: 'es', en: 'en', it: 'it', de: 'de' };
export const LANG_NAMES = { pt: 'Português', es: 'Español', en: 'English', it: 'Italiano', de: 'Deutsch' };

const KEY = 'lang';

export const isLang = value => LANGS.includes(value);

function readSaved() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function saveLang(lang) {
  try {
    localStorage.setItem(KEY, lang);
  } catch {
    /* armazenamento bloqueado: só não lembra a escolha */
  }
}

// Guardado → idiomas do navegador → PT.
export function detectLang() {
  const saved = readSaved();
  if (isLang(saved)) return saved;
  const prefs = typeof navigator !== 'undefined' ? navigator.languages || [navigator.language] : [];
  for (const pref of prefs) {
    const code = String(pref || '').slice(0, 2).toLowerCase();
    if (isLang(code)) return code;
  }
  return DEFAULT_LANG;
}
