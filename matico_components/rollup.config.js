import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript";
import postcss from "rollup-plugin-postcss";
import wasm from "rollup-plugin-wasm";
import json from "@rollup/plugin-json";
import external from "rollup-plugin-peer-deps-external";

import pkg from "./package.json";

export default [
  // browser-friendly UMD build
  {
    input: "src/index.ts",
    output: {
      name: pkg.name,
      file: pkg.browser,
      format: "umd",
    },
    plugins: [
      external({
        includeDependencies: true
      }),
      resolve(), // so Rollup can find `ms`
      commonjs({
        namedExports: {
          "node_modules/react-is/index.js": ["isValidElementType"],
        },
      }), // so Rollup can convert `ms` to an ES module
      wasm(),
      postcss(),
      json(),
      typescript(), // so Rollup can convert TypeScript to JavaScript
    ],
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: "src/index.ts",
    external: ["ms"],
    plugins: [
      wasm(),
      postcss(),
      json(),
      typescript(), // so Rollup can convert TypeScript to JavaScript
    ],
    output: [
      { dir: "dist/cjs", format: "cjs", exports: "named", sourcemap: true },
      { dir: "dist/esm", format: "es", exports: "named", sourcemap: true },
    ],
  },
];
