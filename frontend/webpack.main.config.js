const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: "./src/main.js",
  // Put your normal webpack config below here
  module: {
    rules: require("./webpack.rules"),
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, "./src/process-invoice-pdf.py"), to: "./" },
        { from: path.resolve(__dirname, "./src/assets/sounds/scannerBeep.mp3"), to: "./sounds" },
        { from: path.resolve(__dirname, "./src/assets/sounds/error.mp3"), to: "./sounds" },
        { from: path.resolve(__dirname, "./src/assets/sounds/complete.mp3"), to: "./sounds" },
        { from: path.resolve(__dirname, "./src/assets/sounds/complete2.mp3"), to: "./sounds" },
      ],
    }),
  ],
};