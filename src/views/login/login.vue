<template>
    <div class="login-register-box">
        <transition name="el-zoom-in-top">            
            <el-form class="login-wrap" v-show="showLogin">
                <h3>用户登录</h3>
                <p v-show="showHint">{{hint}}</p>
                <el-input v-model="username" placeholder="请输入用户名"></el-input>
                <el-input v-model="password" placeholder="请输入密码" show-password></el-input>
                <el-button v-on:click="login" type="primary" round>登录</el-button>
                <el-link v-on:click="ToRegister">没有账号？马上注册</el-link>
            </el-form>
        </transition>

        <transition name="el-zoom-in-top">    
            <el-form class="register-wrap" v-show="showRegister">
                <h3>用户注册</h3>
                <p v-show="showHint">{{hint}}</p>
                <el-input v-model="newUsername" placeholder="请输入用户名"></el-input>
                <el-input v-model="newPassword" placeholder="请输入密码" show-password></el-input>
                <el-input v-model="newEmail" placeholder="请输入邮箱"></el-input>
                <el-input v-model="newPhone" placeholder="请输入手机号码"></el-input>
                <el-button v-on:click="register" type="primary" round>注册</el-button>
                <el-link v-on:click="ToLogin">已有账号？马上登录</el-link>
            </el-form>
        </transition>
    </div>
</template>

<style>
    body{
    }
    h3{
        font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    }
    .login-register-box{
        margin-top: 50px;
    }
    .login-wrap{
        border-radius: 20px;
        text-align:center; 
        background: #FFFFFF;
        width: 400px;
        height: auto;
        margin: 10px auto;
        padding: 10px;
        padding-bottom: 50px;
    } 
    .register-wrap{
        border-radius: 20px;
        text-align:center;         
        background: #FFFFFF;
        width: 400px;
        height: auto;
        margin: 10px auto;
        padding: 10px;
        padding-bottom: 50px;
    } 
    input{
        display:block; 
        width:250px; 
        height:40px; 
        line-height:40px; 
        margin:10px auto; 
        outline:none; 
        border:1px solid #888; 
        padding:10px; 
        box-sizing:border-box;
    }
    .el-button{
        width:300px; 
        height:40px; 
        margin:30px 30px; 
        border:none; 
    }
</style>

<script>
    import {setCookie, getCookie} from '../../assets/js/cookie.js'
    export default{
        data(){
            return{
                serverendURL: 'http://localhost:4000',
                showLogin: false,
                showRegister: false,
                showHint: false,
                hint: '',
                username: '',
                password: '',
                newUsername: '',
                newPassword: '',
                newEmail: '',
                newPhone: ''
            }
        },

        // 如果获取cookie成功，则跳转到主页，无需登录
        mounted() {
            if (getCookie('username')) {
                this.$router.push('/home')
            }
            
            setTimeout(() =>{
                this.showLogin = true
            },500);
        },        

        methods:{
            ToLogin(){
                this.showRegister = false
                setTimeout(() =>{
                    this.showLogin = true
                },500);
            },

            login() {
                if (this.username == "" || this.password == "") {
                    this.$message('请输入用户名或密码');
                } else {
                    let data = {'username': this.username, 'password': this.password}
                }

                // this.$http.post(serverendURL + 'account_info', data).then((res) => {
                //     console.log(res)
                //     if (res.data == -1) {
                //         this.hint = '该用户不存在'
                //         this.showHint = true
                //     } else if (res.data == 0) {
                //         this.hint = '密码错误'
                //         this.showHint = true
                //     } else if (res.data = 'admin') {
                //         this.$router.push('/main')
                //     } else {
                //         this.hint = '登陆成功'
                //         this.showHint = true
                //         setCookie('username',this.username,1000*60)
                //         setTimeout(function(){
                //             this.$router.push({path:'home',query:{id:1}})
                //         }.bind(this),1000)
                //     }
                //  }) 

                 this.$router.push('/main')
            },

            ToRegister(){
                this.showLogin = false
                setTimeout(() =>{
                    this.showRegister = true
                },500);
            },

            register(){
                if (this.newUsername == "" || this.newPassword == "" || this.newEmail == "" || this.newPhone == ""){
                    this.$message('请输入用户名或密码');
                } else {
                    let data = {'username':this.newUsername,'password':this.newPassword, 'email':this.newEmail, "phone":this.newPhone}
                    this.$http.post(serverendURL + 'account_info',data).then((res)=>{
                        console.log(res)
                        if(res.data == "ok"){
                            this.hint = "注册成功"
                            this.showHint = true
                            this.username = ''
                            this.password = ''
                            setTimeout(function(){
                                this.showRegister = false
                                this.showLogin = true
                                this.showHint = false
                            }.bind(this),1000)
                        }
                    })
                }
            }   
        }
    }
</script>