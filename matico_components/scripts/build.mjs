import esbuild from "esbuild";
import {outDir,pkg,options} from './options';
// unminified with external dependencies
// expected to be imported and bundled again
esbuild
  .build({
    ...options,
    sourcemap:false,
    outfile: `${outDir}/index.js`,
    format:"esm",
    minify: true,
    external: [...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)]
  })
  .catch(() => process.exit(1));

// minified with bundled dependencies for direct use in the browser
// expected to be used via <script type="module">
// esbuild
//   .build({
//     ...options,
//     outfile: `${outDir}/bundle.js`,
//     minify: true,
//     format:'cjs',
//     external: ["styled-components"]
//   })
//   .catch(() => process.exit(1));
