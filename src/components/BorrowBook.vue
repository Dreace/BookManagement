<template>
    <div>
        <el-button type="text" @click="dialogVisible = true">借书登记</el-button>
        <el-dialog
                :visible.sync="dialogVisible"
                width="30%">
            <h1 align="center">图书借阅</h1>
            <div class="borrow">
                <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px"
                         class="demo-dynamic">
                    <el-form-item
                            prop="cardID"
                            label="借书卡"
                            :rules="[{required: true, message: '请输入借书卡号'},]">
                        <el-col :span="8">
                            <el-input v-model="dynamicValidateForm.cardID"></el-input>
                        </el-col>

                    </el-form-item>
                    <el-form-item
                            v-for="(book, index) in dynamicValidateForm.books"
                            :label="'图书' + index"
                            :key="book.key"
                            :prop="'books.' + index + '.value'"
                            :rules="{required: true, message: '图书号不能为空'}">
                        <el-autocomplete
                                v-model="book.value"
                                :fetch-suggestions="querySearchAsync"
                                placeholder="请输入书籍编号"
                                value-key="bookID"
                                @select="handleSelect">
                        </el-autocomplete>
                        <el-button @click.prevent="removeBook(book)">删除</el-button>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>
                        <el-button @click="addBook">新增图书</el-button>
                        <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "BorrowBook",
        data() {
            return {
                dynamicValidateForm: {
                    cardID: '',
                    books: [{
                        value: ''
                    }],
                },
                dialogVisible: false
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let vm = this;
                        window.console.log(vm.dynamicValidateForm.cardID)
                        this.$api({
                            method: 'post',
                            url: '/Borrow',
                            data: {
                                cardID: vm.dynamicValidateForm.cardID,
                                bookList: vm.dynamicValidateForm.books
                            }
                        }).then((res) => {
                            vm.$message({
                                type: 'success',
                                message: res.message
                            })
                        }).catch((error) => {
                            window.console.log(error)
                        })
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            removeBook(item) {
                var index = this.dynamicValidateForm.books.indexOf(item)
                if (index !== -1) {
                    this.dynamicValidateForm.books.splice(index, 1)
                }
            },
            addBook() {
                this.dynamicValidateForm.books.push({
                    value: ''
                });
            },

            querySearchAsync(queryString, cb) {
                this.$api({
                    method: "GET",
                    url: "Borrow/BookList",
                    params: {
                        "bookID": queryString
                    }
                }).then((res) => cb(res.data));
            },
            handleSelect(item) {
                window.console.log(item);
            },

        },
        mounted() {
        }
    }
</script>


<style>
    .borrow {
        width: 45vw;
        margin: 0 auto;
        position: relative;
    }
</style>