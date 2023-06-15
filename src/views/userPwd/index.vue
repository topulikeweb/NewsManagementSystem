<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>重置密码</span>
    </div>
    <!-- 表单 -->
    <el-form :model="pwdForm" :rules="pwdFormRules" ref="pwdFormRef"
             label-width="100px">
      <el-form-item label="原密码" prop="old_pwd">
        <el-input v-model="pwdForm.old_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="new_pwd">
        <el-input v-model="pwdForm.new_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="re_pwd">
        <el-input v-model="pwdForm.re_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updatePwdFn">修改密码</el-button>
        <el-button @click="resetPwd">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { updatePwdAPI } from '@/api'

export default {
  name: 'my_userPwd',
  data () {
    // 添加自定义函数，增加校验规则，（自定义函数的格式）
    // 校验密码是否输入正确
    const samePwd = (rule, value, callback) => {
      // value就是这个表单输入的数据
      if (value === this.pwdForm.old_pwd) {
        return callback(new Error('和原密码相同'))
      } else {
        callback()
      }
    }
    const rePwd = (rule, value, callback) => {
      if (value !== this.pwdForm.re_pwd) {
        return callback(new Error('两次密码输入不相同'))
      } else {
        callback()
      }
    }
    return {
      pwdForm: {
        old_pwd: '', // 旧密码
        new_pwd: '', // 新密码
        re_pwd: ''// 确认密码
      },
      // 表单的验证规则对象
      pwdFormRules: {
        old_pwd: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            pattern: /^\S{6,15}$/,
            message: '密码长度必须是6-15位的非空字符串',
            trigger: 'blur'
          }
        ],
        new_pwd: [
          {
            required: true,
            message: '请输入新密码',
            trigger: 'blur'
          },
          {
            pattern: /^\S{6,15}$/,
            message: '密码长度必须是6-15位的非空字符串',
            trigger: 'blur'
          },
          {
            validator: samePwd,
            trigger: 'blur'
          }
        ],
        re_pwd: [
          {
            required: true,
            message: '请再次确认新密码',
            trigger: 'blur'
          },
          {
            pattern: /^\S{6,15}$/,
            message: '密码长度必须是6-15位的非空字符串',
            trigger: 'blur'
          },
          {
            validator: rePwd,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    updatePwdFn () {
      this.$refs.pwdFormRef.validate(async vaild => {
        if (!vaild) {
          return false
        }
        const { data: res } = await updatePwdAPI(this.pwdForm)
        console.log(res)
        if (res.code !== 0) {
          return this.$message.error('修改失败')
        } else {
          return this.$message.success('修改成功')
          // eslint-disable-next-line no-unreachable
          this.$refs.pwdFormRef.resetFields()// element-ui自定义方法清除表单数据
        }
      })
    },
    resetPwd () {
      this.$refs.pwdFormRef.resetFields()
    }
  }
}
</script>

<style scoped lang="less">
.el-form {
  width: 500px;
}

</style>
