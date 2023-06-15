<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文章列表</span>
      </div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="q">
          <el-form-item label="文章分类">
            <el-select v-model="q.cate_id" placeholder="请选择分类"
                       size="small">
              <el-option :label="item.cate_name" :value="item.id"
                         v-for="item in cateList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left: 15px;">
            <el-select v-model="q.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="initArtListFn">筛选
            </el-button>
            <el-button type="info" size="small" @click="reinitFn">重置
            </el-button>
          </el-form-item>
        </el-form>
        <!-- 发表文章的按钮 -->
        <el-button type="primary" size="small" class="btn-pub"
                   @click="pubDialogVisible=true">发表文章
        </el-button>
        <!-- 发表文章的 Dialog 对话框 -->
        <el-dialog title="发表文章" :visible.sync="pubDialogVisible"
                   fullscreen :before-close="handleClose">
          <!-- 发布文章的对话框 -->
          <el-form :model="pubForm" :rules="pubFormRules" ref="pubFormRef"
                   label-width="100px">
            <el-form-item label="文章标题" prop="title">
              <el-input v-model="pubForm.title"
                        placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="文章分类" prop="cate_id">
              <el-select v-model="pubForm.cate_id" placeholder="请选择分类"
                         style="width: 100%;">
                <el-option :label="item.cate_name" :value="item.id"
                           v-for="item in cateList" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
            <quill-editor v-model="pubForm.content"></quill-editor>
            <!--其实富文本编辑器就是一个input框，只是更加美观-->
            <!--显示文章封面-->
            <el-form-item label="文章封面">
              <!-- 用来显示封面的图片 -->
              <img :src="pubForm.cover_img" alt="" class="cover-img"
                   ref="imgRef"/>
              <br/>
              <!-- 文件选择框，默认被隐藏 -->
              <input type="file" style="display: none;" accept="image/*"
                     ref="iptFileRef" @change="OnCoverChangeFn"/>
              <!-- 选择封面的按钮 -->
              <el-button type="text" @click="chooseImg">+ 选择封面</el-button>
            </el-form-item>
            <!--发表文章的按钮-->
            <el-form-item>
              <el-button type="primary" @click="pubArticleFn('已发布')">发布
              </el-button>
              <el-button type="info" @click="pubArticleFn('草稿')">存为草稿
              </el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
      <!-- 文章表格区域 -->
      <el-table :data="artList" style="width: 100%;" border stripe>
        <el-table-column label="文章标题" prop="title">
          <!--   点击标题进入文章详情       -->
          <template v-slot="{row:row}"><!--完整写法 ,{}的意思是相当于解构赋值，将scope的row属性赋值给{row}，row就是scope.row ,是这个属性集合成的对象-->
            <el-link @click="showDetailFn(row.id)">{{ row.title }}</el-link>
          </template>

        </el-table-column>
        <el-table-column label="分类" prop="cate_name"></el-table-column>
        <el-table-column label="发表时间" prop="pub_date">
          <!--格式化发表时间-->
          <template v-slot="{row}">
            <!--这里的{row}表示获取当前行的所有数据，以对象的形式存在，用scope也可以-->
            <span>{{ $formatDate(row.pub_date) }}</span><!--获取属性对象上面的pub_date-->
          </template>

        </el-table-column>
        <el-table-column label="状态" prop="state"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="{row}">
            <el-button @click="removeFn(row.id)" type="danger"
                       size="min">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
    </el-card>
    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChangeFn"
      @current-change="handleCurrentChangeFn"
      :current-page.sync="q.pagenum"
      :page-sizes="[2, 3, 5, 7,10]"
      :page-size.sync="q.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 查看文章详情的对话框 -->
    <el-dialog title="文章预览" :visible.sync="detailVisible" width="80%">
      <h1>{{ artDetail.title }}</h1>
      <div class="info">
        <span>作者：{{ artDetail.nickname || artDetail.username }}</span>
        <span>发布时间：{{ $formatDate(artDetail.pub_date) }}</span>
        <span>所属分类：{{ artDetail.cate_name }}</span>
        <span>状态：{{ artDetail.state }}</span>
      </div> <!-- 分割线 -->
      <el-divider></el-divider>

      <!-- 文章的封面 -->
      <img :src="baseURL + artDetail.cover_img" alt=""/>

      <!-- 文章的详情 -->
      <div v-html="artDetail.content" class="detail-box"></div>
    </el-dialog>
  </div>
</template>

<script>
import {
  DeleteArticleAPI,
  getArtCateListAPI,
  getArticleDetailFn,
  getArticleListAPI,
  uploadArticleAPI
} from '@/api'
import defaultImg from '../../../public/img/guimie.jpeg' // 引入默认封面图片的地址
import myAxios from '@/utils/request' // 这里引用基地址，因为请求到的图片的地址只有一半，所以要进行拼接
export default {
  name: 'my_article',
  data () {
    return {
      q: {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
      },
      pubDialogVisible: false, // 控制添加表格是否显示
      // 发布文章的表单
      pubForm: {
        title: '', // 文章标题
        cate_id: '', // 文章分类
        content: '', // 文章内容
        cover_img: null, // 储存用户选择头像图片的url地址
        state: '' // 储存文章发表状态
      },
      cateList: [], // 文章分类
      artList: [], // 文章列表
      total: 0, // 总数据条数
      detailVisible: false, // 控制文章详情对话框的显示与隐藏
      artDetail: {}, // 文章的详情信息对象
      baseURL: myAxios(), // 基地址

      pubFormRules: { // 表单的验证规则对象
        title: [
          {
            required: true,
            message: '请输入文章标题',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 30,
            message: '文章标题的长度为1-30个字符',
            trigger: 'blur'
          }
        ],
        cate_id: [{
          required: true,
          message: '请选择文章标题',
          trigger: 'blur'
        }],
        content: [{
          required: true,
          message: '请输入内容',
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    /**
     * 关闭添加文本框时进行的回调
     */
    async handleClose (done) {
      // 因为这里$confirm返回的是promise对象
      const userResult = await this.$confirm('你确定要关闭吗？').catch(err => err)
      // console.log(userResult)// 确定返回comfirm，取消返回cancel
      if (userResult === 'cancel') {
        // 如果用户取消的话就什么也不干
      } else {
        done() // 用户确定的话就继续向下执行
      }
    },
    // 初始化文章分类的列表数据
    async initCateList () {
      const { data: res } = await getArtCateListAPI()
      if (res.code === 0) {
        // console.log(res.data)
        this.cateList = res.data
        // console.log(this.cateList)
      }
    },
    // 模拟文件选择框的点击事件
    chooseImg () {
      // console.log(this.$refs.iptFileRef) // 获得文件选择框的对象
      this.$refs.iptFileRef.click()// 我获取了文件的对象，然后给他模拟一个点击事件
    },
    /**
     *
     * 用户确定文件的时候进行的操作，以及图片展示问题
     * @param e
     * @constructor
     */
    OnCoverChangeFn (e) {
      // 获取用户点击的文件列表
      const files = e.target.files
      // 如果用户没有选中图片
      if (files.length === 0) {
        // 用户没有选择封面
        this.pubForm.cover_img = null
        this.$refs.imgRef.setAttribute('src', defaultImg)
      } else {
        this.pubForm.cover_img = files[0] // 将文件第一个设为头像的url
        const url = URL.createObjectURL(files[0])// 转换为url格式
        this.$refs.imgRef.setAttribute('src', url)// 设置src属性，并赋值url
      }
    },
    // 发布和存草稿的点击事件
    /**
     * 这里需要注意的是，当我们像接口传递对象的时候，我们key要和后端文档相同
     * @param state
     */
    pubArticleFn (state) { // 设置发布状态
      this.pubForm.state = state
      this.$refs.pubFormRef.validate(async value => {
        if (!value) {
          this.$message.error('文章内容不能为空')
        }
        if (!this.pubForm.cover_img) {
          this.$message.error('请选择文章封面')
        }
        const fd = new FormData()// 创建表单对象
        // Object.keys()遍历对象，返回的是对象里面的key的数组，然后foreach遍历key的数组返回每个key，然后以键值对的形式加入到fd对象里面
        Object.keys(this.pubForm).forEach((key) => {
          fd.append(key, this.pubForm[key])
          // console.log(fd.get('content'))
        })
        const { data: res } = await uploadArticleAPI(fd)
        if (res.code !== 0) {
          this.$message.error('发布文章失败')
          // eslint-disable-next-line no-unreachable
          // console.log('发表文章', res)
        }
        this.$message.success('发布文章成功')
        this.pubDialogVisible = false// 关闭对话框
        await this.initArtListFn()// 获取文章列表
      })
    },
    // 获取文章列表
    async initArtListFn () {
      const { data: res } = await getArticleListAPI(this.q)
      if (res.code !== 0) {
        this.$message.error('获取文章列表失败')
      } else {
        this.$message.success('获取文章列表成功')
        this.artList = res.data
        this.total = res.total
        // console.log('22', this.q)
        console.log('qqq', this.artList)
      }
    },
    // 监听pagesize(每页多少条消息)发生变化，这个方法是查看element-ui文档
    handleSizeChangeFn (newsize) {
      this.q.pagesize = newsize
      // 默认展示第一页数据
      this.q.pagenum = 1
      // 请求数据
      this.initArtListFn()
    },
    handleCurrentChangeFn (newpage) {
      // 重新给页数赋值
      this.q.pagenum = newpage
      // 重新获取数据
      this.initArtListFn()
    },
    // 重置按钮
    reinitFn () {
      this.q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
      }
      // 重新获取文章列表
      this.initArtListFn()
    },
    async showDetailFn (id) {
      const { data: res } = await getArticleDetailFn(id)
      if (res.code !== 0) {
        return this.$message.error('获取文章详情失败')
      } else {
        this.$message.success('获取文章详情成功')
        this.artDetail = res.data // 将获取的数据传给artDetail保存
        this.detailVisible = true// 将文章详情框显示
      }
    },
    async removeFn (id) {
      const confirmResult = await this.$confirm('你确定要删除吗?')
      // 用户点取消，就什么也不操作
      if (confirmResult === 'cancel') return
      // 用户点击确定
      const { data: res } = await DeleteArticleAPI(id)
      if (res.code !== 0) {
        this.$message.error('删除失败')
        console.log(res)// 打印错误原因
      }
      this.$message.success('删除成功')
      await this.reinitFn()
    }
  },
  created () {
    this.initCateList()
    this.initArtListFn()
  }
}
</script>

<style scoped lang="less">
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  .btn-pub {
    margin-top: 5px;
  }
}

el-input {
  width: 400px;
}

// 原因这里有scoped，所以scoped会给.quill-editor加上一个[data-v-hash],但是quill，只能选择当前页面标签或者组件的根标签
//因为 .ql-editor这个标签是我们引用的第三方组件库，我们要修改他就要找到他的根标签或者就只有穿透
// 所以加了::v-deep空格前置的话, 选择器就会变成如下形式  [data-v-hash] .ql-editor 这样就能选中组件内的标签的class类名了
// 这个就是穿透
::v-deep .ql-editor {
  min-height: 300px; // 设置最小高度为300px，大于300px后会被撑大
}

::v-deep .el-pagination {
  margin: 20px auto;
  //height: 200px;
}
</style>
