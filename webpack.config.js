"use strict";
const path = require("path");

module.exports = (env, options) => {
  const isProduction = typeof options.mode !== "undefined" && options.mode === "production";
  const mode = isProduction ? "production" : "development";
  const devtool = isProduction ? false : "inline-source-map";
  const filename = isProduction ? "rum-client.min.js" : "rum-client.js";

  return {
    entry: "./src/index.ts",
    mode,
    devtool,
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [ ".tsx", ".ts", ".js" ],
    },
    output: {
      filename,
      path: path.resolve(__dirname, "dist"),
    },
  };
};
