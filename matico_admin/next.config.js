/** @type {import('next').NextConfig} */
const withPlugins = require("next-compose-plugins");
const optomizedImages = require("next-optimized-images");

const withTM = require("next-transpile-modules")(
  [
    "@adobe/react-spectrum",
    "@react-spectrum/color",
    "@react-spectrum/actiongroup",
    "@react-spectrum/breadcrumbs",
    "@react-spectrum/button",
    "@react-spectrum/buttongroup",
    "@react-spectrum/checkbox",
    "@react-spectrum/combobox",
    "@react-spectrum/dialog",
    "@react-spectrum/divider",
    "@react-spectrum/form",
    "@react-spectrum/icon",
    "@react-spectrum/illustratedmessage",
    "@react-spectrum/image",
    "@react-spectrum/label",
    "@react-spectrum/layout",
    "@react-spectrum/link",
    "@react-spectrum/listbox",
    "@react-spectrum/menu",
    "@react-spectrum/meter",
    "@react-spectrum/numberfield",
    "@react-spectrum/overlays",
    "@react-spectrum/picker",
    "@react-spectrum/progress",
    "@react-spectrum/provider",
    "@react-spectrum/radio",
    "@react-spectrum/slider",
    "@react-spectrum/searchfield",
    "@react-spectrum/statuslight",
    "@react-spectrum/switch",
    "@react-spectrum/table",
    "@react-spectrum/tabs",
    "@react-spectrum/text",
    "@react-spectrum/textfield",
    "@react-spectrum/theme-dark",
    "@react-spectrum/theme-default",
    "@react-spectrum/theme-light",
    "@react-spectrum/tooltip",
    "@react-spectrum/view",
    "@react-spectrum/well",
    "@spectrum-icons/ui",
    "@spectrum-icons/workflow",
    "@spectrum-icons/illustrations",
    "@maticoapp/matico_components",
    "react-mde",
  ],
  { resolveSymlinks: false }
);

module.exports = withPlugins([withTM, optomizedImages], {
  reactStrictMode: true,
  webpack5: true,
  typescript: {
    ignoreBuildErrors: true,
  },
   experimental: {
     urlImports: ['http://localhost:8000/'],
  },
  webpack: (config, options) => {
    config.experiments.asyncWebAssembly = true;
    config.module.rules.push(
          {
            test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
            use: [
              {

                loader: 'file-loader',
                options:{
                  outputPath: 'static/webfonts/',
                  publicPath: '../webfonts/',
                  // optional, just to prettify file names
                  name: '[name].[ext]',
                }
              },
            ],
          }
        );

    return config;
  },
});
