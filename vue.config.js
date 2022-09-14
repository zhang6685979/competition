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
            ignoreIdentifier: 'border',  //（boolean/string）忽略单个属性的方法，启用ignoreidentifier后，replace将自动设置为true。
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
    },
    mobile: {
      entry: 'src/pages/mobile/main.js',
      template: 'src/pages/mobile/index.html',
      title: '问卷调查',
      filename: 'mobile.html',
      chunks: ['chunk-vendors', 'chunk-common', 'mobile']
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
