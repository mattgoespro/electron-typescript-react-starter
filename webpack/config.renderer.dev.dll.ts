/**
 * Builds the DLL for development electron renderer process
 */

import path from "path";
import { Configuration, LoaderOptionsPlugin, EnvironmentPlugin, DllPlugin } from "webpack";
import { merge } from "webpack-merge";
import { dependencies } from "../package.json";
import baseConfig, { checkNodeEnv } from "./config.base";
import * as rendererConfig from "./config.renderer.dev";
import webpackPaths from "./paths";

checkNodeEnv("development");

const dist = webpackPaths.dllPath;

const configuration: Configuration = {
  context: webpackPaths.rootPath,
  devtool: "eval",
  mode: "development",
  target: "electron-renderer",
  externals: ["fsevents", "crypto-browserify"],
  module: rendererConfig.default.module,
  entry: {
    renderer: Object.keys(dependencies || {})
  },
  output: {
    path: dist,
    filename: "[name].dev.dll.js",
    library: {
      name: "renderer",
      type: "var"
    }
  },
  plugins: [
    new DllPlugin({
      path: path.join(dist, "[name].json"),
      name: "[name]"
    }),
    new EnvironmentPlugin({
      NODE_ENV: "development"
    }),
    new LoaderOptionsPlugin({
      debug: true,
      options: {
        context: webpackPaths.srcPath,
        output: {
          path: webpackPaths.dllPath
        }
      }
    })
  ]
};

export default merge(baseConfig, configuration);
