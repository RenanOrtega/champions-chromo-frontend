// Gera dist/sitemap.xml depois do build.
// Inclui as páginas fixas e, se a API responder, a página de álbuns de cada escola.
// Se a API falhar, o sitemap sai só com as páginas fixas e o build continua.
import { writeFileSync, existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SITE_URL = (process.env.VITE_SITE_URL || 'https://www.albumdefigurinha.com.br').replace(/\/$/, '');

function readEnvApiUrl() {
  if (process.env.VITE_API_URL) return process.env.VITE_API_URL;
  for (const file of ['.env.production.local', '.env.production', '.env.local', '.env']) {
    const p = resolve(file);
    if (!existsSync(p)) continue;
    const m = readFileSync(p, 'utf8').match(/^VITE_API_URL\s*=\s*(.+)$/m);
    if (m) return m[1].trim().replace(/^['"]|['"]$/g, '');
  }
  return null;
}

const staticPages = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/schools', priority: '0.9', changefreq: 'weekly' },
];

async function fetchSchools(apiUrl) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(`${apiUrl.replace(/\/$/, '')}/school`, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } finally {
    clearTimeout(timer);
  }
}

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const urls = [...staticPages];
const apiUrl = readEnvApiUrl();
if (apiUrl) {
  try {
    const schools = await fetchSchools(apiUrl);
    for (const s of schools) {
      if (s && s.id) urls.push({ path: `/schools/${encodeURIComponent(s.id)}/albums`, priority: '0.7', changefreq: 'weekly' });
    }
    console.log(`[sitemap] ${schools.length} escolas incluídas`);
  } catch (err) {
    console.warn(`[sitemap] não consegui buscar as escolas (${err.message}); gerando só com as páginas fixas`);
  }
} else {
  console.warn('[sitemap] VITE_API_URL não definida; gerando só com as páginas fixas');
}

const today = new Date().toISOString().slice(0, 10);
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${escape(SITE_URL + u.path)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

writeFileSync(resolve('dist/sitemap.xml'), xml);
console.log(`[sitemap] dist/sitemap.xml com ${urls.length} URLs`);
