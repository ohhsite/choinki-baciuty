import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { getSeo, serializeJsonLd } from '../.ssr/entry-server.js';

const SITE = 'https://choinkibaciuty.pl/';

const html = await fs.readFile(
  new URL('../dist/index.html', import.meta.url),
  'utf8'
);

const robots = await fs.readFile(
  new URL('../dist/robots.txt', import.meta.url),
  'utf8'
);

const sitemap = await fs.readFile(
  new URL('../dist/sitemap.xml', import.meta.url),
  'utf8'
);

const assetFile = (path) =>
  new URL(`../dist${path}`, import.meta.url);

test('Gotowy HTML zawiera treść, telefon i godziny 10:00–20:00', () => {
  assert.match(html, /<html lang="pl">/);

  assert.equal(
    (html.match(/<h1(?:\s|>)/g) || []).length,
    1
  );

  assert.match(html, /Choinki w Baciutach/);
  assert.match(html, /Baciuty 85/);
  assert.match(html, /500 610 026/);
  assert.match(html, /href="tel:\+48500610026"/);
  assert.match(html, /10:00–20:00/);
  assert.match(html, /Najlepiej.*?zadzwoń.*?przed przyjazdem/s);

  assert.equal(
    (html.match(/class="product"/g) || []).length,
    6
  );

  assert.equal(
    (html.match(/class="faq__item"/g) || []).length,
    8
  );

  assert.equal(
    (html.match(/<footer(?:\s|>)/g) || []).length,
    1
  );

  assert.doesNotMatch(
    html,
    /<!--app-html-->|<!--seo-start-->|<!--seo-end-->/
  );

  assert.doesNotMatch(html, /\/src\/main\.tsx/);
});

test('Zdjęcia wskazane w HTML istnieją w dist', async () => {
  const images = Array.from(
    html.matchAll(/<img[^>]+src="([^"]+)"/g),
    (match) => match[1]
  );

  assert.ok(images.length >= 10);

  for (const image of images) {
    assert.ok(image.startsWith('/images/'));
    await fs.access(assetFile(image));
  }
});

test('Pliki JavaScript i CSS wskazane w HTML istnieją w dist', async () => {
  const assets = Array.from(
    html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+\.(?:js|css))"/g),
    (match) => match[1]
  );

  assert.ok(
    assets.some((asset) => asset.endsWith('.js')),
    'Brak skryptu aplikacji.'
  );

  assert.ok(
    assets.some((asset) => asset.endsWith('.css')),
    'Brak arkusza stylów.'
  );

  for (const asset of assets) {
    await fs.access(assetFile(asset));
  }
});

test('Indeksowanie jest włączone, a canonical i sitemap wskazują domenę', () => {
  assert.match(
    html,
    /<meta name="robots" content="index, follow, max-image-preview:large">/
  );

  // Test ma się nie powieść, jeżeli strona blokuje indeksowanie.
  assert.doesNotMatch(html, /noindex|nofollow/i);

  const canonical = html.match(
    /<link rel="canonical" href="([^"]+)"/
  );

  assert.equal(canonical?.[1], SITE);

  assert.match(robots, /^User-agent: \*\s*$/m);
  assert.match(robots, /^Allow: \/\s*$/m);
  assert.doesNotMatch(robots, /^Disallow:\s*\/\s*$/m);

  assert.ok(
    robots.includes(`Sitemap: ${SITE}sitemap.xml`)
  );

  assert.ok(
    sitemap.includes(`<loc>${SITE}</loc>`)
  );
});

test('JSON-LD ma właściwy adres, telefon i godziny codziennie 10:00–20:00', () => {
  const scripts = Array.from(
    html.matchAll(
      /<script type="application\/ld\+json">(.*?)<\/script>/gs
    ),
    (match) => JSON.parse(match[1])
  );

  assert.equal(scripts.length, 1);

  const store = scripts[0]['@graph']?.find(
    (item) => item['@type'] === 'Store'
  );

  assert.ok(store, 'Brak danych Store w JSON-LD.');

  assert.equal(store.url, SITE);
  assert.equal(store.address.streetAddress, 'Baciuty 85');
  assert.equal(store.address.addressLocality, 'Baciuty');
  assert.equal(store.address.postalCode, '18-106');
  assert.equal(store.telephone, '+48500610026');

  const hours = store.openingHoursSpecification;

  assert.equal(hours.opens, '10:00');
  assert.equal(hours.closes, '20:00');

  assert.deepEqual(hours.dayOfWeek, [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ]);

  const seo = getSeo();

  assert.equal(seo.isReady, true);
  assert.equal(seo.canonical, SITE);

  const serialized = serializeJsonLd({
    text: '</script><tekst>',
  });

  assert.ok(!serialized.includes('<'));

  assert.equal(
    JSON.parse(serialized).text,
    '</script><tekst>'
  );
});

test('Nie ma starych danych Białegostoku ani fikcyjnych ocen', () => {
  assert.doesNotMatch(html, /604.?821.?125/);
  assert.doesNotMatch(html, /Galerii Biała/);

  assert.doesNotMatch(
    html,
    /ratingValue|AggregateRating|23\.180333|53\.123426/
  );

  assert.doesNotMatch(
    html,
    /24\/7|bez sztywnych godzin/i
  );
});