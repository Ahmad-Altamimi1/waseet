import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { I18nManager } from "react-native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "../i18n";

type Language = "en" | "ar";

interface LanguageContextType {
  currentLanguage: Language;
  isRTL: boolean;
  changeLanguage: (language: Language) => Promise<void>;
  t: (key: string, options?: any) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const LANGUAGE_STORAGE_KEY = "@aura_language";

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en");
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ar")) {
        await changeLanguage(savedLanguage as Language);
      }
    } catch (error) {
      console.log("Error loading saved language:", error);
    }
  };

  const changeLanguage = async (language: Language) => {
    try {
      // Save language preference
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);

      // Update i18n language
      await i18n.changeLanguage(language);

      // Update RTL settings
      const isArabic = language === "ar";
      setIsRTL(isArabic);
      setCurrentLanguage(language);

      // Update React Native RTL settings
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(isArabic);

      // Force re-render by updating state
      setCurrentLanguage(language);
    } catch (error) {
      console.log("Error changing language:", error);
    }
  };

  const value: LanguageContextType = {
    currentLanguage,
    isRTL,
    changeLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
