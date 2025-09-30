import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en.json';
import translationES from './locales/es.json';
import translationDE from './locales/de.json';
import translationFR from './locales/fr.json';
import translationIT from './locales/it.json';
import translationPT from './locales/pt.json';

const resources = {
  en: {
    translation: translationEN
  },
  es: {
    translation: translationES
  },
  de: {
    translation: translationDE
  },
  fr: {
    translation: translationFR
  },
  it: {
    translation: translationIT
  },
  pt: {
    translation: translationPT
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;