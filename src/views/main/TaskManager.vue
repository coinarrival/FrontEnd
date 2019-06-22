<template>
  <div>
    <el-col>
      <el-tabs :tab-position="'left'">
        <!-- 已发起任务列表 -->
        <el-tab-pane label="已发起任务">
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
                  <el-button type="success" :disabled="scope.row.state != '可承接'" @click.stop="verifyTaskVisible = true">认证完成</el-button>
                  <el-button type="danger" :disabled="scope.row.state != '可承接'" @click.stop="deleteTask">删除</el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination background layout="prev, pager, next, jumper" :page-count="createdPages" :pager-count="7"
            @current-change="handleCreatedPageChange">
          </el-pagination>
        </el-tab-pane>

        <!-- 已接受任务列表 -->
        <el-tab-pane label="已接受任务">
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
                <el-button type="danger" :disabled="scope.row.state !== '可承接'"
                  @click.stop="cancelTask">放弃任务</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination background layout="prev, pager, next, jumper" :page-count="acceptPages" :pager-count="7"
            @current-change="handleAcceptPageChange">
          </el-pagination>
        </el-tab-pane>
      </el-tabs>
    </el-col>

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
    <el-dialog :visible.sync="verifyTaskVisible" :close-on-click-modal="false">
      <el-table :data="acceptUserList" border stripe style="width: 100%" highlight-current-row>
        <el-table-column prop="userID" label="用户名" align="center">
        </el-table-column>
        <el-table-column prop="isFinished" label="操作" align="center">
          <template slot-scope="scope">
            <el-button :disabled="scope.row.isFinished"
              :type="scope.row.isFinished ? 'info' :'success'" @click="handleEdit(scope.$index, scope.row)">认证完成
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TaskManager',
  props: {},
  data() {
    return {
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

      verifyTaskVisible: false,
      acceptUserList: [{
        userID: '123',
        isFinished: false
      }, {
        userID: '111',
        isFinished: true
      }]
    }
  },
  methods: {
    createdTaskClick(row, column, event) {
      this.taskDetailVisible = true;
      this.taskInfo.title = row.title;
      this.taskInfo.state = row.state;
    },
    
    handleCreatedPageChange() {

    },

    handleAcceptPageChange() {

    },

    deleteTask() {
      this.$message('delete');
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

</style>
