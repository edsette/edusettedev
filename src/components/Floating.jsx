import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Link, useRoute } from '../router.jsx';
import { useT } from '../i18n/index.js';
import { waLink } from '../data.js';
import { WhatsAppIcon } from './Icons.jsx';
import TemplatePreview from './TemplatePreview.jsx';

export function WhatsAppFloat() {
  const t = useT();
  return (
    <a className="wa-float" href={waLink(t('whatsapp.hello'))} target="_blank" rel="noopener" aria-label={t('whatsapp.aria')}>
      <WhatsAppIcon />
    </a>
  );
}

const KEY = 'teaser-closed';
const wasClosed = () => {
  try {
    return sessionStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
};

// Cartão fixo "Templates — Em breve" (ideia da Lauren), leva à loja.
export function TemplatesTeaser() {
  const { lang } = useRoute();
  const t = useT();
  const [closed, setClosed] = useState(wasClosed);
  // Só aparece depois do hero, para não cobrir os botões principais.
  const [past, setPast] = useState(false);
  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => {
    setClosed(true);
    try {
      sessionStorage.setItem(KEY, '1');
    } catch {
      /* ignora */
    }
  };

  return (
    <AnimatePresence>
      {!closed && past && (
        <motion.div
          className="teaser-wrap"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
          exit={{ opacity: 0, y: 30, transition: { duration: 0.3 } }}
        >
          <Link className="teaser" to={`/${lang}/templates`}>
            <span className="teaser__thumb">
              <TemplatePreview kind="portfolio" mini />
            </span>
            <span>
              <span className="teaser__label">{t('teaser.label')}</span>
              <br />
              <span className="teaser__soon">{t('teaser.soon')}</span>
            </span>
          </Link>
          <button type="button" className="teaser__close" aria-label={t('teaser.close')} onClick={close}>
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
