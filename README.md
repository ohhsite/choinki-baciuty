# Choinki Baciuty — onepage React

Kompletna, niezależna strona dla punktu sprzedaży żywych choinek: **Baciuty 85, 18-106 Baciuty**.
React + TypeScript + Vite. Fonty i zdjęcia są lokalne. Nie wymaga bazy danych, kont klientów ani panelu administracyjnego.

## WAŻNE — przed publikacją

W pliku **`src/site.config.ts`** wpisz:

- `url`: właściwą domenę, np. `https://twoja-domena.pl` (HTTPS, bez ścieżki).
- `phone`: numer punktu jest już ustawiony na **+48 500 610 026**.
- `hours`: przyjazd **codziennie 9:00–20:00**, najlepiej po wcześniejszym telefonie.
- `email`: opcjonalny e-mail; pusty nie jest wyświetlany.

Numer i godziny są uzupełnione według informacji właścicielki. Przed publikacją pozostaje wpisać właściwą domenę.

Dopóki brakuje poprawnej domeny lub telefonu, projekt generuje wersję roboczą z `noindex` i blokadą indeksowania w robots.txt. Przyciski telefonu działają i prowadzą do numeru 500 610 026. Nie publikuj takiej wersji jako docelowej strony sprzedażowej. `build:production` przerwie publikację z czytelnym błędem, jeżeli brakuje tych danych.

## Uruchomienie

Wymagany Node.js 22.13+ i npm.

Wypakuj ZIP. Plik **package.json jest bezpośrednio w katalogu głównym paczki**. Otwórz terminal w tym katalogu (tam, gdzie widać package.json), a następnie uruchom:

```sh
npm install
npm run dev
```

Otwórz adres wypisany przez Vite. Teksty i zdjęcia zobaczysz od razu; brak domeny nie blokuje podglądu.

## Gotowa strona do hostingu

Po uzupełnieniu danych:

```sh
npm run build:production
npm run preview
```

Na hosting statyczny wgraj **całą zawartość `dist/`**. Projekt działa w katalogu głównym osobnej domeny. Nie kopiuj samego App.tsx do starszego projektu.

Nie potrzeba serwera Node na hostingu: podczas budowania React tworzy kompletny statyczny HTML. Po otwarciu w przeglądarce React przejmuje menu i galerię.

## Co jest w projekcie

- `src/App.tsx` — nawigacja, hero, oferta, porównanie, inspiracje, dojazd, FAQ, kontakt i stopka.
- `src/styles.css` — wszystkie style, w tym widoki mobilne i ograniczenie animacji.
- `src/site.config.ts` — domena, telefon, adres oraz ustawienia kontaktu.
- `src/data.ts` — sześć kategorii choinek, treści FAQ i zdjęcia inspiracji.
- `src/seo.ts` — tytuł, opis, canonical i dane WebSite / WebPage / Store.
- `src/main.tsx` — start aplikacji i hydratacja gotowego HTML.
- `src/entry-server.tsx` — generowanie treści React w trakcie budowania.
- `scripts/prerender.mjs` — HTML, robots.txt i sitemap.xml.
- `scripts/build-production.mjs` — budowa z wymaganą domeną oraz telefonem.
- `tests/seo.test.mjs` — sprawdzenie gotowego HTML i plików SEO.
- `public/images` — lokalne zdjęcia WebP z wariantami 480, 960 i do 1600 px.
- `public/fonts` — lokalne fonty; licencje w `public/fonts/LICENSES.txt`.
- `public/favicon.svg` — ikona strony.

## Treść i zdjęcia

Adres, telefon 500 610 026, godziny codziennie 9:00–20:00 i zalecenie telefonu przed przyjazdem pochodzą z briefu właścicielki. Kod pocztowy 18-106 zweryfikowano w oficjalnym spisie PNA Poczty Polskiej.

Asortyment bazuje na podobnej ofercie przekazanej dla strony choinki.bialystok.pl: jodły Premium / Standard / Frasera, choinki w donicach i świerki. Dostępność i ceny wymagają telefonicznego potwierdzenia; strona nie udaje aktualnych stanów magazynowych.

Fotografie pobrano z istniejącej strony właścicielki `https://choinki.bialystok.pl`. Są opisane jako zdjęcia poglądowe asortymentu lub inspiracje. Nie przedstawiamy ich jako zdjęć punktu w Baciutach. Jeżeli masz własne zdjęcia Baciut, podmień pliki w `public/images`, zachowując nazwy i pionowe proporcje. Zachowaj prawa do używanych fotografii.

Nie dopisano: cen, opinii klientów nowego punktu, ocen Google, deklaracji 24/7, niepotwierdzonych współrzędnych ani niepotwierdzonych dat rozpoczęcia i zakończenia sezonu. Mapa prowadzi do adresu Baciuty 85; warto sprawdzić docelową pinezkę w Mapach Google przed uruchomieniem reklamy.

## SEO

W produkcyjnej wersji po konfiguracji:

- pełna treść jest w źródle HTML przed wykonaniem JavaScript;
- jeden H1 i logiczna hierarchia nagłówków;
- polski język dokumentu, opis lokalizacji, FAQ i semantyczny adres;
- canonical na faktyczną domenę, OG/Twitter i dane Store z telefonem oraz godzinami 09:00–20:00;
- sitemap.xml i robots.txt generowane z rzeczywistej domeny;
- lokalne fonty, responsywne zdjęcia, opóźnione wczytywanie zdjęć poniżej hero i mapy;
- obrazy pokazują pełne kadry (`object-fit: contain`);
- brak fikcyjnych cen/ocen i nieaktualnych dat;
- brak obietnicy wyników rozszerzonych FAQ. Zwykła, widoczna treść pytań zostaje w HTML.

Nie ma specjalnego schematu gwarantującego obecność w odpowiedziach AI. Nie można zagwarantować pozycji w Google. Po publikacji warto zweryfikować domenę w Google Search Console, przesłać sitemap.xml i uzupełnić Profil Firmy zgodnie z faktycznymi danymi punktu.

Przy zmianie numeru, domeny lub treści wykonaj ponownie `npm run build:production`.

## Testy

Po zbudowaniu:

```sh
npm test
```

Sprawdź też w przeglądarce: menu na telefonie, powiększanie galerii, klawisze Escape / strzałki, FAQ, połączenie telefoniczne i docelowy adres mapy.
