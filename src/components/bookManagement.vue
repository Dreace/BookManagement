<template>
    <div>
        <div class="el-form-container">
            <el-row>
                <el-button type="primary" @click="dialogAddBookVisible = true">增加书籍</el-button>
                <el-button type="success" @click="dialogReturnBookVisible = true">归还书籍</el-button>
            </el-row>
            <el-row class="tac">
                <el-col>
                    <el-table
                            :data="bookTable"
                            class="book-table"
                            border
                            height="530"
                            style="width: 100%">
                        <el-table-column
                                prop="bookID"
                                label="ID">
                        </el-table-column>
                        <el-table-column
                                prop="name"
                                label="书名">
                        </el-table-column>
                        <el-table-column
                                prop="ISBN"
                                label="ISBN">
                        </el-table-column>
                        <el-table-column
                                prop="author"
                                label="作者">
                        </el-table-column>
                        <el-table-column
                                prop="press"
                                label="出版社">
                        </el-table-column>
                        <el-table-column
                                prop="price"
                                label="价格">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button
                                        size="mini"
                                        @click="bookEdit(scope.row)">编辑
                                </el-button>
                                <el-button
                                        size="mini"
                                        type="danger"
                                        @click="bookDelete(scope.row)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
            <el-dialog title="归还书籍" :visible.sync="dialogReturnBookVisible" width="35%">
                <div>
                    <el-autocomplete
                            v-model="state"
                            :fetch-suggestions="querySearchAsync"
                            placeholder="请输入书籍编号"
                            :trigger-on-focus="false"
                            @select="handleSelect">
                        <le-template slot="prepend">书籍编号</le-template>
<!--                        <el-button slot="append" icon="el-icon-search"/>-->
                    </el-autocomplete>
                </div>
                <div>
                    <el-form model="form" label-position="left" inline class="demo-table-expand">
                        <el-form-item label="图书名称">
                            <span>{{ form.name }}</span>
                        </el-form-item>
                        <el-form-item label="借书人">
                            <span>{{ form.borrower }}</span>
                        </el-form-item>
                        <el-form-item label="借书日期">
                            <span>{{ form.borrowDate }}</span>
                        </el-form-item>
                        <el-form-item label="截止日期">
                            <span>{{ form.deadline }}</span>
                        </el-form-item>
                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogReturnBookVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogReturnBookVisible = false">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog title="增加书籍"
                       :visible.sync="dialogAddBookVisible"
                       width="35%">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm"
                         label-width="100px" class="demo-ruleForm">
                    <el-form-item label="书籍名称" prop="name">
                        <el-input v-model="ruleForm.name"/>
                    </el-form-item>
                    <el-form-item label="ISBN" prop="ISBN">
                        <el-input v-model="ruleForm.ISBN"/>
                    </el-form-item>
                    <el-form-item label="作者" prop="author">
                        <el-input v-model="ruleForm.author"/>
                    </el-form-item>
                    <el-form-item label="出版社" prop="press">
                        <el-input v-model="ruleForm.press"/>
                    </el-form-item>
                    <el-form-item label="价格" prop="price">
                        <el-input v-model="ruleForm.price"/>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelAddBook">取 消</el-button>
                    <el-button type="primary" @click="confirmAddBook('ruleForm')" :loading="isLoadingAdd">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog title="修改书籍" :visible.sync="dialogModifyBookVisible" width="35%">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="书籍编号" prop="bookID">
                        <el-input v-model="ruleForm.bookID" disabled/>
                    </el-form-item>
                    <el-form-item label="书籍名称" prop="name">
                        <el-input v-model="ruleForm.name"/>
                    </el-form-item>
                    <el-form-item label="ISBN" prop="ISBN">
                        <el-input v-model="ruleForm.ISBN"/>
                    </el-form-item>
                    <el-form-item label="作者" prop="author">
                        <el-input v-model="ruleForm.author"/>
                    </el-form-item>
                    <el-form-item label="出版社" prop="press">
                        <el-input v-model="ruleForm.press"/>
                    </el-form-item>
                    <el-form-item label="价格" prop="price">
                        <el-input v-model="ruleForm.price"/>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelBookEdit">取 消</el-button>
                    <el-button type="primary" @click="bookEdit()" :loading="isLoadingEdit">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    export default {
        methods: {
            handleOpen(key, keyPath) {
                // eslint-disable-next-line no-console
                console.log(key, keyPath);
            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(() => {
                        done();
                    })
                    .catch(() => {
                    });
            },

            //从服务器获得书籍
            searchBook(keywords, type) {
                let vm = this;
                this.$api({
                    method: "GET",
                    url: "GetBookList",
                    params: {
                        keywords: keywords,
                        type: type
                    }
                }).then(res => vm.bookTable = res.data);
            },
            //增加书籍确认
            confirmAddBook(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.isLoadingAdd = true;
                        this.$confirm('将增添书名为' + this.ruleForm.name + '的图书', '确认添加', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$api({
                                method: "POST",
                                url: "/AddBook",
                                data: {
                                    name: this.ruleForm.name,
                                    ISBN: this.ruleForm.ISBN,
                                    author: this.ruleForm.author,
                                    press: this.ruleForm.press,
                                    price: this.ruleForm.price
                                }
                            }).then(() => {
                                this.$message({
                                    type: 'success',
                                    message: '添加成功'
                                });
                                this.$('#ruleForm').reset()
                                this.searchBook('','book_id')
                                this.dialogAddBookVisible = false;
                            }).catch((error) => {
                                window.console.log(error)
                            }).finally(() => this.isLoadingAdd = false)
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消操作'
                            });
                            this.isLoadingAdd = false;
                        });
                    } else {
                        return false;
                    }
                });

            },
            cancelAddBook() {
                this.dialogAddBookVisible = false
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                });
            },
            //修改书籍信息
            bookEdit(row) {
                this.dialogModifyBookVisible = true
                this.ruleForm = Object.assign({}, row)
                this.$('#ruleForm').reset()
                // this.$refs[formName].validate((valid) => {
                //     if (valid) {
                //         this.isLoadingEdit = true;
                //         this.$confirm('将修改ID为' + this.ruleForm.bookID + '的图书', '确认修改', {
                //             confirmButtonText: '确定',
                //             cancelButtonText: '取消',
                //             type: 'warning'
                //         }).then(() => {
                //             this.$api({
                //                 method: "POST",
                //                 url: "/UpdateBook",
                //                 data: {
                //                     name: this.ruleForm.name,
                //                     ISBN: this.ruleForm.ISBN,
                //                     author: this.ruleForm.author,
                //                     press: this.ruleForm.press,
                //                     price: this.ruleForm.price
                //                 }
                //             }).then(() => {
                //                 this.$message({
                //                     type: 'success',
                //                     message: '修改成功'
                //                 });
                //                 this.searchBook('','book_id')
                //                 this.dialogModifyBookVisible = false;
                //             }).catch((error) => {
                //                 window.console.log(error)
                //             }).finally(() => this.isLoadingEdit = false)
                //         }).catch(() => {
                //             this.$message({
                //                 type: 'info',
                //                 message: '已取消操作'
                //             });
                //             this.isLoadingEdit = false;
                //         });
                //     } else {
                //         return false;
                //     }
                // });
            },
            cancelBookEdit(){
                this.dialogModifyBookVisible = false
                this.$('#ruleForm').reset()
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                });
            },
            //删除书籍信息
            bookDelete(row) {
                this.$confirm('将删除书号 ' + row.bookID + '的图书, 是否继续?', '确认删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$api({
                        method: "POST",
                        url: "/DeleteBook",
                        data: {
                            bookID: row.bookID
                        }
                    }).then(() => {
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        });
                        this.searchBook('','book_id')
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

            querySearchAsync(queryString, cb) {
                var bookTable = this.bookTable;
                var results = queryString ? bookTable.filter(this.createStateFilter(queryString)) : bookTable;

                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    cb(results);
                }, 3000 * Math.random());
            },

            createStateFilter(queryString) {
                return (state) => {
                    return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },

            //自动查询书籍编号
            handleSelect(row) {
                this.form = Object.assign({}, row)
            },

            //校验规则
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        alert('submit!');
                    } else {
                        // console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }

        },

        data() {
            return {

                bookTable: [],
                state: '',
                timeout: null,
                searchType: "book_id",

                isLoadingAdd: false,
                isLoadingEdit: false,
                dialogAddBookVisible: false,
                dialogReturnBookVisible: false,
                dialogModifyBookVisible: false,

                form: {
                    bookID: '',
                    name: '',
                    ISBN: '',
                    borrower: '',
                    borrowDate: '',
                    deadline: ''
                },
                formLabelWidth: '120px',

                ruleForm: {
                    bookID: '',
                    name: '',
                    ISBN: '',
                    author: '',
                    press: '',
                    price: '',
                },

                rules: {
                    bookID: [
                        {required: true, message: '请输入书籍编号', trigger: 'blur'},
                        {min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请输入书籍名称', trigger: 'blur'},
                        {min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur'}
                    ],
                    ISBN: [
                        {required: true, message: '请输入书籍ISBN', trigger: 'blur'},
                        {min: 1, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
                    ],
                    author: [
                        {required: true, message: '请输入作者', trigger: 'blur'},
                        {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
                    ],
                    press: [
                        {required: true, message: '请输入出版社', trigger: 'blur'},
                        {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
                    ],
                    price: [
                        {required: true, message: '请输入价格', trigger: 'blur'},
                        {min: 2, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
                    ],
                }
            };
        },
        mounted() {
            this.searchBook('','book_id')
        }
    }


</script>

<style>
    .demo-table-expand {
        font-size: 0;
    }

    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }

    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }

    .book-table {
        margin-top: 30px;
    }
</style>