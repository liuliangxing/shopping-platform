<template>
  <div class="dashboard-editor-container">
    <el-container>
    <el-header>
        <div class="search_form">
          <el-form ref="form" :model="listQuery" label-width="80px">
            <el-row>
              <el-col :span="5">
                <el-form-item label="公告标题">
                  <el-input v-model="listQuery.title" placeholder="公告标题"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="作者">
                  <el-input v-model="listQuery.author" placeholder="作者"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5" >
                <el-form-item label="开始时间">
                  <el-date-picker type="date" placeholder="选择日期" v-model="listQuery.createTime" style="width:100%"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="结束时间">
                  <el-date-picker type="date" placeholder="选择日期" v-model="listQuery.endTime" style="width:100%"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-button type="primary" size="small" round @click="getNoticeListSearch()" style="float:right;" icon="el-icon-search">搜索</el-button>
              </el-col>
              <el-col :span="2">
                <el-button type="primary" size="small" round @click="add" style="float:right;" icon="el-icon-circle-plus">添加公告</el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
    </el-header>
      <el-main>
        <el-table :data="articleList" border style="width: 100%;margin-top:10px;">
          <el-table-column prop="id" label="ID"></el-table-column>
          <el-table-column prop="title" label="公告标题"></el-table-column>
          <el-table-column prop="content" label="内容"></el-table-column>
          <el-table-column prop="version" label="版本"></el-table-column>
          <el-table-column prop="createTime" label="创建时间"></el-table-column>
          <el-table-column prop="author" label="作者"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click="edit(scope.row)" type="text" size="small">修改</el-button>
              <el-button @click="deleteArticle(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
            :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
        <el-dialog
          :title="title"
          :visible.sync="isVisible"
          :close-on-click-modal="false"
          width="50%">
          <add-Notice :article="article" @close="closeDialog()" v-if="isVisible"></add-Notice>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import addNotice from './components/addNotice'
import { articleListSearch, deleteArticle } from '@/api/article.js'
import { Message } from 'element-ui'
export default {
  components: {
    addNotice
  },
  data() {
    return {
      isVisible: false,
      article: {},
      total: 0,
      title: '公告添加',
      articleList: [],
      listQuery: {
        title: '',
        createTime: '',
        endTime: '',
        author: '',
        userId: '',
        pageIndex: 1,
        pageSize: 10
      }
    }
  },
  computed: {
    ...mapGetters([
      'userId'
    ])
  },
  methods: {
    getNoticeListSearch() {
      this.getArticleList()
    },
    closeDialog() {
      this.isVisible = false
      this.getArticleList()
    },
    edit(obj) {
      this.isVisible = true
      this.article = obj
      this.title = '公告修改'
    },
    add() {
      this.article = {}
      this.isVisible = true
    },
    deleteArticle(obj) {
      deleteArticle(obj)
        .then(response => {
          Message({
            message: '删除成功',
            type: 'success',
            duration: 3 * 1000
          })
          this.getArticleList()
        }).catch(e => {
          if (e.status === 408) {
            this.$router.push('/408')
          } else {
            Message({
              message: e,
              type: 'error',
              duration: 3 * 1000
            })
          }
        })
    },
    getArticleList() {
      this.listQuery.userId = this.userId
      articleListSearch(this.listQuery)
        .then(response => {
          this.articleList = response.dataObject.articleList
          this.total = response.dataObject.total
        }).catch(e => {
          if (e.status === 408) {
            this.$router.push('/408')
          } else {
            Message({
              message: e,
              type: 'error',
              duration: 3 * 1000
            })
          }
        })
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getArticleList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val
      this.getArticleList()
    }
  },
  mounted() {
    this.getArticleList()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 20px;
  width:100%;
}
.search_body {
  border: 1px solid #B3C0D1;
  // border-radius: 5px;
  .search_form {
    margin-top: 30px;
  }
}
.pagination-container {
    text-align: center;
  }
</style>
