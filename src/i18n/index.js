import { useCallback } from 'react';
import { useRoute } from '../router.jsx';
import pt from './pt.js';
import es from './es.js';
import en from './en.js';
import it from './it.js';
import de from './de.js';

const DICTS = { pt, es, en, it, de };

const lookup = (dict, key) => key.split('.').reduce((node, part) => (node == null ? node : node[part]), dict);

// t('hero.title') ou t('whatsapp.notify', { name: 'Brasa' }). Chave ausente → '' (nunca cai em outro idioma).
export function translate(lang, key, vars) {
  const value = lookup(DICTS[lang], key);
  if (typeof value !== 'string') {
    if (import.meta.env.DEV) console.error(`[i18n] chave ausente: ${lang}.${key}`);
    return '';
  }
  return vars ? value.replace(/\{(\w+)\}/g, (m, name) => vars[name] ?? m) : value;
}

export function useT() {
  const { lang } = useRoute();
  return useCallback((key, vars) => translate(lang, key, vars), [lang]);
}
