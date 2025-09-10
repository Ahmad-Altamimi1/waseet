import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";
import en from "./locales/en.json";
import ar from "./locales/ar.json";

// Get device language using Expo Localization
const deviceLanguage = getLocales()[0]?.languageCode || "en";

const resources = {
  en: {
    translation: en,
  },
  ar: {
    translation: ar,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: deviceLanguage === "ar" ? "ar" : "en", // Default to English if not Arabic
  fallbackLng: "en",
  compatibilityJSON: "v4",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
