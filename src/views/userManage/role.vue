<template>
  <div class="dashboard-editor-container">
    <el-button type="primary" size="small" @click="add" style="float:right;">添加角色</el-button>
    <el-table :data="roleList" border style="width: 100%;margin-top:10px;">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="角色名称"></el-table-column>
      <el-table-column prop="projectId" label="所属项目"></el-table-column>
      <el-table-column prop="createDate" label="创建时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small">修改</el-button>
          <el-button @click="deleteRole(scope.row)" type="text" size="small">删除</el-button>
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
      <add-Role :role="role" @close="closeDialog()" v-if="isVisible"></add-Role>
    </el-dialog>
  </div>
</template>

<script>
import addRole from './components/addRole'
import { roleListSearch } from '@/api/role.js'
import { Message } from 'element-ui'
export default {
  components: {
    addRole
  },
  data() {
    return {
      isVisible: false,
      role: {},
      total: 0,
      title: '角色添加',
      roleList: [],
      projectList: [],
      listQuery: {
        name: '',
        pageIndex: 1,
        pageSize: 10
      }
    }
  },
  methods: {
    stop(id, index) {
      this.tableData[index].projectStatus = 3
    },
    closeDialog() {
      this.isVisible = false
      this.getRoleList()
    },
    edit(obj) {
      this.isVisible = true
      this.role = obj
      this.title = '角色修改'
    },
    add() {
      this.role = {}
      this.isVisible = true
    },
    deleteRole(obj) {
      console.log(obj)
    },
    getRoleList() {
      roleListSearch(this.listQuery)
        .then(response => {
          this.roleList = response.dataObject.roleList
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
      this.getRoleList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val
      this.getRoleList()
    }
  },
  mounted() {
    this.getRoleList()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 20px;
  width:100%;
}
</style>
