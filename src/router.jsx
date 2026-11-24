import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { detectLang, isLang } from './lang.js';

// Roteador mínimo: /:lang/ e /:lang/templates sob o BASE_URL do Vite.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
const LANG_LIKE = /^[a-z]{2}(-[a-z]{2,4})?$/i;

export const href = path => `${BASE}${path}`;

function resolve(pathname) {
  const rest = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname;
  const parts = rest.split('/').filter(Boolean);
  const raw = parts[0];
  const first = raw?.toLowerCase();
  let lang;
  let valid;
  if (isLang(first)) {
    // "DE" vale como "de", mas a URL é normalizada para minúsculas.
    lang = first;
    valid = raw === first;
    parts.shift();
  } else {
    lang = detectLang();
    valid = false;
    if (parts.length && LANG_LIKE.test(raw) && raw !== 'templates') parts.shift();
  }
  const page = parts.length === 0 ? 'home' : parts.length === 1 && parts[0] === 'templates' ? 'templates' : 'notfound';
  const tail = page === 'templates' ? 'templates' : page === 'notfound' ? parts.join('/') : '';
  return { lang, page, canonical: `/${lang}/${tail}`, valid };
}

function current() {
  const r = resolve(window.location.pathname);
  if (!r.valid) {
    window.history.replaceState(window.history.state, '', href(r.canonical) + window.location.search + window.location.hash);
  }
  return { lang: r.lang, page: r.page };
}

const RouteContext = createContext(null);

export function RouterProvider({ children }) {
  const [route, setRoute] = useState(current);
  const restoreY = useRef(null);
  const lastPage = useRef(null); // null: a primeira renderização também respeita a âncora da URL

  useEffect(() => {
    // Nós mesmos guardamos e restauramos a rolagem de cada entrada do histórico.
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    const onPop = () => {
      restoreY.current = window.history.state?.y ?? 0;
      setRoute(current());
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Voltar/avançar: volta à posição guardada. Página nova: âncora (se houver) ou topo.
  useEffect(() => {
    const pageChanged = lastPage.current !== route.page;
    lastPage.current = route.page;
    if (restoreY.current != null) {
      const y = restoreY.current;
      restoreY.current = null;
      window.scrollTo(0, y);
      return;
    }
    if (!pageChanged) return;
    const id = window.location.hash.slice(1);
    const el = id && document.getElementById(id);
    if (el) el.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [route]);

  // keepScroll: troca de idioma na mesma página, sem mexer na rolagem.
  const navigate = useCallback((path, { keepScroll = false } = {}) => {
    const url = new URL(path, window.location.origin);
    window.history.replaceState({ ...window.history.state, y: window.scrollY }, '');
    window.history.pushState({ y: keepScroll ? window.scrollY : 0 }, '', href(url.pathname) + url.hash);
    setRoute(current());
    if (!keepScroll && url.hash) {
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
