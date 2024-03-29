import install from "electron-devtools-installer";

declare module "electron-devtools-installer" {
  type DevToolExtensionReference = typeof install extends (
    extensionReference: infer R,
    ...args: unknown[]
  ) => Promise<string>
    ? R
    : never;

  export type DevToolExtension = {
    name: string;
    version: string;
    reference: string | DevToolExtensionReference;
  };
}
