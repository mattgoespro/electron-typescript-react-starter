/**
 * Build config for electron renderer process
 */

import path from "path";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import TerserPlugin from "terser-webpack-plugin";
import { DefinePlugin, EnvironmentPlugin } from "webpack";
import { merge } from "webpack-merge";
import baseConfig, { checkNodeEnv } from "./config.base";
import webpackPaths from "./paths";
import deleteSourceMaps from "./utils";

checkNodeEnv("production");
deleteSourceMaps();

export default merge(baseConfig, {
  devtool: "source-map",
  mode: "production",
  target: ["web", "electron-renderer"],
  entry: [path.join(webpackPaths.srcRendererPath, "index.tsx")],
  output: {
    path: webpackPaths.distRendererPath,
    publicPath: "./",
    filename: "renderer.js",
    library: {
      type: "umd"
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: true,
              sourceMap: true,
              importLoaders: 1
            }
          }
        ],
        include: /\.module\.css$/
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
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()]
  },
  plugins: [
    new EnvironmentPlugin({
      NODE_ENV: "production",
      DEBUG_PROD: false
    }),
    new MiniCssExtractPlugin({
      filename: "style.css"
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.join(webpackPaths.srcRendererPath, "index.ejs"),
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true
      },
      isBrowser: false,
      isDevelopment: false
    }),
    new DefinePlugin({
      "process.type": '"renderer"'
    })
  ]
});
