<template>
    <div id="app">
        <div class="card-container">
            <el-row>
                <el-col :span="8">
                    <div class="grid-content">
                        <el-button type="primary" @click="transactCard">办理借书卡</el-button>
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
                        label="开卡日期"
                        >
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
                searchType: "card_id"
            }
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
            }
            ,
            transactCard() {
                window.console.log("transact");
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

</style>
