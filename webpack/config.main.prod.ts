/**
 * Webpack config for production electron main process
 */

import path from "path";
import TerserPlugin from "terser-webpack-plugin";
import { Configuration, DefinePlugin, EnvironmentPlugin } from "webpack";
import { merge } from "webpack-merge";
import baseConfig, { checkNodeEnv } from "./config.base";
import webpackPaths from "./paths";
import deleteSourceMaps from "./utils";

checkNodeEnv("production");
deleteSourceMaps();

const configuration: Configuration = {
  devtool: "source-map",
  mode: "production",
  target: "electron-main",
  entry: {
    main: path.join(webpackPaths.srcMainPath, "main.ts"),
    preload: path.join(webpackPaths.srcMainPath, "preload.ts")
  },
  output: {
    path: webpackPaths.distMainPath,
    filename: "[name].js",
    library: {
      type: "umd"
    }
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true
      })
    ]
  },
  plugins: [
    new EnvironmentPlugin({
      NODE_ENV: "production",
      DEBUG_PROD: false,
      START_MINIMIZED: false
    }),

    new DefinePlugin({
      "process.type": '"browser"'
    })
  ],
  node: {
    __dirname: false,
    __filename: false
  }
};

export default merge(baseConfig, configuration);
