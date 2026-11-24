import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useT } from '../i18n/index.js';

gsap.registerPlugin(useGSAP);

// "Vista explodida" de uma landing page: as camadas começam soltas em 3D, com etiquetas,
// e se encaixam formando a página. Passar o mouse (ou tocar) abre de novo.
// x/y em % do tamanho da própria camada; z em px.
const LAYERS = [
  { id: 'base', z: 0, x: 0, y: 0 },
  { id: 'nav', z: 70, x: -6, y: -150, label: 'nav' },
  { id: 'hero', z: 150, x: -26, y: -16, label: 'hero' },
  { id: 'cta', z: 260, x: 150, y: -60, label: 'cta' },
  { id: 'media', z: 210, x: 30, y: 6, label: 'media' },
  { id: 'cards', z: 120, x: 24, y: 70, label: 'cards' },
  { id: 'post', z: 190, x: -44, y: 30, label: 'post' },
  { id: 'footer', z: 50, x: 4, y: 160, label: 'footer' },
];

const EXPLODED_VIEW = { rotationX: 52, rotationZ: -32, scale: 0.7 };
const FLAT_VIEW = { rotationX: 0, rotationZ: 0, scale: 1 };

export default function PageAssembly() {
  const t = useT();
  const root = useRef(null);
  const tl = useRef(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const page = q('.asm__page')[0];
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set(page, EXPLODED_VIEW);
        LAYERS.forEach(l => gsap.set(q(`[data-layer="${l.id}"]`), { z: l.z, xPercent: l.x, yPercent: l.y }));
        gsap.set(q('.asm__tag'), { autoAlpha: 1 });

        tl.current = gsap
          .timeline({ delay: 1.1, defaults: { ease: 'expo.inOut', duration: 1.6 } })
          .to(q('.asm__tag'), { autoAlpha: 0, duration: 0.5, stagger: 0.04, ease: 'power2.out' }, 0.5)
          .to(q('[data-layer]'), { z: 0, xPercent: 0, yPercent: 0, stagger: { each: 0.07, from: 'end' } }, 0.2)
          .to(page, { ...FLAT_VIEW, duration: 1.9 }, 0.35)
          .fromTo(q('.asm__glow'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, ease: 'power2.out' }, '-=0.5');
        if (import.meta.env.DEV) window.__asm = tl.current; // só para inspeção local
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(q('.asm__tag'), { autoAlpha: 0 });
        tl.current = null;
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  // Abre (inverte a montagem) ao passar o mouse; monta de novo ao sair.
  const explode = () => {
    const a = tl.current;
    if (!a) return;
    a.timeScale(1.6).reverse();
  };
  const assemble = () => {
    const a = tl.current;
    if (!a) return;
    a.timeScale(1).play();
  };
  const toggle = () => {
    const a = tl.current;
    if (!a) return;
    if (a.reversed() || a.progress() < 1) assemble();
    else explode();
  };

  return (
    <div
      className="asm"
      ref={root}
      role="img"
      aria-label={t('hero.assemblyAlt')}
      onPointerEnter={e => e.pointerType === 'mouse' && explode()}
      onPointerLeave={e => e.pointerType === 'mouse' && assemble()}
      onPointerUp={e => e.pointerType !== 'mouse' && toggle()}
    >
      <div className="asm__page">
        <div className="asm__layer asm__base" data-layer="base" />

        <div className="asm__layer asm__nav" data-layer="nav">
          <i className="asm__logo" />
          <span className="asm__links">
            <i />
            <i />
            <i />
          </span>
          <Tag>{t('hero.layers.nav')}</Tag>
        </div>

        <div className="asm__layer asm__hero" data-layer="hero">
          <i className="asm__h" style={{ width: '78%' }} />
          <i className="asm__h" style={{ width: '56%' }} />
          <i className="asm__p" style={{ width: '64%' }} />
          <i className="asm__p" style={{ width: '48%' }} />
          <Tag>{t('hero.layers.hero')}</Tag>
        </div>

        <div className="asm__layer asm__cta" data-layer="cta">
          <Tag side="right">{t('hero.layers.cta')}</Tag>
        </div>

        <div className="asm__layer asm__media" data-layer="media">
          <span className="asm__sun" />
          <span className="asm__hill" />
          <Tag side="right">{t('hero.layers.media')}</Tag>
        </div>

        <div className="asm__layer asm__cards" data-layer="cards">
          <i />
          <i />
          <i />
          <Tag side="right">{t('hero.layers.cards')}</Tag>
        </div>

        <div className="asm__layer asm__post" data-layer="post">
          <span className="asm__avatar" />
          <span className="asm__post-lines">
            <i style={{ width: '90%' }} />
            <i style={{ width: '70%' }} />
          </span>
          <Tag>{t('hero.layers.post')}</Tag>
        </div>

        <div className="asm__layer asm__footer" data-layer="footer">
          <i />
          <i />
          <Tag>{t('hero.layers.footer')}</Tag>
        </div>
      </div>
      <span className="asm__glow" aria-hidden="true" />
    </div>
  );
}

function Tag({ children, side = 'left' }) {
  return (
    <span className={`asm__tag asm__tag--${side}`} aria-hidden="true">
      <span className="asm__tag-line" />
      {children}
    </span>
  );
}
