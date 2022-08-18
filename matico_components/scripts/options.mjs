import { wasmLoader } from "esbuild-plugin-wasm";
import inlineWorkerPlugin from "esbuild-plugin-inline-worker";
import fs from "fs";
import plugin from 'node-stdlib-browser/helpers/esbuild/plugin'
import stdLibBrowser from "node-stdlib-browser"
import {createRequire} from 'module'

const require = createRequire(import.meta.url)

export const pkg = JSON.parse(fs.readFileSync("./package.json"));

export const entrypoint = "src/index.ts";
export const outDir = "dist";

export const banner = `/**
 * Matico Components v${pkg.version}
 * Copyright (c) ${new Date().getFullYear()} Matico.
 *
 * @license MIT
 */`;

export const options = {
  entryPoints: [entrypoint],
  format: "esm",
  bundle: true,
  sourcemap: true,
  loader: {
    '.eot': 'file',
    '.woff': 'file',
    '.woff2': 'file',
    '.svg': 'file',
    '.ttf': 'file',
  },
  plugins: [
    wasmLoader({mode:"deferred"}),
    inlineWorkerPlugin({
      inject: [require.resolve("node-stdlib-browser/helpers/esbuild/shim")],
      sourcemap:true,
      minify:false,
      target:"es2020",
      define:{
        global:"global",
        process:"process",
        Bugger:"Buffer"
      },
      plugins:[
        plugin(stdLibBrowser),
        // replace({ "process.env.NODE_DEBUG": "false" })
      ]
    }),
  ],
  logLevel: "info",
  logLimit: 0,
  banner: { js: banner },
  define: {
    VERSION: `"${pkg.version}"`,
  },
};
