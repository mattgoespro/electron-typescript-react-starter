import path from "path";
import webpackPaths from "../webpack/paths";
import { cleanDirectories } from "./clean";

export async function removeNodeModules() {
  try {
    await cleanDirectories([
      path.resolve(webpackPaths.rootNodeModulesPath),
      path.resolve(webpackPaths.releaseAppNodeModulesPath),
      path.resolve(webpackPaths.srcNodeModulesPath)
    ]);
  } catch (error) {
    console.error(error);
  }
}

removeNodeModules();
