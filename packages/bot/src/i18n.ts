import i18next from 'i18next';
import enNs1 from './locales/en/ns1.json';

export const defaultNS = 'ns1';

i18next.init({
  debug: true,
  fallbackLng: 'en',
  defaultNS,
  resources: {
    en: {
      ns1: enNs1,
    },
  },
});

export const tl = i18next;

// export default i18next;
