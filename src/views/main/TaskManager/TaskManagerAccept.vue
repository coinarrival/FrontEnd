<template>
  <div>
    <!-- 已接受任务列表 -->
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
          <el-button type="danger" :disabled="scope.row.state !== '可承接'" @click.stop="cancelTask(scope.row)">放弃任务</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next, jumper" :page-count="acceptPages" :pager-count="7"
      @current-change="handleAcceptPageChange">
    </el-pagination>
  </div>
</template>

<script>
import Config from '../../../assets/js/config'
import { setTimeout } from 'timers';

export default {
  name: 'TaskManagerAccept',
  props: {},
  mounted() {
    this.loadTaskwithPage(1);
  },
  data() {
    return {
      // accept task list variable
      acceptPages: 10,
      acceptList: [],

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
     * Retrieve the accept task list within page from sever
     * 
     * @param {int} page the needed page
     */
    loadTaskwithPage(page) {
      this.axios.get(`${Config.serverendURL}/accepted_tasks`, {
        params: {
          'page': page
        }
      }).then((res) => {
        if (res.data.status_code == 200) {
          this.acceptList = res.data.data.tasks;
          this.acceptList.forEach(element => {
            if (new Date(element.deadline) < new Date()) {
              element.state = '已过期';
            } else if (element.isCompleted || element.repeatTime == 0){
              element.state = '已完成';
            } else {
              element.state = '可承接';
            }
          });
          this.acceptPages = res.data.max_pages;
        } else if (res.data.status_code == 416) {
          this.$message.error('暂无更多数据');
          this.acceptPages = res.data.max_pages;
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
     * Cancel an accept task
     * 
     * @param {object} row the task row with its info
     */
    cancelTask(row) {
      this.$confirm('是否放弃该任务', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        roundButton: true,
        type: 'warning'
      }).then(() => {
        this.axios.delete(`${Config.serverendURL}/acceptance`, {
          params: {
            'taskID': row.taskID
          }
        }).then((res) => {
          if (res.data.status_code == 200) {
            this.$message.success('删除成功');
          } else if (res.data.status_code == 400) {
            this.$message.warning('信息错误，请重试...');
          } else if (res.data.status_code == 403) {
            this.$message.warning('任务已被完成');
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
        // do nothing and quit
      });
    },

    // change accept task list page
    handleAcceptPageChange(pageNum) {
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
