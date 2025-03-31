import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import BackButton from "../../shared/components/BackButton.jsx";
import { useTheme } from "../../shared/contexts/ThemeContext.jsx";
import { usePrinterSelection } from "../../shared/hooks/usePrinterSelection.jsx";
import {Dropdown, Switch, Select, ConfigProvider} from "antd"
import { blue, red } from "@mui/material/colors";
function Settings() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme, isLightMode } = useTheme();
  const [language, setLanguage] = useState("");
  const [logContent, setLogContent] = useState("");
  const [isRtl, setIsRtl] = useState(false);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  const {
    printers,
    defaultPrinter,
    loading: loadingPrinters,
    error: printerError,
    updateDefaultPrinter,
  } = usePrinterSelection();

  useEffect(() => {
    setIsRtl(language === "ar");
    document.documentElement.setAttribute("dir", language === "ar" ? "rtl" : "ltr");
  }, [language]);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const settings = await ipcRenderer.invoke("get-settings");
        if (settings?.language) {
          setLanguage(settings.language);
          i18n.changeLanguage(settings.language);
        }
      } catch (error) {
        console.error("Failed to load language setting:", error);
      }
    };

    loadLanguage();
    handleRefreshLogs();
  }, [i18n]);

  const handleThemeChange = () => toggleTheme();

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
    ipcRenderer.invoke("save-settings", { language: newLanguage });
  };

  const handlePrinterChange = async (printer) => {
    await updateDefaultPrinter(printer);
  };

  const handleShowDevTools = () => ipcRenderer.invoke("show-dev-tools");

  const handleRefreshLogs = async () => {
    try {
      setIsLoadingLogs(true);
      const logs = await ipcRenderer.invoke("get-log-content");
      setLogContent(logs || "");
      setIsLoadingLogs(false);
    } catch (error) {
    console.error("Failed to refresh logs:", error);
      setIsLoadingLogs(false);
    }
  };

  const languages = [
    
    { value: '', label: 'select...', disabled: true},
    { value: 'en', label: 'English' },
    { value: 'ar', label: 'العربية' },
  ];

  const selectionPrinters = [
    {value: 'oneNote', label:'OneNote (Desktop)'},
    {value: 'msPrint', label:'Microsoft Print to PDF'}
  ];

  return (
    <div className={`container mx-auto p-4 ${isRtl ? "rtl" : "ltr"}`}>
      <div className="flex items-center mb-6">
        <BackButton />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white ml-4">{t("settings.title")}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-md">
          <h2 className="text-lg mb-4 dark:text-white font-semibold">{t("settings.appearance")}</h2>
            <div className="flex justify-between">
              <p className="dark:text-white">{t("settings.lightTheme")}</p>
              <Switch onChange={toggleTheme}></Switch>
            </div>

          <div className="mt-4 flex justify-between items-end">
            <label className="block mb-2">{t("settings.language")}</label>
            {/* <select value={language} onChange={handleLanguageChange} className="w-24 p-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded">
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select> */
            }
            <Select
            size="large"
                  defaultValue={language}
                  style={{ width: 120}}
                  onChange={handleLanguageChange}
                  options={languages}
                  className="text-xl"
            />
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">{t("settings.printing")}</h2>
          {loadingPrinters ? (
            <p>Loading printers...</p>
          ) : printerError ? (
            <p className="text-red-500">{printerError}</p>
          ) : (
            <>
              <label className="block mb-2">{t("settings.defaultPrinter")}</label>
              {/* <select value={defaultPrinter} onChange={handlePrinterChange} className="w-full p-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded">
                <option value="" disabled>{t("settings.selectPrinter")}</option>
                {printers.map((printer, i) => (
                  <option key={i} value={printer}>{printer}</option>
                ))}
              </select> */}
              <div className="mt-4">
                <Select
                    size="large"
                    defaultValue={defaultPrinter}
                    onChange={handlePrinterChange}
                    options={selectionPrinters}
                    className="text-xl"
              />
              </div>
            </>
          )}
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-md md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">{t("settings.developer")}</h2>
          <button onClick={handleShowDevTools} className="bg-blue-500 px-4 py-2 rounded text-white mb-4">{t("settings.showDevTools")}</button>
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <h3>{t("settings.applicationLogs")}</h3>
              <button onClick={handleRefreshLogs} disabled={isLoadingLogs} className="px-3 py-1 border border-gray-500 dark:text-gray-200 rounded">
                {isLoadingLogs ? "Loading..." : t("settings.refresh")}
              </button>
            </div>
            <textarea readOnly value={logContent} rows={10} className="w-full p-2 bg-gray-200 dark:bg-gray-700 dark:text-gray-200 rounded font-mono text-sm"></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
