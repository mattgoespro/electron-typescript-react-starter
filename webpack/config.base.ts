/**
 * Base webpack config used across other specific configs
 */

import TsconfigPathsPlugins from "tsconfig-paths-webpack-plugin";
import { Configuration, EnvironmentPlugin, ContextReplacementPlugin } from "webpack";
import { dependencies as externals } from "../release/app/package.json";
import webpackPaths from "./paths";

export function checkNodeEnv(expectedEnv: string) {
  if (!expectedEnv) {
    throw new Error('"expectedEnv" not set');
  }

  if (process.env.NODE_ENV !== expectedEnv) {
    console.error(`"process.env.NODE_ENV" must be "${expectedEnv}" to use this webpack config`);
    process.exit(2);
  }
}

const configuration: Configuration = {
  externals: [...Object.keys(externals || {})],
  stats: "errors-only",
  module: {
    rules: [
      {
        test: /\.node$/,
        use: "node-loader"
      },

      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            compilerOptions: {
              module: "esnext"
            }
          }
        }
      }
    ]
  },
  output: {
    path: webpackPaths.srcPath,
    library: {
      type: "commonjs2"
    }
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".json"],
    modules: [webpackPaths.srcPath, "node_modules"],
    plugins: [new TsconfigPathsPlugins()]
  },
  plugins: [
    new EnvironmentPlugin({
      NODE_ENV: "production"
    }),
    new ContextReplacementPlugin(/any-promise/)
  ]
};

export default configuration;
