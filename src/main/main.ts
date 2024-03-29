/**
 * This module executes inside of electron's main process.
 */
import { app } from "electron";
import debug from "electron-debug";
import { DesktopWindow } from "./desktop-window";
import { inDebugMode } from "./utils";

if (inDebugMode()) {
  debug({
    devToolsMode: "right",
    showDevTools: true
  });
}

app
  .whenReady()
  .then(async () => {
    const window = new DesktopWindow();
    await window.addWindowEventListeners();
    await window.installDevToolExtensions();
    await window.loadApp();
  })
  .catch((err) => {
    console.error("Error creating window: ", err);
  });
