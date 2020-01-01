<template>
    <div id="app">
        <div class="card-container">
            <el-row>
                <el-col :span="8">
                    <div class="grid-content">
                        <el-button type="primary" @click="transactCardDialog = true">办理借书卡</el-button>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content"></div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content">
                        <el-input v-model="inputValue" placeholder="输入搜索内容">
                            <el-select v-model="searchType" slot="prepend" placeholder="请选择">
                                <el-option label="卡号" value="card_id"/>
                                <el-option label="姓名" value="cardholder"/>
                                <el-option label="电话" value="telephone"/>
                                <el-option label="邮箱" value="email"/>
                            </el-select>
                            <el-button slot="append" icon="el-icon-search"/>
                        </el-input>
                    </div>
                </el-col>
            </el-row>

            <el-table
                    :data="cardTable"
                    class="card-table"
                    stripe
                    border
                    height="500">
                <el-table-column
                        prop="cardID"
                        label="卡号"
                        width="200">
                </el-table-column>
                <el-table-column
                        label="姓名"
                        width="130">
                    <template slot-scope="scope">
                        <i class="el-icon-user"/>
                        <span style="margin-left: 10px">{{ scope.row.cardholder }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="开卡日期">
                    <template slot-scope="scope" v-if="scope.row.date">
                        <i class="el-icon-date"/>
                        <span style="margin-left: 10px">{{ new Date(scope.row.date*1000).toLocaleString() }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="联系电话">
                    <template slot-scope="scope">
                        <i class="el-icon-phone-outline"/>
                        <span style="margin-left: 10px">{{ scope.row.telephone }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="邮箱地址">
                    <template slot-scope="scope">
                        <i class="el-icon-message"/>
                        <span style="margin-left: 10px">{{ scope.row.email }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="操作"
                        width="210px">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                type="warning"
                                plain
                                @click="cardHistory(scope.row)">历史
                        </el-button>
                        <el-button
                                size="mini"
                                type="primary"
                                plain
                                @click="cardReplenish(scope.row)">补办
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="cardDelete(scope.row)">注销
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="办理借书卡"
                   :visible.sync="transactCardDialog"
                   width="30%">
            <el-form :model="form" label-width="80px"
                     :rules="rules" ref="ruleForm" class="transactForm">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="form.name" autocomplete="off"/>
                </el-form-item>
                <el-form-item label="联系电话" prop="telephone">
                    <el-input v-model="form.telephone" autocomplete="off"/>
                </el-form-item>
                <el-form-item label="邮箱地址" prop="email">
                    <el-input v-model="form.email" autocomplete="off"/>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary" @click="confirmTransactCard('ruleForm')" :loading="isLoading">办理</el-button>
                <el-button @click="cancelTransactCard">取消</el-button>
            </div>

        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'CardManagement',
        data() {
            return {
                cardTable: [],
                inputValue: '',
                select: '卡号',
                searchType: "card_id",
                transactCardDialog: false,
                isLoading: false,
                form: {
                    name: '',
                    telephone: '',
                    email: ''
                },
                rules: {
                    name: [{required: true, type: "string", message: '输入姓名', trigger: 'blur'},
                        {min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur'}],
                    telephone: [{
                        required: true,
                        pattern: /^1[0-9]{10}$|^[569][0-9]{7}$/,
                        message: '输入正确电话号码',
                        trigger: 'blur'
                    }],
                    email: [{required: true, message: '请输入邮箱地址', trigger: ['blur', 'change']},
                        {type: 'email', message: '输入正确的邮箱地址', trigger: 'blur'}]
                }
            }
        },
        mounted() {
            this.searchCard('','card_id')
        },
        watch: {
            inputValue(newInputValue) {
                if (newInputValue && newInputValue.length > 0) {
                    this.searchCard(newInputValue, this.searchType)
                }
            },
            searchType(newSearchType) {
                this.searchCard(this.inputValue, newSearchType)
            }
        },
        methods: {
            searchCard(keywords, type) {
                let vm = this;
                this.$api({
                    method: "GET",
                    url: "GetCardList",
                    params: {
                        keywords: keywords,
                        type: type
                    }
                }).then(res => vm.cardTable = res.data);
            },
            cardHistory(row) {
                window.console.log(row);
            },
            cardDelete(row) {
                this.$confirm('将注销卡号 ' + row.cardID + ', 是否继续?', '确认注销', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$api({
                        method: "POST",
                        url: "/DeleteCard",
                        data: {
                            cardID: row.cardID
                        }
                    }).then(() => {
                        this.$message({
                            type: 'success',
                            message: '注销成功'
                        });
                        this.searchCard(this.inputValue, this.searchType)
                    }).catch((error) => {
                        window.console.log(error)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });
            },
            cardReplenish(row) {
                this.$confirm('将为卡号 ' + row.cardID + ' 补办, 是否继续?', '确认补办', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$api({
                        method: "POST",
                        url: "/ReissueCard",
                        data: {
                            cardID: row.cardID
                        }
                    }).then(() => {
                        this.$message({
                            type: 'success',
                            message: '补办成功'
                        });
                        this.searchCard(this.inputValue, this.searchType)
                    }).catch((error) => {
                        window.console.log(error)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });
            },
            confirmTransactCard(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.isLoading = true;
                        this.$confirm('将为"' + this.form.name + '"办理借书卡', '确认', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$api({
                                method: "POST",
                                url: "/ApplyCard",
                                data: {
                                    cardholder: this.form.name,
                                    telephone: this.form.telephone,
                                    email: this.form.email
                                }
                            }).then(() => {
                                this.$message({
                                    type: 'success',
                                    message: '办理成功'
                                });
                                this.transactCardDialog = false;
                            }).catch((error) => {
                                window.console.log(error)
                            }).finally(() => this.isLoading = false)
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消操作'
                            });
                            this.isLoading = false;
                        });
                    } else {
                        return false;
                    }
                });

            },
            cancelTransactCard() {
                this.transactCardDialog = false
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                });
            }

        }
    }
</script>

<style>
    .el-select .el-input {
        width: 80px;
    }

    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }

    .card-container {
        height: 80vh;
        width: 80vw;
        margin: 0 auto;
    }

    .card-table {
        margin-top: 10px;
    }

    .transactForm{
        width: 20vw;
        margin: 0 auto;
    }
</style>
