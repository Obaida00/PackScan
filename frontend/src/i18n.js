import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en.json';
import arTranslations from './locales/ar.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      ar: {
        translation: arTranslations
      }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

export const changeLanguage = (language) => {
  i18n.changeLanguage(language);
  document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
  document.documentElement.setAttribute('lang', language);
};

export const initializeLanguage = async () => {
  try {
    const settings = await ipcRenderer.invoke("get-settings");
    if (settings && settings.language) {
      console.log("settings language provider language to.. ", settings.language);
      changeLanguage(settings.language);
    }
  } catch (error) {
    console.error('Failed to initialize language:', error);
  }
};

export default i18n;
