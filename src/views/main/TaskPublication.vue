<template>
  	<el-form :model="task" style="width: 500px; margin: 20px auto;">
  	  <el-form-item label="任务名称" :label-width="formLabelWidth">
  	    <el-input v-model="task.name" autocomplete="off" placeholder="请输入任务名称"></el-input>
  	  </el-form-item>

  	  <el-form-item label="任务详述" :label-width="formLabelWidth">
  	    <el-input v-model="task.description" autocomplete="off" type="textarea" placeholder="请输入任务详情" maxlength="140"
  	      show-word-limit rows="6"></el-input>
  	  </el-form-item>

  	  <el-form-item label="任务报酬" :label-width="formLabelWidth">
  	    <el-input v-model="task.bounty" autocomplete="off" placeholder="请确定任务报酬" type="number"></el-input>
  	  </el-form-item>
  	  <el-divider></el-divider>

			<el-button-group>
  	  	<el-button type="primary" icon="el-icon-upload" round>发布任务</el-button>
  	  	<el-button type="danger" icon="el-icon-delete" round>清空</el-button>
			</el-button-group>

  	</el-form>
</template>

<script>
export default {
  name: 'TaskPublication',
  props: {},
  data() {
    return {
			formLabelWidth: '120px',
			task: {
				name: '',
				description: '',
				bounty: 50
			},
		}
	},
	methods: { }
}
</script>

<style scoped>

</style>

