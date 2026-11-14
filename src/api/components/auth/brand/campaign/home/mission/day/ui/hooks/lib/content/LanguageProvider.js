import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import en from "./en";
import ar from "./ar";
import ur from "./ur";
import es from "./es";
import campaignEn from "./campaign/en";
import campaignAr from "./campaign/ar";
import campaignUr from "./campaign/ur";
import campaignEs from "./campaign/es";

export const LANGS = [
  { code: "en", native: "English", label: "English", dir: "ltr" },
  { code: "ar", native: "العربية", label: "Arabic", dir: "rtl" },
  { code: "ur", native: "اردو", label: "Urdu", dir: "rtl" },
  { code: "es", native: "Español", label: "Spanish", dir: "ltr" },
];

const DICTS = {
  en: { ...en, ...campaignEn },
  ar: { ...ar, ...campaignAr },
  ur: { ...ur, ...campaignUr },
  es: { ...es, ...campaignEs },
};
const STORAGE_KEY = "luna.lang";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState("en");
  const [chosen, setChosen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let saved = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch {
      saved = null;
    }
    if (saved && LANGS.some((l) => l.code === saved)) {
      setLangState(saved);
      setChosen(true);
    }
    setReady(true);
  }, []);

  const dir = lang === "ar" || lang === "ur" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const setLang = useCallback((code) => {
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      /* storage unavailable */
    }
    setLangState(code);
    setChosen(true);
  }, []);

  const t = useCallback(
    (key, vars) => {
      const dict = DICTS[lang] || en;
      let str = dict[key];
      if (str === undefined) str = en[key];
      if (str === undefined) return key;
      if (vars) {
        Object.keys(vars).forEach((k) => {
          str = str.split(`{${k}}`).join(String(vars[k]));
        });
      }
      return str;
    },
    [lang]
  );

  const value = useMemo(
    () => ({ lang, dir, setLang, t, ready, hasChosen: chosen }),
    [lang, dir, setLang, t, ready, chosen]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}

export function useT() {
  return useLang().t;
}
