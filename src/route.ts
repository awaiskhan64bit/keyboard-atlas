import { useEffect, useState } from 'react';

// Hash routes keep the static deploy working without any rewrite rules.
export type Route = { page: 'home' } | { page: 'brand'; slug: string } | { page: 'board'; id: string };

export const brandSlug = (brand: string) => brand.toLowerCase().replace(/[^a-z0-9]+/g, '-');

export const links = {
  home: '#/',
  brand: (brand: string) => `#/brand/${brandSlug(brand)}`,
  board: (id: string) => `#/board/${id}`,
};

function parse(hash: string): Route {
  const path = hash.replace(/^#\/?/, '');
  const [head, arg] = path.split('/');
  if (head === 'brand' && arg) return { page: 'brand', slug: arg };
  if (head === 'board' && arg) return { page: 'board', id: arg };
  return { page: 'home' };
}

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parse(location.hash));
  useEffect(() => {
    const onChange = () => {
      setRoute(parse(location.hash));
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}
