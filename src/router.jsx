import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { detectLang, isLang } from './lang.js';

// Roteador mínimo: /:lang/ e /:lang/templates sob o BASE_URL do Vite.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
const LANG_LIKE = /^[a-z]{2}(-[a-z]{2,4})?$/i;

export const href = path => `${BASE}${path}`;

function resolve(pathname) {
  const rest = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname;
  const parts = rest.split('/').filter(Boolean);
  let lang = parts[0];
  let valid = isLang(lang);
  if (!valid) {
    lang = detectLang();
    if (parts.length && LANG_LIKE.test(parts[0]) && parts[0] !== 'templates') parts.shift();
  } else {
    parts.shift();
  }
  const page = parts.length === 0 ? 'home' : parts.length === 1 && parts[0] === 'templates' ? 'templates' : 'notfound';
  const tail = page === 'templates' ? 'templates' : page === 'notfound' ? parts.join('/') : '';
  const canonical = `/${lang}/${tail}`;
  return { lang, page, canonical, valid };
}

function current() {
  const r = resolve(window.location.pathname);
  if (!r.valid) {
    window.history.replaceState(null, '', href(r.canonical) + window.location.search + window.location.hash);
  }
  return { lang: r.lang, page: r.page };
}

const RouteContext = createContext(null);

export function RouterProvider({ children }) {
  const [route, setRoute] = useState(current);

  useEffect(() => {
    const onPop = () => setRoute(current());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Depois de trocar de página: vai para a âncora (se houver) ou para o topo.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    const el = id && document.getElementById(id);
    if (el) requestAnimationFrame(() => el.scrollIntoView());
  }, [route.page]);

  const navigate = useCallback(path => {
    const url = new URL(path, window.location.origin);
    const prev = window.location.pathname;
    window.history.pushState(null, '', href(url.pathname) + url.hash);
    const next = current();
    setRoute(next);
    if (href(url.pathname) !== prev && !url.hash) window.scrollTo(0, 0);
    if (url.hash) {
      const el = document.getElementById(url.hash.slice(1));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return <RouteContext.Provider value={{ ...route, navigate }}>{children}</RouteContext.Provider>;
}

export const useRoute = () => useContext(RouteContext);

// Link interno: `to` sem o BASE (ex.: "/en/templates" ou "/pt/#contato").
export function Link({ to, onClick, children, ...rest }) {
  const { navigate } = useRoute();
  return (
    <a
      href={href(to)}
      onClick={e => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        navigate(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
