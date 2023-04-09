/** @type {import('next').NextConfig} */
const optimizedImages = require("next-optimized-images");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: false,
});

const Visualizer = require("webpack-visualizer-plugin");

const transpilePackages = [
  '@adobe/react-spectrum',
  '@react-spectrum/actiongroup',
  '@react-spectrum/badge',
  '@react-spectrum/breadcrumbs',
  '@react-spectrum/button',
  '@react-spectrum/buttongroup',
  '@react-spectrum/calendar',
  '@react-spectrum/checkbox',
  '@react-spectrum/color',
  '@react-spectrum/combobox',
  '@react-spectrum/contextualhelp',
  '@react-spectrum/datepicker',
  '@react-spectrum/dialog',
  '@react-spectrum/divider',
  '@react-spectrum/dnd',
  '@react-spectrum/form',
  '@react-spectrum/icon',
  '@react-spectrum/illustratedmessage',
  '@react-spectrum/image',
  '@react-spectrum/label',
  '@react-spectrum/labeledvalue',
  '@react-spectrum/layout',
  '@react-spectrum/link',
  '@react-spectrum/list',
  '@react-spectrum/listbox',
  '@react-spectrum/menu',
  '@react-spectrum/meter',
  '@react-spectrum/numberfield',
  '@react-spectrum/overlays',
  '@react-spectrum/picker',
  '@react-spectrum/progress',
  '@react-spectrum/provider',
  '@react-spectrum/radio',
  '@react-spectrum/slider',
  '@react-spectrum/searchfield',
  '@react-spectrum/statuslight',
  '@react-spectrum/switch',
  '@react-spectrum/table',
  '@react-spectrum/tabs',
  '@react-spectrum/text',
  '@react-spectrum/textfield',
  '@react-spectrum/theme-dark',
  '@react-spectrum/theme-default',
  '@react-spectrum/theme-light',
  '@react-spectrum/tooltip',
  '@react-spectrum/view',
  '@react-spectrum/well',
  '@spectrum-icons/illustrations',
  '@spectrum-icons/ui',
  '@spectrum-icons/workflow',
  "@maticoapp/matico_components",
  "verbum",
  "lexical",
]

const config = {
  transpilePackages: transpilePackages,
  reactStrictMode: false,
  compiler: {
    styledComponents: true
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // disableStaticImages:true,
  //  experimental: {
  //    urlImports: ['http://localhost:8000/'],
  // },
  webpack: (config, options) => {
    config.experiments.asyncWebAssembly = true;
    config.experiments.syncWebAssembly = true;
    config.experiments.topLevelAwait = true;

    config.module.rules.push(
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "static/webfonts/",
              publicPath: "../webfonts/",
              // optional, just to prettify file names
              // name: '[name].[ext]',
            },
          },
        ],
      },

      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "static/media/",
              publicPath: "../media/",
              // optional, just to prettify file names
              // name: '[name].[ext]',
            },
          },
        ],
      }
    );

    return config;
  },
};

module.exports = (_phase, { defaultConfig }) => {
  const plugins = [withBundleAnalyzer];
  return plugins.reduce((acc, plugin) => plugin(acc), config);
};
