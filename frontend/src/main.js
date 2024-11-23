const { app, BrowserWindow } = require("electron");
const chokidar = require("chokidar");
const fs = require("fs");
import "./axios-client.js";
const path = require("path");
const child_process = require("child_process");

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
watcher.on("add", (file_path) => {
  console.log(`Folder change detected: ${event} - ${path}`);
  
  // sending the event to the renderer process
  executePythonScript(file_path);

  if (mainWindow) mainWindow.webContents.send("folder-change", { file_path });
});

function executePythonScript(file_path) {
  const pythonScript = path.join(__dirname, "script.py");

  // Execute the Python script
  child_process.execFile(
    "python",
    [pythonScript, file_path],
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Python script: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Python script error: ${stderr}`);
        return;
      }

      // Parse and handle the output from the Python script
      console.log(`Python script output: ${stdout}`);
      handlePythonOutput(stdout);
    }
  );
}

// Process the Python script output
function handlePythonOutput(output) {
  try {
    const data = JSON.parse(output); // Assuming the script outputs JSON
    console.log("Extracted data:", data);
    // todo Add logic to process or store the extracted data
  } catch (e) {
    console.error("Error parsing Python script output:", e);
  }
}
