import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => {
      return import('@/views/layout')
    },
    redirect: 'home',
    children: [{
      path: 'home',
      component: () => { // 配置二级路由home（layout的子路由）
        return import('@/views/home')
      }
    }, {
      path: 'user-info',
      component: () => {
        return import('@/views/userInfo')
      }
    }, {
      path: 'user-avatar',
      component: () => {
        return import('@/views/user')
      }
    }, {
      path: 'user-pwd',
      component: () => {
        return import('@/views/userPwd')
      }
    }, {
      path: 'art-cate',
      component: () => {
        return import('@/views/artCate')
      }
    }, {
      path: 'art-list',
      component: () => {
        return import('@/views/article')
      }

    }]
  },
  {
    path: '/register',
    component: () => {
      return import('@/views/register')
    // 这里使用的是webpack的路由懒加载
    // 当我们打开页面的时候才开始加载页面，提高了页面加载的效率
    }
  },
  {
    path: '/login',
    component: () => {
      return import('@/views/login')
    }
  }]

const router = new VueRouter({
  routes
})

export default router

const whiteList = ['/login', '/register']
// 定义全局前置路由守卫,（当我登录进去layout页面之前，此守卫就要进行判断）
router.beforeEach((to, from, next) => {
  const token = store.state.token
  console.log(token)
  // 如果登录了就不拦截
  if (token) {
    if (store.state.userInfo.username) {
      store.dispatch('initUserInfo')// 当token和用户名不存在的时候我才进行调用，获取用户信息
      // 第二个判断是防止进入之后也要获取用户信息
    }
    next()
  } else {
    if (whiteList.includes(to.path)) {
      // 这里还要判断一下，是因为如果直接强制跳转会陷入死循环
      next()
    } else {
      // 没有登陆的话就强制跳转到登录页，强制next跳转但是 会导致全局路由守卫重新进行
      next('/login')
    }
  }
})
