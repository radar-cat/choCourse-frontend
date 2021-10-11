<template>
  <div class="main_welcome">
    <h3>点击按钮修改所有用户的选课限额：</h3>
    <!-- 修改选课限额按钮 -->
    <el-button
      type="primary"
      icon="el-icon-edit"
      @click="showEditDialog()"
    ></el-button>
    <!-- 修改课程对话框 -->
    <el-dialog
      title="修改课程信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @colse="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <!-- 选课限额 -->
        <el-form-item label="选课限额" prop="limit">
          <el-input v-model="editForm.limit"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserLimit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style lang="less" scoped></style>
<script>
export default {
  data() {
    return {
      // 修改课程信息
      editForm: {
        limit: '',
      },
       // 控制修改课程对话框显示/隐藏
      editDialogVisible: false,
      // 修改课程表单验证规则
      editFormRules: {
        limit: [{ required: true, message: '请输入选课限额', trigger: 'blur' }],
      },
    }
  },
  methods: {
    // 展示修改框
    async showEditDialog() {
      //   const { data: res } = await this.$http.get('/app/get_update_course?id=' + id)
      //   this.editForm = res.data
      this.editDialogVisible = true
    },
    // 关闭窗口
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 确认修改
    editUserLimit() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        // 发起请求
        const { data: res } = await this.$http.post(
          '/app/edit_limit?limit=' + this.editForm.limit
        )
        if (res.data != 'success') return this.$message.error('操作失败！！！')
        this.$message.success('操作成功！！！')
        //隐藏
        this.editDialogVisible = false
      })
    },
  },
}
</script>
