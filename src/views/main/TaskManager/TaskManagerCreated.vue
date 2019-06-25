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
            <el-button type="success" :disabled="opeartionPermission(scope.row.state)" @click.stop="showVerifyDialog(scope.row)">认证完成
            </el-button>
            <el-button type="danger" :disabled="opeartionPermission(scope.row.state)" @click.stop="deleteTask(scope.row)">删除</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next, jumper" :page-count="createdPages" :pager-count="7"
      @current-change="handleCreatedPageChange">
    </el-pagination>

    <!-- 任务修改框 -->
    <el-dialog :visible.sync="taskDetailVisible" :close-on-click-modal="false" @close="resetDetailDialog">
      <el-form :model="taskInfo" ref="taskInfo" @submit.native.prevent style="margin: 0 auto; text-align: left;" label-position="left">
        <el-form-item prop="title" label="任务名" :rules="{ required: true, message: '请输入任务名', trigger: 'blur' }">
          <el-input v-model="taskInfo.title" :disabled="opeartionPermission(taskInfo.state)"></el-input>
        </el-form-item>
        <el-form-item prop="reward" label="报酬"
          :rules="[{ required: true, message: '请输入报酬', trigger: 'blur' }, { validator: checkNumber, trigger: 'blur' }]">
          <el-input v-model.number="taskInfo.reward" :disabled="opeartionPermission(taskInfo.state)"></el-input>
        </el-form-item>
        <el-form-item label="发起者">
          <el-input v-model="taskInfo.issuer" disabled></el-input>
        </el-form-item>
        <el-form-item prop="deadline" label="截止日期" :rules="[
      		{ required: true, message: '请选择截止日期', trigger: 'blur' }]">
          <el-date-picker v-model="taskInfo.deadline" align="right" type="date" placeholder="选择日期"
            value-format="yyyy-MM-dd" :picker-options="pickerOptions" :disabled="opeartionPermission(taskInfo.state)">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="可完成次数">
          <el-input-number v-model="taskInfo.repeatTime" disabled></el-input-number>
        </el-form-item>
        <el-form-item label="任务内容" v-if="taskInfo.type !== 'survey'">
          <el-input v-model="taskInfo.content" disabled></el-input>
        </el-form-item>
        <el-form-item v-for="(question, index) in taskInfo.questions" :label="question.name" :key="question.key"
          :prop="taskInfo.questions[index].name" :rules="{ required: question.require, message: '', trigger: 'blur' }">
          <el-input disabled value="问题样例输入"></el-input>
        </el-form-item>
      </el-form>
      <el-button-group>
        <el-button :disabled="opeartionPermission(taskInfo.state)" type="success" @click="updateTask" round>修改任务</el-button>
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
      <el-pagination background layout="prev, pager, next, jumper" :page-count="acceptUserListPage" :pager-count="7"
      @current-change="handleUserListPageChange">
    </el-pagination>
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
      // created task list variable
      createdPages: 10,
      createdList: [],

      // task info variable
      taskDetailVisible: false,
      taskInfo: {
        taskID: '',
        title: '',
        content: '',
        type: '',
        issuer: '',
        reward: '',
        deadline: '',
        repeatTime: '',
        isCompleted: '',
        questions: [],
      },

      // verfication variable
      verifyTaskVisible: false,
      verifyTaskID: '',
      acceptUserListPage: 10,
      acceptUserList: [],

      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },

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
          this.createdList = res.data.data.tasks;
          this.createdList.forEach(element => {
            if (new Date(element.deadline) < new Date()) {
              element.state = '已过期';
            } else if (element.isCompleted || element.repeatTime == 0){
              element.state = '已完成';
            } else {
              element.state = '可承接';
            }
          });
          this.createdPages = res.data.max_pages;
        } else if (res.data.status_code == 416) {
          this.$message.error('暂无更多数据');
          this.createdPages = res.data.max_pages;
        } else {
          this.$message.error('请求任务数据错误');
        }
      }).catch((err) => {
        if (err.response && err.response.status == 401) {
          this.$message.error('请重新登录');
          setTimeout(() => {
            this.$router.push('/');
          }, 1000);
        } else {
          this.$message.error('请求任务数据错误');
          console.log(err);
        }
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
          if (this.taskInfo.type === 'survey') {
            this.taskInfo.questions = JSON.parse(this.taskInfo.content);
          }
          if (new Date(this.taskInfo.deadline) < new Date()) {
            this.taskInfo.state = '已过期';
          } else if (this.taskInfo.isCompleted){
            this.taskInfo.state = '已完成';
          } else {
            this.taskInfo.state = '可承接';
          }
          this.taskInfo.taskID = row.taskID;
        } else if (res.data.status_code == 404) {
          this.$message.error('任务已删除');
        } else {
          this.$message.error('服务器错误...请稍后重试');
        }
        this.taskDetailVisible = true;
      }).catch((err) => {
        if (err.response && err.response.status == 401) {
          this.$message.error('请重新登录');
          setTimeout(() => {
            this.$router.push('/');
          }, 1000);
        } else {
          this.$message.error('服务器错误...请稍后重试');
        }
      });
    },

    // update task
    updateTask() {
      this.axios.post(`${Config.serverendURL}/created_tasks`, {
        "taskID": this.taskInfo.taskID,
        "title": this.taskInfo.title,
        "reward": this.taskInfo.reward,
        "deadline": this.taskInfo.deadline
      }).then((res) => {
        if (res.data.status_code == 200) {
          this.$message.success('更新完成');
        } else if (res.data.status_code == 400) {
          this.$message.error('信息错误');
        } else {
          this.$message.error('服务器错误...请稍后重试');
        }
      }).catch((err) => {
        if (err.response && err.response.status == 401) {
          this.$message.error('请重新登录');
          setTimeout(() => {
            this.$router.push('/');
          }, 1000);
        } else {
          this.$message.error('服务器错误...请稍后重试');
        }
      });
    },
    
    // reset detail dialog form
    // and the chosen task info
    resetDetailDialog() {
      this.$refs['taskInfo'].resetFields();
      this.taskInfo = {};
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
          } else if (res.data.status_code == 404) {
            this.$message.error('任务丢失...');
          } else {
            this.$message.error('服务器错误...请稍后重试');
          }
        }).catch((err) => {
          if (err.response && err.response.status == 401) {
            this.$message.error('请重新登录');
            setTimeout(() => {
              this.$router.push('/');
            }, 1000);
          } else {
            this.$message.error('服务器错误...请稍后重试');
          }
        });
      }).catch(() => {
        // quit and do nothing
      });
    },

    // load accept user list page from server
    loadAcceptUserList(page) {
      this.axios.get(`${Config.serverendURL}/acceptance`, {
        params: {
          taskID: this.verifyTaskID,
          page: page
        }
      }).then(res => {
        if (res.data.status_code == 200) {
          this.acceptUserList = res.data.data.records;
          this.acceptUserListPage = res.data.data.max_pages;
        } else if (res.data.status_code == 400) {
          this.$message.error('信息不全，请重试');
        } else if (res.data.status_code == 401) {
          this.$message.warning('身份验证失败');
        } else if (res.data.status_code == 404) {
          this.$message.error('任务不存在...');
        } else if (res.data.status_code == 416) {
          this.$message.error('暂无更多数据');
          this.acceptUserListPage = res.data.data.max_pages;
        }
      }).catch(err => {
        if (err.response && err.response.status == 401) {
          this.$message.error('请重新登录');
          setTimeout(() => {
            this.$router.push('/');
          }, 1000);
        } else {
          this.$message.error('服务器错误...请稍后重试');
        }
      });
    },

    // show verify task dialog and 
    // store the selected task id
    showVerifyDialog(row) {
      this.verifyTaskID = row.taskID;
      this.loadAcceptUserList(1);
      this.verifyTaskVisible = true;
    },

    handleUserListPageChange(pageNum) {
      this.loadAcceptUserList(pageNum);
    },

    /**
     * Verify a task with accepted user to finish the task
     * 
     * @param {object} row the verified task row with its info
     */
    verfiyTask(index, row) {
      this.$confirm('是否确认完成', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        roundButton: true,
      }).then(() => { // verify the task
        this.axios.post(`${Config.serverendURL}/acceptance`, {
          'taskID': this.verifyTaskID,
          'userID': row.userID
        }).then((res) => {
          if (res.data.status_code == 200) {
            this.$message.success('删除成功');
          } else if (res.data.status_code == 400) {
            this.$message.warning('信息错误，请重试...');
          } else if (res.data.status_code == 404) {
            this.$message.error('任务丢失...');
          } else {
            this.$message.error('服务器错误...请稍后重试');
          }
        }).catch((err) => {
          if (err.response && err.response.status == 401) {
            this.$message.error('请重新登录');
            setTimeout(() => {
              this.$router.push('/');
            }, 1000);
          } else {
            this.$message.error('服务器错误...请稍后重试');
          }
        });
      }).catch(() => {
        // quit and do nothing
      });
    },
    
    // judge operation permission
    opeartionPermission(value) {
      return value != '可承接';
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
    },

    /**
     * Util function to help check the number is valid
     * in form rules
     * 
     * @param {object} rule
     * @param {string} value the checked value
     * @param {function} callback callback funtion
     */
    checkNumber(rule, value, callback) {
      if (!Number.isInteger(value)) {
        callback(new Error('请输入整数值'));
      } else {
        callback();
      }
    }
  }
}
</script>

<style scoped>

</style>
