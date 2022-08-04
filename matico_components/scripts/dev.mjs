import esbuild from "esbuild";
import {outDir,pkg,options} from './options';

esbuild
  .build({
    ...options,
    outfile: `${outDir}/index.js`,
    format:"esm",
    sourcemap:true,
    minify: false,
    external: [...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)],
    watch: true
  })
  .catch(() => process.exit(1));
