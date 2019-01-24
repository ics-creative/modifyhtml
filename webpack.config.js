const webpack = require("webpack");

module.exports = {
  mode: "production",
  target: "node",
  entry: {
    addMetaAndPolyfill: "./src/addMetaAndPolyfill.ts"
  },
  plugins: [
    new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true })
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader"
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  }
};
