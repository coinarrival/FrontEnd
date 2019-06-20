<template>
  <el-table :data="tableData" height="600px" border style="width: 100%" highlight-current-row
    @current-change="acceptTheTask">
    <el-table-column prop="name" label="任务名称" width="300"></el-table-column>
    <el-table-column prop="description" label="任务描述" width="400"></el-table-column>
    <el-table-column prop="bounty" label="任务报酬" width="200"></el-table-column>
    <el-table-column prop="state" label="任务状态" :filters="[{ text: '可承接', value: '可承接' }, { text: '已承接', value: '已承接' }]"
      :filter-method="filterState" filter-placement="bottom-end">
      <template slot-scope="scope">
        <el-tag :type="scope.row.state === '可承接' ? 'success' : 'danger'" disable-transitions>{{scope.row.state}}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'TaskList',
  props: {},
  data() {
    return {
      tableData: [{
        name: '取快递',
        description: '帮忙从蜂巢柜取快递',
        bounty: 20,
        state: '可承接'
      }, {
        name: '《计算机网络》第六版PDF',
        description: '急求电子书',
        bounty: 5,
        state: '可承接'
      }, {
        name: '行人数据',
        description: '数据收集，报酬丰厚',
        bounty: 50,
        state: '可承接'
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
      }],
    }
  },
  methods: {
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

    filterState(value, row) {
      return row.state === value;
    },
  }
}
</script>

<style scoped>

</style>

