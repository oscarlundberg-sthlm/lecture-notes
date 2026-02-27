const { app, BrowserWindow, dialog, Menu, ipcMain } = require("electron/main");
const serve = require("electron-serve").default;
const path = require("path");
const fs = require("fs");

let mainWindow;
let currentFilePath = null;
let isSaving = false;

const appPath = app.isPackaged
  ? path.join(process.resourcesPath, "app")
  : __dirname;

const appServe = app.isPackaged
  ? serve({
      // Path to the built static React app
      directory: path.join(process.resourcesPath, "out"),
    })
  : null;

const createWindow = async () => {
  mainWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(appPath, "preload/preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.maximize();

  if (app.isPackaged) {
    await appServe(mainWindow);
    mainWindow.show();
  } else {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();
  }

  createMenu();
};

app.whenReady().then(async () => {
  await createWindow();

  app.on("activate", async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createWindow();
    }
  });
});

function createMenu() {
  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "New",
          accelerator: "CmdOrCtrl+N",
          // open a dialog to select a PDF file
          click: async () => {
            currentFilePath = null; // Reset current file path for new project
            const { canceled, filePaths } = await dialog.showOpenDialog({
              filters: [{ name: "PDF", extensions: ["pdf"] }],
              properties: ["openFile"],
            });

            if (canceled || !filePaths.length) return;

            // The PDF needs to be converted to a dataURL with base64
            const base64Pdf = fs.readFileSync(filePaths[0], "base64");
            const dataUrl = `data:application/pdf;base64,${base64Pdf}`;

            // Let's get the filename
            const filename = path.basename(
              filePaths[0],
              path.extname(filePaths[0]),
            );

            mainWindow.webContents.send("new-project", {
              pdf: {
                base64: dataUrl,
                filename: filename,
              },
            });
          },
        },
        {
          label: "Open",
          accelerator: "CmdOrCtrl+O",
          click: async () => {
            const { canceled, filePaths } = await dialog.showOpenDialog({
              filters: [{ name: "Project", extensions: ["lectnotes"] }],
              properties: ["openFile"],
            });

            if (canceled || !filePaths.length) return;

            const content = fs.readFileSync(filePaths[0], "utf-8");
            currentFilePath = filePaths[0];

            mainWindow.webContents.send("project-opened", {
              ...JSON.parse(content),
              currentFilepath: currentFilePath,
            });
          },
        },
        {
          label: "Save",
          accelerator: "CmdOrCtrl+S",
          click: async () => {
            mainWindow.webContents.send("menu-save");
          },
        },
        {
          label: "Save As",
          accelerator: "CmdOrCtrl+Shift+S",
          click: async () => {
            mainWindow.webContents.send("menu-save-as");
          },
        },
        { type: "separator" },
        { role: "quit" },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

ipcMain.handle("save-to-disk", async (_, { data, saveAs }) => {
  if (isSaving) return null; // Prevent multiple simultaneous saves
  isSaving = true;

  try {
    if (!currentFilePath || saveAs) {
      const { canceled, filePath } = await dialog.showSaveDialog({
        filters: [{ name: "Project", extensions: ["lectnotes"] }],
      });

      if (canceled || !filePath) return null;
      currentFilePath = filePath;
    }

    fs.writeFileSync(currentFilePath, JSON.stringify(data));
    return currentFilePath;
  } finally {
    isSaving = false;
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
