<template>
  <!-- 登录页面的整体盒子 -->
  <div class="login-container">
    <!-- 登录的盒子 -->
    <div class="login-box">
      <!-- 标题的盒子 -->
      <div class="title-box"></div>
      <!-- 登录的表单区域 -->
      <el-form :model="loginForm" :rules="loginRules" ref="loginRef">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名"
                    maxlength="10" minlength="1"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            maxlength="15"
            minlength="6"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn-login"  @click="loginIN">登录</el-button>
          <el-link type="info" @click="$router.push('/register')">去注册
          </el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { loginin } from '@/api'
import { mapMutations } from 'vuex'// 引入mapMutations
export default {
  name: 'my-login',
  // 登录表单的数据对象
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      // 登录表单的验证规则对象
      loginRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            pattern: /^[a-zA-Z0-9]{1,10}$/,
            message: '用户名必须是1-10的字母数字',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            pattern: /^\S{6,15}$/,
            message: '密码必须是6-15的非空字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    ...mapMutations(['updateToken']), // 更新token令牌
    loginIN () {
      // 先判断是否为空
      this.$refs.loginRef.validate(async valid => {
        if (valid) {
          console.log(this.loginForm)
          const { data: res } = await loginin(this.loginForm)
          if (res.code !== 0) {
            return this.$message.error('登陆失败')
          } else {
            this.$message.success('登陆成功')
            // 但是vuex储存是在浏览器里面，刷新就没有了
            this.updateToken(res.token)

            await this.$router.push('/') // 登陆成功后跳转到首页（layout）
          }
        } else {
          this.$message.error('输入不能为空')
        }
      })
    }
  },
  created () {
    // 绑定点击空格登录，因为在页面无法绑定，只有在created函数上面绑定
    document.onkeydown = (e) => {
      if (e.keyCode === 13) {
        this.loginIN()
      }
    }
  }
}

</script>

<style scoped lang="less">
.login-container {
  background: url('../../../public/img/guimie.jpeg') center;
  background-size: cover;
  height: 100%;

  .login-box {
    width: 400px;
    height: 270px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 0 30px;
    box-sizing: border-box;

    .title-box {
      height: 60px;
      //background: url('') center no-repeat;
    }

    .btn-login {
      width: 100%;
    }
  }
}
</style>
