import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Link, useRoute } from '../router.jsx';
import { useT } from '../i18n/index.js';
import LangSwitcher from './LangSwitcher.jsx';

export function useNavItems() {
  const { lang } = useRoute();
  const t = useT();
  return [
    { key: 'work', to: `/${lang}/#trabalhos`, label: t('nav.work') },
    { key: 'about', to: `/${lang}/#sobre`, label: t('nav.about') },
    { key: 'templates', to: `/${lang}/templates`, label: t('nav.templates') },
    { key: 'contact', to: `/${lang}/#contato`, label: t('nav.contact') },
  ];
}

export default function Header() {
  const { lang, page } = useRoute();
  const t = useT();
  const items = useNavItems();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const burgerRef = useRef(null);
  const wasOpen = useRef(false);
  useEffect(() => {
    document.documentElement.classList.toggle('is-locked', open);
    // Com o menu aberto, o resto da página fica inerte (o Tab não sai do menu).
    const behind = document.querySelectorAll('.header, main, .footer, .wa-float, .teaser-wrap');
    behind.forEach(el => (el.inert = open));
    if (!open) {
      if (wasOpen.current) burgerRef.current?.focus();
      wasOpen.current = false;
      return;
    }
    wasOpen.current = true;
    const onKey = e => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      behind.forEach(el => (el.inert = false));
    };
  }, [open]);

  // Na home o topo é oliva (texto creme); nas outras páginas o cabeçalho já começa sólido.
  const solid = scrolled || page !== 'home';

  return (
    <>
      <header className={`header${solid ? ' is-solid' : ''}`}>
        <div className="container header__inner">
          <Link className="header__logo" to={`/${lang}/`} aria-label={`Eduardo Sette — ${t('nav.home')}`}>
            Eduardo Sette<em>.</em>
          </Link>
          <nav className="header__nav" aria-label={t('nav.main')}>
            {items.map(item => (
              <Link key={item.key} to={item.to}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="header__right">
            <LangSwitcher />
            <button
              type="button"
              className="header__burger"
              ref={burgerRef}
              aria-label={t('nav.menu')}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(true)}
            >
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* Fora do header, para o position: fixed não ficar preso (armadilha da skill). */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="mmenu"
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={t('nav.menu')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mmenu__top">
              <span className="header__logo">
                Eduardo Sette<em style={{ color: 'var(--brass)', fontStyle: 'normal' }}>.</em>
              </span>
              <button type="button" className="mmenu__close" onClick={() => setOpen(false)} autoFocus>
                {t('nav.close')} ✕
              </button>
            </div>
            <nav className="mmenu__links" aria-label={t('nav.menu')}>
              {items.map((item, i) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i + 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link to={item.to} onClick={() => setOpen(false)}>
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
