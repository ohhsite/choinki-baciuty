import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import {
  render,
  getSeo,
  serializeJsonLd,
} from '../.ssr/entry-server.js';

const seo = getSeo();

const escape = (value) =>
  String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char]));

if (!seo.isReady || !seo.canonical) {
  throw new Error(
    'Uzupełnij domenę HTTPS i polski numer telefonu w src/site.config.ts przed publikacją.'
  );
}

const head = [
  `<title>${escape(seo.title)}</title>`,

  `<meta name="description" content="${escape(seo.description)}">`,

  '<meta name="robots" content="index, follow, max-image-preview:large">',

  `<link rel="canonical" href="${escape(seo.canonical)}">`,

  '<meta property="og:type" content="website">',
  '<meta property="og:locale" content="pl_PL">',
  '<meta property="og:site_name" content="Choinki Baciuty">',

  `<meta property="og:url" content="${escape(seo.canonical)}">`,
  `<meta property="og:title" content="${escape(seo.title)}">`,
  `<meta property="og:description" content="${escape(seo.description)}">`,

  '<meta name="twitter:card" content="summary_large_image">',

  `<meta name="twitter:title" content="${escape(seo.title)}">`,
  `<meta name="twitter:description" content="${escape(seo.description)}">`,

  ...(seo.image ? [
    `<meta property="og:image" content="${escape(seo.image)}">`,
    '<meta property="og:image:alt" content="Przykładowa jodła kaukaska Premium z asortymentu">',
    `<meta name="twitter:image" content="${escape(seo.image)}">`,
  ] : []),

  ...(seo.structured ? [
    `<script type="application/ld+json">${serializeJsonLd(seo.structured)}</script>`,
  ] : []),
].join('\n    ');

const index = new URL('../dist/index.html', import.meta.url);

let template = await fs.readFile(index, 'utf8');

const seoPlaceholder = /<!--seo-start-->[\s\S]*?<!--seo-end-->/;

if (!seoPlaceholder.test(template)) {
  throw new Error(
    'Brak znaczników <!--seo-start--> i <!--seo-end--> w index.html.'
  );
}

if (!template.includes('<!--app-html-->')) {
  throw new Error(
    'Brak znacznika <!--app-html--> w index.html.'
  );
}

template = template
  .replace(seoPlaceholder, () => head)
  .replace('<!--app-html-->', () => render());

await fs.writeFile(index, template, 'utf8');

const robots = [
  'User-agent: *',
  'Allow: /',
  `Sitemap: ${seo.canonical}sitemap.xml`,
  '',
].join('\n');

await fs.writeFile(
  new URL('../dist/robots.txt', import.meta.url),
  robots,
  'utf8'
);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${escape(seo.canonical)}</loc>
  </url>
</urlset>
`;

await fs.writeFile(
  new URL('../dist/sitemap.xml', import.meta.url),
  sitemap,
  'utf8'
);

console.log(`HTML wygenerowany: ${fileURLToPath(index)}`);
console.log('Indeksowanie włączone: index, follow.');
console.log(`Canonical: ${seo.canonical}`);
console.log('Wygenerowano robots.txt, sitemap.xml i dane JSON-LD.');