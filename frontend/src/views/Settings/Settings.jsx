import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  FormControl,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  Button,
  TextField,
  Box,
  Typography,
  Paper,
  Divider,
  CircularProgress,
} from "@mui/material";
import BackButton from "../../shared/components/BackButton.jsx";
import { useTheme } from "../../shared/contexts/ThemeContext.jsx";
import { usePrinterSelection } from "../../shared/hooks/usePrinterSelection.jsx";

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
    document.documentElement.setAttribute(
      "dir",
      language === "ar" ? "rtl" : "ltr"
    );
  }, [language]);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const settings = await ipcRenderer.invoke("get-settings");
        if (settings && settings.language) {
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

  const handleThemeChange = () => {
    toggleTheme();
  };

  const handleLanguageChange = async (event) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
    ipcRenderer.invoke("save-settings", { language: newLanguage });
  };

  const handlePrinterChange = async (event) => {
    const newPrinter = event.target.value;
    await updateDefaultPrinter(newPrinter);
  };

  const handleShowDevTools = () => {
    ipcRenderer.invoke("show-dev-tools");
  };

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

  return (
    <div className="container mx-auto p-4" dir={isRtl ? "rtl" : "ltr"}>
      <div className="flex items-center mb-6">
        <BackButton />
        <h1 className="text-2xl font-bold text-white ml-4">
          {t("settings.title")}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Paper className="p-4 bg-gray-800 text-white rounded-lg shadow-md">
          <Typography variant="h6" className="mb-4">
            {t("settings.appearance")}
          </Typography>
          <Divider className="mb-4 bg-gray-600" />

          <FormControlLabel
            control={
              <Switch
                checked={isLightMode}
                onChange={handleThemeChange}
                className="ml-2"
              />
            }
            label={t("settings.lightTheme")}
            className="mb-4 block"
          />

          <Box className="mb-4">
            <Typography className="mb-2">{t("settings.language")}</Typography>
            <FormControl
              fullWidth
              variant="outlined"
              className="bg-gray-700 rounded"
            >
              <Select
                value={language}
                onChange={handleLanguageChange}
                className="text-white"
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="ar">العربية</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>

        <Paper className="p-4 bg-gray-800 text-white rounded-lg shadow-md">
          <Typography variant="h6" className="mb-4">
            {t("settings.printing")}
          </Typography>
          <Divider className="mb-4 bg-gray-600" />

          <Box className="mb-4">
            <Typography className="mb-2">
              {t("settings.defaultPrinter")}
            </Typography>
            {loadingPrinters ? (
              <div className="flex justify-center my-4">
                <CircularProgress size={24} />
              </div>
            ) : printerError ? (
              <Typography color="error">{printerError}</Typography>
            ) : (
              <FormControl
                fullWidth
                variant="outlined"
                className="bg-gray-700 rounded"
              >
                <Select
                  value={defaultPrinter}
                  onChange={handlePrinterChange}
                  className="text-white"
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    {t("settings.selectPrinter")}
                  </MenuItem>
                  {printers.map((printer, i) => (
                    <MenuItem key={i} value={printer}>
                      {printer}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
        </Paper>

        <Paper className="p-4 bg-gray-800 text-white rounded-lg shadow-md md:col-span-2">
          <Typography variant="h6" className="mb-4">
            {t("settings.developer")}
          </Typography>
          <Divider className="mb-4 bg-gray-600" />

          <Button
            variant="contained"
            color="primary"
            onClick={handleShowDevTools}
            className="mb-4"
          >
            {t("settings.showDevTools")}
          </Button>

          <Box className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <Typography>{t("settings.applicationLogs")}</Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={handleRefreshLogs}
                disabled={isLoadingLogs}
                startIcon={
                  isLoadingLogs ? <CircularProgress size={16} /> : null
                }
              >
                {t("settings.refresh")}
              </Button>
            </div>
            <TextField
              multiline
              rows={10}
              fullWidth
              variant="outlined"
              value={logContent}
              slotProps={{
                input: {
                  readOnly: true,
                  className: "bg-gray-700 text-white font-mono text-sm",
                },
              }}
            />
          </Box>
        </Paper>
      </div>
    </div>
  );
}

export default Settings;
