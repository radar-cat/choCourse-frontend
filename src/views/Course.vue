<template>
  <div>
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
        <el-table-column label="选课">
          <!-- scope.row 就是当前行的信息 -->
          <template slot-scope="scope">
            <!-- 选课按钮 -->
            <el-button
              type="primary"
              size="small"
              @click="choCourse(scope.row.id)"
              >选课</el-button
            >
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
    async goChoCourse(courseId) {
      const { data: res } = await this.$http.post('app/choose_course', {
        user: { id: sessionStorage.getItem('id') },
        courseId: courseId,
      })
      if (res.data === 0) {
        return Promise.resolve(this.$message.success('选课成功！！！'))
      } else {
        return Promise.resolve(this.$message.error(res.msg))
      }
    },
    // 先选课，再更新表格内容
    // 唉，没用啊，消息队列异步改库存还是有点慢啊
    choCourse(courseId) {
      this.goChoCourse(courseId).then((val) => {
        this.getCourseList()
      })
    },
  },
}
</script>
<style lang="less" scoped></style>
