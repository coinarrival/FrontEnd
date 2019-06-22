<template>
	<div class="main-box">
		<el-tabs type="border-card">
			<el-tab-pane label="币达任务总览">
				<task-list></task-list>
			</el-tab-pane>

			<el-tab-pane label="发布币达任务">
			  <task-publication></task-publication>
			</el-tab-pane>
			
			<el-tab-pane label="发布问卷">
				<survey-publication></survey-publication>
			</el-tab-pane>

			<el-tab-pane label="管理任务">
				<task-manager></task-manager>
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
	height: 80%;
	margin: 0 auto;
	border-radius: 20px;
}

.el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active {
	font-weight: bold;
	font-size: 15px;
}
</style>

<script>
import TaskList from './TaskList.vue'
import TaskPublication from './TaskPublication.vue'
import UserInfo from './UserInfo.vue'
import UserWallet from './UserWallet.vue'
import SurveyPublication from './SurveyPublication.vue'
import TaskManager from './TaskManager/TaskManager.vue'

export default{
	components: {
		TaskList,
		TaskPublication,
		SurveyPublication,
		UserInfo,
		UserWallet,
		TaskManager,
	},
	data() {
		return { };
	},
	methods: { }
}
</script>