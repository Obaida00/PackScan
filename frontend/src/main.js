const { app, BrowserWindow } = require("electron");
const chokidar = require("chokidar");
const fs = require("fs");
import "./axios-client.js";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

let mainWindow;
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

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
watcher.on("all", (event, path) => {
  console.log(`Folder change detected: ${event} - ${path}`);
  // sending the event to the frontend
  if (mainWindow) mainWindow.webContents.send("folder-change", { event, path });
});
