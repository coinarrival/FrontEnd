<template>
  <div class="login-register-box">
    <transition name="el-zoom-in-top">
      <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="70px"
        class="login-wrap" status-icon v-show="showLogin">
        <h3>用户登录</h3>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" placeholder="请输入密码" prefix-icon="el-icon-lock" show-password>
          </el-input>
        </el-form-item>
        <el-button v-on:click="login" type="primary" round>登录</el-button>
        <el-link v-on:click="ToRegister">没有账号？马上注册</el-link>
      </el-form>
    </transition>

    <transition name="el-zoom-in-top">
      <el-form :model="registrationForm" :rules="registrationRules" ref="registrationForm" label-position="left"
        label-width="80px" class="register-wrap" status-icon v-show="showRegister">
        <h3>用户注册</h3>
        <el-form-item label="用户名" prop="newUsername">
          <el-input v-model="registrationForm.newUsername" placeholder="请输入用户名" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="newPassword">
          <el-input v-model="registrationForm.newPassword" placeholder="请输入密码" prefix-icon="el-icon-lock" show-password>
          </el-input>
        </el-form-item>
        <el-form-item label="重复密码" prop="newConfirmPassword">
          <el-input v-model="registrationForm.newConfirmPassword" placeholder="再次输入密码" prefix-icon="el-icon-lock"
            show-password></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="newEmail">
          <el-input v-model="registrationForm.newEmail" placeholder="请输入邮箱" prefix-icon="el-icon-message"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="newPhone">
          <el-input v-model="registrationForm.newPhone" placeholder="请输入手机号码" prefix-icon="el-icon-mobile-phone">
          </el-input>
        </el-form-item>
        <el-form-item label="职业" prop="newRole">
          <el-radio-group v-model="registrationForm.newRole">
            <el-radio-button :label="'student'">学生</el-radio-button>
            <el-radio-button :label="'teacher'">教师</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-button v-on:click="register" type="primary" round>注册</el-button>
        <el-link v-on:click="ToLogin">已有账号？马上登录</el-link>
      </el-form>
    </transition>
  </div>
</template>

<style scoped>
	body {}

	h3 {
	  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
	}

	.login-register-box {
	  margin-top: 50px;
	}

	.login-wrap,
	.register-wrap {
	  border-radius: 20px;
	  text-align: center;
	  background: #FFFFFF;
	  width: 400px;
	  height: auto;
	  margin: 10px auto;
	  padding: 25px 25px 25px 30px;
	}

	.el-button {
	  width: 300px;
	  height: 40px;
	  margin: 30px 30px;
	  border: none;
	}
</style>

<script>
import {
	setCookie,
	getCookie
} from '../../assets/js/cookie.js'

import Config from '../../assets/js/config'

export default {
	data() {
		var validatePass2 = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请再次输入密码'));
			} else if (value !== this.registrationForm.newPassword) {
				callback(new Error('两次输入密码不一致!'));
			} else {
				callback();
			}
		};
		return {
			showLogin: false,
			showRegister: false,
			loginForm: {
				username: '',
				password: ''
			},
			registrationForm: {
				newUsername: '',
				newPassword: '',
				newConfirmPassword: '',
				newEmail: '',
        newPhone: '',
        newRole: ''
			},
			loginRules: {
				username: [
					{ required: true, message: '请输入用户名', trigger: 'blur' },
				],
				password: [
					{ required: true, message: '请输入密码', trigger: 'blur' },
				]
			},
			registrationRules: {
				newUsername: [
					{ required: true, message: '请输入用户名', trigger: 'blur' },
				],
				newPassword: [
					{ required: true, message: '请输入密码', trigger: 'blur' },
					{ min: 8, max: 20, message: '密码长度为8-20', trigger: 'blur' }
				],
				newConfirmPassword: [
					{ required: true, message: '请再次输入密码', trigger: 'blur' },
					{ validator: validatePass2, trigger: 'blur' }
				],
				newEmail: [
					{ required: true, message: '请输入邮箱', trigger: 'blur' },
				],
				newPhone: [
					{ required: true, message: '请输入电话', trigger: 'blur' },
					{ len: 11, message: '电话格式错误', trigger: 'blur' }
        ],
        newRole: [
					{ required: true, message: '请选择职业', trigger: 'blur' },
        ]
			}
		}
	},

	// 如果获取cookie成功，则跳转到主页，无需登录
	mounted() {
    // TODO: cookie
		if (getCookie('username')) {
			this.$router.push('/home')
		}

		setTimeout(() => {
			this.showLogin = true
		}, 500);
	},

	methods: {
		// to login pannel
		ToLogin() {
      this.showRegister = false;
      this.$refs['registrationForm'].resetFields();
			setTimeout(() => {
				this.showLogin = true
			}, 500);
		},

		// login
		login() {
			this.$refs['loginForm'].validate((valid) => {
				if (valid) { // form is valid
					this.axios.post(`${Config.serverendURL}/login`, {
						username: this.loginForm.username,
						password: this.loginForm.password
					}).then((res) => {
						if (res.data.status_code == 200) {
							this.$message({
								message: '登陆成功',
								type: 'success'
							});
							setCookie('username', this.username, 1000 * 60)
							setTimeout(function () {
								this.$router.push({
									path: 'home',
									query: {
										id: 1
									}
								})
							}.bind(this), 1000);
						} else if (res.data.status_code == 400) {
							this.$message.warning('请输入完整信息');
						} else if (res.data.status_code == 406) {
							this.$message.warning('用户名或密码错误');
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

		// to registry pannel
		ToRegister() {
      this.showLogin = false;
      this.$refs['loginForm'].resetFields();
			setTimeout(() => {
				this.showRegister = true;
			}, 500);
		},

		// make registration
		register() {
			this.$refs['registrationForm'].validate((valid) => {
				if (valid) { // form valid
					this.axios.post(`${Config.serverendURL}/registration`, {
						username: this.newUsername,
						password: this.newPassword,
						email: this.newEmail,
						phone: this.newPhone,
						role: this.newRole
					}).then((res) => {
						if (res.data.status_code === 201) {
							this.$message.success('注册成功');
							this.username = ''; // clear data
							this.password = '';
							setTimeout(function () {
								this.showRegister = false
								this.showLogin = true
							}.bind(this), 1000);
						} else if (res.data.status_code === 400) {
							this.$message.warning('请输入完整信息');
						} else if (res.data.status_code === 409) {
							this.$message.warning(`${res.data.data.which} 已被占用`);
						} else {
							this.$message('服务器错误...请稍后重试');
						}
					}).catch((err) => {
						this.$message.error('服务器错误...请稍后重试',);
					});
				} else {
					return;
				}
			});
		}
	}
}
</script>