<template>
  <div>
    <el-form :model="survey" ref="survey" label-width="100px" style="width: 500px; margin: 20px auto;" @submit.native.prevent>
      <el-form-item prop="name" label="问卷名" :rules="[{ required: true, message: '请输入问卷名', trigger: 'blur' }]">
        <el-input v-model="survey.name"></el-input>
      </el-form-item>
      <el-form-item prop="reward" label="报酬" :rules="[
        { required: true, message: '请输入报酬', trigger: 'blur' }, 
        { validator: checkNumber, trigger: 'blur' }]">
        <el-input v-model.number="survey.reward"></el-input>
      </el-form-item>
      <el-form-item prop="deadline" label="截止日期" :rules="[
	    { required: true, message: '请选择截止日期', trigger: 'blur' }]">
        <el-date-picker v-model="survey.deadline" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"
          :picker-options="pickerOptions" style="width: 100%;">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="repeatTime" label="可完成次数" :rules="[
        { required: true, message: '请输入可完成次数', trigger: 'blur' },
        { validator: checkNumber, trigger: 'blur' }]">
        <el-input v-model.number="survey.repeatTime"></el-input>
      </el-form-item>
      <el-form-item v-for="(question, index) in survey.questions" :label="question.name" :key="question.key"
        :prop="survey.questions[index].name" :rules="{ required: question.require, message: '', trigger: 'blur' }">
        <el-input disabled value="问题样例输入"></el-input>
      </el-form-item>
    </el-form>
    <div>
      <el-button-group>
        <el-button type="primary" @click="postSurvey" class="smallButton" round>提交问卷</el-button>
        <el-button @click="infoVisible = true" type="success" class="smallButton" round>新增问题</el-button>
        <el-button @click.prevent="removeQuestion" type="danger" class="smallButton" round>删除</el-button>
        <el-button @click="resetForm('survey')" type="warning" class="smallButton" round>重置</el-button>
      </el-button-group>
    </div>

    <el-dialog :visible.sync="infoVisible" :close-on-click-modal="false" :show-close="false" :append-to-body="true"
      @close="resetForm('questionInfo')">
      <el-form :model="questionInfo" ref="questionInfo" style="width: 280px; margin: 20px auto;" @submit.native.prevent>
        <el-form-item label="问题名称" prop="name" :rules="{ required: true, message: '', trigger: 'blur' }">
          <el-input v-model="questionInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="是否必填" prop="require" :rules="{ required: true, message: '', trigger: 'blur' }">
          <el-radio-group v-model="questionInfo.require">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button @click="infoVisible = false" class="smallButton" round>取 消</el-button>
          <el-button type="primary" @click="addQuestion" class="smallButton" round>确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Config from '../../assets/js/config'

export default {
  name: 'SurveyPublication',
  props: {},
  data() {
    return {
      survey: {
        name: '问卷',
        reward: 10,
        deadline: '2019-12-31',
        repeatTime: 10,
        questions: []
      },
      infoVisible: false,
      questionInfo: {
        name: '',
        require: false,
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
     * Add a question field into the form
     * if the requirement is matched
     */
    addQuestion() {
      this.$refs['questionInfo'].validate((valid) => {
        if (valid) {
          this.survey.questions.push({
            name: this.questionInfo.name,
            require: this.questionInfo.require,
            value: '',
            key: Date.now()
          });
          this.infoVisible = false;
        }
      });
    },

    /**
     * Reset the form to the default state
     * 
     * @param form form name to be reset
     */
    resetForm(form) {
      this.$refs[form].resetFields();
    },

    /**
     * Remove a question field at the bottom
     */
    removeQuestion() {
      let index = this.survey.questions.length - 1;
      if (index !== -1) {
        this.survey.questions.splice(index, 1);
      }
    },

    /**
     * Post the survey form data to the server
     */
    postSurvey() {
      let request_body = {
        'title': this.survey.name,
        'content': JSON.stringify(this.survey.questions),
        'type': 'survey',
        'reward': this.survey.reward,
        'repeatTime': this.survey.repeatTime,
        'deadline': this.survey.deadline,
      };
      window.tester = request_body;
      this.axios.post(`${Config.serverendURL}/task`, request_body)
        .then(response => {
          if (response.status == 200) {
            switch(response.data.status_code) {
              case 201:
                this.$message.success(`创建成功，您的任务 ID 为 ${response.data.data.taskID}`);
                resetForm('survey')
                break;
              case 400:
                this.$message.error('错误：网页运行异常');
                break;
              case 403:
                this.$message.warning('创建失败：余额不足');
                break;
              default:
                this.$message.error('错误：未知的返回状态');
            }
          } else {
            this.$message.error('错误：未知的返回状态');
          }
        })
        .catch(error => {
          if (err.response.status == 401) {
            this.$message.error('创建失败：登陆失效，请重新登录');
            setTimeout(() => {
              this.$router.push('/');
            }, 1000);
          } else {
            this.$message.error('错误：未知的服务端错误');
          }
        })
    },

    /**
     * Util function to help check the date is valid
     * in form rules
     * 
     * @param {object} rule
     * @param {string} value the checked value
     * @param {function} callback callback funtion
     */
    checkDate(rule, value, callback) {
      let testDate = new Date(value);
      let year = parseInt(value.split('-')[0]);
      let month = parseInt(value.split('-')[1]) - 1; // month is [0, 11] in Date
      let day = parseInt(value.split('-')[2]);
      if (year !== testDate.getFullYear() || month !== testDate.getMonth() ||
        day !== testDate.getDate() || testDate < Date.now()) {
        callback(new Error('日期非法，格式：YYYY-MM-DD'));
      } else {
        return callback();
      }
    },

    /**
     * Util function to help check the number is valid
     * in form rules
     * 
     * @param {object} rule
     * @param {string} value the checked value
     * @param {function} callback callback funtion
     */
    checkNumber(rule, value, callback) {
      if (!Number.isInteger(value)) {
        callback(new Error('请输入数字值'));
      } else {
        callback();
      }
    }
  }
}
</script>

<style scoped>

.smallButton {
  width: 100px
}

</style>
