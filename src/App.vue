<template>
    <div id="app">
        <el-container>
            <el-header>
                <el-row type="flex" class="row-bg" justify="space-around">

                    <el-col :span="3" class="app">
                        <router-link to="/">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-book"/>
                            </svg>
                            <label class="app-name hidden-sm-and-down">简单图书</label>
                        </router-link>
                    </el-col>
                    <el-col :span="10">
                        <el-menu mode="horizontal" router v-if="$store.state.userInfo.isLogin">
                            <el-menu-item index="/cardManagement">
                                <!--                                <router-link to="/cardManagement">-->
                                借书卡管理
                                <!--                                </router-link>-->
                            </el-menu-item>
                        </el-menu>

                    </el-col>
                    <el-col :span="3">
                        <div class=" header-right">
                            <router-link v-if="!$store.state.userInfo.isLogin" to="/login">
                                <el-button icon="el-icon-user">登录</el-button>
                            </router-link>
                            <el-dropdown v-else @command="handleCommand">
                                <el-button>
                                    我的<i class="el-icon-arrow-down el-icon--right"/>
                                </el-button>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="logOut">登出</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </el-col>
                </el-row>

            </el-header>
            <el-main>
                <router-view/>
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
    a {
        text-decoration: none;
        color: black;
    }

    #app {
        font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    }

    .app {
        font-size: 1.5em;
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
