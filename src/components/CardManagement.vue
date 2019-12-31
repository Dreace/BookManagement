<template>
    <div id="app">
        <div class="card-container">
            <el-row>
                <el-col :span="8">
                    <div class="grid-content">
                        <el-button type="primary" @click="transactCard()">办理借书卡</el-button>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content"></div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content">
                        <el-input v-model="inputValue" placeholder="输入搜索内容">
                            <el-select v-model="searchID" slot="prepend" placeholder="请选择">
                                <el-option label="卡号" value="cardID"/>
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
                        width="100">
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
                        label="办卡日期"
                        width="150">
                    <template slot-scope="scope">
                        <i class="el-icon-time"/>
                        <span style="margin-left: 10px">{{ scope.row.date }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="联系电话">
                    <template slot-scope="scope">
                        <i class="el-icon-phone"/>
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
                                @click="cardHistory(scope.$index, scope.row)">历史
                        </el-button>
                        <el-button
                                size="mini"
                                type="primary"
                                plain
                                @click="cardReplenish(scope.$index, scope.row)">补办
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="cardDelete(scope.$index, scope.row)">注销
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
                testTable: [{
                    cardID: '123456',
                    cardholder: '张三',
                    date: '2019/12/01',
                    telephone: '25434236456',
                    email: '123456789@126.com'
                }, {
                    cardID: '123466',
                    cardholder: '李四',
                    date: '2019/12/02',
                    telephone: '34563354657',
                    email: '123456789@126.com'
                }, {
                    cardID: '123556',
                    cardholder: '王五',
                    date: '2019/12/03',
                    telephone: '56785675678',
                    email: '123456789@126.com'
                }, {
                    cardID: '124456',
                    cardholder: '赵六',
                    date: '2019/12/04',
                    telephone: '56745647567',
                    email: '123456789@126.com'
                }, {
                    cardID: '133456',
                    cardholder: '张八',
                    date: '2019/12/05',
                    telephone: '12345678910',
                    email: '123456789@126.com'
                }, {
                    cardID: '223456',
                    cardholder: '李九',
                    date: '2019/12/06',
                    telephone: '12345213455',
                    email: '123456789@126.com'
                }, {
                    cardID: '123458',
                    cardholder: '赵十',
                    date: '2019/12/07',
                    telephone: '12435632323',
                    email: '123456789@126.com'
                }, {
                    cardID: '123476',
                    cardholder: '钟十一',
                    date: '2019/12/08',
                    telephone: '43576874567',
                    email: '123456789@126.com'
                }, {
                    cardID: '123656',
                    cardholder: '张九',
                    date: '2019/12/09',
                    telephone: '45678356345',
                    email: '123456789@126.com'
                }, {
                    cardID: '125456',
                    cardholder: '张一',
                    date: '2019/12/10',
                    telephone: '12345633336',
                    email: '123456789@126.com'
                }, {
                    cardID: '123466',
                    cardholder: '李四',
                    date: '2019/12/02',
                    telephone: '34563354657',
                    email: '123456789@126.com'
                }, {
                    cardID: '123556',
                    cardholder: '王五',
                    date: '2019/12/03',
                    telephone: '56785675678',
                    email: '123456789@126.com'
                }, {
                    cardID: '124456',
                    cardholder: '赵六',
                    date: '2019/12/04',
                    telephone: '56745647567',
                    email: '123456789@126.com'
                }, {
                    cardID: '133456',
                    cardholder: '张八',
                    date: '2019/12/05',
                    telephone: '12345678910',
                    email: '123456789@126.com'
                }, {
                    cardID: '223456',
                    cardholder: '李九',
                    date: '2019/12/06',
                    telephone: '12345213455',
                    email: '123456789@126.com'
                }, {
                    cardID: '123458',
                    cardholder: '赵十',
                    date: '2019/12/07',
                    telephone: '12435632323',
                    email: '123456789@126.com'
                }, {
                    cardID: '123476',
                    cardholder: '钟十一',
                    date: '2019/12/08',
                    telephone: '43576874567',
                    email: '123456789@126.com'
                }, {
                    cardID: '123656',
                    cardholder: '张九',
                    date: '2019/12/09',
                    telephone: '45678356345',
                    email: '123456789@126.com'
                }, {
                    cardID: '125456',
                    cardholder: '张一',
                    date: '2019/12/10',
                    telephone: '12345633336',
                    email: '123456789@126.com'
                }],
                cardTable: [],
                inputValue: '',
                select: '卡号',
                searchID: "cardID"
            }
        },
        watch: {
            inputValue: function (newInputValue) {
                this.cardTable = newInputValue ? this.testTable.filter(this.createStateFilter(newInputValue)) : this.testTable
            }
        },
        methods: {
            cardHistory(index, row) {
                window.console.log(index, row);
            },
            cardDelete(index, row) {
                window.console.log(index, row);
            },
            cardReplenish(index, row) {
                window.console.log(index, row);
            },
            transactCard() {
                window.console.log("transact");
            },
            createStateFilter(queryString) {
                let vm = this;
                return (state) => {
                    return (state[vm.searchID].toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
                };
            }
        },
        mounted() {
            this.cardTable = this.testTable;
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
