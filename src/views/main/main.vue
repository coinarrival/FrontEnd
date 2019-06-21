<template>
	<div class="main-box">
		<el-tabs type="border-card">
			<el-tab-pane label="币达任务总览">
				<task-list></task-list>
			</el-tab-pane>

			<el-tab-pane label="发布币达任务">
			  <task-publication></task-publication>
			</el-tab-pane>
			
			<el-tab-pane label="我的钱包">
				<user-wallet></user-wallet>
			</el-tab-pane>

			<el-tab-pane label="个人信息">
				<user-info></user-info>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<style>
.main-box{
	width: 80%;
	height: 80%;
	margin: 20px auto;
	border-radius: 20px;
}
</style>

<script>
import TaskList from './TaskList.vue'
import TaskPublication from './TaskPublication.vue'
import UserInfo from './UserInfo.vue'
import UserWallet from './UserWallet.vue'

export default{
	components: {
		TaskList,
		TaskPublication,
		UserInfo,
		UserWallet,
	},
	data() {
		return { };
	},
	methods: { }
}
</script>