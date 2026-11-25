import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Cada seção vira uma "página": fica presa (sticky) quando o fim dela chega à base da tela,
// e a próxima sobe por cima, com cantos arredondados que se endireitam; a de baixo encolhe
// e escurece. A rolagem continua livre. Com movimento reduzido, nada disso liga.
export default function usePageFlow(ref) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const root = document.documentElement;
        const sections = gsap.utils.toArray(':scope > section', ref.current);
        if (sections.length < 2) return;
        root.classList.add('pages');

        // Presa só quando o fim da seção alcança a base da tela.
        const setStick = () => {
          const vh = window.innerHeight;
          sections.forEach((s, i) => {
            if (i === sections.length - 1) return;
            s.style.top = `${Math.min(0, vh - s.offsetHeight)}px`;
          });
        };
        setStick();
        ScrollTrigger.addEventListener('refreshInit', setStick);

        sections.forEach((next, i) => {
          if (i === 0) return;
          const prev = sections[i - 1];
          const range = { trigger: next, start: 'top bottom', end: 'top top', scrub: true };
          gsap.fromTo(
            next,
            { clipPath: 'inset(0% 0% 0% 0% round 44px 44px 0px 0px)' },
            { clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)', ease: 'none', scrollTrigger: range }
          );
          gsap.fromTo(
            prev.querySelector(':scope > .container'),
            { scale: 1, opacity: 1, y: 0 },
            { scale: 0.9, opacity: 0.25, y: -40, ease: 'power1.in', immediateRender: false, scrollTrigger: range }
          );
          gsap.fromTo(prev, { '--dim': 0 }, { '--dim': 0.45, ease: 'none', immediateRender: false, scrollTrigger: range });
        });

        return () => {
          ScrollTrigger.removeEventListener('refreshInit', setStick);
          sections.forEach(s => (s.style.top = ''));
          root.classList.remove('pages');
        };
      });
      return () => mm.revert();
    },
    { scope: ref }
  );
}
