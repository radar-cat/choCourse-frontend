<template>
  <div>
    <!-- 卡片视图区 -->
    <el-card>
      <el-row :gutter="25">
        <el-col :span="10">
          <!-- 搜索添加 -->
          <el-input
            placeholder="请输入课程名称关键字"
            v-model="query"
            clearable
            @clear="getCourseList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getSearchCourse"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加课程</el-button
          >
        </el-col>
      </el-row>
      <!-- 课程列表 -->
      <el-table
        :data="
          courselist === []
            ? courselist
            : courselist.slice(
                (currentPage - 1) * pageSize,
                currentPage * pageSize
              )
        "
        border
        stripe
      >
        <el-table-column label="编号" prop="id" type="index"></el-table-column>
        <el-table-column label="课程名称" prop="name"></el-table-column>
        <el-table-column label="学分" prop="counts"></el-table-column>
        <el-table-column label="任课教师" prop="teacher"></el-table-column>
        <el-table-column label="课程详情" prop="details"></el-table-column>
        <el-table-column label="课程余量" prop="stock"></el-table-column>
        <el-table-column label="开始时间" prop="start_date"></el-table-column>
        <el-table-column label="结束时间" prop="end_date"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteCourse(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[1, 5, 10, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total"
      >
      </el-pagination>
    </el-card>

    <!-- 创建新课程对话框 -->
    <el-dialog
      title="添加课程"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <!-- 课程名 -->
        <el-form-item label="课程名" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <!-- 学分 -->
        <el-form-item label="学分" prop="counts">
          <el-input v-model="addForm.counts"></el-input>
        </el-form-item>
        <!-- 教师 -->
        <el-form-item label="授课教师" prop="teacher">
          <el-input v-model="addForm.teacher"></el-input>
        </el-form-item>
        <!-- 详情 -->
        <el-form-item label="课程详情" prop="details">
          <el-input v-model="addForm.details"></el-input>
        </el-form-item>
        <!-- 开始时间 -->
        <el-form-item label="选课开始时间" prop="start_date">
          <el-input v-model="addForm.start_date"></el-input>
        </el-form-item>
        <!-- 结束时间 -->
        <el-form-item label="选课结束时间" prop="end_date">
          <el-input v-model="addForm.end_date"></el-input>
        </el-form-item>
        <!-- 余量 -->
        <el-form-item label="课程余量" prop="stock">
          <el-input v-model="addForm.stock"></el-input>
        </el-form-item>
      </el-form>
      <!-- 内容底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCourse">确 定</el-button>
      </span>
    </el-dialog>
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
        <!-- 课程名 -->
        <el-form-item label="课程名" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <!-- 学分 -->
        <el-form-item label="学分" prop="counts">
          <el-input v-model="editForm.counts"></el-input>
        </el-form-item>
        <!-- 教师 -->
        <el-form-item label="授课教师" prop="teacher">
          <el-input v-model="editForm.teacher"></el-input>
        </el-form-item>
        <!-- 详情 -->
        <el-form-item label="课程详情" prop="details">
          <el-input v-model="editForm.details"></el-input>
        </el-form-item>
        <!-- 开始时间 -->
        <el-form-item label="选课开始时间" prop="start_date">
          <el-input v-model="editForm.start_date"></el-input>
        </el-form-item>
        <!-- 结束时间 -->
        <el-form-item label="选课结束时间" prop="end_date">
          <el-input v-model="editForm.end_date"></el-input>
        </el-form-item>
        <!-- 余量 -->
        <el-form-item label="课程余量" prop="stock">
          <el-input v-model="editForm.stock"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCourseInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 请求数据
      query: '',
      courselist: [], // 课程列表
      currentPage: 1,
      pageSize: 10,
      total: 0, // 最大数据记录
      addDialogVisible: false, // 对话框显示
      // 添加课程表单项
      addForm: {
        name: '',
        counts: '',
        teacher: '',
        details: '',
        stock: '',
        start_date: '',
        end_date: '',
      },
      // 控制修改课程对话框显示/隐藏
      editDialogVisible: false,
      // 修改课程信息
      editForm: {},
      // 验证规则
      addFormRules: {
        name: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
        counts: [{ required: true, message: '请输入学分', trigger: 'blur' }],
        teacher: [
          { required: true, message: '请输入授课教师', trigger: 'blur' },
        ],
        details: [
          { required: true, message: '请输入课程详情', trigger: 'blur' },
        ],
        start_date: [
          { required: true, message: '请输入选课开始时间', trigger: 'blur' },
        ],
        end_date: [
          { required: true, message: '请输入选课结束时间', trigger: 'blur' },
        ],
        stock: [{ required: true, message: '请输入课程余量', trigger: 'blur' }],
      },
      // 修改课程表单验证规则
      editFormRules: {
        name: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
        counts: [{ required: true, message: '请输入学分', trigger: 'blur' }],
        teacher: [
          { required: true, message: '请输入授课教师', trigger: 'blur' },
        ],
        details: [
          { required: true, message: '请输入课程详情', trigger: 'blur' },
        ],
        start_date: [
          { required: true, message: '请输入选课开始时间', trigger: 'blur' },
        ],
        end_date: [
          { required: true, message: '请输入选课结束时间', trigger: 'blur' },
        ],
        stock: [{ required: true, message: '请输入课程余量', trigger: 'blur' }],
      },
    }
  },
  created() {
    this.getCourseList()
  },
  methods: {
    async getCourseList() {
      const { data: res } = await this.$http.get('/app/all_course')
      this.courselist = res.data // 将返回数据赋值
      this.total = res.data.length // 总个数
    },
    async getSearchCourse() {
      const { data: res } = await this.$http.get('/app/query_course', {
        params: {
          query: this.query,
        },
      })
      this.courselist = res.data // 将返回数据赋值
      this.total = res.data.length // 总个数
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val
    },
    // 监听添加课程
    addDialogClosed() {
      this.$refs.addFormRef.resetFields() // 重置表单项
    },
    // 添加课程
    addCourse() {
      this.$refs.addFormRef.validate(async (valid) => {
        // console.log(valid);
        if (!valid) return
        // 发起请求
        const { data: res } = await this.$http.post(
          '/app/add_course',
          this.addForm
        )
        if (res.data != 'success') {
          // userinfo.state = !userinfo.state;
          return this.$message.error('操作失败！！！')
        }
        this.$message.success('操作成功！！！')
        //隐藏
        this.addDialogVisible = false
        this.getCourseList()
      })
    },
    // 展示修改框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('/app/get_update_course?id=' + id)
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 关闭窗口
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 确认修改
    editCourseInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        console.log(valid)
        if (!valid) return
        // 发起请求
        const { data: res } = await this.$http.post('/app/edit_course', this.editForm)
        if (res.data != 'success') return this.$message.error('操作失败！！！')
        this.$message.success('操作成功！！！')
        //隐藏
        this.editDialogVisible = false
        this.getCourseList()
      })
    },
    // 删除按钮
    async deleteCourse(id) {
      // 弹框
      const confirmResult = await this.$confirm(
        '此操作将永久删除该课程, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      // 成功删除为confirm 取消为 cancel
      if (confirmResult != 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.post('/app/delete_course?id=' + id)
      if (res.data != 'success') {
        return this.$message.error('操作失败！！！')
      }
      this.$message.success('操作成功！！！')
      this.getCourseList()
    },
  },
}
</script>
<style lang="less" scoped></style>
