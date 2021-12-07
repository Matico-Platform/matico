const webpack = require("webpack");
const path = require("path");
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
const pkg = require("./package.json");

const config = {
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    library: {
      name: "matico_components",
      type: "umd",
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [
                    "postcss-preset-env",
                    {
                      // Options
                    },
                  ],
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "swc-loader",
          options: {
            jsc: {
              parser: {
                syntax: "typescript",
                tsx: true,
              },
            },
          },
        },
      },
      {
        test: /\.svg$/,
        use: "file-loader",
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: "url-loader",
            options: {
              mimetype: "image/png",
            },
          },
        ],
      },
    ],
  },
  resolve: {
    mainFields: ["browser", "module", "main"],
    extensions: [".tsx", ".ts", ".js"],
    alias:{
      "Components" : path.resolve(__dirname,"./src/Components"),
      "Contexts" : path.resolve(__dirname,"./src/Contexts"),
      "Hooks" : path.resolve(__dirname,"./src/Hooks"),
      "Stores" : path.resolve(__dirname,"./src/Stores"),
      "Utils" : path.resolve(__dirname,"./src/Utils"),
      "Datasets" : path.resolve(__dirname,"./src/Datasets"),
      "~/`" : path.resolve(__dirname,"./src"),

    },
    fallback: {
      buffer: require.resolve("buffer/"),
    },
    // alias: {
    //   "react-dom": "@hot-loader/react-dom",
    // },
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
  ],
  externals: [
    ...Object.keys(pkg.dependencies),
    ...Object.keys(pkg.peerDependencies),
  ].filter((a) => a !== "matico_spec"),
  plugins: [new LodashModuleReplacementPlugin()],
  experiments: {
    asyncWebAssembly: true,
    syncWebAssembly: true,
  },
};

module.exports = config;
