<template>
  <div>
    <!-- 已发起任务列表 -->
    <el-table :data="createdList" border stripe height="600px" style="width: 100%" highlight-current-row
      @cell-click="createdTaskClick">
      <el-table-column prop="title" label="任务名称" align="center">
      </el-table-column>
      <el-table-column prop="reward" label="任务报酬" align="center" sortable width="150px">
      </el-table-column>
      <el-table-column prop="deadline" label="期限" align="center" sortable width="150px">
      </el-table-column>
      <el-table-column prop="repeatTime" label="可完成次数" align="center" width="150px">
      </el-table-column>
      <el-table-column prop="state" label="任务状态" align="center" width="150px" :filters="stateFilters"
        :filter-method="filterState" filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag :type="stateTag[scope.row.state]" effect="dark" disable-transitions>
            {{scope.row.state}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="state" label="操作" align="center" width="200px">
        <template slot-scope="scope">
          <!-- TODO: 更改判断条件 -->
          <el-button-group>
            <el-button type="success" :disabled="scope.row.state != '可承接'" @click.stop="showVerifyDialog(scope.row)">认证完成
            </el-button>
            <el-button type="danger" :disabled="scope.row.state != '可承接'" @click.stop="deleteTask(scope.row)">删除</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next, jumper" :page-count="createdPages" :pager-count="7"
      @current-change="handleCreatedPageChange">
    </el-pagination>

    <!-- 任务修改框 -->
    <el-dialog :visible.sync="taskDetailVisible" :close-on-click-modal="false">
      <el-form :model="taskInfo" :disabled="taskInfo.state != '可承接'">
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
          <el-input-number v-model="taskInfo.repeatTime"></el-input-number>
        </el-form-item>
        <el-form-item label="任务内容">
          <el-input v-model="taskInfo.content"></el-input>
        </el-form-item>
      </el-form>
      <el-button-group>
        <el-button :disabled="taskInfo.state != '可承接'" type="success" round>修改任务</el-button>
      </el-button-group>
    </el-dialog>

    <!-- 认证任务框 -->
    <el-dialog :visible.sync="verifyTaskVisible" :close-on-click-modal="false" @close="resetSelected">
      <el-table :data="acceptUserList" border stripe style="width: 100%" highlight-current-row>
        <el-table-column prop="userID" label="用户名" align="center">
        </el-table-column>
        <el-table-column prop="isFinished" label="操作" align="center">
          <template slot-scope="scope">
            <el-button :disabled="scope.row.isFinished" :type="scope.row.isFinished ? 'info' :'success'"
              @click="verfiyTask(scope.$index, scope.row)">认证完成
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>

</template>

<script>
import Config from '../../../assets/js/config'

export default {
  name: 'TaskManagerCreated',
  props: {},
  mounted() {
    this.loadTaskwithPage(1);
  },
  data() {
    return {
      // TODO: delete the static data once server on
      // created task list variable
      createdPages: 10,
      createdList: [{
        taskID: "123",
        title: '取快递',
        type: "EXAMPLE",
        reward: 123.123,
        deadline: "YYYY-MM-DD",
        repeatTime: 15,
        state: '已过期'
      }, {
        taskID: "123",
        title: '《计算机网络》第六版PDF',
        type: "EXAMPLE",
        reward: 123.123,
        deadline: "YYYY-MM-DD",
        repeatTime: 15,
        state: '可承接'
      }, {
        taskID: "123",
        title: '取快递2',
        type: "EXAMPLE",
        reward: 123.123,
        deadline: "YYYY-MM-DD",
        repeatTime: 15,
        state: '已完成'
      }],

      // TODO: delete the static data once server on
      // task info variable
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

      // TODO: delete the static data once server on
      // verfication variable
      verifyTaskVisible: false,
      verifyTaskID: '',
      acceptUserList: [{
        userID: '123',
        isFinished: false
      }, {
        userID: '111',
        isFinished: true
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
    /**
     * Retrieve the data within page from sever
     * 
     * @param {int} page the needed page
     */
    loadTaskwithPage(page) {
      this.axios.get(`${Config.serverendURL}/created_tasks`, {
        params: {
          'page': page
        }
      }).then((res) => {
        if (res.data.status_code == 200) {
          this.createdList = res.data.tasks;
          this.createdList.forEach(element => {
            if (new Date(element.deadline) < new Date()) {
              element.state = '已过期';
            } else if (element.isCompleted){
              element.state = '已完成';
            } else {
              element.state = '可承接';
            }
          });
          this.createdPages = res.data.max_pages;
        } else if (res.data.status_code == 416) {
          this.$message.error('请求任务数据错误');
          this.createdPages = res.data.max_pages;
        } else {
          this.$message.error('请求任务数据错误');
        }
      }).catch((err) => {
        this.$message.error('请求任务数据错误');
        console.log(err);
      });
    },

    /**
     * Retrieve task detail from server and
     * show the detail dialog
     */
    createdTaskClick(row, column, event) {
      this.axios.get(`${Config.serverendURL}/task`, {
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
        this.taskDetailVisible = true;
      }).catch((err) => {
        this.$message.error('服务器错误...请稍后重试');
      });
      // TODO: delete code once server on
      this.taskInfo.title = row.title;
      this.taskInfo.state = row.state;
      this.taskDetailVisible = true;
    },
    
    /**
     * Delete task with operation confirm
     * 
     * @param {object} row the task row with its info
     */
    deleteTask(row) {
      this.$confirm('是否删除该任务', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        roundButton: true,
        type: 'warning'
      }).then(() => { // delete the task
        this.axios.delete(`${Config.serverendURL}/task`, {
          params: {
            'taskID': row.taskID
          }
        }).then((res) => {
          if (res.data.status_code == 200) {
            this.$message.success('删除成功');
          } else if (res.data.status_code == 400) {
            this.$message.warning('信息错误，请重试...');
          } else if (res.data.status_code == 401) {
            this.$message.warning('请重新登录...');
          } else if (res.data.status_code == 404) {
            this.$message.error('任务丢失...');
          } else {
            this.$message.error('服务器错误...请稍后重试');
          }
        }).catch((err) => {
          this.$message.error('服务器错误...请稍后重试');
        });
      }).catch(() => {
        // quit and do nothing
      });
    },

    // show verify task dialog and 
    // store the selected task id
    showVerifyDialog(row) {
      this.verifyTaskID = row.taskID;
      this.verifyTaskVisible = true;
    },

    /**
     * Verify a task with accepted user to finish the task
     * 
     * @param {object} row the verified task row with its info
     */
    verfiyTask(row) {
      this.$confirm('是否确认完成', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        roundButton: true,
      }).then(() => { // verify the task
        this.axios.post(`${Config.serverendURL}/acceptance`, {
          params: {
            'taskID': this.verifyTaskID,
            'userID': row.userID
          }
        }).then((res) => {
          if (res.data.status_code == 200) {
            this.$message.success('删除成功');
          } else if (res.data.status_code == 400) {
            this.$message.warning('信息错误，请重试...');
          } else if (res.data.status_code == 401) {
            this.$message.warning('请重新登录...');
          } else if (res.data.status_code == 404) {
            this.$message.error('任务丢失...');
          } else {
            this.$message.error('服务器错误...请稍后重试');
          }
        }).catch((err) => {
          this.$message.error('服务器错误...请稍后重试');
        });
      }).catch(() => {
        // quit and do nothing
      });
    },
    
    // reset the selected verfity task id
    resetSelected() {
      this.verifyTaskID = '';
    },

    // change created task list page
    handleCreatedPageChange(pageNum) {
      this.loadTaskwithPage(pageNum);
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
