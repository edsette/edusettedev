import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LANGS, LANG_NAMES } from '../lang.js';
import { useRoute } from '../router.jsx';
import { useT } from '../i18n/index.js';

export default function LangSwitcher() {
  const { lang, page, navigate } = useRoute();
  const t = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = e => {
      if (e.type === 'keydown' ? e.key === 'Escape' : !ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', close);
    };
  }, [open]);

  const choose = code => {
    setOpen(false);
    if (code === lang) return;
    // Mantém a página atual; na home, mantém a âncora se houver.
    const rest = page === 'templates' ? 'templates' : '';
    navigate(`/${code}/${rest}${page === 'home' ? window.location.hash : ''}`);
  };

  return (
    <div className="lang" ref={ref}>
      <button
        type="button"
        className="lang__btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${t('nav.lang')}: ${LANG_NAMES[lang]}`}
        onClick={() => setOpen(o => !o)}
      >
        {lang.toUpperCase()}
        <svg viewBox="0 0 10 10" aria-hidden="true">
          <path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            className="lang__list"
            role="listbox"
            aria-label={t('nav.lang')}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {LANGS.map(code => (
              <li key={code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={code === lang}
                  aria-current={code === lang}
                  lang={code}
                  onClick={() => choose(code)}
                >
                  {LANG_NAMES[code]} <small>{code.toUpperCase()}</small>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
