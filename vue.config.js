const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  runtimeCompiler: true,
  publicPath: "./",
  productionSourceMap: false,
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack(config) {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload-manage').tap(() => [{
      rel: 'preload',
      // to ignore runtime.js
      // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
      fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
      include: {
        type: 'initial',
        entries: ['manage']
      },
      includeHtmlNames: ['manage.html']
    }])
    // // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch-index')
    config.plugins.delete('prefetch-mobile')
    config.plugins.delete('preload-index')
    config.plugins.delete('preload-mobile')

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                vxeTable: {
                  name: 'chunk-vxe', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?vxe-table(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
          //config.optimization.runtimeChunk('single')
          config.optimization.runtimeChunk = {
            name: (entrypoint) => `runtime~${entrypoint.name}`,
          };

        }
      )
  },
  assetsDir: "static",
  css: {
    loaderOptions: {
      less: {
        modifyVars: {},
        javascriptEnabled: true,
      },
      postcss: {
        plugins: [
          require('postcss-plugin-px2rem')({
            rootValue: 192, //换算基数， 默认100  ，这样的话把根标签的字体规定为1rem为50px,这样就可以从设计稿上量出多少个px直接在代码中写多上px了。
            // unitPrecision: 5, //允许REM单位增长到的十进制数字。
            //propWhiteList: [],  //默认值是一个空数组，这意味着禁用白名单并启用所有属性。
            // propBlackList: [], //黑名单
            exclude: /^((?!website).)+$/, //默认false，可以（reg）利用正则表达式排除某些文件夹的方法，例如/(node_module)\/如果想把前端UI框架内的px也转换成rem，请把此属性设为默认值
            selectorBlackList: ['.el-'], //要忽略并保留为px的选择器
            ignoreIdentifier: 'border', //（boolean/string）忽略单个属性的方法，启用ignoreidentifier后，replace将自动设置为true。
            // replace: true, // （布尔值）替换包含REM的规则，而不是添加回退。
            mediaQuery: false, //（布尔值）允许在媒体查询中转换px。
            minPixelValue: 3 //设置要替换的最小像素值(3px会被转rem)。 默认 0
          }),
        ]
      }

    }
  },

  // 入口设置
  pages: {
    index: {
      entry: 'src/pages/website/main.js',
      template: 'src/pages/website/index.html',
      title: '技能竞赛与认证服务平台',
      filename: 'index.html',
      chunks: ['chunk-vendors', 'chunk-common', 'chunk-libs', 'chunk-commons', 'chunk-elementUI','index']
    },
    manage: {
      entry: 'src/main.js',
      template: 'src/pages/manage/index.html',
      title: '技能竞赛管理平台',
      filename: 'manage.html',
      chunks: ['chunk-vendors', 'chunk-common', 'chunk-libs', 'chunk-commons', 'chunk-elementUI','chunk-vxe',
        'manage'
      ]
    },
    mobile: {
      entry: 'src/pages/mobile/main.js',
      template: 'src/pages/mobile/index.html',
      title: '问卷调查',
      filename: 'mobile.html',
      chunks: ['chunk-vendors', 'chunk-common', 'chunk-libs', 'chunk-elementUI', 'mobile']
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
      },
      '/profile': {
        target: process.env.VUE_APP_SERVER_URL,
        changeOrigin: true,
        pathRewrite: {
          '^/profile': '/profile'
        }
      }
    }
  },

  lintOnSave: false
}
