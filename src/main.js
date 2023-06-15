import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './ElementUI/index'
import dayjs from 'dayjs' // 引入时间格式化第三方组件
// 导入富文本编辑器（作用就是渲染输入框样式，让用户体验更好）
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'// 引入文件

Vue.config.productionTip = false// 关闭生产提示

// 全局注册富文本编辑器
Vue.use(VueQuillEditor)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// 定义$formatDate方法，引用第三方包dayjs格式化时间，并将$formatDate方法挂载到Vue原型对象上面
Vue.prototype.$formatDate = (objdata) => {
  return dayjs(objdata).format('YYYY-MM-DD HH:mm:ss')
}
