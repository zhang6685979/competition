const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  runtimeCompiler: true,
  publicPath: "./",
  productionSourceMap: false,
  chainWebpack: (config) => {
    config.resolve.alias.set('@/', resolve('src'))
    // config.plugins.delete('prefetch')
  },
  assetsDir: "static",
  css: {
    loaderOptions: {
      less: {
        modifyVars: {},
        javascriptEnabled: true,
      }
    }
  },

  // 入口设置
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      title: '技能竞赛管理平台',
      filename: 'index.html'
    },
    website: {
      entry: 'src/pages/website/main.js',
      template: 'src/pages/website/index.html',
      title: '技能竞赛与认证服务平台',
      filename: 'website.html',
      chunks: ['chunk-vendors', 'chunk-common', 'website']
    }
  },
  devServer: {
    index: '/index.html', // 运行时，默认打开index页面
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.VUE_APP_SERVER_URL,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/userfiles': {
        target: process.env.VUE_APP_SERVER_URL,
        changeOrigin: true,
        pathRewrite: {
          '^/userfiles': '/userfiles'
        }
      }
    }
  },

  lintOnSave: false
}
