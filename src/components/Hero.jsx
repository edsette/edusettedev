import { motion } from 'motion/react';
import SplitText from '../reactbits/SplitText.jsx';
import Magnet from '../reactbits/Magnet.jsx';
import { useRoute, Link } from '../router.jsx';
import { useT } from '../i18n/index.js';
import { img, waLink } from '../data.js';
import { WhatsAppIcon } from './Icons.jsx';

const rise = delay => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.9, ease: [0.22, 1, 0.36, 1] },
});

export default function Hero() {
  const { lang } = useRoute();
  const t = useT();

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__inner">
        <div>
          <motion.p className="eyebrow hero__eyebrow" {...rise(0.1)}>
            {t('hero.eyebrow')}
          </motion.p>
          <div id="hero-title">
            <SplitText
              key={lang}
              tag="h1"
              className="hero__title"
              text={t('hero.title')}
              splitType="words"
              delay={55}
              duration={1}
              effect="rise"
              mask
              textAlign="left"
              threshold={0}
              rootMargin="0px"
            />
          </div>
          <motion.p className="hero__sub" {...rise(0.7)}>
            {t('hero.sub')}
          </motion.p>
          <motion.div className="hero__ctas" {...rise(0.9)}>
            <Magnet padding={60} magnetStrength={3}>
              <a className="btn btn--solid" href={waLink(t('whatsapp.hello'))} target="_blank" rel="noopener">
                <WhatsAppIcon />
                <span>{t('hero.ctaPrimary')}</span>
              </a>
            </Magnet>
            <Link className="btn" to={`/${lang}/#trabalhos`}>
              <span>{t('hero.ctaSecondary')}</span>
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="hero__photo"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hero__arch">
            <img src={img('perfil.png')} alt={t('hero.photoAlt')} width="375" height="666" fetchPriority="high" />
          </div>
          <p className="hero__badge">
            <i aria-hidden="true" />
            {t('hero.badge')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
