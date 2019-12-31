<template>
    <div id="app">
        <el-container>
            <el-header>
                <el-row type="flex" class="row-bg" justify="space-around">
                    <el-col :span="6" class="app">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-book"/>
                        </svg>
                        <label class="app-name hidden-sm-and-down">简单图书</label>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content bg-purple-light"></div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                            <router-link to="/cardManagement">
                                <el-link>借书卡管理</el-link>
                            </router-link>
                            <router-link to="/login">
                                <el-link>登录</el-link>
                            </router-link>
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
        name: 'app'
    }
</script>

<style>
    #app {
        font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    }

    .app {
        font-size: 1.5em;
    }

    .app-name {
        margin-left: 20px;
    }

    .bg-purple {
        background: #d3dce6;
    }

    .bg-purple-light {
        background: #e5e9f2;
    }

    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }

    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }

    .icon {
        width: 1em;
        height: 1em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
    }
</style>
