/** Jedyne miejsce konfiguracji danych kontaktowych i domeny. */
export const site = {
  name: 'Choinki Baciuty',
  season: 2026,
  // Wpisz właściwą domenę, np. https://twoja-domena.pl (bez ścieżki).
  url: '',
  // Numer telefonu punktu w Baciutach.
  phone: '+48500610026',
  // Opcjonalny adres e-mail. Pusty nie wyświetla się na stronie.
  email: '',
  address: {
    street: 'Baciuty 85',
    locality: 'Baciuty',
    postalCode: '18-106',
    region: 'podlaskie',
    country: 'PL',
  },
  hours: { opens: '10:00', closes: '20:00', label: '10:00–20:00' },
  visitNote: 'Najlepiej zadzwoń przed przyjazdem i upewnij się, że jesteśmy na miejscu.',
  mapQuery: 'Baciuty 85, 18-106 Baciuty, Polska',
  heroImage: '/images/jodla-premium-960.webp',
} as const;

export const phoneDigits = site.phone.replace(/\D/g, '');
export const hasPhone = /^48\d{9}$/.test(phoneDigits);
export const phoneHref = hasPhone ? `tel:+${phoneDigits}` : '#kontakt';
export const phoneLabel = hasPhone ? phoneDigits.slice(2).replace(/(\d{3})(?=\d)/g, '$1 ') : '';
export const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(site.mapQuery)}`;
export const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&hl=pl&z=16&output=embed`;
