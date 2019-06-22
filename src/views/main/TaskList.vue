<template>
  <div>
    <el-col>
      <el-row>
        <el-table :data="taskList" border stripe height="600px" style="width: 100%" highlight-current-row
          @row-click="taskClick">
          <el-table-column prop="title" label="任务名称" align="center">
          </el-table-column>
          <el-table-column prop="issuer" label="发起者" align="center" width="150px">
          </el-table-column>
          <el-table-column prop="reward" label="任务报酬" align="center" sortable width="150px">
          </el-table-column>
          <el-table-column prop="deadline" label="期限" align="center" sortable width="150px">
          </el-table-column>
          <el-table-column prop="repeatTime" label="可接受人数" align="center" width="150px">
          </el-table-column>
          <el-table-column prop="state" label="任务状态" align="center" width="150px" :filters="stateFilters" :filter-method="filterState"
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

    <el-dialog :visible.sync="taskDetailVisible" :close-on-click-modal="false">
      <el-form :model="taskInfo" :inline="true" disabled>
        <el-form-item label="任务名">
          <el-input v-model="taskInfo.title"></el-input>
        </el-form-item>
        <el-form-item label="报酬">
          <el-input v-model="taskInfo.reward"></el-input>
        </el-form-item>
        <el-form-item label="发起者">
          <el-input v-model="taskInfo.issuer"></el-input>
        </el-form-item>
        <el-form-item label="期限">
          <el-input v-model="taskInfo.deadline"></el-input>
        </el-form-item>
        <el-form-item label="可接受人数">
          <el-input-number v-model="taskInfo.repeatTime" controls-position="right"></el-input-number>
        </el-form-item>
      </el-form>
      <div class="taskDetail">
        {{taskInfo.content}}
      </div>
      <el-button-group>
        <el-button :disabled="taskInfo.isCompleted" type="success" round>接受任务</el-button>
      </el-button-group>
    </el-dialog>
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
      }],
      stateTag: {
        '已过期': 'warning',
        '可承接': 'success'
      },

      selectedTaskID: '',
      taskList: [{
        taskID: "123",
        title: '取快递',
        type: "EXAMPLE",
        issuer: "EXAMPLE",
        reward: 123.123,
        deadline: "YYYY-MM-DD",
        repeatTime: 15,
        state: '已过期'
      }, {
        taskID: "123",
        title: '《计算机网络》第六版PDF',
        type: "EXAMPLE",
        issuer: "EXAMPLE",
        reward: 123.123,
        deadline: "YYYY-MM-DD",
        repeatTime: 15,
        state: '可承接'
      }, {
        taskID: "123",
        title: '行人数据',
        type: "EXAMPLE",
        issuer: "EXAMPLE",
        reward: 123.123,
        deadline: "YYYY-MM-DD",
        repeatTime: 15,
        state: '已过期'
      }, {
        taskID: "123",
        title: '送钱',
        type: "EXAMPLE",
        issuer: "EXAMPLE",
        reward: 123.123,
        deadline: "YYYY-MM-DD",
        repeatTime: 15,
        state: '可承接'
      }],

      taskDetailVisible: false,
      taskInfo: {
        id: "",
        title: "EXAMPLE",
        content: "EXAMPLE",
        type: "EXAMPLE",
        issuer: "EXAMPLE",
        reward: 999.999,
        deadline: "YYYY-MM-DD",
        repeatTime: 15,
        isCompleted: false
      },
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
          this.taskList.forEach(element => {
            if (new Date(element.deadline) < new Date()) {
              element.state = '已过期';
            } else {
              element.state = '可承接';
            }
          });
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

    /**
     * Handle the click event of the task list cell
     * 
     * @param {object} row clicked row
     * @param {object} column clicked column
     * @param {object} event click event
     */
    taskClick(row, column, event) {
      //TODO: 处理问卷类型内容
      this.axios.get(`${this.serverendURL}/task?taskID=${row.taskID}`)
      .then((res) => {
        if (res.data.status_code == 200) {
          this.taskInfo = res.data.data;
        } else if (res.data.status_code == 404) {
          this.$message.error('任务已删除');
        } else {
          this.$message.error('服务器错误...请稍后重试');
        }
        })
      .catch((err) => {
        this.$message.error('服务器错误...请稍后重试');    
      });
      this.taskDetailVisible = true;
      this.taskInfo.title = row.title;
    },

    /**
     * Handle the pagination change of current page.
     * 
     * @param {int} pageNum the changed page number
     */
    handlePageChange(pageNum) {
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

.taskDetail {
  margin: 0 0 20px 0;
}

</style>

