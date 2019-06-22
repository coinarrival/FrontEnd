<template>
  <div>
    <el-col>
      <el-row>
        <!-- 任务列表 -->
        <el-table :data="taskList" border stripe height="600px" style="width: 100%" highlight-current-row
          @row-click="taskClick">
          <el-table-column prop="title" label="任务名称" align="center">
          </el-table-column>
          <el-table-column prop="issuer" label="发起者" align="center" width="150px">
          </el-table-column>
          <el-table-column prop="type" label="类型" align="center" width="100px" :filters="typeFilters" :filter-method="filterType"
            filter-placement="bottom-end">
            <template slot-scope="scope">
              <el-tag :type="typeTag[scope.row.type]" effect="dark" disable-transitions>
                {{scope.row.type}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="reward" label="任务报酬" align="center" sortable width="150px">
          </el-table-column>
          <el-table-column prop="deadline" label="期限" align="center" sortable width="150px">
          </el-table-column>
          <el-table-column prop="repeatTime" label="可完成次数" align="center" width="150px">
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

    <!-- 任务详情 -->
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
        <el-form-item label="可完成次数">
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
import Config from '../../assets/js/config'

export default {
  name: 'TaskList',
  props: {},
  mounted() {
    this.loadTaskwithPage(1);
  },
  data() {
    return {
      // TODO: delete the static data once server on
      // task list variable
      maxPages: 10,
      selectedTaskID: '',
      taskList: [{
        taskID: "123",
        title: '取快递',
        type: "normal",
        issuer: "EXAMPLE",
        reward: 123.123,
        deadline: "YYYY-MM-DD",
        repeatTime: 15,
        state: '已过期'
      }, {
        taskID: "123",
        title: '《计算机网络》第六版PDF',
        type: "normal",
        issuer: "EXAMPLE",
        reward: 123.123,
        deadline: "YYYY-MM-DD",
        repeatTime: 15,
        state: '可承接'
      }, {
        taskID: "123",
        title: '行人数据',
        type: "survey",
        issuer: "EXAMPLE",
        reward: 123.123,
        deadline: "YYYY-MM-DD",
        repeatTime: 15,
        state: '已过期'
      }, {
        taskID: "123",
        title: '送钱',
        type: "normal",
        issuer: "EXAMPLE",
        reward: 123.123,
        deadline: "YYYY-MM-DD",
        repeatTime: 15,
        state: '可承接'
      }],

      // TODO: delete the static data once server on
      // task detail variable
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

      // type filter variable
      typeFilters: [{
        text: '普通',
        value: 'normal'
      }, {
        text: '问卷',
        value: 'survey'
      }],
      typeTag: {
        'survey': 'success',
        'normal': 'info'
      },

      // state filter variable
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
    }
  },
  methods: {
    /**
     * Retrieve the data within page from sever
     * 
     * @param {int} page the needed page
     */
    loadTaskwithPage(page) {
      this.axios.get(`${Config.serverendURL}/tasks`, {
        params: {
          'page': page
        }
      }).then((res) => {
        if (res.data.status_code == 200) {
          this.taskList = res.data.tasks;
          this.taskList.forEach(element => {
            if (new Date(element.deadline) < new Date()) {
              element.state = '已过期';
            } else if (element.isCompleted){
              element.state = '已完成';
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
      }).catch((err) => {
        this.$message.error('请求任务数据错误');
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
      this.axios.get(`${this.serverendURL}/task`, {
        params: {
          'taskID': row.taskID
        }
      }).then((res) => {
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
      // TODO: delete the static data once server on
      this.taskDetailVisible = true;
      this.taskInfo.title = row.title;
      this.taskInfo.isCompleted = (row.state != '可承接');
    },

    /**
     * Handle the pagination change of current page.
     * 
     * @param {int} pageNum the changed page number
     */
    handlePageChange(pageNum) {
      this.loadTaskwithPage(pageNum);
    },

    
    // Filter util function for task type list
    filterType(value, row) {
      return row.type === value;
    },

    // Filter util function for task state list
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

