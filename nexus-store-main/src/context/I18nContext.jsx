import { createContext, useState, useCallback, useContext } from "react";
import ar from "../i18n/ar";
import en from "../i18n/en";

const TRANSLATIONS = { ar, en };
const STORAGE_KEY = "nexus_lang";

export const I18nContext = createContext(null);

export const I18nProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem(STORAGE_KEY) || "ar");

  const switchLang = useCallback((l) => {
    setLang(l);
    localStorage.setItem(STORAGE_KEY, l);
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = l;
  }, []);

  const t = useCallback((key, ...args) => {
    const val = TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.ar[key] ?? key;
    return typeof val === "function" ? val(...args) : val;
  }, [lang]);

  // Apply dir/lang on mount
  useState(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  });

  return (
    <I18nContext.Provider value={{ lang, switchLang, t, isRtl: lang === "ar" }}>
      {children}
    </I18nContext.Provider>
  );
};
