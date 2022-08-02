// const path = require("path");

// module.exports = function override(config, env) {
//   const wasmExtensionRegExp = /\.wasm$/;

//   config.resolve.extensions.push(".wasm");

//   config.module.rules.forEach((rule) => {
//     (rule.oneOf || []).forEach((oneOf) => {
//       if (oneOf.loader && oneOf.loader.indexOf("file-loader") >= 0) {
//         // make file-loader ignore WASM files
//         oneOf.exclude.push(wasmExtensionRegExp);
//       }
//     });
//   });

//   // add a dedicated loader for WASM
//   config.module.rules.push({
//     test: wasmExtensionRegExp,
//     include: path.resolve(__dirname, "src"),
//     use: [{ loader: require.resolve("wasm-loader"), options: {} }],
//   });

//   config.module.rules.unshift({
//     test: /\.worker\.js$/,
//     use: {
//       loader: "worker-loader",
//       options: {
//         // Use directory structure & typical names of chunks produces by "react-scripts"
//         filename: "static/js/[name].[contenthash:8].js",
//       },
//     },
//   });

//   return config;
// };

const { addBeforeLoader, loaderByName } = require('@craco/craco');
const webpack = require('webpack')

module.exports = {
  webpack: {
    experiments: {
      asyncWebAssembly: true,
      syncWebAssembly: true
  }, 
     configure: {
      resolve: {
        fallback: {
          buffer: require.resolve('buffer'),
        },
      },
    },
    plugins: {
      add: [
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        }),
      ],
    },
  }
  
};
