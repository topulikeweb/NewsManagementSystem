// 基于axios的网络封装函数
import axios from 'axios'
import store from '@/store'
import router from '@/router'

const myAxios = axios.create({
  // 创建一个axios方法，比原来的axios方法多了一个基地址
  // 当我们在使用这个方法的时候，地址=baseurl+url
  baseURL: 'http://big-event-vue-api-t.itheima.net'
})
export default myAxios
// 定义一个请求拦截器，在我每次请求的时候都要经过这个拦截器
// 目的是帮我携带参数，减少工作量
/**
 * @Description: 定义的请求拦截器，帮助传递参数的请求拦截器
 * @author topu
 * @date 2022/9/12
 */
// 白名单
const whiteAPIList = ['/api/reg', '/api/login']

myAxios.interceptors.request.use(function (config) {
  // 做一个判断，当token存在的时候，就是在除开登录页面和注册页面以外的页面
  // if (store.state.token) {
  if (!whiteAPIList.includes(config.url)) {
    // 发起请求的时候就会拦截，给其赋值
    config.headers.Authorization = store.state.token
  }
  return config
}, function (error) {
  return Promise.reject(error)
}
)
/**
 * @Description:定义响应拦截器
 * @author topu
 * @date 2022/9/12
 */
// 其实请求/响应拦截器就是一个promise对象
myAxios.interceptors.request.use(response => {
  return response
}, reject => {
  if (reject.response.status === 401) { // 如果token过期
    store.commit('updateToken', '')// 将token重置为空
    router.push('/login') // 强制跳转到登陆页面
  }
  return Promise.reject(reject)
})
