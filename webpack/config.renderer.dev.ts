import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import {
  DllReferencePlugin,
  Configuration,
  NoEmitOnErrorsPlugin,
  LoaderOptionsPlugin,
  EnvironmentPlugin
} from "webpack";
import "webpack-dev-server";
import { merge } from "webpack-merge";
import baseConfig, { checkNodeEnv } from "./config.base";
import { killSubprocessesMiddleware, startPreloadTaskMiddleware } from "./middleware";
import webpackPaths from "./paths";

if (process.env.NODE_ENV === "production") {
  checkNodeEnv("development");
}

const port = process.env.PORT || 1212;
const manifest = path.resolve(webpackPaths.dllPath, "renderer.json");
const skipDLLs =
  module.parent?.filename.includes("config.renderer.dev.dll") ||
  module.parent?.filename.includes("webpack.config.renderer.dev");

/**
 * Warn if the DLL is not built
 */
if (!skipDLLs && !(fs.existsSync(webpackPaths.dllPath) && fs.existsSync(manifest))) {
  console.warn(
    'The DLL files are missing. Sit back while we build them for you with "npm run build-dll"'
  );
  execSync("npm run postinstall");
}

const configuration: Configuration = {
  devtool: "inline-source-map",
  mode: "development",
  target: ["web", "electron-renderer"],
  entry: [
    `webpack-dev-server/client?http://localhost:${port}/dist`,
    "webpack/hot/only-dev-server",
    path.join(webpackPaths.srcRendererPath, "index.tsx")
  ],
  output: {
    path: webpackPaths.distRendererPath,
    publicPath: "/",
    filename: "renderer.dev.js",
    library: {
      type: "umd"
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: "/node_modules/",
        use: [
          {
            loader: "css-loader",
            options: { modules: true, sourceMap: true, importLoaders: 1 }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource"
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: "asset/resource"
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "@svgr/webpack",
            options: {
              prettier: false,
              svgo: false,
              svgoConfig: {
                plugins: [{ removeViewBox: false }]
              },
              titleProp: true,
              ref: true
            }
          },
          "file-loader"
        ]
      }
    ]
  },
  plugins: [
    ...(skipDLLs
      ? []
      : [
          new DllReferencePlugin({
            context: webpackPaths.dllPath,
            manifest: require(manifest),
            sourceType: "var"
          })
        ]),
    new ReactRefreshWebpackPlugin({
      include: [webpackPaths.srcRendererPath],
      forceEnable: true
    }),
    new NoEmitOnErrorsPlugin(),
    new EnvironmentPlugin({
      NODE_ENV: "development",
      USE_RESOURCE_DEVTOOLS: process.env.USE_RESOURCE_DEVTOOLS ?? false
    }),
    new LoaderOptionsPlugin({
      debug: true
    }),
    new HtmlWebpackPlugin({
      filename: path.join("index.html"),
      template: path.join(webpackPaths.srcRendererPath, "index.ejs"),
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true
      },
      isBrowser: false,
      env: process.env.NODE_ENV,
      isDevelopment: process.env.NODE_ENV !== "production",
      nodeModules: webpackPaths.releaseAppNodeModulesPath
    })
  ],
  node: {
    __dirname: false,
    __filename: false
  },
  devServer: {
    port,
    compress: true,
    hot: true,
    headers: { "Access-Control-Allow-Origin": "*" },
    static: {
      publicPath: "/"
    },
    historyApiFallback: {
      verbose: true
    },
    setupMiddlewares(middlewares) {
      const { preloadProcess, args } = startPreloadTaskMiddleware();
      killSubprocessesMiddleware(args, [preloadProcess]);
      return middlewares;
    }
  }
};

export default merge(baseConfig, configuration);
