<template>
    <div>
        <div class="login-container">
            <div class="login-text">登录简单图书管理系统</div>
            <el-form :model="form" :rules="rules" label-width="70px" class="el-form" ref="loginForm">
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="form.userName" placeholder="请输入用户名" prefix-icon="el-icon-user-solid" clearable/>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" placeholder="请输入密码" show-password
                              prefix-icon="el-icon-s-promotion" clearable/>
                </el-form-item>
                <el-form-item class="login-button">
                    <el-button type="primary" @click="onSubmit('loginForm')">登录</el-button>
                    <el-button @click="resetForm('loginForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>

    export default {
        name: "login",
        data() {
            return {
                form: {
                    userName: "",
                    password: ""
                },
                rules: {
                    userName: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 3, max: 20, message: '密码长度在 3 到 20 个字符', trigger: 'blur'}
                    ],
                }
            }
        },
        methods: {
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            onSubmit: function (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let vm = this;
                        this.$api({
                            method: 'post',
                            url: '/Login',
                            data: {
                                name: this.form.userName,
                                password: this.form.password
                            }
                        }).then((res) => {
                            vm.$store.commit("change", {
                                isLogin: true,
                                name: res.data.name,
                                permission: res.data.permission
                            });
                            this.$store.commit("changeMenuIndex", "/bookManagement")
                            this.$router.push("/bookManagement")
                        }).catch((error) => {
                            window.console.log(error)
                        })
                    }
                })
            }
        }

    }
</script>

<style scoped>
    .login-button {
        width: 100%;
        margin: 0 auto;
    }

    .login-text {
        font-size: 1.8em;
        line-height: 3em;
        text-align: center;
    }

    .el-form {
        width: 70%;
        margin: 0 auto;
    }

    .login-container {
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
        background-color: white;
        padding: 10px;
        max-width: 400px;
        margin: 150px auto 0;
    }

</style>