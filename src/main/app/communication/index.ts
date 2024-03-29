import { IpcMain, IpcMainEvent } from "electron";
import { onExampleEvent, onSharedExampleEvent } from "./event-listener";
import { Events } from "./events";

const ExampleListenerFn = async (event: IpcMainEvent, ...type: [Events]) => {
  const ev = type[0];

  switch (ev.event) {
    case "example":
      onExampleEvent(event, ev);
      return;
    default:
      return;
  }
};

const SharedExampleListenerFn = async (event: IpcMainEvent, ...type: [Events]) => {
  const ev = type[0];

  switch (ev.event) {
    case "shared-example":
      onSharedExampleEvent(event, ev);
      return;
    default:
      return;
  }
};

export const imageToIconEventHandler = (ipcMain: IpcMain) => {
  ipcMain.on("example", ExampleListenerFn);
  ipcMain.on("shared-example", SharedExampleListenerFn);
};
