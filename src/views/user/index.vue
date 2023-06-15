<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>更换头像</span>
    </div>
    <div>
      <!-- 图片，用来展示用户选择的头像 -->
      <img class="the_img" v-if="!this.avatar" src="" alt=""/>
      <img class="the_img" v-else :src="this.avatar" alt="">

      <!-- 按钮区域 -->
      <div class="btn-box">
        <input type="file" accept="image/*" style="display: none" ref="iptRef"
               @change="onFileChange"/>
        <el-button type="primary" icon="el-icon-plus" @click="chooseImg">
          选择图片
        </el-button>
        <el-button type="success" icon="el-icon-upload"
                   :disabled="avatar === ''">上传头像
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<script>

import { updateAvatarAPI } from '@/api'

export default {
  name: 'userAvatar',
  data () {
    return {
      avatar: ''
    }
  },
  methods: {
    chooseImg () {
      this.$refs.iptRef.click()
    },
    /**
     * @Description: 将文件转换为图片的url，渲染到页面上
     * @author topu
     * @date 2022/9/14
     */
    onFileChange (e) {
      // const { data: res } = updateUserInfo()
      // if (res.code !== 0) return this.$message.error('上传错误')
      const files = e.target.files
      if (files.length === 0) {
        // 当用户没有选择照片的时候
        this.avatar = ''
      } else {
        // 创建FileReader对象
        const fl = new FileReader()
        fl.readAsDataURL(files[0])// 读取文件内容，输出data：url格式的字符串
        fl.onload = async (e) => {
          this.avatar = e.target.result
          const { data: res } = await updateAvatarAPI(this.avatar)// 将头像的地址通过PATCH更新
          if (res.code !== 0) {
            this.$message.error('更新头像失败')
          } else {
            await this.$store.dispatch('initUserInfo')
            this.$message.success('修改成功')
            console.log(this.avatar)
          }
        }
      }
    }
  }
}
</script>

<style scoped long="less">
.btn-box {
  margin-top: 10px;
}

.preview {
  object-fit: cover;
}

.the_img {
  width: 350px;
  height: 350px;
}

</style>
