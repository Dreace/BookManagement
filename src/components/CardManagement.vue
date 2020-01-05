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
                        <el-input v-model="inputValue" placeholder="输入搜索内容" clearable>
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
            <el-table :data="cardTable" class="card-table" border height="500">
                <el-table-column prop="cardID" label="卡号" width="200"/>
                <el-table-column label="姓名" width="130">
                    <template slot-scope="scope">
                        <i class="el-icon-user"/>
                        <span style="margin-left: 10px">{{ scope.row.cardholder }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="开卡日期">
                    <template slot-scope="scope" v-if="scope.row.date">
                        <i class="el-icon-date"/>
                        <span style="margin-left: 10px">{{ new Date(scope.row.date*1000).toLocaleString() }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="联系电话">
                    <template slot-scope="scope">
                        <i class="el-icon-phone-outline"/>
                        <span style="margin-left: 10px">{{ scope.row.telephone }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="邮箱地址">
                    <template slot-scope="scope">
                        <i class="el-icon-message"/>
                        <span style="margin-left: 10px">{{ scope.row.email }}</span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="210px">
                    <template slot-scope="scope">
                        <el-button size="mini" type="warning" plain @click="cardHistory(scope.row)">历史</el-button>
                        <el-button size="mini" type="primary" plain @click="cardReplenish(scope.row)">补办</el-button>
                        <el-button size="mini" type="danger" @click="cardDelete(scope.row)">注销</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="办理借书卡" :visible.sync="transactCardDialog" width="30%" @close="closeTransactCard">
            <el-form :model="form" label-width="80px" :rules="rules" ref="ruleForm" class="transactForm">
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
                <el-button @click="closeTransactCard">取消</el-button>
                <el-button type="primary" @click="confirmTransactCard('ruleForm')" :loading="isLoading">办理</el-button>
            </div>
        </el-dialog>
        <el-dialog title="借书历史" :visible.sync="cardHistoryDialog" width="1000px" @close="closeCardHistory">
            <el-table :data="bookHistoryTable" @expand-change="bookHistoryShow" height="450" width="900px">
                <el-table-column label="单号" width="300px" prop="slipID"/>
                <el-table-column label="借书日期" width="250px">
                    <template slot-scope="scope" v-if="scope.row.borrowingTime">
                        <span> {{  new Date(scope.row.borrowingTime*1000).toLocaleString() }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="截止日期" width="250px">
                    <template slot-scope="scope" v-if="scope.row.dueTime">
                        <span> {{  new Date(scope.row.dueTime*1000).toLocaleString() }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="书籍数量" width="90px" prop="count"/>
                <el-table-column type="expand" height="100%">
                    <template slot-scope="scope">
                        <el-table :data="scope.row.books" border>
                            <el-table-column label="书籍编号" prop="bookID" width="150"/>
                            <el-table-column label="书名" prop="name" width="200"/>
                            <el-table-column label="作者" prop="author" width="150"/>
                            <el-table-column label="出版社" prop="press" width="170"/>
                            <el-table-column label="归还日期" prop="returnTime" width="150"/>
                        </el-table>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'CardManagement',
        data() {
            return {
                cardTable: [],
                cardHistoryTable: [],
                bookHistoryTable: [],
                inputValue: '',
                bookMap: new Map(),
                select: '卡号',
                searchType: "card_id",
                transactCardDialog: false,
                cardHistoryDialog: false,
                isLoading: false,
                form: {
                    name: '',
                    telephone: '',
                    email: ''
                },
                rules: {
                    name: [{required: true, type: "string", message: '输入姓名', trigger: 'blur'},
                        {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}],
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
            this.searchCard('', 'card_id')
        },
        watch: {
            inputValue(newInputValue) {
                if (newInputValue && newInputValue.length > 0) {
                    this.searchCard(newInputValue, this.searchType)
                } else {
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
                this.cardHistoryDialog = true;
                this.bookHistoryTable = [];
                this.$api({
                    method: "GET",
                    url: "GetCardBorrowList",
                    params: {
                        cardID: row.cardID
                    }
                }).then(res => {
                    let bookMap = {};
                    let bookHistoryTable = [];
                    for (let item of res.data) {
                        if (!bookMap[item.slipID]) {
                            bookMap[item.slipID] = []
                        }
                        bookMap[item.slipID].push(item)
                    }
                    for (let slip_id in bookMap) {
                        bookHistoryTable.push({
                            slipID: slip_id,
                            count: bookMap[slip_id].length,
                            borrowingTime: bookMap[slip_id][0].borrowingTime,
                            dueTime: bookMap[slip_id][0].dueTime,
                            books: bookMap[slip_id],
                        })
                    }
                    this.bookHistoryTable = bookHistoryTable;
                });
            },
            bookHistoryShow(row) {
                if (row.books[0].name) {
                    return
                }
                for (let book of row.books) {
                    this.$api({
                        method: "GET",
                        url: "GetBookList",
                        params: {
                            keywords: book.bookID,
                            type: "book_id"
                        }
                    }).then(res => {
                        book.author = res.data[0].author;
                        book.press = res.data[0].press;
                        book.returnTime = book.isRepaid ? new Date(book.returnTime * 1000).toLocaleDateString() : "未归还";
                        this.$set(book, "name", res.data[0].name);
                    });
                }
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
                                this.$refs.ruleForm.resetFields();
                                this.searchCard(this.inputValue, this.searchType)
                            }).catch((error) => {
                                window.console.log(error)
                            }).finally(() => this.isLoading = false)
                        }).catch(() => {
                            this.isLoading = false;
                        });
                    } else {
                        return false;
                    }
                });
            },
            closeTransactCard() {
                this.transactCardDialog = false;
                this.$refs.ruleForm.resetFields();
            },
            closeCardHistory() {
                this.cardHistoryDialog = false;
                this.cardHistoryTable = [];
            }
        }
    }
</script>

<style>
    .el-table__expanded-cell .el-table th.gutter {
        display: none !important;
    }

    .el-table th.gutter {
        display: table-cell !important;
    }

    .el-table__body, .el-table__footer, .el-table__header {
        table-layout: unset !important;
    }

    .el-table__body-wrapper::-webkit-scrollbar {
        /*width: 0;*/
        width: 7px;
    }

    .el-table__body-wrapper::-webkit-scrollbar-thumb {
        border-radius: 2px;
        height: 50px;
        background: #aeaeae;
    }

    .el-table__body-wrapper::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px white;
        border-radius: 2px;
        background: white;
    }

    .el-select .el-input {
        width: 80px;
    }

    .grid-content {
        width: 100%;
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

    .transactForm {
        width: 20vw;
        margin: 0 auto;
    }
</style>
