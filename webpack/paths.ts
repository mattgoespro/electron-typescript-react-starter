import path from "path";

const rootPath = path.join(__dirname, "..");

const srcPath = path.join(rootPath, "src");
const releasePath = path.join(rootPath, "release");

const appPath = path.join(releasePath, "app");
const distPath = path.join(appPath, "dist");

export default {
  appPath,
  appPackagePath: path.join(appPath, "package.json"),
  buildPath: path.join(releasePath, "build"),
  distPath,
  distMainPath: path.join(distPath, "main"),
  distRendererPath: path.join(distPath, "renderer"),
  dllPath: path.join(rootPath, "dll"),
  releasePath,
  releaseAppNodeModulesPath: path.join(appPath, "node_modules"),
  rootPath,
  rootNodeModulesPath: path.join(rootPath, "node_modules"),
  srcMainPath: path.join(srcPath, "main"),
  srcNodeModulesPath: path.join(srcPath, "node_modules"),
  srcPath,
  srcRendererPath: path.join(srcPath, "renderer")
};
