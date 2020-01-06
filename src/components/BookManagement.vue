<template>
    <div>
        <div class="book-container">
            <el-row>
                <el-col :span="8">
                    <div v-show="$store.state.userInfo.isLogin">
                        <el-button type="primary" @click="dialogAddBookVisible = true"
                                   v-if="$route.path==='/bookManagement'">增添书籍
                        </el-button>
                        <el-button type="warning" @click="dialogBorrowBookVisible = true"
                                   v-if="$route.path==='/borrowAndReturn'">借阅书籍
                        </el-button>
                        <el-button type="success" @click="dialogReturnBookVisible = true"
                                   v-show="$route.path==='/borrowAndReturn'">归还书籍
                        </el-button>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content"></div>
                </el-col>
                <el-col :span="8">
                    <div class="search">
                        <el-input placeholder="请输入内容" v-model="inputBookValue" class="input-with-select" clearable>
                            <el-select v-model="searchBookType" slot="prepend" placeholder="请选择">
                                <el-option label="书号" value="book_id"/>
                                <el-option label="ISBN" value="ISBN"/>
                                <el-option label="书名" value="name"/>
                                <el-option label="作者" value="author"/>
                            </el-select>
                            <el-button slot="append" icon="el-icon-search"/>
                        </el-input>
                    </div>
                </el-col>
            </el-row>

            <el-table :data="bookTable" class="book-table" border height="520">
                <el-table-column width="150" prop="bookID" label="ID"/>
                <el-table-column width="150" prop="name" label="书名"/>
                <el-table-column width="150" prop="ISBN" label="ISBN"/>
                <el-table-column prop="author" label="作者"/>
                <el-table-column prop="press" label="出版社"/>
                <el-table-column width="80" prop="price" label="价格"/>
                <el-table-column width="80" label="是否借出">
                    <template slot-scope="scope">
                        <span>{{scope.row.isBorrowed?"已借出":"在馆"}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200" key="1"
                                 v-if="$store.state.userInfo.isLogin && $route.path==='/bookManagement'">
                    <template slot-scope="scope">
                        <el-button plain type="success" size="mini" @click="repeatAddBook(scope.row)">+1
                        </el-button>
                        <el-button plain type="primary" size="mini" @click="bookEdit(scope.row)">编辑
                        </el-button>
                        <el-button size="mini" type="danger" @click="bookDelete(scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog title="归还书籍" :visible.sync="dialogReturnBookVisible" width="500px"
                       @close="closeReturnDialog(['returnDataForm','returnInputForm'])">
                <div class="return-book">
                    <el-form :model="returnBookIDForm" ref="returnInputForm" :rules="returnRules">
                        <el-form-item prop="bookID">
                            <el-autocomplete class="return-book-input"
                                             v-model="returnBookIDForm.bookID"
                                             :fetch-suggestions="queryReturnSearchAsync"
                                             placeholder="请输入书籍编号"
                                             value-key="bookID"
                                             @select="handleReturnSelect"
                                             clearable>
                                <template slot="prepend">书籍编号</template>
                            </el-autocomplete>
                        </el-form-item>
                        <div class="return-book-form">
                            <el-form :model="returnBookForm"
                                     ref="returnDataForm"
                                     label-position="left" class="demo-table-expand">
                                <el-form-item label="图书名称" class="return-book-item" prop="name">
                                    <span>{{ returnBookForm.name }}</span>
                                </el-form-item>
                                <el-form-item label="ISBN" class="return-book-item" prop="ISBN">
                                    <span>{{ returnBookForm.ISBN }}</span>
                                </el-form-item>
                                <el-form-item label="作者" class="return-book-item" prop="author">
                                    <span>{{ returnBookForm.author }}</span>
                                </el-form-item>
                                <el-form-item label="出版社" class="return-book-item" prop="press">
                                    <span>{{ returnBookForm.press }}</span>
                                </el-form-item>
                                <el-form-item label="出借时间" class="return-book-item" prop="borrowingTime">
                                    <span v-if="returnBookForm.borrowingTime">{{new Date(returnBookForm.borrowingTime*1000).toLocaleString() }}</span>
                                </el-form-item>
                                <el-form-item label="应还期限" class="return-book-item" prop="dueTime">
                                <span v-if="returnBookForm.dueTime">
                                    {{(new Date(returnBookForm.dueTime*1000).toLocaleString()) +(
                                    (Date.now() > returnBookForm.dueTime*1000)?"（已逾期"+
                                    Math.ceil((returnBookForm.dueTime - Date.now()/1000)/86400)+"天）":"")}}
                                </span>
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-form>

                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="closeReturnDialog(['returnInputForm','returnDataForm'])">取 消</el-button>
                    <el-button type="primary" @click="confirmReturnBook('returnInputForm')" :loading="isLoadingReturn">确
                        定
                    </el-button>
                </div>
            </el-dialog>
            <el-dialog title="增添书籍" :visible.sync="dialogAddBookVisible" width="35%" @close="closeAddDialog">
                <el-form :model="addBookForm" :rules="addRules" ref="addForm"
                         label-width="100px" class="demo-ruleForm">
                    <el-form-item label="书籍名称" prop="name">
                        <el-input v-model="addBookForm.name" clearable/>
                    </el-form-item>
                    <el-form-item label="ISBN" prop="ISBN">
                        <el-input v-model="addBookForm.ISBN" clearable/>
                    </el-form-item>
                    <el-form-item label="作者" prop="author">
                        <el-input v-model="addBookForm.author" clearable/>
                    </el-form-item>
                    <el-form-item label="出版社" prop="press">
                        <el-input v-model="addBookForm.press" clearable/>
                    </el-form-item>
                    <el-form-item label="价格" prop="price">
                        <el-input v-model.number="addBookForm.price" clearable/>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelAddBook">取 消</el-button>
                    <el-button type="primary" @click="confirmAddBook('addForm')" :loading="isLoadingAdd">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog title="修改书籍" :visible.sync="dialogModifyBookVisible" width="35%">
                <el-form :model="bookForm" :rules="addRules" ref="editForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="书籍编号" prop="bookID">
                        <el-input v-model="bookForm.bookID" disabled/>
                    </el-form-item>
                    <el-form-item label="书籍名称" prop="name">
                        <el-input v-model="bookForm.name" clearable/>
                    </el-form-item>
                    <el-form-item label="ISBN" prop="ISBN">
                        <el-input v-model="bookForm.ISBN" clearable/>
                    </el-form-item>
                    <el-form-item label="作者" prop="author">
                        <el-input v-model="bookForm.author" clearable/>
                    </el-form-item>
                    <el-form-item label="出版社" prop="press">
                        <el-input v-model="bookForm.press" clearable/>
                    </el-form-item>
                    <el-form-item label="价格" prop="price">
                        <el-input v-model.number="bookForm.price" clearable/>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelBookEdit">取 消</el-button>
                    <el-button type="primary" @click="confirmBookEdit('editForm')" :loading="isLoadingEdit">确 定
                    </el-button>
                </div>
            </el-dialog>
            <el-dialog title="借阅书籍" :visible.sync="dialogBorrowBookVisible" width="500px" @close="closeBorrowDialog">

                <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px"
                         class="demo-dynamic" :rules="borrowRules">
                    <el-form-item prop="cardID" label="借书卡">
                        <el-autocomplete
                                class="borrow-input"
                                clearable
                                v-model="dynamicValidateForm.cardID"
                                :fetch-suggestions="queryCardIDAsync"
                                placeholder="借书卡号"
                                value-key="cardID">
                        </el-autocomplete>
                    </el-form-item>
                    <el-form-item
                            v-for="(book, index) in dynamicValidateForm.books"
                            :label="'图书 ' + (index + 1)"
                            :key="book.key"
                            :prop="'books.' + index + '.value'"
                            :rules="borrowRules['book.value']">
                        <el-autocomplete
                                class="borrow-input"
                                clearable
                                v-model="book.value"
                                :fetch-suggestions="queryBorrowSearchAsync"
                                placeholder="书籍编号"
                                value-key="bookID">
                        </el-autocomplete>
                        <el-button @click.prevent="removeBorrowBook(book)" class="delete-borrow-button">删除</el-button>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="resetBorrowBook('dynamicValidateForm')">重置</el-button>
                    <el-button @click="addBook">新增图书</el-button>
                    <el-button type="primary" @click="confirmBorrowBook('dynamicValidateForm')">提交</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    export default {
        methods: {
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
                        this.$confirm('将归还 ID ：' + this.returnBookIDForm.bookID + ' 的图书', '确认归还', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$api({
                                method: "POST",
                                url: "/Return",
                                data: {
                                    bookID: this.returnBookIDForm.bookID
                                }
                            }).then(() => {
                                this.$message({
                                    type: 'success',
                                    message: '归还成功'
                                });
                                this.dialogReturnBookVisible = false;
                            }).catch((error) => {
                                window.console.log(error)
                            }).finally(() => this.isLoadingReturn = false)
                        }).catch(() => {
                            this.isLoadingReturn = false;
                        });
                    } else {
                        return false;
                    }
                });

            },
            closeReturnDialog(formNames) {
                // window.console.log(this.$refs);
                for (let formName of formNames) {
                    // window.console.log(this.$refs[formName]);
                    this.$refs[formName].resetFields();
                }
                this.dialogReturnBookVisible = false;
            },

            repeatAddBook(row) {
                this.dialogAddBookVisible = true;
                this.$set(this.addBookForm, "name", row.name);
                this.$set(this.addBookForm, "ISBN", row.ISBN);
                this.$set(this.addBookForm, "author", row.author);
                this.$set(this.addBookForm, "press", row.press);
                this.$set(this.addBookForm, "price", row.price);
                // this.addBookForm = Object.assign({},row)
            },
            //增加书籍确认
            confirmAddBook(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.isLoadingAdd = true;
                        this.$confirm('将增添书名为《' + this.addBookForm.name + '》的图书', '确认添加', {
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
                                this.searchBook('', 'book_id');
                                this.dialogAddBookVisible = false;
                                this.$refs[formName].resetFields();
                            }).catch((error) => {
                                window.console.log(error)
                            }).finally(() => this.isLoadingAdd = false)
                        }).catch(() => {
                            this.isLoadingAdd = false;
                        });
                    } else {
                        return false;
                    }
                });

            },
            cancelAddBook() {
                this.dialogAddBookVisible = false;
                this.$refs.addForm.resetFields();
            },
            closeAddDialog() {
                this.dialogAddBookVisible = false;
                this.$refs.addForm.resetFields();
            },
            //修改书籍信息
            bookEdit(row) {
                this.dialogModifyBookVisible = true;
                this.bookForm = Object.assign({}, row)
            },
            //确认图书修改
            confirmBookEdit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.isLoadingEdit = true;
                        this.$confirm('将修改 ID 为：' + this.bookForm.bookID + ' 的图书', '确认修改', {
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
                                this.searchBook('', 'book_id');
                                this.dialogModifyBookVisible = false;
                            }).catch((error) => {
                                window.console.log(error)
                            }).finally(() => this.isLoadingEdit = false)
                        }).catch(() => {
                            this.isLoadingEdit = false;
                        });
                    } else {
                        return false;
                    }
                });
            },
            cancelBookEdit() {
                this.dialogModifyBookVisible = false;
            },
            //删除书籍信息
            bookDelete(row) {
                this.$confirm('将删除书号：' + row.bookID + ' 的图书, 是否继续?', '确认删除', {
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
                });
            },
            //选择书号触发
            handleReturnSelect() {
                let vm = this;
                this.$api({
                    method: "GET",
                    url: "Return/BookDetail",
                    params: {
                        bookID: this.returnBookIDForm.bookID,
                    }
                }).then(res => {
                    // this.$set(vm.returnBookForm, "name", res.data.name);
                    vm.returnBookForm = res.data
                });
            },

            //从服务器获得已借书籍ID
            queryReturnSearchAsync(queryString, cb) {
                this.$api({
                    method: "GET",
                    url: "Return/BookList",
                    params: {
                        "bookID": queryString
                    }
                }).then((res) => cb(res.data));
            },
            //借阅书籍
            confirmBorrowBook(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let vm = this;
                        window.console.log(vm.dynamicValidateForm.cardID);
                        let books = [];
                        for (let item of vm.dynamicValidateForm.books) {
                            books.push(item.value)
                        }
                        this.$api({
                            method: 'post',
                            url: '/Borrow',
                            data: {
                                cardID: vm.dynamicValidateForm.cardID,
                                bookList: books
                            }
                        }).then((res) => {
                            vm.$message({
                                type: 'success',
                                message: "借书成功"
                            });
                            this.$confirm("借书单号：" + res.data.slipID, "借书成功");
                            this.dialogBorrowBookVisible = false;
                            this.$refs[formName].resetFields();
                        }).catch((error) => {
                            window.console.log(error)
                        })
                    }
                });
            },
            resetBorrowBook(formName) {
                this.$refs[formName].resetFields();
            },
            //关闭借书dialog
            closeBorrowDialog() {
                this.dialogBorrowBookVisible = false;
                this.$refs.dynamicValidateForm.resetFields();
            },
            removeBorrowBook(item) {
                let index = this.dynamicValidateForm.books.indexOf(item);
                if (index !== -1) {
                    this.dynamicValidateForm.books.splice(index, 1)
                }
            },
            addBook() {
                this.dynamicValidateForm.books.push({
                    value: ''
                });
            },
            queryBorrowSearchAsync(queryString, cb) {
                this.$api({
                    method: "GET",
                    url: "Borrow/BookList",
                    params: {
                        "bookID": queryString
                    }
                }).then((res) => cb(res.data));
            },
            queryCardIDAsync(queryString, cb) {
                this.$api({
                    method: "GET",
                    url: "GetPureCardList",
                    params: {
                        "cardID": queryString
                    }
                }).then((res) => cb(res.data));
            }
        },

        data() {
            return {
                bookTable: [],
                state: '',
                timeout: null,
                searchType: "book_id",

                inputBookValue: '',
                searchBookType: 'name',

                isLoadingAdd: false,
                isLoadingReturn: false,
                isLoadingEdit: false,
                dialogAddBookVisible: false,
                dialogReturnBookVisible: false,
                dialogModifyBookVisible: false,
                dialogBorrowBookVisible: false,

                formLabelWidth: '120px',

                returnBookIDForm: {
                    bookID: '',
                },

                bookForm: {
                    bookID: '',
                    name: '',
                    ISBN: '',
                    author: '',
                    press: '',
                    price: '',
                    isBorrowed: ''
                },

                returnBookForm: {
                    bookID: '',
                    name: '',
                    ISBN: '',
                    author: '',
                    press: '',
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

                dynamicValidateForm: {
                    cardID: '',
                    books: [{
                        value: ''
                    }],
                },

                addRules: {
                    name: [
                        {required: true, message: '书籍名称不能为空', trigger: 'blur'},
                        {min: 1, max: 200, message: '长度在 0 到 200 个字符', trigger: 'blur'}
                    ],
                    ISBN: [
                        {required: true, message: 'ISBN不能为空', trigger: 'blur'},
                        {min: 13, max: 15, message: '长度在 13 到 15 个字符', trigger: 'blur'}
                    ],
                    author: [
                        {required: true, message: '作者不能为空', trigger: 'blur'},
                        {min: 0, max: 200, message: '长度在 0 到 200 个字符', trigger: 'blur'}
                    ],
                    press: [
                        {required: true, message: '出版社不能为空', trigger: 'blur'},
                        {min: 0, max: 100, message: '长度在 0 到 100 个字符', trigger: 'blur'}
                    ],
                    price: [
                        {required: true, message: '价格不能为空', trigger: 'blur'},
                        {min: 0, max: 1000, type: "number", message: '价格只能在 0 到 1000 '}
                    ],
                },
                borrowRules: {
                    cardID: [
                        {required: true, message: '借书卡号不能为空', trigger: 'blur'},
                        {min: 14, max: 14, message: '借书卡号只能为 14 位', trigger: 'blur'}
                    ],
                    "book.value": [
                        {required: true, message: '图书号不能为空', trigger: 'blur'},
                        {min: 14, max: 14, message: '图书号只能为 14 位', trigger: 'blur'}
                    ]
                },
                returnRules: {
                    bookID: [{required: true, message: ' ', trigger: 'blur'}]
                }

            };
        },
        watch: {
            inputBookValue(newInputValue) {
                if (newInputValue && newInputValue.length > 0) {
                    this.searchBook(newInputValue, this.searchBookType)
                } else {
                    this.searchBook(newInputValue, this.searchBookType)
                }
            },
            searchBookType(newSearchType) {
                this.searchBook(this.inputBookValue, newSearchType)
            }
        },
        mounted() {
            this.searchBook('', 'book_id');
        }
    }


</script>

<style>
    .book-container .el-table__body {
        width: 1211.5px !important;
    }

    .book-container .el-table__body, .el-table__footer, .el-table__header {
        table-layout: unset !important;
    }

    .return-book-form .el-form-item {
        margin-bottom: 0;
        /*margin-left: 20px;*/
    }

    .return-book-input {
        width: 400px;
    }

    .demo-table-expand {
        font-size: 0;
        width: 800px;
    }

    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }

    .demo-table-expand {
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

    .return-book {
        margin: 0 auto;
        width: 400px;
    }

    .return-book-form {
        margin-top: 15px;
    }

    .search {
        width: 45vw;
        margin: 0 auto;
        position: relative;
    }

    .delete-borrow-button {
        margin-left: 10px;
    }

    .borrow-input {
        width: 260px;
    }

    .return-book-item {
        width: 400px;
    }
</style>