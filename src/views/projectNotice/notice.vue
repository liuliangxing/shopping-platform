<template>
  <div class="dashboard-editor-container">
    <el-row v-for="o in articleList" :key="o">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>{{o.version}}</span>
          <div style="float: right; padding: 3px 0">{{o.createTime}}</div>
        </div>
        <br/>
        <div v-for="content in o.contents" :key="content" class="text item">
          <li>
            {{content}} 
          </li>
        </div>

      </el-card>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { articleListSearch } from '@/api/article.js'
import { Message } from 'element-ui'
export default {
  components: {
  },
  data() {
    return {
      listQuery: {
        userId: '',
        pageIndex: 1,
        pageSize: 3
      },
      articleList: []
    }
  },
  computed: {
    ...mapGetters([
      'userId'
    ])
  },
  methods: {
    getArticleListSearch() {
      this.listQuery.userId = this.userId
      articleListSearch(this.listQuery)
        .then(response => {
          this.articleList = response.dataObject.articleList
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
    }
  },
  mounted() {
    this.getArticleListSearch()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
}
.text {
  font-size: 16px;
}
.item {
  margin-bottom: 18px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

</style>
