import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://www.albumdefigurinha.com.br').replace(/\/$/, '');
export const SITE_NAME = 'Rei das Figurinhas';

const DEFAULT_TITLE = 'Rei das Figurinhas | Álbum de figurinha personalizado para escolas';
const DEFAULT_DESCRIPTION =
  'Álbuns de figurinhas personalizados para escolas, empresas e eventos. Escolha a escola, selecione o álbum e compre as figurinhas que faltam online, com pagamento por Pix.';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

export interface PageMeta {
  /** Título da página, sem o nome do site (ele é adicionado no final). */
  title?: string;
  description?: string;
  /** Imagem para compartilhamento (WhatsApp, Facebook). URL absoluta. */
  image?: string;
  /** true em páginas que não devem aparecer no Google (carrinho, pedido, pagamento). */
  noindex?: boolean;
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function apply(meta: PageMeta, pathname: string) {
  const title = meta.title ? `${meta.title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const description = meta.description || DEFAULT_DESCRIPTION;
  const image = meta.image || DEFAULT_IMAGE;
  const url = `${SITE_URL}${pathname === '/' ? '/' : pathname.replace(/\/$/, '')}`;

  document.title = title;
  setMeta('name', 'description', description);
  setMeta('name', 'robots', meta.noindex ? 'noindex, nofollow' : 'index, follow');
  setCanonical(url);
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', description);
  setMeta('property', 'og:url', url);
  setMeta('property', 'og:image', image);
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', description);
  setMeta('name', 'twitter:image', image);
}

/**
 * Define título, descrição, canonical e tags de compartilhamento da página atual.
 * Ao sair da página, volta para os valores padrão do site.
 */
export function usePageMeta(meta: PageMeta) {
  const { pathname } = useLocation();
  const { title, description, image, noindex } = meta;

  useEffect(() => {
    apply({ title, description, image, noindex }, pathname);
  }, [title, description, image, noindex, pathname]);

  useEffect(() => () => apply({}, window.location.pathname), []);
}
