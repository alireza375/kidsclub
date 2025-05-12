import { useState, useEffect } from "react";
import { fetchPublicLanguages } from "../helpers/backend";

const useLanguages = () => {
  const [languages, setLanguages] = useState(null);

  useEffect(() => {
    const fetchLanguages = async () => {
      const response = await fetchPublicLanguages();
      setLanguages(response);
    };
    fetchLanguages();
  }, []);

  return languages;
};

export default useLanguages;
