const {
  app,
  BrowserWindow,
  ipcMain,
  Notification,
  nativeTheme,
} = require("electron");
const fs = require("fs");
const path = require("path");
const child_process = require("child_process");
const sound = require("sound-play");
const log = require("electron-log");
const os = require("os");
import Store from "electron-store";
const axiosClient = require("./axios-client.js");

const store = new Store({
  name: "settings",
  defaults: {
    theme: "dark",
    language: "en",
    defaultReceiptPrinter: "",
    defaultStickerPrinter: "",
  },
});

log.transports.file.level = "info";
log.transports.file.file = __dirname + "/log/log";
log.transports.console.format = "[{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}";
log.transports.notificationTransport = (msg) => {
  if (msg.level === "error") {
    sendNotification(
      "Error Occurred ❗",
      "An error occurred in the application.",
      5000
    );
  }
};
log.transports.notificationTransport.level = "error";

const FILE_EXTENSION = "packscan";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

let mainWindow;
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    minWidth: 1000,
    minHeight: 700,
    width: 1000,
    height: 700,
    center: true,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // remove the menu bar
  mainWindow.removeMenu();

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools({ mode: "right" });

  nativeTheme.themeSource = store.store.theme;
};

// Single-instance lock
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (event, commandLine, workingDirectory) => {
    if (mainWindow) {
      const filePath = commandLine[commandLine.length - 1];
      if (filePath && filePath.endsWith(`.${FILE_EXTENSION}`)) {
        onFileEvent(filePath);
      }
    }
  });

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.whenReady().then(() => {
    const success = app.setAsDefaultProtocolClient(FILE_EXTENSION);
    log.info(
      `Registered as default handler for .${FILE_EXTENSION}: ${success}`
    );

    createWindow();

    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });

  if (process.argv.length >= 2) {
    const filePath = process.argv[1];
    if (filePath && filePath.endsWith(`.${FILE_EXTENSION}`)) {
      app.whenReady().then(() => {
        onFileEvent(filePath);
      });
    }
  }

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
}
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// renderer process event listeners for axios callouts
ipcMain.handle("fetch-storages", async (event) => {
  return await axiosClient.fetchStorages();
});
ipcMain.handle("fetch-storage-by-id", async (event, id) => {
  return await axiosClient.fetchStorageById(id);
});
ipcMain.handle("fetch-orders", async (event, filters) => {
  return await axiosClient.fetchInvoices(filters);
});
ipcMain.handle("fetch-order", async (event, id) => {
  return await axiosClient.getInvoiceById(id);
});
ipcMain.handle("fetch-packer", async (event, id) => {
  return await axiosClient.getPackerById(id);
});
ipcMain.handle(
  "submit-order",
  async (event, { id, packerId, numberOfPackages, manually = true }) => {
    await axiosClient.submitInvoice(id, packerId, numberOfPackages, manually);
    let stickerPrinter = store.get("defaultStickerPrinter");
    await printInvoiceSticker(id, stickerPrinter);
  }
);
ipcMain.handle("mark-invoice-pending", async (event, invoiceId) => {
  return await axiosClient.markInvoiceAsPending(invoiceId);
});
ipcMain.handle(
  "mark-invoice-in-progress",
  async (event, { invoiceId, packerId }) => {
    return await axiosClient.markInvoiceAsImportant(invoiceId, packerId);
  }
);
ipcMain.handle("unmark-invoice-important", async (event, invoiceId) => {
  return await axiosClient.unmarkInvoiceAsImportant(invoiceId);
});
ipcMain.handle("go-back", async (event) => {
  if (mainWindow.webContents.navigationHistory.canGoBack()) {
    mainWindow.webContents.navigationHistory.goBack();
  }
});
ipcMain.handle("play-sound", async (event, soundName) => {
  log.info(`playing sound: ${soundName}`);

  const soundFilePath = getSfxFilePath(`${soundName}.mp3`);
  await sound.play(soundFilePath);
});
ipcMain.handle("print-invoice", async (event, invoiceId) => {
  await printInvoiceReceipt(invoiceId);
});
ipcMain.handle("print-invoice-sticker", async (event, invoiceId) => {
  await printInvoiceSticker(invoiceId);
});
ipcMain.handle("notify", (event, title, body) => {
  sendNotification(title, body);
});
ipcMain.handle("get-settings", async (event) => {
  log.info("Getting settings");
  return store.store;
});
ipcMain.handle("save-settings", async (event, settings) => {
  log.info("Saving settings:", settings);
  for (const [key, value] of Object.entries(settings)) {
    store.set(key, value);
    if (key === "theme") nativeTheme.themeSource = value;
  }
  return store.store;
});
ipcMain.handle("get-printers", async (event) => {
  log.info("Getting printers");
  try {
    if (mainWindow) {
      let printers = await mainWindow.webContents.getPrintersAsync();
      log.info("printers found...", printers);
      return printers.map((p) => p.name);
    } else {
      log.error("Couldnt get printers, try again later");
      return [];
    }
  } catch (error) {
    log.error("Error getting printers:", error);
    return [];
  }
});
ipcMain.handle("get-log-content", async (event) => {
  log.info("Getting log content");
  try {
    const logFilePath = log.transports.file.getFile().path;
    log.info("log file: ", logFilePath);
    if (fs.existsSync(logFilePath)) {
      const logContent = fs.readFileSync(logFilePath, "utf8");
      const lines = logContent.split("\n");
      return lines.slice(-1000).join("\n");
    }
    return "No log file found";
  } catch (error) {
    log.error("Error reading log file:", error);
    return "Error reading log file: " + error.message;
  }
});
ipcMain.handle("show-dev-tools", async (event) => {
  log.info("Opening DevTools");
  if (mainWindow) {
    mainWindow.webContents.openDevTools();
  }
});

const onFileEvent = async (filePath) => {
  sendNotification(
    "New File Opened!",
    "New file has just been opened, proceessing in progress..."
  );
  log.info(`New file opened: ${filePath}`);

  if (path.extname(filePath) != `.${FILE_EXTENSION}`) {
    log.error(`File type \"${path.extname(filePath)}\" is not supported !!!`);
    return;
  }

  let { invoice_id: invoiceId } = await axiosClient.uploadNewFile(filePath);
  let printer = store.get("defaultReceiptPrinter");
  await printInvoiceReceipt(invoiceId, printer);
};

function printPdf(pdf, printer) {
  sendNotification("Printing...", "Printing new file...");
  PdfPrintToPrinter(pdf, printer)
    .then((code) => {
      code == 0
        ? sendNotification("Success!!", "File printed successfully ✔️")
        : sendNotification(
            "Something went wrong",
            "File printing cancelled ✖️"
          );
    })
    .catch((e) => {
      sendNotification(
        "Error occured during printing",
        "File printing cancelled 🚫"
      );
      log.error("File printing error occured... ", e);
    });
}

function PdfPrintToPrinter(file_path, printer) {
  log.info(
    "printing " +
      file_path +
      "with printer.. " +
      (printer ?? "(selectable by user)")
  );
  let exePath = getPtpExePath();
  const args = [file_path];

  if (printer) {
    args.push("-printer");
    args.push(printer);
  }

  return new Promise((resolve, reject) => {
    const ptpProcess = child_process.spawn(exePath, args);

    ptpProcess.stdout.on("data", (data) => {
      const output = data.toString();
      log.info("ptp exe stdout:", output);
    });

    ptpProcess.stderr.on("data", (data) => {
      const errorMsg = data.toString();
      log.error("ptp exe stderr:", errorMsg);
    });

    ptpProcess.on("error", (error) => {
      log.error("ptp exe process error:", error);
      reject(error);
    });

    ptpProcess.on("close", (code) => {
      log.info("ptp exe process closed with code", code);
      if (code === 0 || code === 1) {
        resolve(code);
      } else {
        reject(new Error("ptp exe process exited with code " + code));
      }
    });
  });
}

function getPtpExePath() {
  try {
    let PtpExePath;

    if (app.isPackaged) {
      const tempDir = os.tmpdir();

      PtpExePath = path.join(tempDir, "PDFtoPrinterSelect.exe");
      if (!fs.existsSync(PtpExePath)) {
        const asarScriptPath = path.join(
          app.getAppPath(),
          ".webpack\\main\\PDFtoPrinterSelect.exe"
        );
        fs.copyFileSync(asarScriptPath, PtpExePath);
        log.info(`ptp exe extracted to: ${PtpExePath}`);
      }
    } else {
      PtpExePath = path.join(__dirname, "PDFtoPrinterSelect.exe");
    }

    log.info("ptp exe path:", PtpExePath);
    return PtpExePath;
  } catch (error) {
    log.error(error);
  }
}

async function printInvoiceSticker(id, printer) {
  let s = await axiosClient.downloadInvoiceSticker(id, setProgress);
  printPdf(s, printer);
}

async function printInvoiceReceipt(id, printer) {
  let r = await axiosClient.downloadInvoiceReceipt(id, setProgress);
  printPdf(r, printer);
}

function getSfxFilePath(sfxFileName) {
  try {
    let sfxPath;

    if (app.isPackaged) {
      const tempDir = os.tmpdir();
      const soundsDir = path.join(tempDir, "packscan_sounds");

      if (!fs.existsSync(soundsDir)) {
        log.info("creating directory ", soundsDir);
        fs.mkdirSync(soundsDir, { recursive: true });
      }

      sfxPath = path.join(tempDir, "sounds", sfxFileName);
      if (!fs.existsSync(sfxPath)) {
        log.info(`trying to copy the file out of asar for file: ${sfxPath}`);
        const asarScriptPath = path.join(
          app.getAppPath(),
          `.webpack\\main\\sounds\\${sfxFileName}`
        );
        fs.copyFileSync(asarScriptPath, sfxPath);
        log.info(`ptp exe extracted to: ${sfxPath}`);
      }
    } else {
      sfxPath = path.join(__dirname, "sounds", sfxFileName);
    }

    log.info("sound file path:", sfxPath);
    return sfxPath;
  } catch (error) {
    log.error(error);
  }
}

function setProgress(progress) {
  log.info("Taskbar progress: ", progress);
  if (mainWindow) mainWindow.setProgressBar(progress);
  startFlashing();
  if (progress === 1) stopFlashing();
}

function sendNotification(title, body, timeout = null) {
  log.info(`sending notification - title: ${title} - body: ${body}`);
  startFlashing();
  try {
    if (Notification.isSupported()) {
      const notification = new Notification({
        title: title,
        body: body,
      });
      notification.show();

      setTimeout(() => {
        notification.close();
        stopFlashing();
      }, timeout || 3000);

      notification.on("click", () => {
        mainWindow.focus();
      });
    } else {
      console.warn("Notifications are not supported on this platform.");
    }
  } catch (err) {
    log.error("Failed to display notification:", err);
  }
}

function startFlashing() {
  log.info("Taskbar flashing ON");
  if (mainWindow) mainWindow.flashFrame(true);
}

function stopFlashing() {
  log.info("Taskbar flashing OFF");
  if (mainWindow) mainWindow.flashFrame(false);
}
