<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix header-box">
        <span>文章分类</span>
        <el-button type="primary" size="mini" @click="addVisible=true">添加分类</el-button>
      </div>
      <el-table style="width: 100%" :data="artList" border stripe>
        <el-table-column
          label="序号"
          type="index"
          width="100"
        ></el-table-column>
        <el-table-column label="分类名称" prop="cate_name"></el-table-column>
        <el-table-column label="分类别名" prop="cate_alias"></el-table-column>
        <el-table-column label="操作">
<!--作用域插槽 scope是一个对象有一个key为row scope：{row：行属性}-->
          <template v-slot="scope">
          <el-button type="primary" size="mini" @click="reWrite(scope.row)">修改</el-button><!--获取每一行的属性-->
          <el-button type="danger" size="mini" @click="deleteFn(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog :title="isEdit?'编辑文章分类':'增加文章分类'" :visible.sync="addVisible" width="35%" @close="onAddClosedFn"><!--close意思是对话框关闭后触发-->
      <el-form :model="addForm" :rules="addRules" ref="addRef" label-width="80px">
        <el-form-item label="分类名称" prop="cate_name">
          <el-input v-model="addForm.cate_name" minlength="1" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="cate_alias">
          <el-input v-model="addForm.cate_alias" minlength="1" maxlength="15"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="addVisible=false">取 消</el-button>
        <el-button size="mini" type="primary" @click="addFn">添 加</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  addArtCateAPI,
  DeleteartlistAPI,
  getArtCateListAPI,
  updataArtCateAPI
} from '@/api'

export default {
  name: 'my_artCate',
  data () {
    return {
      artList: [], // 请求到的文件放到这个集合
      addVisible: false, // 先将添加分类的对话框隐藏
      addForm: {
        cate_alias: '', // 分类别名
        cate_name: ''// 分类名称
      },
      editId: '', // 要修改的id
      isEdit: false, // 是否处于编辑状态
      addRules: { // 添加表单的验证规则对象
        cate_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          },
          {
            pattern: /^\S{1,10}$/,
            message: '分类名必须是1-10位的非空字符',
            trigger: 'blur'
          }
        ],
        cate_alias: [
          {
            required: true,
            message: '请输入分类别名',
            trigger: 'blur'
          },
          {
            pattern: /^[a-zA-Z0-9]{1,15}$/,
            message: '分类别名必须是1-15位的字母数字',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 请求列表数据，并将数据选渲染
    async initCateListFn () {
      const { data: res } = await getArtCateListAPI()
      this.artList = res.data
    },
    /**
     *添加分类
     */
    addFn () {
      // 表单预检验,防止没有输入数据
      this.$refs.addRef.validate(async valid => {
        if (valid) {
          if (this.isEdit) {
            // 调用编辑的方法
            const { data: res } = await updataArtCateAPI({ id: this.editId, ...this.addForm })
            if (res.code !== 0) {
              this.$message.error('修改失败')
            } else {
              this.$message.success('更新成功')
            }
            // 当不处与编辑状态下的时候，开始新增的时候
          } else {
            const { data: res } = await addArtCateAPI(this.addForm)
            if (res.code !== 0) {
              this.$message.error('添加文章失败')
            } else {
              this.$message.success('添加文章成功')
            }
          }
          await this.initCateListFn()// 当我操作完成后，将后台的数据重新渲染
          this.addVisible = false
        } else {
          return false
        }
      })
    },
    onAddClosedFn () {
      this.$refs.addRef.resetFields() // 清空表单数据
    },
    // 修改内容
    reWrite (obj) {
      this.editId = obj.id// 得到编辑对象的id
      this.isEdit = true// 改为可编辑状态
      this.addVisible = true // 让弹窗显示
      // (数据回填)
      this.addForm.cate_alias = obj.cate_alias
      this.addForm.cate_name = obj.cate_name
    },
    /**
     * 这里为什么要用async和await？因为 axios返回的是promise对象，如果用resolve和reject的话可读性就很差，为了可读性
     * 就是用了async和await
     * @param
     * @returns {Promise<void>}
     */
    async deleteFn (id) {
      const { data: res } = await DeleteartlistAPI(id)
      if (res.code !== 0) {
        this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      await this.initCateListFn() // 重新渲染数据
    }
  },
  created () {
    this.initCateListFn()
  }
}
</script>

<style scoped lang="less">
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

</style>
