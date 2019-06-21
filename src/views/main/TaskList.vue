<template>
  <div>
    <el-col>
      <el-row>
        <el-table :data="taskList" border stripe height="600px" style="width: 100%" highlight-current-row
          @current-change="acceptTheTask">
          <el-table-column prop="name" label="任务名称" align="center" width="300px">
          </el-table-column>
          <el-table-column prop="description" label="任务描述" header-align="center" width="400px">
          </el-table-column>
          <el-table-column prop="bounty" label="任务报酬" align="center" sortable width="150px">
          </el-table-column>
          <el-table-column prop="state" label="任务状态" align="center" :filters="stateFilters" :filter-method="filterState"
            filter-placement="bottom-end">
            <template slot-scope="scope">
              <el-tag :type="stateTag[scope.row.state]" effect="dark" disable-transitions>
                {{scope.row.state}}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <el-pagination background layout="prev, pager, next, jumper" :page-count="maxPages" :pager-count="7"
          @current-change="handlePageChange">
        </el-pagination>
      </el-row>
    </el-col>
  </div>
</template>

<script>
export default {
  name: 'TaskList',
  props: {},
  mounted() {
    this.loadTaskwithPage(1);
  },
  data() {
    return {
      serverendURL: 'http://localhost:3000',
      
      maxPages: 10,
      stateFilters: [{
        text: '已过期',
        value: '已过期',
      }, {
        text: '可承接',
        value: '可承接'
      }, {
        text: '我发起的',
        value: '我发起的'
      }, {
        text: '已承接',
        value: '已承接'
      }],
      stateTag: {
        '已过期': 'warning',
        '可承接': 'success',
        '我发起的': 'info',
        '已承接': 'danger',
      },
      taskList: [{
        name: '取快递',
        description: '帮忙从蜂巢柜取快递',
        bounty: 20,
        state: '我发起的'
      }, {
        name: '《计算机网络》第六版PDF',
        description: '急求电子书',
        bounty: 5,
        state: '可承接'
      }, {
        name: '行人数据',
        description: '数据收集，报酬丰厚',
        bounty: 50,
        state: '已过期'
      }, {
        name: '取快递2',
        description: '帮忙从蜂巢柜取快递2',
        bounty: 20,
        state: '已承接'
      }, {
        name: '送钱',
        description: '随缘送648',
        bounty: 648,
        state: '已承接'
      }, {
        name: '行人数据2',
        description: '数据收集，报酬丰厚',
        bounty: 50,
        state: '可承接'
      }, {
        name: '行人数据2',
        description: '数据收集，报酬丰厚',
        bounty: 50,
        state: '可承接'
      }, {
        name: '行人数据2',
        description: '数据收集，报酬丰厚',
        bounty: 50,
        state: '可承接'
      }, {
        name: '行人数据2',
        description: '数据收集，报酬丰厚',
        bounty: 50,
        state: '可承接'
      }, {
        name: '行人数据2',
        description: '数据收集，报酬丰厚',
        bounty: 50,
        state: '可承接'
      }, {
        name: '行人数据2',
        description: '数据收集，报酬丰厚',
        bounty: 50,
        state: '可承接'
      }, {
        name: '行人数据2',
        description: '数据收集，报酬丰厚',
        bounty: 50,
        state: '可承接'
      }, {
        name: '行人数据2',
        description: '数据收集，报酬丰厚',
        bounty: 50,
        state: '可承接'
      }, {
        name: '行人数据2',
        description: '数据收集，报酬丰厚',
        bounty: 50,
        state: '可承接'
      }, {
        name: '行人数据2',
        description: '数据收集，报酬丰厚',
        bounty: 50,
        state: '可承接'
      }, {
        name: '行人数据2',
        description: '数据收集，报酬丰厚',
        bounty: 50,
        state: '可承接'
      }, {
        name: '行人数据2',
        description: '数据收集，报酬丰厚',
        bounty: 50,
        state: '可承接'
      }, {
        name: '行人数据2',
        description: '数据收集，报酬丰厚',
        bounty: 50,
        state: '可承接'
      }, {
        name: '行人数据2',
        description: '数据收集，报酬丰厚',
        bounty: 50,
        state: '可承接'
      }, {
        name: '行人数据2',
        description: '数据收集，报酬丰厚',
        bounty: 50,
        state: '可承接'
      }, {
        name: '行人数据2',
        description: '数据收集，报酬丰厚',
        bounty: 50,
        state: '可承接'
      }, {
        name: '行人数据2',
        description: '数据收集，报酬丰厚',
        bounty: 50,
        state: '可承接'
      }]
    }
  },
  methods: {
    /**
     * Retrieve the data within page from sever
     * 
     * @param {int} page the needed page
     */
    loadTaskwithPage(page) {
      this.axios.get(`${this.serverendURL}/tasks?page=${page}`)
      .then((res) => {
        if (res.data.status_code == 200) {
          this.taskList = res.data.tasks;
          this.maxPages = res.data.max_pages;
        } else if (res.data.status_code == 416) {
          this.$message.error('请求任务数据错误');
          this.maxPages = res.data.max_pages;
        } else {
          this.$message.error('请求任务数据错误');
        }
      })
      .catch((err) => {
        console.log(err);
      });
    },

    // TODO: handle task click
    acceptTheTask() {
      this.$alert('领取任务', '任务名称', {
        confirmButtonText: '确定',
        callback: action => {
          this.$message({
            type: 'info',
            message: `action: ${ action }`
          });
        }
      });
    },

    /**
     * Handle the pagination change of current page.
     * 
     * @param {int} pageNum the changed page number
     */
    handlePageChange(pageNum) {
      console.log(pageNum);
      this.loadTaskwithPage(pageNum);
    },

    /**
     * Filter util function for task state list
     * helps find the target state tasks
     * 
     * @param {string} value filter target value
     * @param {object} row filter list row
     */
    filterState(value, row) {
      return row.state === value;
    },
  }
}
</script>

<style scoped>

.el-table::before {
  height: 0px;
}

</style>

