const { app, BrowserWindow, ipcMain } = require("electron");
const chokidar = require("chokidar");
const fs = require("fs");
import * as axiosClient from "./axios-client.js";
const path = require("path");
const child_process = require("child_process");
const util = require("util");
const sound = require("sound-play");
const log = require("electron-log");
const os = require("os");

log.transports.file.level = "info";
log.transports.file.file = __dirname + "/log/log";

const execFile = util.promisify(child_process.execFile);

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
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// renderer process event listeners for axios callouts
ipcMain.handle("fetch-storages", async (event) => {
  return await axiosClient.fetchStorages();
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
  async (event, { invoiceId, packerId, numberOfPackages, manually = true }) => {
    var data = await axiosClient.submitInvoice(
      invoiceId,
      packerId,
      numberOfPackages,
      manually
    );
    await generateStickerForInvoice(data.data);
    return;
  }
);

ipcMain.handle("go-back", async (event) => {
  if (mainWindow.webContents.navigationHistory.canGoBack()) {
    mainWindow.webContents.navigationHistory.goBack();
  }
});

ipcMain.handle("play-sound", async (event, soundName) => {
  log.info(`playing sound: ${soundName}`);

  const soundFilePath = path.join(__dirname, `sounds/${soundName}.mp3`);
  await sound.play(soundFilePath);
});

// chokidar monitoring setup and starting
// Directory to watch
const folderToWatch = "./watched";

// Ensure the folder exists
if (!fs.existsSync(folderToWatch)) {
  fs.mkdirSync(folderToWatch);
}

// Initialize Chokidar watcher
const watcher = chokidar.watch(folderToWatch, {
  persistent: true,
  ignoreInitial: true,
});

// Watch for changes
watcher.on("add", async (file_path) => {
  log.info(`New file detected: ${file_path}`);

  executePythonScript(file_path).then(async (data) => {
    log.info("python exection finished");

    await axiosClient.uploadNewInvoice(data);
  });
});

async function executePythonScript(file_path) {
  log.info("python execution started");

  try {
    let pythonScriptPath;

    if (app.isPackaged) {
      // In production, extract the Python script to a temp directory
      const tempDir = os.tmpdir();
      pythonScriptPath = path.join(tempDir, "process_invoice_pdf.py");

      // Extract the script if it doesn't exist
      if (!fs.existsSync(pythonScriptPath)) {
        const asarScriptPath = path.join(
          app.getAppPath(),
          ".webpack\\main\\process_invoice_pdf.py"
        );
        fs.copyFileSync(asarScriptPath, pythonScriptPath);
        log.info(`Python script extracted to: ${pythonScriptPath}`);
      }
    } else {
      // In development, use the original script path
      pythonScriptPath = path.join(__dirname, "process_invoice_pdf.py");
    }

    // Execute the Python script
    log.info("python script path:", pythonScriptPath);

    const { stdout, stderr } = await execFile("python", [
      pythonScriptPath,
      file_path,
    ]).catch((e) => log.info("error occured with execFile: ", e));

    if (stderr) {
      console.error(`Python script error: ${stderr}`);
      return;
    }
    log.info("python output => ", stdout);
    return stdout;
  } catch (error) {
    log.info(error);
  }
}

async function generateStickerForInvoice(invoice) {
  log.info("python generating sticker");

  let generateStickerScriptPath = getGenerateStickerScriptPath();

  let data = JSON.stringify(invoice).toString();

  // Execute the Python script
  return new Promise((resolve, reject) => {
    const pythonProcess = child_process.spawn("python", [
      "-u",
      generateStickerScriptPath,
      data,
    ]);
    let fullOutput = "";

    pythonProcess.stdout.on("data", (data) => {
      const output = data.toString();
      fullOutput += output;
      log.info("python stdout:", output);

      const progressMatch = output.match(/progress:\s*(\d+)%/i);
      if (progressMatch && progressMatch[1]) {
        const progress = parseInt(progressMatch[1], 10);
        if (mainWindow && mainWindow.webContents) {
          mainWindow.webContents.send("loading-progress", progress);
        }
      }
    });

    pythonProcess.stderr.on("data", (data) => {
      const errorMsg = data.toString();
      log.error("python stderr:", errorMsg);
    });

    pythonProcess.on("error", (error) => {
      log.error("python process error:", error);
      reject(error);
    });

    pythonProcess.on("close", (code) => {
      log.info("python process closed with code", code);
      if (code === 0) {
        resolve(fullOutput);
      } else {
        reject(new Error("python process exited with code " + code));
      }
    });
  });
}

function getGenerateStickerScriptPath() {
  try {
    let generateStickerScriptPath;

    if (app.isPackaged) {
      // In production, extract the Python script to a temp directory
      const tempDir = os.tmpdir();
      // Extract the scripts if they doesn't exist

      // generate_sticker.py
      generateStickerScriptPath = path.join(tempDir, "generate_sticker.py");
      if (!fs.existsSync(generateStickerScriptPath)) {
        const asarScriptPath = path.join(
          app.getAppPath(),
          ".webpack\\main\\generate_sticker.py"
        );
        fs.copyFileSync(asarScriptPath, generateStickerScriptPath);
        log.info(`Python script extracted to: ${generateStickerScriptPath}`);
      }

      let generateBarcodeScriptPath = path.join(tempDir, "generate_barcode.py");
      // generate_barcode.py
      if (!fs.existsSync(generateBarcodeScriptPath)) {
        const asarScriptPath = path.join(
          app.getAppPath(),
          ".webpack\\main\\generate_barcode.py"
        );
        fs.copyFileSync(asarScriptPath, generateBarcodeScriptPath);
        log.info(`Python script extracted to: ${generateBarcodeScriptPath}`);
      }

      //print_html.py
      let printHtmlScriptPath = path.join(tempDir, "print_html.py");
      if (!fs.existsSync(printHtmlScriptPath)) {
        const asarScriptPath = path.join(
          app.getAppPath(),
          ".webpack\\main\\print_html.py"
        );
        fs.copyFileSync(asarScriptPath, printHtmlScriptPath);
        log.info(`Python script extracted to: ${printHtmlScriptPath}`);
      }
    } else {
      // In development, use the original script path
      generateStickerScriptPath = path.join(__dirname, "generate_sticker.py");
    }

    log.info("python script path:", generateStickerScriptPath);
    return generateStickerScriptPath;
  } catch (error) {
    log.error(error);
  }
}
