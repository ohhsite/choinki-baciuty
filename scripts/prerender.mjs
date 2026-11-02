import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { render, getSeo, serializeJsonLd } from '../.ssr/entry-server.js';

const seo = getSeo();
const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
if (process.env.REQUIRE_PRODUCTION === '1' && !seo.isReady) {
  throw new Error('Uzupełnij domenę HTTPS i polski numer telefonu w src/site.config.ts przed publikacją.');
}
const head = [
  `<title>${escape(seo.title)}</title>`,
  `<meta name="description" content="${escape(seo.description)}">`,
  `<meta name="robots" content="${seo.isReady ? 'index, follow, max-image-preview:large' : 'noindex, nofollow'}">`,
  ...(seo.canonical ? [`<link rel="canonical" href="${escape(seo.canonical)}">`,`<meta property="og:url" content="${escape(seo.canonical)}">`] : []),
  '<meta property="og:type" content="website">',
  '<meta property="og:locale" content="pl_PL">',
  '<meta property="og:site_name" content="Choinki Baciuty">',
  `<meta property="og:title" content="${escape(seo.title)}">`,
  `<meta property="og:description" content="${escape(seo.description)}">`,
  '<meta name="twitter:card" content="summary_large_image">',
  `<meta name="twitter:title" content="${escape(seo.title)}">`,
  `<meta name="twitter:description" content="${escape(seo.description)}">`,
  ...(seo.image ? [`<meta property="og:image" content="${escape(seo.image)}">`,`<meta name="twitter:image" content="${escape(seo.image)}">`,`<meta property="og:image:alt" content="Przykładowa jodła kaukaska Premium z asortymentu">`] : []),
  ...(seo.structured ? [`<script type="application/ld+json">${serializeJsonLd(seo.structured)}</script>`] : []),
].join('\n    ');
const index = new URL('../dist/index.html', import.meta.url);
let template = await fs.readFile(index, 'utf8');
if (!template.includes('<!--app-html-->')) throw new Error('Brak miejsca na treść React w index.html.');
template = template.replace(/<!--seo-start-->[\s\S]*?<!--seo-end-->/, head).replace('<!--app-html-->', render());
await fs.writeFile(index, template);
if (seo.isReady) {
  await fs.writeFile(new URL('../dist/robots.txt',import.meta.url),`User-agent: *\nAllow: /\nSitemap: ${seo.canonical}sitemap.xml\n`);
  await fs.writeFile(new URL('../dist/sitemap.xml',import.meta.url),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escape(seo.canonical)}</loc></url></urlset>\n`);
} else {
  await fs.writeFile(new URL('../dist/robots.txt',import.meta.url),'User-agent: *\nDisallow: /\n');
  await fs.rm(new URL('../dist/sitemap.xml',import.meta.url),{force:true});
}
console.log(`HTML wygenerowany: ${fileURLToPath(index)}`);
console.log(seo.isReady ? 'SEO: canonical, sitemap, robots, metadane i JSON-LD gotowe.' : 'Wersja robocza: uzupełnij domenę oraz telefon w src/site.config.ts. Indeksowanie pozostaje wyłączone.');
