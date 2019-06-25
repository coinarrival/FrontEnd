<template>
	<div class="main-box">
		<el-tabs type="border-card" @tab-click="tabChange">
			<el-tab-pane label="币达任务总览">
				<task-list v-if="currentTabIndex == 0"></task-list>
			</el-tab-pane>

			<el-tab-pane label="发布币达任务">
			  <task-publication v-if="currentTabIndex == 1"></task-publication>
			</el-tab-pane>
			
			<el-tab-pane label="发布问卷">
				<survey-publication v-if="currentTabIndex == 2"></survey-publication>
			</el-tab-pane>

			<el-tab-pane label="管理任务">
				<task-manager v-if="currentTabIndex == 3"></task-manager>
			</el-tab-pane>

			<el-tab-pane label="我的钱包">
				<user-wallet v-if="currentTabIndex == 4"></user-wallet>
			</el-tab-pane>

			<el-tab-pane label="个人信息">
				<user-info v-if="currentTabIndex == 5" :username="this.$route.query.username"></user-info>
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
		return { 
			currentTabIndex: 0,
		};
	},
	methods: { 
		tabChange(tab, event) {
			console.log(this.$route.query.username);
			this.currentTabIndex = tab.index;
		}
	}
}
</script>