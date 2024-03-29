import fs from "fs";
import path from "path";
import { URL } from "url";

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === "development") {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, "../renderer/", htmlFileName)}`;
}

export function inDevelopmentMode() {
  return process.env.NODE_ENV === "development";
}

export function inDebugMode() {
  return inDevelopmentMode() || process.env.DEBUG_PROD === "true";
}

export function inProductionMode() {
  return process.env.NODE_ENV === "production";
}

export function getChildDirectories(dirPath: string) {
  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => ({
      name: dirent.name,
      path: path.join(dirPath, dirent.name)
    }));
}
