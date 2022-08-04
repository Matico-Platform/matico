const { addBeforeLoader, addPlugins, loaderByName } = require('@craco/craco');
const NodePolyfilPlugin = require("node-polyfill-webpack-plugin")
const webpack = require('webpack')
const WorkerLoaderPlugin = require("craco-worker-loader");


module.exports = async ()=>{
  return{
    webpack: {
      configure(webpackConfig){
        webpackConfig.experiments= {
          asyncWebAssembly: true,
          syncWebAssembly: true,
          topLevelAwait: true
        }

        addPlugins(webpackConfig, [new NodePolyfilPlugin()])


        return webpackConfig
      }
    }
  }
};


