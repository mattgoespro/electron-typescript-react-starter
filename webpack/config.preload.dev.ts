import path from "path";
import { Configuration, LoaderOptionsPlugin, EnvironmentPlugin } from "webpack";
import { merge } from "webpack-merge";
import baseConfig, { checkNodeEnv } from "./config.base";
import webpackPaths from "./paths";

if (process.env.NODE_ENV === "production") {
  checkNodeEnv("development");
}

const configuration: Configuration = {
  devtool: "inline-source-map",
  mode: "development",
  target: "electron-preload",
  entry: path.join(webpackPaths.srcMainPath, "preload.ts"),
  output: {
    path: webpackPaths.dllPath,
    filename: "preload.js",
    library: {
      type: "umd"
    }
  },
  plugins: [
    new EnvironmentPlugin({
      NODE_ENV: "development"
    }),
    new LoaderOptionsPlugin({
      debug: true
    })
  ],
  node: {
    __dirname: false,
    __filename: false
  },
  watch: true
};

export default merge(baseConfig, configuration);
