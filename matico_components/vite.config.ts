import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vitest/config'
import dts from 'vite-plugin-dts'
import { UserConfigExport } from 'vite'
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import tsconfigPaths from 'vite-tsconfig-paths'
import topLevelAwait from "vite-plugin-top-level-await";
import { name, dependencies, peerDependencies } from './package.json'

const app = async (): Promise<UserConfigExport> => {
  return defineConfig({
    plugins: [
      topLevelAwait(),
      tsconfigPaths(),
      react(),
      dts({
        insertTypesEntry: true,
      }),
    ],
    css: {
      postcss: {
        plugins: [],
      },
    },
    build: {
      lib: {
        entry: path.resolve(__dirname, 'src/index.ts'),
        name,
        formats: ['es', 'umd'],
        fileName: (format) => `matico_components.${format}.js`,
      },
      rollupOptions: {
        plugins: [peerDepsExternal()],
        external: [...Object.keys(dependencies), ...Object.keys(peerDependencies)],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
          },
        },
      },
    },
    worker: {
      plugins: [tsconfigPaths(), topLevelAwait()],
    },
    test: {
      globals: true,
      css: {
        modules: {
          classNameStrategy: 'non-scoped'
        }
      },
      deps: {
        inline: [/.*react-spectrum.*/], // ,
      },
      environment: 'jsdom',
      setupFiles: ['./vitest_setup.js']
    },
  })
}
// https://vitejs.dev/config/
export default app
