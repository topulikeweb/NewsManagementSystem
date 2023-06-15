<template>
  <!-- 注册页面的整体盒子 -->
  <div class="reg-container">
    <!-- 注册的盒子 -->
    <div class="reg-box">
      <!-- 标题的盒子 -->
      <div class="title-box"></div>
      <!-- 注册的表单区域 -->
      <el-form :model="form" ref="form" :rules="rulesObj">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="form.username"
                    placeholder="请输入用户名"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password"
                    placeholder="请输入密码"></el-input>
        </el-form-item>
        <!-- 确认密码 -->
        <el-form-item prop="repassword">
          <el-input v-model="form.repassword" type="password"
                    placeholder="请再次确认密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn-reg" @click="regNewUserFn">注册</el-button>
          <el-link type="info" @click="$router.push('/login')">去登录</el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 整个页面的结构和代码是跟据element-ui的结构来写的
import { registerAPI } from '@/api'

export default {
  name: 'my-register',
  data () {
    // 这个函数只能写在data中，不然无法获取到form表单里面的值
    const samePwFn = (rule, value, callback) => {
      if (value !== this.form.password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      form: {
        username: '',
        password: '',
        repassword: ''
      },
      rulesObj: {
        username: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        },
        {
          partten: '/^[a-zA-Z0-9]{1,10}$/',
          message: '长度在3到5个字符之间',
          trigger: 'blur'
        }
        ],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        },
        {
          pattern: /^\S{6,15}$/,
          message: '密码必须是6-15的非空字符',
          trigger: 'blur'
        }
        ],
        repassword: [
          {
            required: true,
            message: '请确认密码',
            trigger: 'blur'
          },
          {
            validator: samePwFn,
            trigger: 'blur'
          }// validator自定义一个事件，然后失去焦点的时候就会调用samePwFn函数
        ]
      }
    }
  },
  methods: {
    regNewUserFn () {
      this.$refs.form.validate(async (vaild) => {
        if (vaild) {
          // 通过判断拿到数据
          // console.log(this.form)
          // es6语法将请求返回的数据对象里面的data数据赋值给res，意思是res=registerAPI(this.form).data
          const { data: res } = await registerAPI(this.form)
          console.log(res)
          // 当请求失败
          if (res.code !== 0) {
            // element-ui在vue的原型链上面绑定了$message
            return this.$message.error('注册失败')// 这个是在上框弹
          } else {
            this.$message.success(res.message)
            // 跳转到登陆页面
            await this.$router.push('/login')
          }
        } else {
          return false
        }
      })
    },
    resetForm () {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style scoped>
.reg-container {
  background: url('../../../public/img/guimie.jpeg') center;
  background-size: cover;
  height: 100%;
}

.reg-box {
  width: 400px;
  height: 335px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 0 30px;
  box-sizing: border-box;
}

.title-box {
  height: 60px;
  /*background: url() center no-repeat;*/
}

.btn-reg {
  width: 100%;
}

</style>
