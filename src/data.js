export const WHATSAPP = '351924781513';
export const waLink = text => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;

export const SOCIAL = {
  github: 'https://github.com/edsette',
  linkedin: 'https://www.linkedin.com/in/sette-edu/',
};

export const img = file => `${import.meta.env.BASE_URL}img/${file}`;

// Textos de cada projeto ficam no i18n em work.items.<id>.
export const PROJECTS = [
  { id: 'gabbe', url: 'https://edsette.github.io/gabbe_st/', image: 'gabbe.jpg', featured: true },
  { id: 'afiacorte', url: 'https://edsette.github.io/afiacorte/', image: 'afiacorte.jpg', featured: false },
];

// gumroadUrl: preencher quando o template estiver à venda (botão vira "Comprar").
export const TEMPLATES = [
  { id: 'atelier', preview: 'portfolio', price: null, gumroadUrl: null },
  { id: 'brasa', preview: 'restaurant', price: null, gumroadUrl: null },
  { id: 'oficio', preview: 'local', price: null, gumroadUrl: null },
];
