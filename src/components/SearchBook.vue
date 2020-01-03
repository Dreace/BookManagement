<template>
    <div>
        <h1 align="center">书籍查询</h1>
        <div class="search">
            <el-input placeholder="请输入内容" v-model="inputBookValue" class="input-with-select">
                <el-select v-model="searchBookType" slot="prepend" placeholder="请选择">
                    <el-option label="图书号" value="book_id"/>
                    <el-option label="IBSN" value="IBSN"/>
                    <el-option label="书名" value="name"/>
                    <el-option label="作者" value="author"/>
                </el-select>
                <el-button slot="append" icon="el-icon-search"/>
            </el-input>
        </div>

        <br>

        <div class="result">
            <el-table
                    :data="bookTable"
                    style="width: 100%"
                    :row-class-name="tableRowClassName"
                    max-height=350px>
                <el-table-column
                        prop="bookID"
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
                inputBookValue: '',
                searchBookType: 'name',
                bookTable: [],
            }

        },
        watch: {
            inputBookValue(newInputValue) {
                if (newInputValue && newInputValue.length > 0) {
                    this.searchBook(newInputValue, this.searchBookType)
                }
            },
            searchBookType(newSearchType) {
                this.searchBook(this.inputBookValue, newSearchType)
            }
        },
        methods: {
            tableRowClassName({row}) {
                if (row.isBorrowed === true) {
                    return 'warning-row';
                }
                return '';
            },

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
        },
        mounted() {
            this.searchBook("", "name")
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