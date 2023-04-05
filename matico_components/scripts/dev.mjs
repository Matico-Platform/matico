import esbuild from "esbuild";
import { outDir, pkg, options } from './options';

let context = await esbuild
  .context({
    ...options,
    outfile: `${outDir}/index.js`,
    format: "esm",
    sourcemap: true,
    minify: false,
    external: [...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)],
  })
  .catch(() => process.exit(1));

await context.watch()
