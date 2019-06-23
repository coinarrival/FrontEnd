<template>
  <div>
    <!-- 用户头像 -->
    <el-upload
      :class="basicInfo.avatar? 'avatar' : 'avatar-uploader'"
      :action="serverendURL/avatar"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload">
      <!-- TODO: change to below comment line once server on -->
      <!-- <img v-if="basicInfo.avatar" :src="serverendURL + '/public/avatar/' + basicInfo.avatar" class="avatar"> -->
      <img v-if="basicInfo.avatar" :src="basicInfo.avatar" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>

    <!-- 个人信息 -->
    <el-form :model="basicInfo" ref="basicInfo" :rules="validateRules" style="width: 400px; margin: 20px auto;"
      label-position="left">
      <!-- 基础信息 -->
      <el-form-item label="用户" :label-width="formLabelWidth" prop="username">
        <el-input v-model="basicInfo.username" autocomplete="off" disabled></el-input>
      </el-form-item>

      <el-form-item label="修改密码" :label-width="formLabelWidth" prop="password">
        <el-input v-model="basicInfo.password" autocomplete="off" show-password></el-input>
      </el-form-item>


      <el-form-item label="性别" :label-width="formLabelWidth">
        <el-input v-model="basicInfo.gender" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="年龄" :label-width="formLabelWidth" prop="age">
        <el-input v-model.number="basicInfo.age" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="电话" :label-width="formLabelWidth" prop="phone">
        <el-input v-model.number="basicInfo.phone" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
        <el-input v-model="basicInfo.email" autocomplete="off"></el-input>
      </el-form-item>

      <el-divider></el-divider>

      <!-- 学校信息 -->
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
        <el-input v-model.number="studentInfo.grade" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="学校" :label-width="formLabelWidth">
        <el-input v-model="basicInfo.school" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="专业" :label-width="formLabelWidth">
        <el-input v-model="basicInfo.major" autocomplete="off"></el-input>
      </el-form-item>

      <el-divider></el-divider>

      <el-form-item>
        <el-button-group>
        <el-button v-on:click="saveInfo" type="primary" round>保存信息</el-button>
        </el-button-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>

.avatar-uploader {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 1px dashed #d9d9d9;
  margin: 0 auto;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
  border-radius: 50%;
  margin: 0 auto;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.el-button {
  width: 200px;
}

.el-form-item.is-success {
  border-color: #606266;
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
          callback(new Error('年龄区间为18到80岁'));
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
      serverendURL: Config.serverendURL,
      formLabelWidth: '100px',
      
      // validation rules
      validateRules: {
        username: [{
          required: true, message: '请输入用户名', trigger: 'blur'
        }],
				password: [{
          required: true, message: '请输入密码', trigger: 'blur'
        }, {
          min: 8, max: 20, message: '密码长度为8-20', trigger: 'blur'
        }],
        email: [{
          required: true, message: '请输入邮箱', trigger: 'blur'
        }, {
          pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
          message: '非法邮箱',
          trigger: 'blur'
        }],
        phone: [{ 
          required: true, message: '请输入电话', trigger: 'blur'
        }, { 
          pattern: /^1[34578]\d{9}$/, message: '目前只支持中国大陆的手机号码', trigger: 'blur'
        }],
        age: [{
          required: false, validator: checkAge, trigger: 'blur'
        }]
      },
      studentRules: {
        studentID: [{
          required: true, message: '请输入学号', trigger: blur
        }, { 
          pattern: /^1\d{7}$/, message: '请输入8位学号', trigger: 'blur'
        }],
        grade: [{
          required: false, validator: checkGrade, trigger: blur
        }]
      },
      teacherRules: {
        teacherID: [{
          required: true, message: '请输入工号', trigger: blur
        }, { 
          pattern: /\d{8}$/, message: '请输入8位工号', trigger: 'blur'
        }]
      },
  
      // basic info for all role users
      basicInfo: {
        username: '佚名',
        gender: 'male',
        email: 'falsemail@gmail.com',
        phone: '13231987429',
        school: 'SYSU',
        major: 'Software Engineer',
        age: 18,
        role: 'student',
        password: '123456789',
        avatar: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'
      },
      // student info
      studentInfo: {
        grade: '2016',
        studentID: '16340000'
      },
      // teacher info
      teacherInfo: {
        teacherID: '20000000'
      }
    }
  },
  methods: {
    // load user info from server
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

    // save user info to server
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
    },

    uploadAhandleAvatarSuccess(res, file) {
      if (res.status_code == 200) {
        this.basicInfo.avatar = res.data.data.filename;
      } else if (res.status_code == 400) {
        this.message.warning('图片错误');
      } else if (res.status_code == 401) {
        this.message.warning('请重新登录');
      } else {
        this.message.error('服务器错误，请稍后重试...');
      }
    },

    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    }
  }
}
</script>