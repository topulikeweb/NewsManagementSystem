<template>
  <el-container class="main-container">
    <!-- 头部区域 -->
    <el-header>
      <!-- 左侧的 logo -->
      <img src="../../../public/img/guimietouxian2.webp" alt="" style="width: 150px;height: 70px;transform: translateY(0px)" />
      <!-- 右侧的菜单 -->
      <el-menu
        default-active="this.$route.path"
        class="el-menu-top"
        mode="horizontal"
        background-color="#23262E"
        text-color="#fff"
        active-text-color="#409EFF"
      >
        <el-submenu index="1">
          <template slot="title">
            <!-- 头像 -->
            <img src="../../../public/img/guimietouxiang.jpeg" alt="" class="avatar" style="width: 30px;height: 30px;overflow: hidden"/>
            <span>个人中心</span>
          </template>
          <el-menu-item index="1-1"><i class="el-icon-s-operation"></i>基本资料</el-menu-item>
          <el-menu-item index="1-2"><i class="el-icon-camera"></i>更换头像</el-menu-item>
          <el-menu-item index="1-3"><i class="el-icon-key"></i>重置密码</el-menu-item>
        </el-submenu>
        <el-menu-item index="2"><i class="el-icon-switch-button" @click="quitFn"></i>退出</el-menu-item>
      </el-menu>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <!-- 侧边栏区域 -->
<!--      侧边栏用户信息区域  -->
        <el-aside width="80px">
          <div class="user-box">
            <img :src="user_pic" alt="" v-if="user_pic" />
            <img src="" alt="" v-else />
            <span>欢迎 {{ nickname || username }}</span>
          </div>
        </el-aside>
        <!-- 左侧导航菜单 -->
        <!--         组件上的属性，限制同一时间只能打开一个标签，后面没跟boolean就代表true-->
<!--        default-active 表示设置首页路由路径 router表示开启路由模式-->
        <!--也可以location.window.href获取当前路由-->
        <el-menu
          default-active="this.$route.path"
          class="el-menu-vertical-demo"
          background-color="#23262E"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          router
          >
          <template v-for="item in menus">
            <!-- 不包含子菜单的“一级菜单” -->
            <el-menu-item :index="item.indexPath" :key="item.indexPath" v-if="!item.children">
              <i :class="item.icon"></i>{{ item.title }}
            </el-menu-item>

            <!-- 包含子菜单的“一级菜单” -->
            <el-submenu :index="item.indexPath" :key="item.indexPath" v-else>
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{ item.title }}</span>
              </template>
              <!-- 循环渲染“二级菜单” -->
              <el-menu-item :index="subItem.indexPath" v-for="subItem in item.children" :key="subItem.indexPath">
                <i :class="subItem.icon"></i>{{ subItem.title }}
              </el-menu-item>
            </el-submenu>
          </template>
<!--          <el-submenu index="/my">-->
<!--            <template slot="title">-->
<!--              <i class="el-icon-s-tools"></i>-->
<!--              <span>个人中心</span>-->
<!--            </template>-->
<!--            <el-menu-item index="my1"-->
<!--            ><i class="el-icon-star-on"></i>1</el-menu-item-->
<!--            >-->
<!--            <el-menu-item index="my2"-->
<!--            ><i class="el-icon-star-on"></i>2</el-menu-item-->
<!--            >-->
<!--          </el-submenu>-->
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 页面主体区域 -->
        <el-main>
          <router-view></router-view>
        </el-main>
        <!-- 底部 footer 区域 -->
        <el-footer>© www.itheima.com - 黑马程序员</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getMenusAPI } from '@/api'

export default {
  name: 'my-layout',
  data () {
    return {
      menus: []
    }
  },
  methods: {
    // 我们在组件上的click ，input之类的方法不一定是原生的方法，如果不是，要在后面加native
    // 变成原生的方法
    quitFn () {
      // 询问用户是否退出登录 配合element-ui使用的
      this.$confirm('您确认退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 执行确定时的操作
        // 先清空token,直接联系mutations
        this.$store.commit('updateToken', '')
        this.$store.commit('updateToken', '')// 将用户信息清空
        this.$router.push('/login')
      }).catch(err => {
        console.log(err.message)
      })
    },
    async getMenusListFn () {
      const { data: res } = await getMenusAPI()
      console.log(res)
      this.menus = res.data // 这里要注意，不要把等号写反了
      // console.log(this.menus)
    }
  },
  computed: {
    ...mapGetters(['nickname', 'username', 'user_pic'])
  },
  created () {
    this.getMenusListFn()
  }
}
</script>

<style  lang="less" scoped>
.main-container {
  height: 100%;
  .el-header,
  .el-aside {
    background-color: #23262e;
  }
  .el-header {
    padding: 0;
    display: flex;
    justify-content: space-between;
  }
  .el-main {
    overflow-y: scroll;
    height: 0;
    background-color: #F2F2F2;
  }
  .el-footer {
    background-color: #eee;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.avatar {
  border-radius: 50%;
  width: 35px;
  height: 35px;
  background-color: #fff;
  margin-right: 10px;
  object-fit: cover;
}
.user-box {
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  user-select: none;
  float: left;
  width: 80px;
  img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: #fff;
    margin-right: 15px;
    object-fit: cover;
  }
  span {
    color: white;
    font-size: 12px;
  }
}
</style>
