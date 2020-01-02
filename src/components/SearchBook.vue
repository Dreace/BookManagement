<template>
    <div>
        <h1 align="center">书籍查询</h1>
        <div class="search">
            <el-input placeholder="请输入内容" v-model="input" class="input-with-select">
                <el-select v-model="select" slot="prepend" placeholder="请选择">
                    <el-option label="图书号" value="book_id"></el-option>
                    <el-option label="IBSN" value="IBSN"></el-option>
                    <el-option label="书名" value="name"></el-option>
                    <el-option label="作者" value="author"></el-option>
                </el-select>
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
        </div>

        <br>

        <div class="result">
            <el-table
                    :data="bookTable"
                    style="width: 100%"
                    :row-class-name="tableRowClassName"
                    max-height= 350px>
                <el-table-column
                        prop="book_id"
                        label="图书号">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="书名">
                </el-table-column>
                <el-table-column
                        prop="IBSN"
                        label="IBSN">
                </el-table-column>
                <el-table-column
                        prop="author"
                        label="作者">
                </el-table-column>
                <el-table-column
                        prop="press"
                        label="出版社">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SearchBook",
        data() {
            return {
                input: '',
                select: 'name',
                bookTable: [],
                testTable: [{
                    book_id: '1234567',
                    name: '爱的教育',
                    IBSN: '9781234567897',
                    author: 'lover',
                    press: '人民邮电出版社',
                    status: 0
                }, {
                    book_id: '1111111',
                    name: '爱的教育',
                    IBSN: '9781234567897',
                    author: 'lover',
                    press: '人民邮电出版社',
                    status: 1
                }, {
                    book_id: '1115451',
                    name: '爱的教育',
                    IBSN: '9781234567897',
                    author: 'lover',
                    press: '人民邮电出版社',
                    status: 1
                }, {
                    book_id: '1515545',
                    name: '爱的教育',
                    IBSN: '9781234567897',
                    author: 'harbor',
                    press: '人民邮电出版社',
                    status: 0
                }, {
                    book_id: '1154451',
                    name: '数据库',
                    IBSN: '9781234567897',
                    author: 'lover',
                    press: '人民邮电出版社',
                    status: 1
                }, {
                    book_id: '4533545',
                    name: '算法',
                    IBSN: '9781234567897',
                    author: 'lover',
                    press: '人民邮电出版社',
                    status: 0
                }]
            }

        },
        watch: {
          input: function (newInput) {
                this.bookTable = newInput ? this.testTable.filter(this.createStateFilter(newInput)) : this.testTable
          }
        },
        methods: {
            tableRowClassName({row}) {
                if (row.status === 0) {
                    return 'warning-row';
                }
                return '';
            },
            createStateFilter(queryString) {
                let vm = this;
                return (state) => {
                    return (state[vm.select].toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
                };
            }
        },
        mounted() {
            this.bookTable = this.testTable
        }
    }
</script>

<style>
    .el-select .el-input {
        width: 100px;
    }
    .input-with-select .el-input-group__prepend {
        background-color: #fff;
    }
    .search {
        width: 45vw;
        margin: 0 auto;
        position: relative;
    }
    .el-table .warning-row {
        background: #e5e9f2;
    }
    .result {
        width: 80vw;
        margin: 0 auto;
        position: relative;
    }
</style>