<template>
  <div class="dashboard-editor-container">
    <el-container>
      <el-header class="search_body" style="height:100px;">
        <div class="search_form">
          <el-form ref="form" :model="searchForm" label-width="80px">
            <el-row>
              <el-col :span="6" :offset="1">
                <el-form-item label="角色名">
                  <el-input v-model="searchForm.roleName" placeholder=""></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4" :offset="1">
                <el-form-item label="状态">
                  <el-select v-model="searchForm.enabled" placeholder="请选择" clearable>
                  <el-option
                    label="启用" value="1">
                  </el-option>
                  <el-option
                    label="禁用" value="2">
                  </el-option>
                </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="1" :offset="1" v-if="validatePermissions('SELECT_ROLE')">
                <el-button type="primary" size="small" round @click="getRoleList" style="float:right;" icon="el-icon-search" >搜索</el-button>
              </el-col>
              <el-col :span="2" v-if="validatePermissions('ADD_ROLE')">
                <el-button type="primary" size="small" round @click="addRole('添加角色',null)" style="float:right;" icon="el-icon-plus" >添加角色</el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-header>
      <el-main>
        <el-table
        :data="roleList"
        stripe
        style="width: 100%">
        <el-table-column
        prop="id"
        label="编号"
        align="center"
        >
        </el-table-column>
        <el-table-column
        prop="roleName"
        label="角色名"
        align="center"
        >
        </el-table-column>
        <el-table-column
        prop="roleDesc"
        label="角色描述"
        align="center"
        >
        </el-table-column>
         <el-table-column
        prop="enabled"
        label="状态"
        align="center"
        >
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.enabled === 1">启用</el-tag>
          <el-tag type="info" v-else >禁用</el-tag>
        </template>
        </el-table-column>
        <el-table-column
        fixed="right"
        label="操作"
        align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addRole('编辑用户', scope.row)" v-if="validatePermissions('EDIT_ROLE')">编辑</el-button>
          <span v-if="validatePermissions('DEL_ROLE')">
            <el-button v-if="scope.row.enabled === 1" type="text" size="small" @click="disable(scope.row, 2)">禁用</el-button>
            <el-button v-else type="text" size="small" @click="disable(scope.row, 1)">启用</el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>

        <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="searchForm.page"
              :page-sizes="[10,20,30, 50]" :page-size="searchForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </div>
      </el-main>
    </el-container>

    <!-- 操作角色 -->
    <el-dialog
      :title="title"
      :visible.sync="isVisible"
      :close-on-click-modal="false"
      width="600px">
      <role-handle @close="close()" :selectRole="selectRow"></role-handle>
    </el-dialog>
  </div>
</template>

<script>
import { roleListSearch, disableRole } from '@/api/role'
import { Message } from 'element-ui'
import roleHandle from './components/roleHandle'
import { validateOperationPermissions } from '@/utils/validate.js'
export default {
  components: {
    roleHandle
  },
  data() {
    return {
      selectId: 0,
      title: '',
      isVisible: false,
      // isVisible1: false,
      selectRow: {
      },
      searchForm: {
        pageIndex: 1,
        pageSize: 10
      },
      total: 0,
      roleList: []
    }
  },
  methods: {
    validatePermissions(authoritiesName) {
      return validateOperationPermissions(authoritiesName)
    },
    disable(row, status) {
      row.enabled = status
      disableRole(row)
        .then(response => {
          Message({
            message: '修改状态成功',
            type: 'success',
            duration: 3 * 1000
          })
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
    close() {
      this.isVisible = false
      this.getRoleList()
    },
    handleSizeChange(val) {
      this.searchForm.pageSize = val
      this.getRoleList()
    },
    handleCurrentChange(val) {
      this.searchForm.pageIndex = val
      this.getRoleList()
    },
    addRole(title, row) {
      this.title = title
      this.selectRow = row
      this.isVisible = true
    },
    getRoleList() {
      roleListSearch(this.searchForm)
        .then(response => {
          this.roleList = response.dataObject.result
          this.total = this.roleList.length
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
    this.getRoleList()
    // this.getUserList()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 20px;
  width:100%;
  // height: 880px;
}
.search_body {
  border: 1px solid #ebeef5;
  .search_form {
    margin-top: 30px;
  }
}
.pagination-container {
    text-align: center;
  }
</style>