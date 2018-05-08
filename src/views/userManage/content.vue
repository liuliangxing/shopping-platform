<template>
  <div class="dashboard-editor-container">
    <el-container>
    <el-header>
        <div class="search_form">
          <el-form ref="form" :model="listQuery" label-width="80px">
            <el-row>
              <el-col :span="5" offset="5">
                <el-form-item label="内容">
                  <el-input v-model="listQuery.content" placeholder="内容" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-button type="primary" size="small" round @click="getContentListSearch()" style="float:right;" icon="el-icon-search">搜索</el-button>
              </el-col>
              <el-col :span="2">
                <el-button type="primary" size="small" @click="add" round  style="float:right;" icon="el-icon-circle-plus">添加内容</el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
    </el-header>
    <el-main>
      <el-table :data="contentList" border style="width: 100%;margin-top:10px;">
        <el-table-column type="index" label="序号" width="80px"></el-table-column>
        <el-table-column prop="id" label="ID" width="150px"></el-table-column>
        <el-table-column prop="content" label="内容"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="250px"></el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" type="text" size="small">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
          :page-sizes="[10,20,30,50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
      <el-dialog
        :title="title"
        :visible.sync="isVisible"
        :close-on-click-modal="false"
        width="50%">
        <add-Content :content="content" @close="closeDialog()" v-if="isVisible"></add-Content>
      </el-dialog>
    </el-main>
    </el-container>
  </div>
</template>

<script>
import addContent from './components/addContent'
import { contentListSearch } from '@/api/content.js'
import { Message } from 'element-ui'
export default {
  components: {
    addContent
  },
  data() {
    return {
      isVisible: false,
      content: {},
      total: 0,
      title: '内容添加',
      contentList: [],
      listQuery: {
        content: '',
        pageIndex: 1,
        pageSize: 10
      }
    }
  },
  methods: {
    getContentListSearch() {
      this.getContentList()
    },
    closeDialog() {
      this.isVisible = false
      this.getContentList()
    },
    edit(obj) {
      this.isVisible = true
      this.content = obj
      this.title = '内容修改'
    },
    add() {
      this.content = {}
      this.isVisible = true
    },
    getContentList() {
      contentListSearch(this.listQuery)
        .then(response => {
          this.contentList = response.dataObject.smsContents
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
      this.getContentList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val
      this.getContentList()
    }
  },
  mounted() {
    this.getContentList()
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
