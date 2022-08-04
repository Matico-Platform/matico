const esbuild = require('esbuild')
const options = require('./options')

esbuild.build({
  ...options,
  watch: {
    onRebuild(error, result) {
      if (error) console.error('watch build failed:', error)
      else { 
        console.log('watch build succeeded:', result)
      }
    },
  },
})
