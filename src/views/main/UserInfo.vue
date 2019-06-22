<template>
  <el-form :model="basicInfo" ref="basicInfo" :rules="validateRules" style="width: 500px; margin: 20px auto;" label-position="left">
    <el-form-item label="姓名" :label-width="formLabelWidth" prop="username">
      <el-input v-model="basicInfo.username" autocomplete="off" disabled></el-input>
    </el-form-item>

    <el-form-item label="性别" :label-width="formLabelWidth">
      <el-input v-model="basicInfo.gender" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item label="年龄" :label-width="formLabelWidth" prop="age">
      <el-input v-model="basicInfo.age" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item label="电话" :label-width="formLabelWidth" prop="phone">
      <el-input v-model="basicInfo.phone" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
      <el-input v-model="basicInfo.email" autocomplete="off"></el-input>
    </el-form-item>

    <el-divider></el-divider>

    <el-form-item>
      <el-tag
        :type="basicInfo.role == 'student' ? '' : 'info'"
        :effect="basicInfo.role == 'student' ? 'dark' : ''">
        学生
      </el-tag>
      <el-tag
        :type="basicInfo.role == 'teacher' ? '' : 'info'"
        :effect="basicInfo.role == 'teacher' ? 'dark' : ''">
        教师
      </el-tag>
    </el-form-item>

    <el-form-item label="学号" :label-width="formLabelWidth" v-if="basicInfo.role === 'student'">
      <el-input v-model="studentInfo.studentID" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item label="工号" :label-width="formLabelWidth" v-if="basicInfo.role === 'teacher'">
      <el-input v-model="teacherInfo.teacherID" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item label="年级" :label-width="formLabelWidth" v-if="basicInfo.role === 'student'" prop="grade">
      <el-input v-model="studentInfo.grade" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item label="学校" :label-width="formLabelWidth">
      <el-input v-model="basicInfo.school" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item label="专业" :label-width="formLabelWidth">
      <el-input v-model="basicInfo.major" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item label="修改密码" :label-width="formLabelWidth" prop="password">
      <el-input v-model="basicInfo.password" autocomplete="off" show-password></el-input>
    </el-form-item>

    <el-divider></el-divider>

    <el-form-item>
      <el-button-group>
      <el-button v-on:click="saveInfo" type="primary" round>保存信息</el-button>
      <el-button round>取消修改</el-button>
      </el-button-group>
    </el-form-item>
  </el-form>
</template>

<style scoped>
.el-button {
  width: 200px;
}
</style>

<script>
import Config from '../../assets/js/config'
import {
  getCookie,
  setCookie
} from '../../assets/js/cookie'

export default {
  name: 'UserInfo',
  props: {},
  mounted() {
    this.loadInfo();
  },
  data() {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        callback();
      } else {
        if (!Number.isInteger(value)) {
          callback(new Error('年龄应为数字值'));
        } else if (value < 18 || value > 80) {
            callback(new Error('请输入正确的年龄'));
        } else {
          callback();
        }
      }
    };

    var checkGrade = (rule, value, callback) => {
      if (!value) {
        callback();
      } else {
        if (!Number.isInteger(value)) {
          callback(new Error('年级应为数字值'));
        } else {
          callback();
        }
      }
    };

    return {
      formLabelWidth: '120px',
      basicInfo: {
        username: '佚名',
        gender: 'male',
        email: 'falsemail@gmail.com',
        phone: '13231987429',
        school: 'SYSU',
        major: 'Software Engineer',
        age: 18,
        role: 'student',
        password: '123456',
        avatar: 'example.png'        
      },
      validateRules: {
        username: [{ 
          required: true, 
          message: '请输入用户名', 
          trigger: 'blur' 
        }],
				password: [{
          required: true, 
          message: '请输入密码', 
          trigger: 'blur' 
        }, {
          min: 8, 
          max: 20, 
          message: '密码长度为8-20', 
          trigger: 'blur'
        }],
        email: [{
          required: true,
          message: '请输入邮箱', 
          trigger: 'blur' 
        }, {
          pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
          message: '非法邮箱',
          trigger: 'blur'
        }],
        phone: [{ 
          required: true, 
          message: '请输入电话', 
          trigger: 'blur' 
        }, { 
          pattern: /^1[34578]\d{9}$/, 
          message: '目前只支持中国大陆的手机号码', 
          trigger: 'blur' 
        }],
        age: [{
          required: false,
          validator: checkAge, 
          trigger: 'blur' 
        }]
      },
      studentRules: {
        studentID: [{
          required: true,
          message: '请输入学号',
          trigger: blur
        }, { 
          pattern: /^1\d{7}$/, 
          message: '请输入8位学号', 
          trigger: 'blur' 
        }],
        grade: [{
          required: false,
          validator: checkGrade,
          trigger: blur
        }]
      },
      teacherRules: {
        teacherID: [{
          required: true,
          message: '请输入工号',
          trigger: blur
        }, { 
          pattern: /\d{8}$/, 
          message: '请输入8位工号', 
          trigger: 'blur' 
        }]
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
      this.axios.get(`${Config.serverendURL}/account_info`, {
        params: {
          'username': getCookie('username')
        }
      }).then((res) => {
        if (res.data.status_code == 200) {
          this.basicInfo.userID = res.data.data.userID;
          this.basicInfo.username = res.data.data.username;
          this.basicInfo.gender = res.data.data.gender;
          this.basicInfo.email = res.data.data.email;
          this.basicInfo.phone = res.data.data.phone;
          this.basicInfo.school = res.data.data.school;
          this.basicInfo.major = res.data.data.major;
          this.basicInfo.age = res.data.data.age;
          this.basicInfo.role = res.data.data.role;
          this.basicInfo.avata = res.data.data.avatar;
          if (this.basicInfo.role == 'student') {
            this.studentInfo.studentID = res.data.data.studentID;
            this.studentInfo.grade = res.data.data.grade;
          } else if (this.basicInfo.role == 'teacher') {
            this.teacherInfo.teacherID = res.data.data.teacherID;
          }
        } else if (res.data.status_code == 400) {
          this.$message.error('信息不完整');
        } else if (res.data.status_code == 404) {
          this.$message.error('没有找到此用户');
        } else {
          this.$message.error('请求错误');
        }
      }).catch((err) => {
        this.$message.error('请求错误');
        console.log(err);
      });
      this.$refs['basicInfo'].clearValidate();
    }, 

    saveInfo() {
      this.$refs['basicInfo'].validate((valid) => {
        if (valid) {
          this.axios.post(`${Config.serverendURL}/account_info`, {
            password: this.basicInfo.password,
            gender: this.basicInfo.gender,
            email: this.basicInfo.email,
            phone: this.basicInfo.phone,
            school: this.basicInfo.school,
            major: this.basicInfo.major,
            age: this.basicInfo.age,
            studentID: this.studentInfo.studentID,
            grade: this.studentInfo.grade,
            teacherID: this.teacherInfo.teacherID,
            avatar: this.basicInfo.avatar
          }) .then((res) => {
            if (res.data.status_code === 201) {
              this.$message.success('更新成功');
            } else if (res.data.status_code === 401) {
              this.$message.warning('请重新登录'); 
            } else if (res.data.status_code === 409) {
              this.$message.warning(`${res.data.data.which} 已被占用`);
            } else {
              this.$message.error('服务器错误...请稍后重试');
            }
          }).catch((err) => { 
            this.$message.error('服务器错误...请稍后重试');
          });
        } else {
				  return;
			  }
      });
    }
  }
}
</script>