import { IpcRendererEvent, contextBridge, ipcRenderer } from "electron";
import { Channel, ChannelEvent } from "./app/communication/shared/communication";

const electronHandler = {
  windowEventEmitter: {
    emitEvent<T extends ChannelEvent<string>>(event: T) {
      const channel = event.channel;
      const payload = event.payload;

      ipcRenderer.send(channel, event, payload);
    },
    handleEvent<T extends ChannelEvent<string>>(channel: Channel<T>, func: (response: T) => void) {
      const subscription = (_event: Electron.IpcRendererEvent, response: T) => func(response);

      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    }
  }
};

contextBridge.exposeInMainWorld("electron", electronHandler);

export type WindowEventEmitter = typeof electronHandler.windowEventEmitter;
export type ElectronHandler = typeof electronHandler;
