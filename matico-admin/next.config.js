/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  webpack5:true,
  webpack:(config,options)=>{
    config.experiments.asyncWebAssembly= true
    return config
  }
}
