<template>
  <el-form :model="info" style="width: 600px; margin: 20px auto;">
    <el-form-item label="姓名" :label-width="formLabelWidth"  prop="username">
      <el-input v-model="basicInfo.username" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item label="性别" :label-width="formLabelWidth">
      <el-input v-model="basicInfo.gender" autocomplete="off" disabled=true></el-input>
    </el-form-item>

    <el-form-item label="职业">
      <el-radio-group v-model="basicInfo.role">
        <el-radio-button :label="'student'">学生</el-radio-button>
        <el-radio-button :label="'teacher'">教师</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="学号" :label-width="formLabelWidth" v-if="basicInfo.role === 'student'">
      <el-input v-model="Studentinfo.studentID" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item label="工号" :label-width="formLabelWidth" v-if="basicInfo.role === 'teacher'">
      <el-input v-model="Teacherinfo.teacherID" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item label="年级" :label-width="formLabelWidth" v-if="basicInfo.role === 'student'">
      <el-input v-model="Studentinfo.grade" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item label="学校" :label-width="formLabelWidth">
      <el-input v-model="basicInfo.school" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item label="专业" :label-width="formLabelWidth">
      <el-input v-model="basicInfo.major" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item label="修改密码" :label-width="formLabelWidth"  prop="password">
      <el-input v-model="basicInfo.password" autocomplete="off"></el-input>
    </el-form-item>

    <el-divider></el-divider>
    
    <el-form-item label="年龄" :label-width="formLabelWidth">
      <el-input v-model="basicInfo.age" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item label="电话" :label-width="formLabelWidth"  prop="phone">
      <el-input v-model="basicInfo.phone" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item label="邮箱" :label-width="formLabelWidth"  prop="email">
      <el-input v-model="basicInfo.email" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item>
      <el-button v-on:click="saveInfo" type="primary" round>保存信息</el-button>
      <el-button>取消修改</el-button>
    </el-form-item>

  </el-form>
</template>

<style>
  .el-button {
	  width: 300px;
	  height: 40px;
	  margin: 30px 30px;
	  border: none;
	}
</style>

<script>
export default {
  name: 'UserInfo',
  props: {},
  mounted() {
    this.loadInfo();
  },
  data() {
    return {
      formLabelWidth: '120px',
      serverendURL: 'http://localhost:3000',
      basicInfo: {
        username: '佚名',
        gender: 'male',
        email: 'falsemail@gmail.com',
        phone: '13231987429',
        school: 'SYSU',
        major: 'Software Engineer',
        age: 18,
        role: 'student',
        password: '***',
        avatar: 'example.png'        
      },
      validateRules: {
        username: [
					{ required: true, message: '请输入用户名', trigger: 'blur' },
        ],
				password: [
					{ required: true, message: '请输入密码', trigger: 'blur' },
				],
        email: [
					{ required: true, message: '请输入邮箱', trigger: 'blur' },
				],
        phone: [
					{ required: true, message: '请输入电话', trigger: 'blur' },
					{ len: 11, message: '电话格式错误', trigger: 'blur' }
        ]
      },
      studentInfo: {
        grade: '2016',
        studentID: '16340000'
      },
      teacherInfo: {
        teacherID: '20000000'
      }
    }
  },
  methods: {
    loadInfo() {
      this.axios.get(`${this.serverendURL}/account_info?username=${this.info.username}`)
      .then((res) => {
        if (res.data.status_code == 200) {
          gender: this.basicInfo.gender;
          email: this.basicInfo.email;
          phone: this.basicInfo.phone;
          school: this.basicInfo.school;
          major: this.basicInfo.major;
          age: this.basicInfo.age;
          studentID: this.basicInfo.studentID;
          grade: this.basicInfo.grade;
          avatar: this.basicInfo.avatar
        } else if (res.data.status_code == 400) {
          this.$message.error('信息不完整');
        } else if (res.data.status_code == 404) {
          this.$message.error('没有找到此用户');
        } else {
          this.$message.error('请求错误');
        }
      })
      .catch((err) => {
        console.log(err);
      });
    }, 

    saveInfo() {
      this.$refs['basicInfo'].validate((valid) => {
        if (valid) {
          if(this.basicInfo.isStudent) {
            this.axios.post(this.serverendURL + '/account_info', {
              gender: this.basicInfo.gender,
              email: this.basicInfo.email,
              phone: this.basicInfo.phone,
              school: this.basicInfo.school,
              major: this.basicInfo.major,
              age: this.basicInfo.age,
              studentID: this.basicInfo.studentID,
              grade: this.basicInfo.grade,
              avatar: this.basicInfo.avatar
            }) 
            .then((res) => {
              if (res.data.status_code === 201) {
                this.$message({
                  message: '更新成功',
                  type: 'success'
                });
              } else if (res.data.status_code === 401) {
                this.$message({
                  message: '此用户未登录', 
                  type: 'warning'
                }); 
              } else if (res.data.status_code === 409) {
                this.$message({
                  message: `${res.data.data.which} 已被占用`,
                  type: 'warning'
                });
              } else {
                this.$message({
                  message: '服务器错误...请稍后重试',
                  type: 'error'
                });
              }
            })
            .catch((err) => { 
              this.$message({
                message: '服务器错误...请稍后重试',
                type: 'error'
              });
            });
          } else if(!this.basicInfo.isStudent) {
              this.axios.post(this.serverendURL + '/account_info', {
                gender: this.basicInfo.gender,
                email: this.basicInfo.email,
                phone: this.basicInfo.phone,
                school: this.basicInfo.school,
                major: this.basicInfo.major,
                age: this.basicInfo.age,
                teacherID: this.basicInfo.studentID,
                avatar: this.basicInfo.avatar
              }) 
            .then((res) => {
              if (res.data.status_code === 201) {
                this.$message({
                  message: '更新成功',
                  type: 'success'
                });
              } else if (res.data.status_code === 401) {
                this.$message({
                  message: '此用户未登录', 
                  type: 'warning'
                }); 
              } else if (res.data.status_code === 409) {
                this.$message({
                  message: `${res.data.data.which} 已被占用`,
                  type: 'warning'
                });
              } else {
                this.$message({
                  message: '服务器错误...请稍后重试',
                  type: 'error'
                });
              }
            })
            .catch((err) => { 
              this.$message({
                message: '服务器错误...请稍后重试',
                type: 'error'
              });
            });
          }
        } else {
				  return;
			  }
      });
    }
  }
}
</script>