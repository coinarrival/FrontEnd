<template>
  <div>
    <el-table :data="acceptList" border stripe height="600px" style="width: 100%" highlight-current-row>
      <el-table-column prop="title" label="任务名称" align="center">
      </el-table-column>
      <el-table-column prop="issuer" label="发起者" align="center" sortable width="150px">
      </el-table-column>
      <el-table-column prop="reward" label="任务报酬" align="center" sortable width="150px">
      </el-table-column>
      <el-table-column prop="deadline" label="期限" align="center" sortable width="150px">
      </el-table-column>
      <el-table-column prop="state" label="任务状态" align="center" width="150px" :filters="stateFilters"
        :filter-method="filterState" filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag :type="stateTag[scope.row.state]" effect="dark" disable-transitions>
            {{scope.row.state}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="state" label="操作" align="center" width="150px">
        <template slot-scope="scope">
          <!-- TODO: 更改判断条件 -->
          <el-button type="danger" :disabled="scope.row.state !== '可承接'" @click.stop="cancelTask">放弃任务</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next, jumper" :page-count="acceptPages" :pager-count="7"
      @current-change="handleAcceptPageChange">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'TaskManagerAccept',
  props: {},
  data() {
    return {
      acceptPages: 10,
      acceptList: [{
        taskID: "123",
        title: '取快递',
        type: "EXAMPLE",
        issuer: "EXAMPLE",
        reward: 123.123,
        deadline: "YYYY-MM-DD",
        state: '已过期'
      }, {
        taskID: "123",
        title: '《计算机网络》第六版PDF',
        type: "EXAMPLE",
        issuer: "EXAMPLE",
        reward: 123.123,
        deadline: "YYYY-MM-DD",
        state: '可承接'
      }, {
        taskID: "123",
        title: '行人数据',
        type: "EXAMPLE",
        issuer: "EXAMPLE",
        reward: 123.123,
        deadline: "YYYY-MM-DD",
        state: '已完成'
      }],

      // filter variable
      stateFilters: [{
        text: '已过期',
        value: '已过期',
      }, {
        text: '可承接',
        value: '可承接'
      }, {
        text: '已完成',
        value: '已完成'
      }],
      stateTag: {
        '已过期': 'warning',
        '可承接': 'success',
        '已完成': 'info',
      },
    }
  },
  methods: {
    handleAcceptPageChange() {

    },

    cancelTask() {
      this.$confirm('是否放弃该任务', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        roundButton: true,
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '放弃成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消放弃'
        });
      });
    },
    
    // Filter util function
    filterState(value, row) {
      return row.state === value;
    }
  }
}
</script>

<style scoped>

</style>
