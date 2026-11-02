import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const html = await fs.readFile(new URL('../dist/index.html',import.meta.url),'utf8');
const robots = await fs.readFile(new URL('../dist/robots.txt',import.meta.url),'utf8');

test('Treść i kontakt są w gotowym HTML bez JavaScript', () => {
  assert.match(html,/<html lang="pl">/);
  assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1);
  assert.match(html,/Choinki w Baciutach/);
  assert.match(html,/Baciuty 85/);
  assert.match(html,/500 610 026/);
  assert.match(html,/href="tel:\+48500610026"/);
  assert.match(html,/9:00–20:00/);
  assert.match(html,/Najlepiej.*?zadzwoń.*?przed przyjazdem/s);
  assert.doesNotMatch(html,/bez sztywnych godzin|Nie działamy według sztywnych godzin/i);
  assert.equal((html.match(/class="product"/g)||[]).length,6);
  assert.equal((html.match(/class="faq__item"/g)||[]).length,8);
  assert.equal((html.match(/<footer(?:\s|>)/g)||[]).length,1);
  assert.doesNotMatch(html,/<!--app-html-->/);
});

test('Wszystkie lokalne zdjęcia w HTML istnieją', async () => {
  const images=Array.from(html.matchAll(/<img[^>]+src="([^"]+)"/g),m=>m[1]);
  assert.ok(images.length>=10);
  for(const image of images){
    assert.ok(image.startsWith('/images/'));
    await fs.access(new URL('../dist'+image,import.meta.url));
  }
});

test('Nie ma starych danych punktu białostockiego ani fikcyjnych ocen', () => {
  assert.doesNotMatch(html,/604.?821.?125/);
  assert.doesNotMatch(html,/Galerii Biała/);
  assert.doesNotMatch(html,/ratingValue|AggregateRating|23\.180333|53\.123426/);
  assert.doesNotMatch(html,/24\/7/);
});

test('Brak konfiguracji wyłącza indeksowanie; produkcja ma prawdziwy canonical', async () => {
  const canonical=html.match(/<link rel="canonical" href="([^"]+)"/);
  const isIndexable=html.includes('index, follow, max-image-preview:large');
  if(isIndexable){
    assert.ok(canonical);
    assert.equal(new URL(canonical[1]).protocol,'https:');
    assert.match(robots,/Allow: \//);
    assert.match(robots,/Sitemap: https:/);
    const sitemap=await fs.readFile(new URL('../dist/sitemap.xml',import.meta.url),'utf8');
    assert.ok(sitemap.includes(canonical[1]));
    const scripts=Array.from(html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs),m=>JSON.parse(m[1]));
    assert.equal(scripts.length,1);
    const store=scripts[0]['@graph'].find(x=>x['@type']==='Store');
    assert.equal(store.address.streetAddress,'Baciuty 85');
    assert.match(store.telephone,/^\+48\d{9}$/);
  } else {
    assert.match(html,/content="noindex, nofollow"/);
    assert.match(robots,/Disallow: \//);
  }
});

test('Faktyczna konfiguracja produkcyjna tworzy właściwe dane SEO', async () => {
  const ts = await import('typescript');
  const vm = await import('node:vm');
  const config = (await fs.readFile(new URL('../src/site.config.ts',import.meta.url),'utf8')).replace("url: '',", "url: 'https://example.invalid',").replace(/phone:\s*'[^']*',/, "phone: '+48000000000',").replace(/export /g,'');
  const seo = (await fs.readFile(new URL('../src/seo.ts',import.meta.url),'utf8')).replace(/^import .*?;\n/m,'').replace(/export /g,'');
  const js = ts.transpileModule(config+'\n'+seo+'\nJSON.stringify({seo:getSeo(), serialized:serializeJsonLd({x:"<tekst>"})});',{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText;
  const result=JSON.parse(vm.runInNewContext(js,{URL}));
  assert.equal(result.seo.canonical,'https://example.invalid/');
  assert.equal(result.seo.isReady,true);
  assert.equal(result.seo.structured['@graph'].find(x=>x['@type']==='Store').telephone,'+48000000000');
  const hours=result.seo.structured['@graph'].find(x=>x['@type']==='Store').openingHoursSpecification;
  assert.equal(hours.opens,'09:00');
  assert.equal(hours.closes,'20:00');
  assert.equal(hours.dayOfWeek.length,7);
  assert.equal(JSON.parse(result.serialized).x,'<tekst>');
  assert.ok(!result.serialized.includes('<'));
});

test('Publikacja produkcyjna jest blokowana przy brakujących danych', async () => {
  if (html.includes('index, follow, max-image-preview:large')) return;
  const {spawnSync}=await import('node:child_process');
  const result=spawnSync(process.execPath,['scripts/prerender.mjs'],{cwd:new URL('..',import.meta.url),encoding:'utf8',env:{...process.env,REQUIRE_PRODUCTION:'1'}});
  assert.notEqual(result.status,0);
  assert.match(result.stderr,/Uzupełnij domenę HTTPS/);
});
