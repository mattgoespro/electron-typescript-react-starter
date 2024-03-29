import { execSync } from "child_process";
import fs from "fs";
import { dependencies } from "../release/app/package.json";
import webpackPaths from "../webpack/paths";

if (
  Object.keys(dependencies || {}).length > 0 &&
  fs.existsSync(webpackPaths.releaseAppNodeModulesPath)
) {
  const electronRebuildCmd =
    "../../node_modules/.bin/electron-rebuild --force --types prod,dev,optional --module-dir .";
  execSync(
    process.platform === "win32" ? electronRebuildCmd.replace(/\//g, "\\") : electronRebuildCmd,
    {
      cwd: webpackPaths.appPath,
      stdio: "inherit"
    }
  );
}
