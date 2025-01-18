const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development", // tryb development lub production
  entry: "./src/app.js", // punkt wejścia
  output: {
    path: path.resolve(__dirname, "dist"), // folder wyjściowy
    filename: "bundle.js", // nazwa pliku wynikowego
    clean: true, // czyszczenie folderu "dist"
  },
  devServer: {
    static: "./dist", // serwowanie plików ze "dist"
    port: 8080, // port serwera deweloperskiego
    open: true, // otwarcie przeglądarki automatycznie
  },
  module: {
    rules: [
      {
        test: /\.css$/i, // obsługa plików CSS
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.html$/i, // obsługa plików HTML
        loader: "html-loader",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html", // Twój szablon HTML w folderze `src`
      filename: "index.html", // wynikowy plik HTML w `dist`
    }),
  ],
};
