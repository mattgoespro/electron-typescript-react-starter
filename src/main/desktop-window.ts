import fs from "fs";
import os from "os";
import path from "path";
import electron, { app, Menu, MenuItem, shell, BrowserWindow } from "electron";
import installDevToolExtension, {
  REDUX_DEVTOOLS,
  REACT_DEVELOPER_TOOLS as REACT_DEVTOOLS,
  DevToolExtension
} from "electron-devtools-installer";
import { install as installSourceMapSupport } from "source-map-support";
import { imageToIconEventHandler } from "./app/communication";
import { getConfiguration } from "./config";
import { getChildDirectories, inDebugMode, inProductionMode, resolveHtmlPath } from "./utils";

class DevtoolsExtensionError extends Error {
  private log = "[DevtoolsExtensionError]";

  constructor(private options: { message: string; details?: string[] }) {
    super(options.message);
  }

  public toString() {
    return [
      [`${this.log}`, this.message].join(" "),
      (this.options.details ?? []).map((detail) => `${this.log}\t${detail}`).join("\n")
    ].join("\n");
  }
}

export class DesktopWindow {
  private assetsPath = path.resolve(getConfiguration("assetsPath"));

  private window: BrowserWindow;

  constructor() {
    this.window = new BrowserWindow({
      show: false,
      width: 1200,
      height: 800,
      icon: path.join(this.assetsPath, "icon.png"),
      webPreferences: {
        preload: app.isPackaged
          ? path.join(__dirname, "preload.js")
          : path.resolve(__dirname, "../../dll/preload.js"),
        nodeIntegration: true,
        webSecurity: false
      }
    });

    this.addWindowMenu();
  }

  private addWindowMenu() {
    const menu = new Menu();
    menu.insert(0, new MenuItem({ label: "Reload", role: "reload" }));

    if (inDebugMode()) {
      this.window.webContents.on("context-menu", (_, props) => {
        const { x, y } = props;

        Menu.buildFromTemplate([
          {
            label: "Inspect element",
            click: () => {
              this.window.webContents.inspectElement(x, y);
            }
          }
        ]).popup({ window: this.window });
      });
      return;
    }

    Menu.setApplicationMenu(menu);
  }

  public async addWindowEventListeners() {
    this.window.on("ready-to-show", () => {
      if (!this.window) {
        throw new Error('"mainWindow" is not defined');
      }

      this.window.webContents.openDevTools();
      this.window.show();
    });

    this.window.on("close", () => {
      app.quit();
    });

    this.window.webContents.setWindowOpenHandler((edata) => {
      shell.openExternal(edata.url);
      return { action: "deny" };
    });

    this.attachToMainProcess(imageToIconEventHandler);

    return this;
  }

  private attachToMainProcess(attachHandler: (ipcMain: Electron.IpcMain) => void) {
    attachHandler(electron.ipcMain);
  }

  public installSourceMapSupport() {
    if (inProductionMode()) {
      installSourceMapSupport({
        environment: "browser",
        hookRequire: true
      });
    }

    return this;
  }

  private async installDevToolsFromChromeDirectory(
    supportedExtensions: Map<string, DevToolExtension>
  ) {
    const chromeExtensionsDirectory = path.join(
      os.homedir(),
      "AppData",
      "Local",
      "Google",
      "Chrome",
      "User Data",
      "Default",
      "Extensions"
    );

    if (!fs.existsSync(chromeExtensionsDirectory)) {
      throw new DevtoolsExtensionError({
        message: `devtools extension error: error finding Chrome extensions directory`
      });
    }

    const extensionDirs = getChildDirectories(chromeExtensionsDirectory);

    for (const extensionDir of extensionDirs) {
      const extensionId = extensionDir.name;

      if (supportedExtensions.has(extensionId)) {
        const extension = supportedExtensions.get(extensionId);
        const extensionName = extension[0] as string;
        const extensionVersion = extension[1];

        const installedVersion = getChildDirectories(extensionDir.path)[0];

        if (installedVersion.name !== extensionVersion) {
          throw new DevtoolsExtensionError({
            message: `devtools extension mismatch error: ${extensionName}`,
            details: [
              `expected version: ${extensionVersion}`,
              `installed version: ${installedVersion.name}`
            ]
          });
        }

        try {
          await electron.session.defaultSession.loadExtension(
            path.join(extensionDir.path, extensionVersion),
            {
              allowFileAccess: true
            }
          );

          console.log(`devtools extensions: installed ${extensionName} (id: ${extensionId})`);
        } catch (err) {
          throw new DevtoolsExtensionError({
            message: `devtools extension error: ${extensionName}`,
            details: [err.message]
          });
        }
      }
    }
    return;
  }

  private async installDevToolsFromElectronDevToolsInstaller(
    supportedExtensions: Map<string, DevToolExtension>
  ) {
    for (const supportedExtension of supportedExtensions.keys()) {
      const extension = supportedExtensions.get(supportedExtension);
      const extensionName = extension.name;

      try {
        await installDevToolExtension(extension.reference, {
          forceDownload: true,
          loadExtensionOptions: {
            allowFileAccess: true
          }
        });

        console.log(`installed ${extensionName}`);
      } catch (err) {
        if (err instanceof DevtoolsExtensionError) {
          console.error(err);
        } else if (err instanceof Error) {
          throw new DevtoolsExtensionError({
            message: `devtools extension error: ${extensionName}`,
            details: [err.message]
          });
        }
      }
    }
  }

  public async installDevToolExtensions() {
    const supportedExtensions = new Map<string, DevToolExtension>()
      .set(REACT_DEVTOOLS.id, {
        name: "react-devtools",
        version: "4.28.5_2",
        reference: REACT_DEVTOOLS
      })
      .set(REDUX_DEVTOOLS.id, {
        name: "redux-devtools",
        version: "3.1.3_0",
        reference: REDUX_DEVTOOLS
      });

    if (getConfiguration("useResourceDevtools")) {
      await this.installDevToolsFromChromeDirectory(supportedExtensions);
      console.log(`devtools extensions: installed devtools from Chrome installation directory.`);
      return this;
    }

    await this.installDevToolsFromElectronDevToolsInstaller(supportedExtensions);
    console.log(`devtool extensions: installed devtools from 'electron-devtools-installer'`);

    return this;
  }

  public async loadApp() {
    await this.window.loadURL(resolveHtmlPath("index.html"));
  }
}
