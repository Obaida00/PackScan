import { useCallback } from "react";

export function useSFX() {
  const playItemScanSound = useCallback(() => {
    return ipcRenderer.invoke("play-sound", "scannerBeep");
  }, []);

  const playPackingCompleteSound = useCallback(() => {
    return ipcRenderer.invoke("play-sound", "complete");
  }, []);

  const playItemOverScanSound = useCallback(() => {
    return ipcRenderer.invoke("play-sound", "error");
  }, []);

  const playCanSubmitSound = useCallback(() => {
    return ipcRenderer.invoke("play-sound", "complete2");
  }, []);

  return {
    playItemScanSound,
    playPackingCompleteSound,
    playItemOverScanSound,
    playCanSubmitSound,
  };
}
