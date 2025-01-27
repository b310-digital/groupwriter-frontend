import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationDE from './locales/de/translations.json';
import translationEN from './locales/en/translations.json';
import { initReactI18next } from 'react-i18next';

void i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: { de: translationDE, en: translationEN },
    fallbackLng: 'en',
    debug: false
  });

export default i18n;
