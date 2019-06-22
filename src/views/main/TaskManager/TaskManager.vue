<template>
  <div>
    <el-tabs :tab-position="'left'">
      <!-- 已发起任务列表 -->
      <el-tab-pane label="已发起任务">
        <task-manager-created></task-manager-created>
      </el-tab-pane>

      <!-- 已接受任务列表 -->
      <el-tab-pane label="已接受任务">
        <task-manager-accept></task-manager-accept>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import TaskManagerCreated from './TaskManagerCreated.vue'
import TaskManagerAccept from './TaskManagerAccept.vue'

export default {
  name: 'TaskManager',
  props: {},
  components: {
    TaskManagerCreated,
    TaskManagerAccept,
  },
  data() {
    return {}
  },
  methods: {}
}
</script>


<style scoped>

</style>
