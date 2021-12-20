import {wasmLoader} from "esbuild-plugin-wasm";
import inlineWorkerPlugin from 'esbuild-plugin-inline-worker';
import fs from 'fs'

export const pkg = JSON.parse(fs.readFileSync('./package.json'))


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
  plugins: [wasmLoader(), inlineWorkerPlugin()],
  logLevel: "info",
  logLimit: 0,
  banner: { js: banner },
  define: {
    VERSION: `"${pkg.version}"`,
  },
};
