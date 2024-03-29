import path from "path";
import webpackPaths from "../webpack/paths";
import { cleanDirectories } from "./clean";

export async function removeBuilds() {
  try {
    await cleanDirectories([
      path.resolve(webpackPaths.buildPath),
      path.resolve(webpackPaths.distPath),
      path.resolve(webpackPaths.dllPath)
    ]);
  } catch (error) {
    console.error(error);
  }
}

removeBuilds();
