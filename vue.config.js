const { defineConfig } = require('@vue/cli-service')
// 根据输入的环境来判断是否需要进行删除第三方包
let externals = {}
let CDN = { css: [], js: [] } // 根据环境看是否需要加CDN
const isPuduction = process.env.NODE_ENV
if (isPuduction === 'production') {
  // 判断用户输入的是否为生产环境，如果是生产环境就删除包，开发环境就不删除
  externals = { // ‘包名’：’在项目中应用的名字‘
    echarts: 'echarts',
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    axios: 'axios',
    dayjs: 'dayjs',
    'element-ui': 'ELEMENT',
    'vue-quill-editor': 'VueQuillEditor',
    'vuex-persistedstate': 'createPersistedState'
  }
  // eslint-disable-next-line no-unused-vars
  CDN = {
    css: [
      'https://unpkg.com/element-ui@2.15.8/lib/theme-chalk/index.css',
      'https://unpkg.com/quill@1.3.7/dist/quill.core.css',
      'https://unpkg.com/quill@1.3.7/dist/quill.snow.css',
      'https://unpkg.com/quill@1.3.7/dist/quill.bubble.css'
    ],
    js: [
      'https://unpkg.com/echarts@5.3.2/dist/echarts.min.js',
      'https://unpkg.com/vue@2.6.14/dist/vue.js',
      'https://unpkg.com/vue-router@3.5.1/dist/vue-router.js',
      'https://unpkg.com/vuex@3.6.2/dist/vuex.js',
      'https://unpkg.com/axios@0.27.2/dist/axios.min.js',
      'https://unpkg.com/dayjs@1.11.3/dayjs.min.js',
      'https://unpkg.com/element-ui@2.15.8/lib/index.js',
      'https://unpkg.com/quill@1.3.7/dist/quill.js',
      'https://unpkg.com/vue-quill-editor@3.0.6/dist/vue-quill-editor.js',
      'https://unpkg.com/vuex-persistedstate@3.2.1/dist/vuex-persistedstate.umd.js'
    ]
  }
} else {
  // 如果是生产环境就不删除
  externals = {}
}

module.exports = defineConfig({
  transpileDependencies: true,
  // publicPath: './' // 在生产环境下就要将路径改为绝对路径，因为我们要部署到服务器，就要dist文件部署到浏览器根目录下面
  // 但是一个服务器上面一般会部署很多项目，不会让你在根目录上面就部署你的一个项目，
  // 所以webpack的配置项就会提供你publicPath：来改变index.html引入其他文件的地址,当我改变为相对路径后我就可以将打包出来的包部署到任意路径
  // 如果我们想让代码自动识别是‘/’还是'./'就要使用node里面的方法process.env.NODE_ENV,它会根据你敲击的命令不同来改变值
  // 如果你敲击 yarn serve 就会变为’development’字符串，如果敲击yarn build就会变为’production‘字符串
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  configureWebpack: {
    // 删去引用的包,减少dist文件的体积，用CDN就可以将其引回来
    externals: externals
  },
  // 使用插件，给webpack的cdn赋值
  chainWebpack (config) {
    config.plugin('html').tap(args => {
      args[0].cdn = CDN
      return args
    })
  }
})
