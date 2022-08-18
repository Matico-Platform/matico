/** @type {import('next').NextConfig} */
const optimizedImages = require("next-optimized-images");
const withCSS = require('@zeit/next-css')

const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE==='true',
    openAnalyzer:false
})



const fs = require('fs');
const flatten = (arr) => arr.reduce((acc, val) => acc.concat(val));

const spectrumStuff = ['@adobe', '@react-spectrum', '@spectrum-icons'].map((ns) =>
      fs.readdirSync(`./node_modules/${ns}`).map((dir) => `${ns}/${dir}`)
)
console.log("spectrumStuff ", spectrumStuff)
let transpileNodes= flatten(spectrumStuff)
transpileNodes.push("verbum")
transpileNodes.push("lexical")
transpileNodes.push("katex")
transpileNodes.push("@maticoapp/matico_components")

const withTM = require("next-transpile-modules")(
 transpileNodes,  { resolveSymlinks: true}
);

const config = {
  reactStrictMode: false,
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

                loader: 'file-loader',
                options:{
                  outputPath: 'static/webfonts/',
                  publicPath: '../webfonts/',
                  // optional, just to prettify file names
                  name: '[name].[ext]',
                }
              },
            ],
          },

          {
            test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
            use: [
              {

                loader: 'file-loader',
                options:{
                  outputPath: 'static/media/',
                  publicPath: '../media/',
                  // optional, just to prettify file names
                  name: '[name].[ext]',
                }
              },
            ],
          }
        );

    return config;
  },
};

// module.exports = withTM(config)
module.exports= (_phase,{defaultConfig})=>{
  const plugins = [withCSS,withTM]
  return plugins.reduce((acc,plugin)=>plugin(acc), config)
}
