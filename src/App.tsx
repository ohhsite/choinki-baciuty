import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, Clock3, Leaf, MapPin, Menu, Navigation, Phone, Plus, Sprout, TreePine, X, ZoomIn } from 'lucide-react';
import { faq, inspirations, products } from './data';
import { hasPhone, mapEmbedUrl, mapsUrl, phoneHref, phoneLabel, site } from './site.config';

type PhotoIndex = number | null;

function Brand({ light = false }: { light?: boolean }) {
  return <a className={`brand${light ? ' brand--light' : ''}`} href="#start" aria-label="Choinki Baciuty — początek strony">
    <span className="brand__symbol" aria-hidden="true"><TreePine strokeWidth={1.2} /><span>✦</span></span>
    <span className="brand__words">Choinki<span>BACIUTY</span></span>
  </a>;
}

function PhoneButton({ className = '', children = 'Zadzwoń przed wizytą' }: { className?: string; children?: React.ReactNode }) {
  return <a className={`button button--primary ${className}`} href={phoneHref}><Phone size={17} aria-hidden="true" />{hasPhone ? children : 'Kontakt i dojazd'}<ArrowUpRight size={17} aria-hidden="true" /></a>;
}

function GalleryDialog({ index, onClose, onNavigate }: { index: number; onClose: () => void; onNavigate: (step: number) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const photo = inspirations[index];
  useEffect(() => {
    const dialog = ref.current;
    const focus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const oldOverflow = document.body.style.overflow;
    if (dialog && !dialog.open) dialog.showModal();
    document.body.style.overflow = 'hidden';
    const keys = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') { event.preventDefault(); onNavigate(1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); onNavigate(-1); }
    };
    document.addEventListener('keydown', keys);
    return () => {
      document.removeEventListener('keydown', keys);
      document.body.style.overflow = oldOverflow;
      if (dialog?.open) dialog.close();
      focus?.focus({ preventScroll: true });
    };
  }, [onNavigate]);
  return <dialog ref={ref} className="lightbox" aria-label="Galeria świątecznych inspiracji" onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.target === ref.current) onClose(); }}>
    <button type="button" className="lightbox__close" onClick={onClose} aria-label="Zamknij galerię"><X size={23} /></button>
    <button type="button" className="lightbox__prev" onClick={() => onNavigate(-1)} aria-label="Poprzednie zdjęcie"><ArrowLeft size={22} /></button>
    <figure className="lightbox__figure"><img src={`${photo.image}.webp`} alt={photo.alt} /><figcaption>{photo.caption}<span>{index + 1} / {inspirations.length}</span></figcaption></figure>
    <button type="button" className="lightbox__next" onClick={() => onNavigate(1)} aria-label="Następne zdjęcie"><ArrowRight size={22} /></button>
  </dialog>;
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoIndex>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const closeGallery = useCallback(() => setSelectedPhoto(null), []);
  const navigateGallery = useCallback((step: number) => setSelectedPhoto((previous) => previous === null ? 0 : (previous + step + inspirations.length) % inspirations.length), []);
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus(); } };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return <div data-app-root>
    <a className="skip-link" href="#main">Przejdź do treści</a>
    <div className="topbar"><div className="container topbar__inner"><span><MapPin size={13} aria-hidden="true" />Baciuty 85 · podlaskie</span><span className="topbar__note">Codziennie {site.hours.label} · najlepiej zadzwoń przed przyjazdem</span><a href={phoneHref}>{hasPhone ? phoneLabel : 'Umów przyjazd'}<ArrowUpRight size={13} aria-hidden="true" /></a></div></div>
    <header className="header"><div className="container header__inner">
      <Brand />
      <nav className={`nav${menuOpen ? ' nav--open' : ''}`} id="navigation" aria-label="Nawigacja główna">
        {[['oferta','Nasze choinki'],['wybor','Jak wybrać'],['galeria','Inspiracje'],['dojazd','Dojazd'],['faq','Pytania']].map(([id,label]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>)}
        <a className="nav__mobile-contact" href="#kontakt" onClick={() => setMenuOpen(false)}>Kontakt</a>
      </nav>
      <a className="header__call" href={phoneHref}>{hasPhone ? <><Phone size={15} aria-hidden="true" />{phoneLabel}</> : <>Kontakt<ArrowUpRight size={15} aria-hidden="true" /></>}</a>
      <button type="button" className="menu-button" ref={menuButton} aria-expanded={menuOpen} aria-controls="navigation" aria-label={menuOpen ? 'Zamknij menu' : 'Otwórz menu'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
    </div></header>

    <main id="main">
      <section className="hero" id="start" aria-labelledby="hero-heading"><div className="container hero__grid">
        <div className="hero__copy"><p className="eyebrow"><span />Żywe choinki · Baciuty 85</p><div className="hero__hours"><Clock3 size={15} aria-hidden="true" /><span>Zapraszamy codziennie <strong>{site.hours.label}</strong></span></div><h1 id="hero-heading">Choinki w Baciutach.<br /><em>Jodły kaukaskie i świerki.</em></h1><p className="hero__lead">Jodły i świerki, które wybierzesz osobiście. Wpadnij po swoje drzewko, obejrzyj je z bliska i znajdź to jedno, które zabierzesz do domu.</p>
          <div className="hero__actions"><PhoneButton>{phoneLabel}</PhoneButton><a className="button button--outline" href="#oferta">Poznaj nasze choinki<ArrowDown size={17} aria-hidden="true" /></a></div>
          <div className="visit-note"><span className="visit-note__icon"><Phone size={18} aria-hidden="true" /></span><p><strong>Najlepiej zadzwoń przed przyjazdem.</strong><span>Upewnij się, że jesteśmy na miejscu, i zapytaj o drzewka.</span></p></div>
          <div className="hero__small"><span><Leaf size={14} aria-hidden="true" />Żywe drzewka</span><span><TreePine size={14} aria-hidden="true" />Jodły i świerki</span><span><MapPin size={14} aria-hidden="true" />Wybór na miejscu</span></div>
        </div>
        <div className="hero__visual"><span className="hero__number" aria-hidden="true">Piękne choinki</span><figure className="hero__photo"><img src="/images/jodla-premium-960.webp" srcSet="/images/jodla-premium-480.webp 480w, /images/jodla-premium-960.webp 960w, /images/jodla-premium.webp 1600w" sizes="(max-width: 760px) 88vw, 43vw" width="1792" height="2400" alt="Naturalna jodła kaukaska Premium — przykład choinki z asortymentu" fetchPriority="high" decoding="async" /><figcaption>Zdjęcie poglądowe asortymentu</figcaption></figure><div className="hero__seal"><TreePine size={30} strokeWidth={1.3} aria-hidden="true" /><span>Wybierz na żywo.<br /><strong>Poczuj święta.</strong></span></div><span className="hero__vertical" aria-hidden="true">ZIELEŃ, KTÓRA ZOSTAJE W PAMIĘCI</span></div>
      </div></section>

      <section className="intro-strip" aria-label="Zakup choinki w Baciutach"><div className="container intro-strip__inner"><p>Twoje święta.<br /><strong>Twój wybór.</strong></p><div><Sprout size={25} strokeWidth={1.4} aria-hidden="true" /><span>Cięte i w donicach<small>Różne gatunki i wysokości</small></span></div><div><MapPin size={25} strokeWidth={1.4} aria-hidden="true" /><span>Wybierasz osobiście<small>Przyjedź do Baciut 85</small></span></div><div><Clock3 size={24} strokeWidth={1.4} aria-hidden="true" /><span>Codziennie {site.hours.label}<small>Najlepiej zadzwoń przed przyjazdem</small></span></div></div></section>

      <section className="section assortment" id="oferta" aria-labelledby="offer-heading"><div className="container">
        <div className="section-heading"><div><p className="eyebrow"><span />Poznaj nasz asortyment</p><h2 id="offer-heading">Jedna z nich<br /><em>będzie Twoja.</em></h2></div><div className="section-heading__text"><p>Klasyczna jodła, pachnący świerk, a może choinka w donicy? Porównaj gatunki i wybierz charakter drzewka, który najbardziej Ci odpowiada.</p><a className="text-link" href={phoneHref}>Zapytaj o rozmiary i ceny<ArrowUpRight size={16} aria-hidden="true" /></a></div></div>
        <div className="product-grid">{products.map((product,index) => <article className="product" key={product.id}><div className="product__photo"><img src={`${product.image}-480.webp`} srcSet={`${product.image}-480.webp 480w, ${product.image}-960.webp 960w`} sizes="(max-width: 560px) 90vw, (max-width: 900px) 43vw, 28vw" width="720" height="960" alt={`${product.name} — zdjęcie poglądowe choinki`} loading="lazy" decoding="async" /><span className="product__index">0{index+1}</span><span className="product__type">{product.tags[0]}</span></div><div className="product__body"><p className="product__eyebrow">{product.eyebrow}</p><h3>{product.name}</h3><p className="product__description">{product.description}</p><a className="product__link" href={phoneHref}>Zapytaj o dostępność<ArrowUpRight size={17} aria-hidden="true" /></a></div></article>)}</div>
        <p className="assortment__note"><span aria-hidden="true">*</span>Zdjęcia pokazują przykładowy asortyment. Każda naturalna choinka jest inna. Aktualne drzewka, wysokości i ceny potwierdź telefonicznie przed przyjazdem.</p>
      </div></section>

      <section className="choice" id="wybor" aria-labelledby="choice-heading"><div className="container choice__grid"><div className="choice__headline"><p className="eyebrow eyebrow--light"><span />Bez pośpiechu, po swojemu</p><h2 id="choice-heading">Dobra choinka<br />to ta, która<br /><em>cieszy Ciebie.</em></h2><p>Spójrz na pokrój, porównaj gęstość gałęzi i pomyśl, ile miejsca masz w domu. Resztę wybierzesz na miejscu.</p><a className="button button--cream" href="#dojazd">Odwiedź nas w Baciutach<ArrowUpRight size={17} aria-hidden="true" /></a></div><div className="choice__details"><article><span>01</span><div><h3>Premium czy Standard?</h3><p>Premium ma zwykle gęstszy, bardziej regularny pokrój. Standard zachwyca naturalnością — może być mniej symetryczny lub mieć prześwity między gałęziami.</p></div></article><article><span>02</span><div><h3>Cięta czy w donicy?</h3><p>To dwa różne sposoby na świąteczne drzewko. Przed wizytą zapytaj, które gatunki i rozmiary są aktualnie dostępne w wybranej formie.</p></div></article><article><span>03</span><div><h3>Zacznij od miejsca w domu.</h3><p>Zmierz wysokość pomieszczenia i przestrzeń na gałęzie. Zostaw miejsce na stojak, donicę i ozdobę na czubku.</p></div></article></div></div></section>

      <section className="section inspiration" id="galeria" aria-labelledby="gallery-heading"><div className="container"><div className="section-heading"><div><p className="eyebrow"><span />Świąteczne inspiracje</p><h2 id="gallery-heading">Drzewko to początek.<br /><em>Reszta jest Twoja.</em></h2></div><p className="section-heading__text">Lampki, ulubione ozdoby i ta jedna gałąź na najważniejszą bombkę. Zobacz, jak naturalne choinki odnajdują się w domowych wnętrzach.</p></div><div className="inspiration__grid">{inspirations.map((photo,index) => <figure key={photo.image}><button type="button" className="gallery-button" onClick={() => setSelectedPhoto(index)} aria-label={`Powiększ zdjęcie: ${photo.caption}`}><img src={`${photo.image}-480.webp`} srcSet={`${photo.image}-480.webp 480w, ${photo.image}-960.webp 960w`} sizes="(max-width: 560px) 84vw, 30vw" width="720" height="960" alt={photo.alt} loading="lazy" decoding="async" /><span><ZoomIn size={18} aria-hidden="true" /></span></button><figcaption><span>0{index+1}</span>{photo.caption}</figcaption></figure>)}</div></div></section>

      <section className="visit section" id="dojazd" aria-labelledby="visit-heading"><div className="container visit__grid"><div className="visit__copy"><p className="eyebrow"><span />Tu spotkasz swoją choinkę</p><h2 id="visit-heading">Baciuty 85.<br /><em>Wpadnij po święta.</em></h2><p className="visit__lead">Nasz punkt sprzedaży choinek znajduje się w Baciutach, w gminie Turośń Kościelna. Przyjedź, obejrzyj dostępne drzewka i wybierz konkretną choinkę.</p><address className="address-card"><MapPin size={24} strokeWidth={1.5} aria-hidden="true" /><div><strong>{site.address.street}</strong><span>{site.address.postalCode} {site.address.locality}</span><small>gmina Turośń Kościelna · woj. podlaskie</small></div></address><div className="visit__availability"><Clock3 size={21} strokeWidth={1.5} aria-hidden="true" /><div><h3>Zapraszamy codziennie {site.hours.label}.</h3><p>{site.visitNote} Przy okazji zapytaj o dostępne gatunki i wysokości choinek.</p></div></div><div className="visit__actions"><PhoneButton /><a className="text-link" href={mapsUrl} target="_blank" rel="noopener noreferrer">Wyznacz trasę<Navigation size={16} aria-hidden="true" /><span className="sr-only"> (Mapy Google, nowa karta)</span></a></div></div><div className="map-card"><iframe src={mapEmbedUrl} title="Mapa dojazdu — Baciuty 85, 18-106 Baciuty" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /><div className="map-card__caption"><span><MapPin size={15} aria-hidden="true" />Baciuty 85</span><a href={mapsUrl} target="_blank" rel="noopener noreferrer">Otwórz mapę<ArrowUpRight size={15} aria-hidden="true" /><span className="sr-only"> w nowej karcie</span></a></div></div></div></section>

      <section className="section faq" id="faq" aria-labelledby="faq-heading"><div className="container faq__grid"><div className="faq__intro"><p className="eyebrow"><span />Przed przyjazdem</p><h2 id="faq-heading">Dobrze wiedzieć.<br /><em>Łatwiej wybrać.</em></h2><p>Najczęstsze pytania o choinki w Baciutach, dostępność i wizytę w naszym punkcie.</p><a className="text-link" href="#kontakt">Masz inne pytanie?<ArrowUpRight size={16} aria-hidden="true" /></a></div><div className="faq__items">{faq.map((item,index) => <details className="faq__item" key={item.question}><summary><span className="faq__number">0{index+1}</span><h3>{item.question}</h3><Plus size={19} strokeWidth={1.5} aria-hidden="true" /></summary><p>{item.answer}</p></details>)}</div></div></section>

      <section className="contact" id="kontakt" aria-labelledby="contact-heading"><div className="container contact__inner"><span className="contact__star" aria-hidden="true">✳</span><p className="eyebrow"><span />Mała podróż po wielki klimat</p><h2 id="contact-heading">Twoja choinka<br /><em>czeka na swój dom.</em></h2><p>Wpadnij do Baciut 85 — codziennie {site.hours.label}.<br />Najlepiej wcześniej zadzwoń i upewnij się, że jesteśmy na miejscu.</p>{hasPhone ? <a className="contact__phone" href={phoneHref}>{phoneLabel}<ArrowUpRight size={30} strokeWidth={1.3} aria-hidden="true" /></a> : <a className="contact__phone contact__phone--address" href={mapsUrl} target="_blank" rel="noopener noreferrer">Baciuty 85<ArrowUpRight size={27} aria-hidden="true" /><span className="sr-only"> — Mapy Google, nowa karta</span></a>}<span className="contact__note"><Check size={14} aria-hidden="true" />Baciuty 85 · codziennie {site.hours.label}</span></div></section>
    </main>

    <footer className="footer"><div className="container"><div className="footer__top"><Brand light /><p>Żywe choinki w Baciutach.<br />Naturalny początek Twoich świąt.</p><nav aria-label="Nawigacja w stopce"><a href="#oferta">Asortyment</a><a href="#dojazd">Dojazd</a><a href="#kontakt">Kontakt</a></nav><address>{site.address.street}<br />{site.address.postalCode} {site.address.locality}{hasPhone && <a href={phoneHref}>{phoneLabel}</a>}</address></div><div className="footer__bottom"><span>© {site.season} {site.name}</span><span>Codziennie {site.hours.label} · najlepiej zadzwoń przed przyjazdem.</span><a href="#start">Wróć na górę<ArrowUpRight size={14} aria-hidden="true" /></a></div></div></footer>
    <div className="mobile-bar">{hasPhone ? <a className="mobile-bar__phone" href={phoneHref}><Phone size={18} aria-hidden="true" />Zadzwoń przed wizytą</a> : <a className="mobile-bar__phone" href="#kontakt"><MapPin size={18} aria-hidden="true" />Kontakt i adres</a>}<a href={mapsUrl} target="_blank" rel="noopener noreferrer" aria-label="Wyznacz trasę do Baciut 85 w Mapach Google (nowa karta)"><Navigation size={20} aria-hidden="true" /></a></div>
    {selectedPhoto !== null && <GalleryDialog index={selectedPhoto} onClose={closeGallery} onNavigate={navigateGallery} />}
  </div>;
}
