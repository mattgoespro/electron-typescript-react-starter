import fs from "fs";
import webpackPaths from "../webpack/paths";

const srcNodeModulesPath = webpackPaths.srcNodeModulesPath;
const releaseAppNodeModulesPath = webpackPaths.releaseAppNodeModulesPath;

if (!fs.existsSync(srcNodeModulesPath) && fs.existsSync(releaseAppNodeModulesPath)) {
  fs.symlinkSync(releaseAppNodeModulesPath, srcNodeModulesPath, "junction");
}
