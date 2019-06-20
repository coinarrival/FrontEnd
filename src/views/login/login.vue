<template>
  <div class="login-register-box">
    <transition name="el-zoom-in-top">
      <el-form class="login-wrap" v-show="showLogin">
        <h3>用户登录</h3>
        <el-input v-model="username" placeholder="请输入用户名"></el-input>
        <el-input v-model="password" placeholder="请输入密码" show-password></el-input>
        <el-button v-on:click="login" type="primary" round>登录</el-button>
        <el-link v-on:click="ToRegister">没有账号？马上注册</el-link>
      </el-form>
    </transition>

    <transition name="el-zoom-in-top">
      <el-form class="register-wrap" v-show="showRegister">
        <h3>用户注册</h3>
        <el-input v-model="newUsername" placeholder="请输入用户名"></el-input>
        <el-input v-model="newPassword" placeholder="请输入密码" show-password></el-input>
        <el-input v-model="newConfirmPassword" placeholder="再次输入密码" show-password></el-input>
        <el-input v-model="newEmail" placeholder="请输入邮箱"></el-input>
        <el-input v-model="newPhone" placeholder="请输入手机号码"></el-input>
        <el-button v-on:click="register" type="primary" round>注册</el-button>
        <el-link v-on:click="ToLogin">已有账号？马上登录</el-link>
      </el-form>
    </transition>
  </div>
</template>

<style>
	body {}

	h3 {
		font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
	}

	.login-register-box {
		margin-top: 50px;
	}

	.login-wrap {
		border-radius: 20px;
		text-align: center;
		background: #FFFFFF;
		width: 400px;
		height: auto;
		margin: 10px auto;
		padding: 10px;
		padding-bottom: 50px;
	}

	.register-wrap {
		border-radius: 20px;
		text-align: center;
		background: #FFFFFF;
		width: 400px;
		height: auto;
		margin: 10px auto;
		padding: 10px;
		padding-bottom: 50px;
	}

	input {
		display: block;
		width: 250px;
		height: 40px;
		line-height: 40px;
		margin: 10px auto;
		outline: none;
		border: 1px solid #888;
		padding: 10px;
		box-sizing: border-box;
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

export default {
	data() {
		return {
			serverendURL: 'http://localhost:3000',
			showLogin: false,
			showRegister: false,
			username: '',
			password: '',
			newUsername: '',
			newPassword: '',
			newConfirmPassword: '',
			newEmail: '',
			newPhone: ''
		}
	},

	// 如果获取cookie成功，则跳转到主页，无需登录
	mounted() {
		if (getCookie('username')) {
			this.$router.push('/home')
		}

		setTimeout(() => {
			this.showLogin = true
		}, 500);
	},

	methods: {
		ToLogin() {
			this.showRegister = false
			setTimeout(() => {
				this.showLogin = true
			}, 500);
		},

		login() {
			if (this.username === "" || this.password === "") {
				this.$message('请输入用户名或密码');
				return;
			}

			this.axios.post(this.serverendURL + '/login', {
				username: this.username,
				password: this.password
			})
				.then((res) => {
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
						this.$message({
							message: '请输入完整信息',
							type: 'warning'
						});
					} else if (res.data.status_code == 406) {
						this.$message({
							message: '用户名或密码错误',
							type: 'error'
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
		},

		ToRegister() {
			this.showLogin = false;
			setTimeout(() => {
				this.showRegister = true;
			}, 500);
		},

		register() {
			// TODO: 增加角色框
			if (this.newUsername === "" || this.newPassword === "" ||
				this.newEmail === "" || this.newPhone === "") {
				this.$message({
					message: '请输入完整信息',
					type: 'warning'
				});
			} else if (this.newPassword !== this.newConfirmPassword) {
				this.$message({
					message: '密码不一致',
					type: 'warning'
				});
			} else {
				// TODO: 增加角色数据
				this.axios.post(this.serverendURL + '/registration', {
					username: this.newUsername,
					password: this.newPassword,
					email: this.newEmail,
					phone: this.newPhone
				})
				.then((res) => {
					if (res.data.status_code === 201) {
						this.$message({
							message: '注册成功',
							type: 'success'
						});
						this.username = '';
						this.password = '';
						setTimeout(function () {
							this.showRegister = false
							this.showLogin = true
						}.bind(this), 1000);
					} else if (res.data.status_code === 400) {
						this.$message({
							message: '请输入完整信息',
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
		}
	}
}
</script>