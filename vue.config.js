const merge = require('webpack-merge')
const RouterWebpackPlugin = require('./plugins/router.webpack.plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const { resolve } = require('path')
const isProduction = process.env.NODE_ENV === 'production'
const fs = require('fs')
const chalk = require('chalk')
const { error } = require('./utils')
const configPath = resolve(process.cwd(), 'vue.config.js')

let fileConfig
if (fs.existsSync(configPath)) {
  try {
    fileConfig = require(configPath)
    if (typeof fileConfig === 'function') {
      fileConfig = fileConfig()
    }
    if (!fileConfig || typeof fileConfig !== 'object') {
      error(`Error loading ${chalk.bold('vue.config.js')}: should export an object or a function that returns object.`)
      fileConfig = null
    }
  } catch (e) {
    error(`Error loading ${chalk.bold('vue.config.js')}:`)
    throw e
  }
}

module.exports = merge(
  {
    pages: {
      index: resolve(__dirname, 'src/main.js'),
    },
    css: {
      loaderOptions: {
        scss: {
          // prependData: `@import 'gz-common/src/assets/styles/_variables';`,
        },
      },
    },
    lintOnSave: true,
    productionSourceMap: false,
    devServer: {
      port: 9097,
    },
    chainWebpack: config => {
      config.resolve.alias.set('@api', resolve(__dirname, 'src/api/index.js'))
      config.resolve.alias.set('@router', resolve(__dirname, 'src/router/index.js'))
      config.resolve.alias.set('@store', resolve(__dirname, 'src/store/index.js'))
    },
    configureWebpack: config => {
      config.plugins.push(new RouterWebpackPlugin())
      isProduction &&
        config.plugins.push(
          new CompressionWebpackPlugin({
            algorithm: 'gzip',
            test: new RegExp('\\.(js|css)$'),
            threshold: 10240,
            minRatio: 0.8,
          })
        )
    },
  },
  fileConfig
)
