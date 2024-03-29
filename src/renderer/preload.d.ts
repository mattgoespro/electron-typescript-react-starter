import { compose } from "@reduxjs/toolkit";
import { ElectronHandler } from "../main/preload";

declare global {
  interface NodeModule {
    hot?: { accept: (path: string, callback: () => void) => void };
  }

  declare interface System {
    import<T = unknown>(module: string): Promise<T>;
  }

  declare let System: System;

  interface Window {
    electron: ElectronHandler;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: typeof compose;
  }
}

export {};
