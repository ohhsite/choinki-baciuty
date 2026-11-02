import { site, phoneLabel } from './site.config';

export const products = [
  { id:'jodla-premium', name:'Jodła Premium', eyebrow:'Gęsta i regularna', description:'Pełniejszy pokrój i pięknie uformowany czubek. Dla tych, którzy lubią wyjątkowo równe drzewka.', image:'/images/jodla-premium', tags:['Jodła kaukaska','Premium'] },
  { id:'jodla-standard', name:'Jodła Standard', eyebrow:'Piękno natury', description:'Naturalny pokrój i indywidualny charakter. Każde drzewko wygląda trochę inaczej.', image:'/images/jodla-standard', tags:['Jodła kaukaska','Standard'] },
  { id:'jodla-donica', name:'Jodła w donicy', eyebrow:'Zielony akcent', description:'Jodły w donicach dla osób szukających takiej formy choinki. O dostępne rozmiary zapytaj przed wizytą.', image:'/images/jodla-donica', tags:['Jodła','W donicy'] },
  { id:'jodla-frasera', name:'Jodła Frasera', eyebrow:'Własny charakter', description:'Kolejna propozycja dla miłośników jodeł. Porównaj dostępne drzewka i wybierz swój pokrój.', image:'/images/jodla-frasera', tags:['Jodła Frasera','Zapytaj o wybór'] },
  { id:'swierk-ciety', name:'Świerk cięty', eyebrow:'Świąteczna klasyka', description:'Tradycyjny wybór do świątecznych dekoracji. Dostępne wysokości i ceny potwierdzisz telefonicznie.', image:'/images/swierk-ciety', tags:['Świerk','Cięty'] },
  { id:'swierk-donica', name:'Świerk w donicy', eyebrow:'Naturalnie u Ciebie', description:'Świerki w donicach w różnych rozmiarach. Wybierz swój egzemplarz na miejscu w Baciutach.', image:'/images/swierk-donica', tags:['Świerk','W donicy'] },
] as const;

export const inspirations = [
  { image:'/images/galeria-dom-01', alt:'Udekorowana naturalna choinka we wnętrzu', caption:'Święta w domowym wydaniu' },
  { image:'/images/galeria-dom-02', alt:'Żywa choinka udekorowana na Boże Narodzenie', caption:'Twoje ozdoby, Twój klimat' },
  { image:'/images/galeria-dom-03', alt:'Naturalna choinka ze świątecznymi dekoracjami w domu', caption:'Zaczyna się od drzewka' },
] as const;

export const faq = [
  { question:'Gdzie kupić żywą choinkę w Baciutach?', answer:'Zapraszamy pod adres Baciuty 85, 18-106 Baciuty, w gminie Turośń Kościelna. Przed przyjazdem zadzwoń i potwierdź, że jesteśmy na miejscu.' },
  { question:'W jakich godzinach można przyjechać po choinkę?', answer:`Po choinkę możesz przyjechać codziennie w godzinach ${site.hours.label}. Najlepiej wcześniej zadzwoń pod numer ${phoneLabel} i upewnij się, że jesteśmy na miejscu.` },
  { question:'Jakie choinki są w ofercie?', answer:'Oferujemy jodły kaukaskie Premium i Standard, jodły Frasera oraz świerki. Są choinki cięte i w donicach. Dostępność konkretnego gatunku i wysokości potwierdź przed przyjazdem.' },
  { question:'Czy mogę wybrać konkretną choinkę na miejscu?', answer:'Tak. Po telefonicznym ustaleniu wizyty możesz przyjechać do Baciut 85, obejrzeć dostępne drzewka i wybrać konkretny egzemplarz.' },
  { question:'Ile kosztują choinki w sezonie 2026?', answer:'Cena zależy od gatunku, klasy i wysokości drzewka. Aktualne ceny oraz dostępne rozmiary podamy telefonicznie lub na miejscu. Skontaktuj się z nami przed wizytą.' },
  { question:'Czym różni się jodła Premium od Standard?', answer:'Premium to wybór dla osób szukających gęstszej i bardziej regularnej choinki. Standard ma bardziej naturalny pokrój — może mieć prześwity między gałęziami lub być mniej symetryczny. Najlepiej porównać konkretne drzewka na miejscu.' },
  { question:'Czy są dostępne choinki w donicach?', answer:'Tak, w ofercie są także choinki w donicach. Przed przyjazdem zapytaj o aktualnie dostępne gatunki, wysokości i konkretne drzewka.' },
  { question:'Czy oferujecie dowóz choinek z Baciut?', answer:'Możliwość, termin i koszt ewentualnego dowozu ustal z nami telefonicznie przed zakupem. Na tej stronie nie przyjmujemy zamówień na dostawę ani płatności online.' },
] as const;
