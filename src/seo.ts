import { site, hasPhone, phoneDigits, phoneLabel } from './site.config';

export function getSeo() {
  let canonical: string | undefined;
  try {
    const candidate = new URL(site.url);
    if (candidate.protocol === 'https:' && !candidate.username && !candidate.password && candidate.pathname === '/' && !candidate.search && !candidate.hash) canonical = candidate.origin + '/';
  } catch { /* Domena nie została jeszcze podana — wersja robocza nie jest indeksowana. */ }
  const isReady = Boolean(canonical && hasPhone);
  const title = `Choinki Baciuty 2026 – jodły i świerki | Baciuty 85`;
  const description = `Choinki Baciuty 2026: jodły, świerki i choinki w donicach. Baciuty 85, codziennie ${site.hours.label}. Przed przyjazdem najlepiej zadzwoń: ${phoneLabel}.`;
  const absolute = (path: string) => canonical ? new URL(path, canonical).href : undefined;
  const structured = canonical ? {
    '@context':'https://schema.org',
    '@graph':[
      { '@type':'WebSite', '@id':`${canonical}#website`, name:site.name, url:canonical, inLanguage:'pl-PL' },
      { '@type':'WebPage', '@id':`${canonical}#webpage`, name:title, description, url:canonical, inLanguage:'pl-PL', isPartOf:{'@id':`${canonical}#website`}, mainEntity:{'@id':`${canonical}#store`}, primaryImageOfPage:{'@type':'ImageObject',url:absolute(site.heroImage)} },
      {
        '@type':'Store', '@id':`${canonical}#store`, name:site.name, url:canonical,
        description:`Sprzedaż żywych choinek: jodły i świerki, cięte oraz w donicach. Baciuty 85, codziennie ${site.hours.label}. Najlepiej zadzwoń przed przyjazdem.`,
        openingHoursSpecification:{'@type':'OpeningHoursSpecification',dayOfWeek:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],opens:site.hours.opens,closes:site.hours.closes},
        image:absolute(site.heroImage),
        ...(hasPhone ? {telephone:`+${phoneDigits}`} : {}),
        ...(site.email ? {email:site.email} : {}),
        address:{'@type':'PostalAddress',streetAddress:site.address.street,addressLocality:site.address.locality,postalCode:site.address.postalCode,addressRegion:site.address.region,addressCountry:site.address.country},
        hasMap:`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.mapQuery)}`,
      },
    ],
  } : undefined;
  return { title, description, canonical, isReady, structured, image:absolute(site.heroImage) };
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
