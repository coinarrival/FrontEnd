<template>
	<div class="main-box">
		<el-tabs type="border-card">
			<el-tab-pane label="币达任务总览">
				<el-table	:data="tableData" height="600px" border style="width: 100%" highlight-current-row @current-change="acceptTheTask">
					<el-table-column prop="name" label="任务名称" width="300"></el-table-column>
					<el-table-column prop="description" label="任务描述" width="400"></el-table-column>
					<el-table-column prop="bounty" label="任务报酬" width="200"></el-table-column>
					<el-table-column prop="state" label="任务状态"
						:filters="[{ text: '可承接', value: '可承接' }, { text: '已承接', value: '已承接' }]"
						:filter-method="filterState"
						filter-placement="bottom-end">
						<template slot-scope="scope">
							<el-tag
							:type="scope.row.state === '可承接' ? 'success' : 'danger'"
							disable-transitions>{{scope.row.state}}</el-tag>
						</template>
					</el-table-column>
				</el-table>			
			</el-tab-pane>

			<el-tab-pane label="发布币达任务">
			  	<el-form :model="task" style="width: 600px; margin: 20px auto;">
					<el-form-item label="任务名称" :label-width="formLabelWidth">
						<el-input v-model="task.name" autocomplete="off" placeholder="请输入任务名称"></el-input>
					</el-form-item>

					<el-form-item label="任务详述" :label-width="formLabelWidth">
						<el-input v-model="task.description" autocomplete="off" type="textarea" 
							placeholder="请输入任务详情" maxlength="140" show-word-limit rows="6"></el-input>
					</el-form-item>

					<el-form-item label="任务报酬" :label-width="formLabelWidth">
						<el-input v-model="task.bounty" autocomplete="off" placeholder="请确定任务报酬" type="number"></el-input>
					</el-form-item>					
				</el-form>

				<el-divider></el-divider>

				<el-button type="primary" icon="el-icon-upload">发布任务</el-button>

				<el-button type="info" icon="el-icon-delete">清空</el-button>

			</el-tab-pane>
			
			<el-tab-pane label="我的钱包">
				<el-row>
					<p class="balance">余额: ￥ {{balance}}</p>
				</el-row>
				<el-row>
					<el-button type="primary">充值</el-button>
					<el-button type="success">提现</el-button>
				</el-row>
			</el-tab-pane>

			<el-tab-pane label="个人信息">
				<el-form :model="info" style="width: 600px; margin: 20px auto;">
					<el-form-item label="姓名" :label-width="formLabelWidth">
						<el-input v-model="info.name" autocomplete="off"></el-input>
					</el-form-item>

					<el-form-item label="学号" :label-width="formLabelWidth">
						<el-input v-model="info.id" autocomplete="off"></el-input>
					</el-form-item>

					<el-form-item label="专业" :label-width="formLabelWidth">
						<el-input v-model="info.major" autocomplete="off"></el-input>
					</el-form-item>

					<el-form-item label="性别" :label-width="formLabelWidth">
						<el-input v-model="info.gender" autocomplete="off"></el-input>
					</el-form-item>

					<el-divider></el-divider>

					<el-form-item label="电话" :label-width="formLabelWidth">
						<el-input v-model="info.phone" autocomplete="off"></el-input>
					</el-form-item>

					<el-form-item label="邮箱" :label-width="formLabelWidth">
						<el-input v-model="info.email" autocomplete="off"></el-input>
					</el-form-item>
				</el-form>
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

.balance {
	color: #67C23A;
	font-size: 25pt;
}

.p_info{
	width:40%;
	margin: 0 auto;
}
</style>

<script>
	export default{
		// data(){
		// 	return{
		// 		list: ''
		// 	}
		// },
		// mounted(){
			// this.$http.get('http://localhost/vueapi/index.php/Home/user/index').then((res)=>{
			// 	this.list = res.data
			// 	console.log(res)
			// })
	// 	}
	// }
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

				task: {
					name: '',
					description: '',
					bounty: 50
				},

				formLabelWidth: '120px',

				balance: 100,

				info: {
					name: '佚名',
					id: '16340000',
					major: 'Software Engineer',
					gender: 'male',
					phone: '13231987429',
					email: 'falsemail@gmail.com'
				} 
			};
		},
		methods: {
			handleSelect(key, keyPath) {
				console.log(key, keyPath);
			},

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