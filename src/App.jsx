import { useEffect } from 'react';
import { RouterProvider, Link, useRoute } from './router.jsx';
import { useT } from './i18n/index.js';
import { HTML_LANG, saveLang } from './lang.js';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import BigNav from './components/BigNav.jsx';
import { About, Contact, Footer, Work } from './components/Sections.jsx';
import Templates from './pages/Templates.jsx';

function Home() {
  return (
    <main>
      <Hero />
      <BigNav />
      <Work />
      <About />
      <Contact />
    </main>
  );
}

function NotFound() {
  const { lang } = useRoute();
  const t = useT();
  return (
    <main className="notfound">
      <div>
        <h1 style={{ fontSize: 'clamp(2.4rem, 6vw, 4.4rem)', color: 'var(--olive)' }}>{t('notFound.title')}</h1>
        <p style={{ marginTop: 28 }}>
          <Link className="text-link" to={`/${lang}/`}>
            ← {t('notFound.back')}
          </Link>
        </p>
      </div>
    </main>
  );
}

function Shell() {
  const { lang, page } = useRoute();
  const t = useT();

  useEffect(() => {
    document.documentElement.lang = HTML_LANG[lang];
    document.title = t(page === 'templates' ? 'meta.templatesTitle' : 'meta.title');
    document.querySelector('meta[name="description"]')?.setAttribute('content', t('meta.description'));
    saveLang(lang);
  }, [lang, page, t]);

  return (
    <>
      <Header />
      {page === 'home' ? <Home /> : page === 'templates' ? <Templates /> : <NotFound />}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <Shell />
    </RouterProvider>
  );
}
