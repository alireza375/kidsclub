import { useState, useEffect } from "react";
import { fetchTranslations } from "../helpers/backend";

const useTranslations = (lang) => {
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    if (lang) {
      const fetchData = async () => {
        const { error, data } = await fetchTranslations({ id: lang });
        if (!error) {
          setTranslations(data?.translations || {});
        } else {
          console.error('Error fetching translations:', error);
        }
      };
      fetchData();
    }
  }, [lang]);

  return translations;
};

export default useTranslations;
