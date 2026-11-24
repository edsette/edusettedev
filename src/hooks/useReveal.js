import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

let refreshQueued = false;
function queueRefresh() {
  if (refreshQueued) return;
  refreshQueued = true;
  const run = () => ScrollTrigger.refresh();
  document.fonts?.ready.then(run);
  window.addEventListener('load', run, { once: true });
}

// Revela os filhos [data-reveal] de `ref` ao rolar. Com movimento reduzido, nada é escondido.
export default function useReveal(ref, { y = 24, stagger = 0.08 } = {}) {
  useGSAP(
    () => {
      queueRefresh();
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const els = gsap.utils.toArray('[data-reveal]', ref.current);
        if (!els.length) return;
        gsap.from(els, {
          y,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          stagger,
          scrollTrigger: { trigger: ref.current, start: 'top 82%', once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref }
  );
}
