import React, { useEffect, useRef, useState } from "react";
import { FaCog, FaGlobe, FaDollarSign } from "react-icons/fa";
import { useI18n } from "../../providers/i18n";

const FloatingSettingsPanel = ({
  languages,
  currencies,
  currentLanguage,
  currentCurrency,
  onLanguageSelect,
  onCurrencySelect,
}) => {
  const i18n = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("language"); // Default to Language Tab

  const panelRef = useRef(null); // Reference for the panel

  const togglePanel = () => setIsOpen((prev) => !prev);

  // Collapse the panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* Floating Button with Infinite Rotation */}
      <button
        className="bg-primary text-white rounded-full p-4 shadow-lg hover:bg-secondary transition-all duration-300 flex items-center justify-center animate-spin-slow"
        onClick={togglePanel}
        aria-label="Open Settings"
      >
        <FaCog className="text-2xl" />
      </button>

      {/* Expandable Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          className="absolute bottom-16 right-0 bg-white shadow-lg rounded-lg p-4 w-64 transition-all duration-300"
        >
          {/* Tabs */}
          <div className="flex justify-around border-b-2 border-gray-200 mb-4">
            <button
              className={`pb-2 ${
                activeTab === "language"
                  ? "border-primary text-primary font-semibold"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("language")}
            >
              <FaGlobe className="inline-block mr-2" />
              {i18n?.t("Language")}
            </button>
            <button
              className={`pb-2 ${
                activeTab === "currency"
                  ? "border-primary text-primary font-semibold"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("currency")}
            >
              <FaDollarSign className="inline-block mr-2" />
              {i18n?.t("Currency")}
            </button>
          </div>

          {/* Language Selector */}
          {activeTab === "language" && (
            <div>
              <p className="text-gray-600 text-sm font-semibold mb-3">
                {i18n?.t("Select Language")}
              </p>
              <ul>
                {languages?.docs?.map((lang) => (
                  <li
                    key={lang?.code}
                    className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                      lang?.id === currentLanguage ? "bg-gray-100 font-semibold" : ""
                    }`}
                    onClick={() => {
                      onLanguageSelect(lang?.id);
                      setIsOpen(false); // Close the panel after selection
                    }}
                  >
                    <img
                      src={`https://flagcdn.com/${lang?.flag}.svg`}
                      alt={lang?.name}
                      className="w-5 h-5 rounded-full"
                    />
                    {lang?.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Currency Selector */}
          {activeTab === "currency" && (
            <div>
              <p className="text-gray-600 text-sm font-semibold mb-3">
                {i18n?.t("Select Currency")}
              </p>
              <ul>
                {currencies?.map((currency) => (
                  <li
                    key={currency?.id}
                    className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                      currency?.code === currentCurrency ? "bg-gray-100 font-semibold" : ""
                    }`}
                    onClick={() => {
                      onCurrencySelect(currency?.code);
                      setIsOpen(false); // Close the panel after selection
                    }}
                  >
                    <span className="text-lg">{currency?.symbol}</span>
                    {currency?.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FloatingSettingsPanel;
