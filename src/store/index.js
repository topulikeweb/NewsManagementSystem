import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { getUserInfoAPI } from '@/api'
// import store from 'core-js/internals/shared-store'
// 这人插件会自动帮我将vuex的值储存在本地
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    userInfo: {}// 定义就收用户信息的对象
  },
  mutations: {
    updateToken (state, value) {
      state.token = value
    },
    initUserInfo (state, value) {
      state.userInfo = value
    }
  },
  actions: {
    // 将信息渲染到页面的函数
    async  initUserInfo (context, value) {
      const { data: res } = await getUserInfoAPI()
      if (res.code === 0) {
        // eslint-disable-next-line no-undef
        console.log(this.state.userInfo)// 输出用户信息（this指向的是store，可以找到state）
        context.commit('initUserInfo', res.data)
      }
    }
  },
  getters: {
    nickname: (state) => {
      return state.userInfo.nickname// 昵称
    },
    username: (state) => {
      return state.userInfo.username// 用户名
    },
    user_pic: (state) => {
      return state.userInfo.user_pic// 用户头像
    }
  },
  plugins: [
    createPersistedState() // 使用这个插件
  ]

})
