import { motion } from 'motion/react';
import SplitText from '../reactbits/SplitText.jsx';
import { useRoute } from '../router.jsx';
import { useT } from '../i18n/index.js';
import Monogram3D from './Monogram3D.jsx';
import PageAssembly from './PageAssembly.jsx';

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
          <motion.p className="hero__who" {...rise(0.1)}>
            <Monogram3D size={68} />
            <span className="eyebrow">{t('hero.eyebrow')}</span>
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
        </div>

        <PageAssembly />
      </div>
    </section>
  );
}
