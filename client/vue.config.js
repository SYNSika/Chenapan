const { defineConfig } = require('@vue/cli-service')
const fs = require('fs')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    https :{
      key: fs.readFileSync(process.env.PRIVATE_KEY),
      cert: fs.readFileSync(process.env.CERTIFICATE)
    },
    port: 8080
  }
})
