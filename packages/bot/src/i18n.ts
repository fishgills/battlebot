import i18next from 'i18next';
import { env } from './env.js';
import * as enCommon from './locales/en/common.json';
export const defaultNS = 'common';

i18next.init({
  lng: 'en',
  debug: env.isDevelopment,
  fallbackLng: 'en',
  resources: {
    en: {
      common: enCommon,
    },
  },
});

export const tl = i18next;

// export default i18next;
