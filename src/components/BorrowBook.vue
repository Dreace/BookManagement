<template>
    <div>
        <el-button type="text" @click="dialogVisible = true">借书登记</el-button>
        <el-dialog
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose">
            <h1 align="center">图书借阅</h1>
            <div class="borrow">
                <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px"
                         class="demo-dynamic">
                    <el-form-item
                            prop="cardID"
                            label="借书卡"
                            :rules="[
      { required: true, message: '请输入借书卡号', trigger: 'blur' },
    ]"
                    >
                        <el-col :span="8">
                            <el-input v-model="dynamicValidateForm.cardID"></el-input>
                        </el-col>

                    </el-form-item>
                    <el-form-item
                            v-for="(book, index) in dynamicValidateForm.books"
                            :label="'图书' + index"
                            :key="book.key"
                            :prop="'books.' + index + '.value'"
                            :rules="{
      required: true, message: '图书号不能为空'
    }"
                    >
                        <el-autocomplete
                                v-model="book.value"
                                :fetch-suggestions="querySearchAsync"
                                placeholder="请输入内容"
                                @select="handleSelect"
                        ></el-autocomplete>
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
                    temp: [],
                    timeout: null,
                },
                dialogVisible: false
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        alert('submit!');
                    } else {
                        window.console.log('error submit!!');
                        return false;
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
                    value: '',
                    key: Date.now()
                });
            },

            loadAll() {
                return [
                    {"value": "1233245"},
                    {"value": "2323545"},
                    {"value": "y98234890"},
                    {"value": "t9453453523"},
                    {"value": "3878232"},
                    {"value": "33465465t"},
                    {"value": "a35243626"},
                    {"value": "46457t"},
                    {"value": "4859245u"},
                    {"value": "749052304u584"},
                    {"value": "03r98348r8q"},
                    {"value": "378129358123"},
                    {"value": "6853497589"},
                    {"value": "48632985"},
                    {"value": "236459878"},
                ];
            },
            querySearchAsync(queryString, cb) {
                var temp = this.temp;
                var results = queryString ? temp.filter(this.createStateFilter(queryString)) : temp;

                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    cb(results);
                }, 5);
            },
            createStateFilter(queryString) {
                return (state) => {
                    return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            handleSelect(item) {
                window.console.log(item);
            },

        },
        mounted() {
            this.temp = this.loadAll();

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