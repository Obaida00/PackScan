import React, { createContext, useState, useEffect } from "react";

const LoadingContext = createContext();

export function LoadingProvider({ children }) {
  const [progressLoading, setProgressLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressListener = (event, prog) => setProgress(prog);
    ipcRenderer.on("loading-progress", progressListener);
    return () => {
      ipcRenderer.removeListener("loading-progress", progressListener);
    };
  }, []);

  return (
    <LoadingContext.Provider
      value={{ progressLoading, setProgressLoading, progress, setProgress }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoadingContext() {
  const context = React.useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoadingContext must be used within a LoadingProvider");
  }
  return context;
}
