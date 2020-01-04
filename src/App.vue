<template>
    <div id="app">
        <el-container>
            <el-header>
                <el-row type="flex" class="row-bg" justify="space-around">

                    <el-col :span="3" class="app-name">
                        <router-link to="/">
                            <img src="./assets/name.png" alt="">
                        </router-link>
                    </el-col>
                    <el-col :span="10">
                        <el-menu mode="horizontal" router v-if="$store.state.userInfo.isLogin">
                            <el-menu-item index="/bookManagement">
                                书籍管理
                            </el-menu-item>
                            <el-menu-item index="/cardManagement">
                                借书卡管理
                            </el-menu-item>
                        </el-menu>

                    </el-col>
                    <el-col :span="3">
                        <div class=" header-right">
                            <router-link v-if="!$store.state.userInfo.isLogin" to="/login">
                                <el-button icon="el-icon-user">登录</el-button>
                            </router-link>
                            <el-dropdown v-else @command="handleCommand">
                                <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"/>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="logOut">登出</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </el-col>
                </el-row>
            </el-header>
            <el-main>
                <keep-alive>
                    <router-view/>
                </keep-alive>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: 'app',
        data() {
            return {
                menuIndex: 0
            }
        },
        methods: {
            handleCommand: function (command) {
                if (command === "logOut") {
                    this.$setCookie("session", "", -1);
                    this.$store.commit("clear");
                }
            },
        }
    }
</script>

<style>
    .el-dialog__footer {
        width: fit-content;
        margin: 0 auto;
    }


    a {
        text-decoration: none;
        color: black;
    }

    #app {
        font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    }

    .app-name {
        font-size: 1.5em;
    }

    .app-name img {
        max-width: 80%;
        max-height: 100%;
    }

    .header-right {
        display: flex;
        justify-content: flex-end;
    }

    .app-name {
        margin-left: 20px;
    }

    .el-menu.el-menu--horizontal {
        border: none !important;
    }

    .el-col {
        display: flex;
        align-items: center;
    }

    .row-bg {
        /*padding: 10px 0;*/
        /*background-color: #f9fafc;*/
        border-bottom: solid 1px #e6e6e6;
        height: 61px;
    }

    .icon {
        width: 1em;
        height: 1em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
    }
</style>