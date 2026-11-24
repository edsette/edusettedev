import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from '../router.jsx';
import { useT } from '../i18n/index.js';
import { useNavItems } from './Header.jsx';
import useReveal from '../hooks/useReveal.js';

// Ideia da Lauren Waller: o menu vira o herói da página, em tipografia display.
export default function BigNav() {
  const t = useT();
  const items = useNavItems();
  const [hover, setHover] = useState(null);
  const ref = useRef(null);
  useReveal(ref);

  return (
    <section className="bignav" aria-label={t('bignav.eyebrow')} ref={ref}>
      <div className="container">
        <div className="bignav__intro" data-reveal>
          <span className="eyebrow">{t('bignav.eyebrow')}</span>
          <p>{t('bignav.intro')}</p>
        </div>
        <ul className="bignav__list" onMouseLeave={() => setHover(null)}>
          {items.map((item, i) => (
            <li key={item.key} className="bignav__item" data-reveal>
              <Link to={item.to} onMouseEnter={() => setHover(item.key)} onFocus={() => setHover(item.key)}>
                <span className="bignav__num">0{i + 1}</span>
                <span className="bignav__word">
                  {item.label}
                  {item.key === 'templates' && <span className="bignav__tag">{t('bignav.soon')}</span>}
                </span>
                <span className="bignav__desc">{t(`bignav.${item.key}`)}</span>
                {hover === item.key && <motion.span layoutId="bignav-line" className="bignav__line" />}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
