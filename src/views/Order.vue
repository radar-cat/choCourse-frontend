<template>
  <div>
    <el-card>
      <!-- 用户列表 -->
      <el-table
        :data="
          orderlist === []
            ? orderlist
            : orderlist.slice(
                (currentPage - 1) * pageSize,
                currentPage * pageSize
              )
        "
        border
        stripe
      >
        <el-table-column label="学号" prop="user_id"></el-table-column>
        <el-table-column label="课程编号" prop="course_id"></el-table-column>
        <el-table-column label="课程名称" prop="course_name"></el-table-column>
        <el-table-column label="退选">
          <!-- scope.row 就是当前行的信息 -->
          <template slot-scope="scope">
            <!-- 退选按钮 -->
            <el-button
              type="primary"
              size="small"
              @click="quitCourse(scope.row.user_id, scope.row.course_id)"
              >退选</el-button
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
      orderlist: [], // 订单列表
      currentPage: 1,
      pageSize: 10,
      total: 0, // 最大数据记录
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.post('/app/order_list',{
       id: sessionStorage.getItem('id')
      })
      this.orderlist = res.data // 将返回数据赋值
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
    async goQuitCourse(userId, courseId) {
      const { data: res } = await this.$http.post('app/quit_course', {
        user: { id: userId },
        courseId: courseId,
      })
      if (res.data === 0) {
        return Promise.resolve(this.$message.success('退选成功！！！'))
      } else {
        return Promise.resolve(this.$message.error(res.msg))
      }
    },
    // 先退选，再更新表格内容
    // 唉，没用啊，消息队列异步改库存还是有点慢啊
    quitCourse(userId, courseId) {
      this.goQuitCourse(userId, courseId).then((val) => {
        this.getOrderList()
      })
    },
  },
}
</script>
<style lang="less" scoped></style>
