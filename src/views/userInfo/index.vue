<template>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本资料</span>
      </div>
      <!-- 表单 -->
      <el-form
        :model="userForm"
        :rules="userFormRules"
        ref="userFormRef"
        label-width="100px"
      >
        <el-form-item label="登录名称" prop="username">
          <el-input v-model="userForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickname">
          <el-input
            v-model="userForm.nickname"
            minlength="1"
            maxlength="10"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="userForm.email"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitFn">提交修改</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
</template>

<script>
import { updateUserInfo } from '@/api'

export default {
  name: 'my_userInfo',
  data () {
    return {
      userForm: {
        username: this.$store.state.userInfo.username, // 用户名默认登录的
        nickname: '',
        email: '',
        user_pic: '', // 用户头像地址
        id: ''
      },
      // 对表单数据进行验证
      userFormRules: {
        nickname: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { pattern: /^\S{1,10}$/, message: '昵称必须是1-10位的非空字符串', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitFn () {
      this.$refs.userFormRef.validate(async valid => {
        if (valid) {
          console.log(this.userForm)
          // 根据接口文档显示，必须要携带id
          this.userForm.id = this.$store.state.userInfo.id
          // 将修改的数据传给后端
          const { data: res } = await updateUserInfo(this.userForm)
          if (res.code !== 0) {
            return this.$message.error('更新失败')
          }
          this.$message.success('更新成功')
          await this.$store.dispatch('initUserInfo')
          console.log(this.userForm.nickname)
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.el-form {
  width: 500px;
}
</style>
