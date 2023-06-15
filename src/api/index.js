// 注意封装的是具体接口的请求方式
// 每个方法只能负责一个url地址
import axios from '@/utils/request'
import store from '@/store'
// import request from '@/utils/request'
// es6语法规定:解构赋值{uername：‘1111’}=》{uername：uername}key相同的时候就可以给uername赋值
export const registerAPI = ({ username, password, repassword }) => {
  // 返回的是一个promise的方法，就是成功。。。。失败。。。。
  // 我们需要返回这个方法，去逻辑页面使用promise方法
  /**
   * @Description: 传递注册信息的参数
   * @author topu
   * @date 2022/9/11
  */
  return axios({
    url: '/api/reg',
    method: 'POST',
    // 这里使用data传参，因为params会在url后面拼接参数
    data: {
      username,
      password,
      repassword
    }
  })
}
/**
 * @Description: 传递登录信息
 * @author topu
 * @date 2022/9/11
*/
export const loginin = ({ username, password }) => {
  return axios({
    method: 'POST',
    url: '/api/login',
    data: {
      username,
      password
    }
  })
}
/**
 * @Description: 获取用户的信息
 * @author topu
 * @date 2022/9/11
*/
export const getUserInfoAPI = () => {
  return axios({
    // method: 'GET',// method不写就是默认get
    url: '/my/userinfo',
    // 传参也可以用headers，要看接口的要求
    headers: {
      // this.$store.state.toke这个文件不是vue组件，所以拿不到
      Authorization: store.state.token
    }
  })
}
/**
 * @Description: 封装请求侧边栏数据
 * @author topu
 * @date 2022/9/12
*/
export const getMenusAPI = () => {
  return axios({
    url: '/my/menus',
    headers: {
      Authorization: store.state.token
    }
  })
}
/**
 * @Description: 更新用户信息
 * @author topu
 * @date 2022/9/14
*/
// 这个传参也是解构赋值
/* 关闭eslint的命名规则 */
// eslint-disable-next-line camelcase
export const updateUserInfo = ({ id, email, username, nickname, user_pic }) => {
  axios({
    method: 'PUT', // PUT表示修改
    url: '/my/userinfo',
    data: {
      id,
      email,
      username,
      user_pic,
      nickname
    }
  })
}

/**
 * @Description: 更新头像接口
 * @author topu
 * @date 2022/9/14
*/
export const updateAvatarAPI = (avatar) => {
  return axios({
    method: 'PATCH', // 更新数据
    url: '/my/update/avatar',
    data: {
      avatar
    }
  })
}
/**
 * @Description: 修改密码的接口
 * @author topu
 * @date 2022/9/15
*/
// eslint-disable-next-line camelcase
export const updatePwdAPI = ({ old_pwd, new_pwd, re_pwd }) => {
  return axios({
    method: 'PATCH',
    url: '/my/updatepwd',
    data: {
      old_pwd,
      new_pwd,
      re_pwd
    }
  })
}
/**
 * @Description: 获取文章数据
 * @author topu
 * @date 2022/9/15
*/
export const getArtCateListAPI = () => {
  return axios({
    method: 'GET',
    url: '/my/cate/list'
  })
}
/**
 * @Description: 添加文章
 * @author topu
 * @date 2022/9/16
*/
// eslint-disable-next-line camelcase
export const addArtCateAPI = ({ cate_alias, cate_name }) => {
  return axios({
    method: 'POST',
    url: '/my/cate/add',
    data: {
      cate_name,
      cate_alias
    }
  })
}

/**
 *修改分类内容的API
 * @returns {*}
 */
// eslint-disable-next-line camelcase
export const updataArtCateAPI = ({ id, cate_alias, cate_name }) => {
  return axios({
    method: 'PUT', // 更新数据
    url: '/my/cate/info',
    data: {
      id,
      cate_name,
      cate_alias
    }
  })
}
/**
 * 删除分类
 *
 */
export const DeleteartlistAPI = (id) => {
  return axios({
    method: 'DELETE',
    url: '/my/cate/del',
    // 传参的方式要看接口文档
    params: {
      id
    }
  })
}

export const uploadArticleAPI = (fd) => {
  return axios({
    url: '/my/article/add',
    method: 'POST',
    data: fd // 参数的传递要求是表单对象 ，不是普通对象
  })
}
/**
 * 获取文章列表
 *
 */
// eslint-disable-next-line camelcase
export const getArticleListAPI = ({ pagenum, pagesize, cate_id, state }) => {
  return axios({
    url: '/my/article/list',
    params: {
      pagenum,
      pagesize,
      cate_id,
      state
    }
  })
}
/**
 * 获取文章详情列表
 * @param id
 * @returns {*}
 */
export const getArticleDetailFn = (id) => {
  return axios({
    url: '/my/article/info',
    params: {
      id
    }
  })
}
/**
 * 删除文章的接口
 * @param id
 * @returns {*}
 * @constructor
 */
export const DeleteArticleAPI = (id) => {
  return axios({
    url: '/my/article/info',
    method: 'DELETE',
    params: {
      id
    }
  })
}
