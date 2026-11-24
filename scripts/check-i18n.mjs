// Confere se os 5 idiomas têm exatamente as mesmas chaves que o PT, sem textos vazios
// e sem nenhuma menção a "suporte técnico" (spec §4). Sai com código 1 se algo falhar.
const LANGS = ['pt', 'es', 'en', 'it', 'de'];
const FORBIDDEN = /suporte t[ée]cnico|soporte t[ée]cnico|technical support|tech support|supporto tecnico|technischer support/i;

const flatten = (obj, prefix = '') =>
  Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' ? flatten(v, `${prefix}${k}.`) : [[`${prefix}${k}`, v]]
  );

const dicts = {};
for (const lang of LANGS) {
  const mod = await import(new URL(`../src/i18n/${lang}.js`, import.meta.url));
  dicts[lang] = new Map(flatten(mod.default));
}

const errors = [];
const base = dicts.pt;
for (const lang of LANGS) {
  const d = dicts[lang];
  for (const key of base.keys()) if (!d.has(key)) errors.push(`${lang}: falta "${key}"`);
  for (const [key, value] of d) {
    if (!base.has(key)) errors.push(`${lang}: chave a mais "${key}"`);
    if (typeof value !== 'string' || !value.trim()) errors.push(`${lang}: "${key}" vazio ou não é texto`);
    else if (FORBIDDEN.test(value)) errors.push(`${lang}: "${key}" menciona suporte técnico`);
  }
}

if (errors.length) {
  console.error(`check-i18n: ${errors.length} problema(s)\n` + errors.join('\n'));
  process.exit(1);
}
console.log(`check-i18n: ok — ${base.size} chaves × ${LANGS.length} idiomas`);
