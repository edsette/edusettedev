import { useRef } from 'react';
import ScrollReveal from '../reactbits/ScrollReveal.jsx';
import Magnet from '../reactbits/Magnet.jsx';
import { useRoute } from '../router.jsx';
import { useT } from '../i18n/index.js';
import { PROJECTS, SOCIAL, img, waLink } from '../data.js';
import { ArrowIcon, WhatsAppIcon } from './Icons.jsx';
import useReveal from '../hooks/useReveal.js';

export function Work() {
  const t = useT();
  const ref = useRef(null);
  useReveal(ref, { stagger: 0.12 });

  return (
    <section className="work" id="trabalhos" ref={ref} aria-labelledby="work-title">
      <div className="container">
        <div className="section-head" data-reveal>
          <div>
            <p className="eyebrow">{t('work.eyebrow')}</p>
            <h2 id="work-title">{t('work.title')}</h2>
          </div>
          <p>{t('work.intro')}</p>
        </div>
        <div className="work__grid">
          {PROJECTS.map(p => (
            <a
              key={p.id}
              className={`card${p.featured ? '' : ' card--alt'}`}
              href={p.url}
              target="_blank"
              rel="noopener"
              data-reveal
            >
              <div className="card__media">
                <img src={img(p.image)} alt="" loading="lazy" width="1584" height="990" />
              </div>
              <div className="card__meta">
                <div>
                  <h3>{t(`work.items.${p.id}.name`)}</h3>
                  <p className="card__type">{t(`work.items.${p.id}.type`)}</p>
                  <p className="card__desc">{t(`work.items.${p.id}.desc`)}</p>
                </div>
                <ArrowIcon className="card__arrow" width="22" height="22" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function About() {
  const { lang } = useRoute();
  const t = useT();
  const ref = useRef(null);
  useReveal(ref);
  const steps = [1, 2, 3, 4];

  return (
    <section className="about" id="sobre" ref={ref} aria-labelledby="about-title">
      <div className="container">
        <p className="eyebrow" id="about-title">
          {t('about.eyebrow')}
        </p>
        <ScrollReveal
          key={lang}
          baseOpacity={0.18}
          enableBlur
          blurStrength={5}
          baseRotation={1.5}
          containerClassName="about__reveal"
          textClassName="about__statement"
          wordAnimationEnd="bottom 65%"
        >
          {t('about.statement')}
        </ScrollReveal>
        <div className="about__grid">
          <div className="about__text" data-reveal>
            <figure className="about__me">
              <span className="about__arch">
                <img src={img('eduardo.jpg')} alt={t('hero.photoAlt')} width="640" height="640" loading="lazy" />
              </span>
              <figcaption>
                <strong>Eduardo Sette</strong>
                <span className="about__badge">
                  <i aria-hidden="true" />
                  {t('hero.badge')}
                </span>
              </figcaption>
            </figure>
            <p>{t('about.p1')}</p>
            <p>{t('about.p2')}</p>
          </div>
          <div data-reveal>
            <h3 className="about__process">{t('about.processTitle')}</h3>
            <ol className="about__steps">
              {steps.map(n => (
                <li key={n}>
                  <b>0{n}</b>
                  <div>
                    <strong>{t(`about.step${n}Title`)}</strong>
                    <span>{t(`about.step${n}Text`)}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  const t = useT();
  const ref = useRef(null);
  useReveal(ref);

  return (
    <section className="contact" id="contato" ref={ref} aria-labelledby="contact-title">
      <div className="container">
        <p className="eyebrow" data-reveal>
          {t('contact.eyebrow')}
        </p>
        <h2 id="contact-title" data-reveal>
          {t('contact.titleA')} <em>{t('contact.titleB')}</em>
        </h2>
        <p data-reveal>{t('contact.text')}</p>
        <div data-reveal style={{ display: 'inline-block' }}>
          <Magnet padding={70} magnetStrength={3}>
            <a className="btn btn--solid" href={waLink(t('whatsapp.hello'))} target="_blank" rel="noopener">
              <WhatsAppIcon />
              <span>{t('contact.cta')}</span>
            </a>
          </Magnet>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const t = useT();
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span>
          © {new Date().getFullYear()} Eduardo Sette. {t('footer.rights')}
        </span>
        <span className="footer__links">
          <a href={SOCIAL.github} target="_blank" rel="noopener">
            GitHub
          </a>
          <a href={SOCIAL.linkedin} target="_blank" rel="noopener">
            LinkedIn
          </a>
        </span>
      </div>
    </footer>
  );
}
