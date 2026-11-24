import { useRef } from 'react';
import { Contact } from '../components/Sections.jsx';
import { useT } from '../i18n/index.js';
import { TEMPLATES } from '../data.js';
import TemplatePreview from '../components/TemplatePreview.jsx';
import { ArrowIcon } from '../components/Icons.jsx';
import useReveal from '../hooks/useReveal.js';

function TemplateCard({ item }) {
  const t = useT();
  const name = t(`templates.items.${item.id}.name`);
  const forSale = Boolean(item.gumroadUrl);

  return (
    <article className="tpl-card" data-reveal>
      <div className="tpl-card__preview">
        <TemplatePreview kind={item.preview} />
        {!forSale && <span className="tpl-card__soon">{t('templates.soon')}</span>}
      </div>
      <div className="tpl-card__body">
        <h2>{name}</h2>
        <p className="tpl-card__cat">{t(`templates.items.${item.id}.category`)}</p>
        <div className="tpl-card__foot">
          <span className="tpl-card__price">{item.price ?? t('templates.priceSoon')}</span>
          {forSale && (
            <a className="tpl-card__buy" href={item.gumroadUrl} target="_blank" rel="noopener">
              {t('templates.buy')} <ArrowIcon width="14" height="14" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Templates() {
  const t = useT();
  const ref = useRef(null);
  useReveal(ref, { stagger: 0.1 });

  return (
    <main ref={ref}>
      <section className="tpl-hero container" aria-labelledby="tpl-title">
        <p className="eyebrow" data-reveal>
          {t('templates.eyebrow')}
        </p>
        <h1 id="tpl-title" data-reveal>
          {t('templates.title')}
        </h1>
        <p data-reveal>{t('templates.intro')}</p>
      </section>
      <section className="container tpl-grid" aria-label={t('templates.eyebrow')}>
        {TEMPLATES.map(item => (
          <TemplateCard key={item.id} item={item} />
        ))}
      </section>
      <Contact />
    </main>
  );
}
