<template>
  <div>
    <el-form :model="task" ref="task" label-width="100px" style="width: 500px; margin: 20px auto; text-align: left;"
      @submit.native.prevent>
      <el-form-item prop="name" label="任务名称" :rules="[
			{ required: true, message: '请输入问卷名', trigger: 'blur' }]">
        <el-input v-model="task.name"></el-input>
      </el-form-item>

      <el-form-item prop="description" label="任务详述" :rules="[
			{ required: true, message: '请输入任务详情', trigger: 'blur' }]">
        <el-input v-model="task.description" autocomplete="off" type="textarea" placeholder="请输入任务详情" maxlength="140"
          show-word-limit rows="6"></el-input>
      </el-form-item>

      <el-form-item prop="reward" label="任务报酬" :rules="[
		{ required: true, message: '请输入任务报酬', trigger: 'blur' }]">
        <el-input-number v-model="task.reward" :step="2" style="margin-right: 5px" :min="0.1">
        </el-input-number>
        元
      </el-form-item>

      <el-form-item prop="deadline" label="截止日期" :rules="[
		{ required: true, message: '请选择截止日期', trigger: 'blur' }]">
        <el-date-picker v-model="task.deadline" align="right" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>

      <el-form-item prop="repeatedTime" label="可承接次数" :rules="[
		{ required: true, message: '请输入任务可承接次数', trigger: 'blur' }]">
        <el-input-number v-model="task.repeatedTime" style="margin-right: 5px" :min="1" :step="1" step-strictly>
        </el-input-number>
        次
      </el-form-item>
    </el-form>

    <el-divider></el-divider>

    <el-button-group>
      <el-button type="primary" icon="el-icon-upload" class="roundButton" round @click="publishTask">发布任务</el-button>
      <el-button type="danger" icon="el-icon-delete" class="roundButton" round @click="resetForm('task')">清空</el-button>
    </el-button-group>
  </div>
</template>

<script>
import Config from '../../assets/js/config'

export default {
  name: 'TaskPublication',
  props: {},
  data() {
    return {
      formLabelWidth: '120px',
      task: {
        name: '',
        description: '',
        reward: 50,
        deadline: '',
        repeatedTime: 1
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      }
    }
  },
  methods: {
    /**
     * Reset the task from* 
     *
     * @param form form name to be reset
     */
    resetForm(form) {
      this.$refs[form].resetFields();
    },

    /**
     * Publish a task* 
     */
    publishTask() {
       this.$refs['task'].validate((valid) => {
         if (valid) {
           // console.log(this.task.name, this.task.deadline)
           let request_body = {
             'title': this.task.name,
             'content': this.task.description,
             'type': 'normal',
             'reward': this.task.reward,
             'repeatTime': this.task.repeatTime,
             'deadline': this.task.deadline
           }
           this.axios.post(`${Config.serverendURL}/task`, request_body)
             .then(response => {
               if (response.status == 200) {
                 switch (response.data.status_code) {
                   case 201:
                     this.$message.success(`创建成功，您的任务 ID 为 ${response.data.data.taskID}`);
                     resetForm('task')
                     break;
                   case 400:
                     this.$message.error('创建失败，任务信息填写有误');
                     break;
                   case 403:
                     this.$message.warning('创建失败，余额不足');
                     break;
                   default:
                     this.$message.error('错误：未知的返回状态');
                 }
               } else {
                 this.$message.error('错误：未知的服务端错误');
               }
             })
             .catch(error => {
               this.$message.error('错误：未知的服务端错误');
             })
         } else {
           console.log('invalid submit!!');
           return;
         }
       })
    }


  }
}
</script>

<style scoped>
	.roundButton {
	  width: 200px;
	}
</style>

