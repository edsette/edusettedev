import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { useT } from '../i18n/index.js';

const STEPS = [1, 2, 3, 4];
const DURATION = 4800; // ms por etapa

// "Como trabalho": palco animado com uma cena por etapa + lista que serve de navegação.
// Avança sozinho enquanto está visível; pausa com o mouse em cima.
export default function ProcessCarousel() {
  const t = useT();
  const root = useRef(null);
  const inView = useInView(root, { amount: 0.4 });
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const running = inView && !paused && !reduce;

  useEffect(() => {
    if (!running) return;
    const id = setTimeout(() => setActive(a => (a + 1) % STEPS.length), DURATION);
    return () => clearTimeout(id);
  }, [running, active]);

  const n = STEPS[active];

  return (
    <div
      className={`proc${running ? ' is-running' : ''}`}
      ref={root}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{ '--proc-dur': `${DURATION}ms` }}
    >
      <h3 className="about__process">{t('about.processTitle')}</h3>

      <div className="proc__stage" aria-live="polite">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={n}
            className="proc__slide"
            initial={{ opacity: 0, x: 60, rotateY: -12, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
            exit={{ opacity: 0, x: -60, rotateY: 12, scale: 0.96 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="proc__num" aria-hidden="true">
              0{n}
            </span>
            <Scene n={n} />
            <p className="proc__caption">
              <strong>{t(`about.step${n}Title`)}</strong>
              {t(`about.step${n}Text`)}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <ol className="proc__tabs">
        {STEPS.map((s, i) => (
          <li key={s}>
            <button
              type="button"
              className={i === active ? 'is-active' : undefined}
              aria-current={i === active ? 'step' : undefined}
              onClick={() => setActive(i)}
            >
              <b>0{s}</b>
              <span>{t(`about.step${s}Title`)}</span>
              <i className="proc__bar" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Scene({ n }) {
  if (n === 1)
    return (
      <div className="scene scene--chat" aria-hidden="true">
        <span className="bub bub--in" style={{ '--d': '0.2s', '--w': '62%' }} />
        <span className="bub bub--out" style={{ '--d': '0.9s', '--w': '48%' }} />
        <span className="bub bub--in" style={{ '--d': '1.6s', '--w': '72%' }} />
        <span className="bub bub--out bub--typing" style={{ '--d': '2.4s' }}>
          <i />
          <i />
          <i />
        </span>
      </div>
    );
  if (n === 2)
    return (
      <div className="scene scene--proto" aria-hidden="true">
        <span className="wf wf--nav" style={{ '--d': '0.1s' }} />
        <span className="wf wf--h" style={{ '--d': '0.5s' }} />
        <span className="wf wf--p" style={{ '--d': '0.8s' }} />
        <span className="wf wf--img" style={{ '--d': '1.1s' }} />
        <span className="wf wf--card" style={{ '--d': '1.6s' }} />
        <span className="wf wf--card" style={{ '--d': '1.8s' }} />
        <span className="wf wf--card" style={{ '--d': '2s' }} />
        <span className="spark" />
      </div>
    );
  if (n === 3)
    return (
      <div className="scene scene--tweak" aria-hidden="true">
        <span className="tw__preview">
          <i className="tw__title" />
          <i className="tw__line" />
          <i className="tw__btn" />
        </span>
        <span className="tw__panel">
          <span className="tw__swatches">
            <i />
            <i />
            <i />
          </span>
          <span className="tw__slider">
            <i />
          </span>
          <span className="tw__slider tw__slider--b">
            <i />
          </span>
        </span>
        <span className="tw__cursor" />
      </div>
    );
  return (
    <div className="scene scene--live" aria-hidden="true">
      <span className="lv__browser">
        <span className="lv__bar">
          <i />
          <i />
          <i />
          <span className="lv__url">
            <span>seunegocio.com</span>
          </span>
        </span>
        <span className="lv__load" />
        <span className="lv__body">
          <span className="lv__chart">
            <i style={{ '--h': '30%', '--d': '2.1s' }} />
            <i style={{ '--h': '48%', '--d': '2.25s' }} />
            <i style={{ '--h': '42%', '--d': '2.4s' }} />
            <i style={{ '--h': '70%', '--d': '2.55s' }} />
            <i style={{ '--h': '92%', '--d': '2.7s' }} />
          </span>
          <span className="lv__ok">✓</span>
        </span>
      </span>
    </div>
  );
}
