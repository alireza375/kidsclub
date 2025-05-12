import { useState, useEffect } from "react";

const useLanguageSettings = (languages) => {
  const [lang, setLang] = useState(null);
  const [defaultLang, setDefaultLang] = useState(null);
  const [langCode, setLangCode] = useState(null);
  const [isRtl, setIsRtl] = useState("ltr");

  useEffect(() => {
    const storedLang = localStorage.getItem("lang");
    if (storedLang) {
      setLang(storedLang);
    } else if (languages && languages?.docs?.length > 0) {
      const defaultLang = languages?.docs?.find((lang) => lang.default);
      if (defaultLang) {
        setDefaultLang(defaultLang);
        setLang(defaultLang.id);
        setIsRtl(defaultLang.rtl ? "rtl" : "ltr");
        localStorage.setItem("lang", defaultLang.id);
      }
    }
  }, [languages]);

  useEffect(() => {
    if (lang) {
      const selectedLang = languages?.docs?.find((l) => l.id === lang);
      setLangCode(selectedLang?.code || null);
      setIsRtl(selectedLang?.rtl ? "rtl" : "ltr");
    }
  }, [lang, languages]);

  const changeLanguage = (value) => {
    setLang(value);
    localStorage.setItem("lang", value);
  };

  return { lang, defaultLang, langCode, isRtl, changeLanguage };
};

export default useLanguageSettings;
