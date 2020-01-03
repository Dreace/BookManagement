<template>
    <div>
        <div class="book-container">
            <el-row>
                <el-col :span="8">
                    <el-button type="primary" @click="dialogAddBookVisible = true">增加书籍</el-button>
                    <el-button type="success" @click="dialogReturnBookVisible = true">归还书籍</el-button>
                </el-col>
            </el-row>
            <el-row class="tac">
                <el-col>
                    <el-table
                            :data="bookTable"
                            class="book-table"
                            border
                            height="530">
                        <el-table-column
                                width="150"
                                prop="bookID"
                                label="ID">
                        </el-table-column>
                        <el-table-column
                                prop="name"
                                label="书名">
                        </el-table-column>
                        <el-table-column
                                width="150"
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
                                width="80"
                                prop="price"
                                label="价格">
                        </el-table-column>
                        <el-table-column label="操作" width="150">
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
                <div class="return-book-style">
                    <el-autocomplete
                            v-model="state"
                            :fetch-suggestions="querySearchAsync"
                            placeholder="请输入书籍编号"
                            value-key="bookID"
                            @select="handleSelect">
                        <le-template slot="prepend">书籍编号</le-template>
                        <!--                        <el-button slot="append" icon="el-icon-search"/>-->
                    </el-autocomplete>
                    <div class="return-book-form">
                        <el-form :model="returnBookForm"
                                 ref="returnForm"
                                 label-position="left" class="demo-table-expand">
                            <el-form-item label="图书名称">
                                <span>{{ returnBookForm.name }}</span>
                            </el-form-item>
                            <el-form-item label="ISBN">
                                <span>{{ returnBookForm.ISBN }}</span>
                            </el-form-item>
                            <el-form-item label="作者">
                                <span>{{ returnBookForm.author }}</span>
                            </el-form-item>
                            <el-form-item label="是否已借">
                                <span>{{ returnBookForm.isBorrowed }}</span>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelReturnBook">取 消</el-button>
                    <el-button type="primary" @click="confirmReturnBook('returnForm')" :loading="isLoadingReturn">确 定
                    </el-button>
                </div>
            </el-dialog>
            <el-dialog title="增加书籍" :visible.sync="dialogAddBookVisible" width="35%">
                <el-form :model="addBookForm" :rules="addRules" ref="addForm"
                         label-width="100px" class="demo-ruleForm">
                    <el-form-item label="书籍名称" prop="name">
                        <el-input v-model="addBookForm.name"/>
                    </el-form-item>
                    <el-form-item label="ISBN" prop="ISBN">
                        <el-input v-model="addBookForm.ISBN"/>
                    </el-form-item>
                    <el-form-item label="作者" prop="author">
                        <el-input v-model="addBookForm.author"/>
                    </el-form-item>
                    <el-form-item label="出版社" prop="press">
                        <el-input v-model="addBookForm.press"/>
                    </el-form-item>
                    <el-form-item label="价格" prop="price">
                        <el-input v-model="addBookForm.price"/>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelAddBook">取 消</el-button>
                    <el-button type="primary" @click="confirmAddBook('addForm')" :loading="isLoadingAdd">确 定
                    </el-button>
                </div>
            </el-dialog>
            <el-dialog title="修改书籍" :visible.sync="dialogModifyBookVisible" width="35%">
                <el-form :model="bookForm" :rules="editRules" ref="editForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="书籍编号" prop="bookID">
                        <el-input v-model="bookForm.bookID" disabled/>
                    </el-form-item>
                    <el-form-item label="书籍名称" prop="name">
                        <el-input v-model="bookForm.name"/>
                    </el-form-item>
                    <el-form-item label="ISBN" prop="ISBN">
                        <el-input v-model="bookForm.ISBN"/>
                    </el-form-item>
                    <el-form-item label="作者" prop="author">
                        <el-input v-model="bookForm.author"/>
                    </el-form-item>
                    <el-form-item label="出版社" prop="press">
                        <el-input v-model="bookForm.press"/>
                    </el-form-item>
                    <el-form-item label="价格" prop="price">
                        <el-input v-model.number="bookForm.price"/>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelBookEdit">取 消</el-button>
                    <el-button type="primary" @click="confirmBookEdit('editForm')" :loading="isLoadingEdit">确 定
                    </el-button>
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
            //归还书籍确认
            confirmReturnBook(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.isLoadingAdd = true;
                        this.$confirm('将归还ID为：' + this.returnBookForm.bookID + '的图书', '确认归还', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$api({
                                method: "POST",
                                url: "/Return",
                                data: {
                                    bookID: this.returnBookForm.bookID
                                }
                            }).then(() => {
                                this.$message({
                                    type: 'success',
                                    message: '归还成功'
                                });
                                this.dialogReturnBookVisible = false;
                                this.returnBookForm = '';
                                this.state = '';
                            }).catch((error) => {
                                window.console.log(error)
                            }).finally(() => this.isLoadingReturn = false)
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消操作'
                            });
                            this.isLoadingReturn = false;
                        });
                    } else {
                        return false;
                    }
                });

            },
            cancelReturnBook() {
                this.returnBookForm = '';
                this.state = '';
                this.dialogReturnBookVisible = false;
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                });
            },
            //增加书籍确认
            confirmAddBook(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.isLoadingAdd = true;
                        this.$confirm('将增添书名为' + this.addBookForm.name + '的图书', '确认添加', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$api({
                                method: "POST",
                                url: "/AddBook",
                                data: {
                                    name: this.addBookForm.name,
                                    ISBN: this.addBookForm.ISBN,
                                    author: this.addBookForm.author,
                                    press: this.addBookForm.press,
                                    price: this.addBookForm.price
                                }
                            }).then(() => {
                                this.$message({
                                    type: 'success',
                                    message: '添加成功'
                                });
                                this.searchBook('', 'book_id')
                                this.dialogAddBookVisible = false;
                                this.$refs[formName].resetFields();
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
                this.$refs.addForm.resetFields();
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                });
            },
            //修改书籍信息
            bookEdit(row) {
                this.dialogModifyBookVisible = true
                this.bookForm = Object.assign({}, row)
            },
            //确认图书修改
            confirmBookEdit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.isLoadingEdit = true;
                        this.$confirm('将修改ID为' + this.bookForm.bookID + '的图书', '确认修改', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$api({
                                method: "POST",
                                url: "/UpdateBook",
                                data: {
                                    bookID: this.bookForm.bookID,
                                    name: this.bookForm.name,
                                    ISBN: this.bookForm.ISBN,
                                    author: this.bookForm.author,
                                    press: this.bookForm.press,
                                    price: this.bookForm.price
                                }
                            }).then(() => {
                                this.$message({
                                    type: 'success',
                                    message: '修改成功'
                                });
                                this.searchBook('', 'book_id')
                                this.dialogModifyBookVisible = false;
                            }).catch((error) => {
                                window.console.log(error)
                            }).finally(() => this.isLoadingEdit = false)
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消操作'
                            });
                            this.isLoadingEdit = false;
                        });
                    } else {
                        return false;
                    }
                });
            },
            cancelBookEdit() {
                this.dialogModifyBookVisible = false
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
                        this.searchBook('', 'book_id')
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
            //选择书号触发
            handleSelect() {
                let vm = this;
                this.$api({
                    method: "GET",
                    url: "GetBookList",
                    params: {
                        keywords: this.state,
                        type: 'book_id'
                    }
                }).then(res => vm.returnBookForm = res.data[0]);
            },


            //校验规则
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        alert('submit!');
                    } else {
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            //从服务器获得已借书籍ID
            querySearchAsync(queryString, cb) {
                this.$api({
                    method: "GET",
                    url: "Return/BookList",
                    params: {
                        "bookID": queryString
                    }
                }).then((res) => cb(res.data));
            },
        },

        data() {
            return {

                bookTable: [],
                state: '',
                timeout: null,
                searchType: "book_id",


                isLoadingAdd: false,
                isLoadingReturn: false,
                isLoadingEdit: false,
                dialogAddBookVisible: false,
                dialogReturnBookVisible: false,
                dialogModifyBookVisible: false,


                formLabelWidth: '120px',

                bookForm: {
                    bookID: '',
                    name: '',
                    ISBN: '',
                    author: '',
                    press: '',
                    price: '',
                },

                returnBookForm: {
                    bookID: '',
                    name: '',
                    ISBN: '',
                    author: '',
                    isBorrowed: ''
                },

                addBookForm: {
                    bookID: '',
                    name: '',
                    ISBN: '',
                    author: '',
                    press: '',
                    price: '',
                },

                addRules: {
                    bookID: [
                        {required: true, message: '请输入书籍编号', trigger: 'blur'},
                        {min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请输入书籍名称', trigger: 'blur'},
                        {min: 0, max: 30, message: '长度在 0 到 30 个字符', trigger: 'blur'}
                    ],
                    ISBN: [
                        {required: true, message: '请输入书籍ISBN', trigger: 'blur'},
                        {min: 0, max: 15, message: '长度在 0 到 15 个字符', trigger: 'blur'}
                    ],
                    author: [
                        {required: true, message: '请输入作者', trigger: 'blur'},
                        {min: 0, max: 30, message: '长度在 0 到 30 个字符', trigger: 'blur'}
                    ],
                    press: [
                        {required: true, message: '请输入出版社', trigger: 'blur'},
                        {min: 0, max: 30, message: '长度在 0 到 30 个字符', trigger: 'blur'}
                    ],
                    price: [
                        {required: true, message: '请输入价格', trigger: 'blur'},
                        {min: 0, max: 10, message: '长度在 0 到 10 个字符', trigger: 'blur'}
                    ],
                },

                editRules: {
                    name: [
                        {required: true, message: '请输入书籍名称', trigger: 'blur'},
                        {min: 0, max: 200, message: '长度在 0 到 200 个字符', trigger: 'blur'}
                    ],
                    ISBN: [
                        {min: 0, max: 15, message: '长度在 0 到 15 个字符', trigger: 'blur'}
                    ],
                    author: [
                        {required: false, message: '请输入作者', trigger: 'blur'},
                        {min: 0, max: 200, message: '长度在 0 到 200 个字符', trigger: 'blur'}
                    ],
                    press: [
                        {required: true, message: '请输入出版社', trigger: 'blur'},
                        {min: 0, max: 100, message: '长度在 0 到 100 个字符', trigger: 'blur'}
                    ],
                    price: [
                        {min: 0, max: 1000, type: "number", message: '大小在 0 到 1000 '}
                    ],
                }
            };
        },
        watch: {
            returnBookForm: function (book) {
                window.console.log(book)
            }
        },
        mounted() {
            this.searchBook('', 'book_id');
        }
    }


</script>

<style>
    .demo-table-expand {
        font-size: 0;
        width: 800px;
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
        margin-top: 10px;
    }

    .book-container {
        height: 80vh;
        width: 80vw;
        margin: 0 auto;

    }

    .return-book-style {

        margin: 0 auto;
    }

    .return-book-form {
        margin-top: 30px;
    }

</style>