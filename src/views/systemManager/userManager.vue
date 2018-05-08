<template>
  <div class="dashboard-editor-container">
    <el-container>
      <el-header class="search_body" style="height:100px;">
        <div class="search_form">
          <el-form ref="form" :model="searchForm" label-width="80px">
            <el-row>
              <el-col :span="6" :offset="1">
                <el-form-item label="用户名">
                  <el-input v-model="searchForm.username" placeholder=""></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="1">
                <el-form-item label="昵称">
                  <el-input v-model="searchForm.nickname" placeholder=""></el-input>
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
              <el-col :span="1" :offset="1" v-if="validatePermissions('SELECT_USER')">
                <el-button type="primary" size="small" round @click="getUserList" style="float:right;" icon="el-icon-search" >搜索 </el-button>
              </el-col>
              <el-col :span="2" v-if="validatePermissions('ADD_USER')">
                <el-button type="primary" size="small" round @click="addUser('添加用户')" style="float:right;" icon="el-icon-plus" >添加用户</el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-header>
      <el-main>
        <el-table
        :data="userList"
        stripe
        style="width: 100%">
        <el-table-column
        prop="id"
        label="编号"
        align="center"
        >
        </el-table-column>
        <el-table-column
        prop="username"
        label="用户名"
        align="center"
        >
        </el-table-column>
        <el-table-column
        prop="nickname"
        label="昵称"
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
          <el-button type="text" size="small" @click="grantRole(scope.row)" v-if="validatePermissions('SET_USER_ROLE')">角色</el-button>
          <el-button type="text" size="small" @click="grant(scope.row)" v-if="validatePermissions('SET_USER_AUTHORITIES')">授权</el-button>
          <el-button type="text" size="small" @click="addUser('编辑用户', scope.row)" v-if="validatePermissions('EDIT_USER')" >编辑</el-button>
          <span v-if="validatePermissions('DEL_USER')" >
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

    <!-- 添加用户 -->
    <el-dialog
      :title="title"
      :visible.sync="isVisible"
      :close-on-click-modal="false"
      width="600px">
      <add-user @close="close()" :loginForm="selectRow"></add-user>
    </el-dialog>
    <!-- 用户授权 -->
    <el-dialog
      title="授权 (注： 不可选的权限来自于角色权限！)"
      :visible.sync="isVisible1"
      :close-on-click-modal="false"
      width="600px">
      <grant-authorization @close="close1()" :id="selectId"></grant-authorization>
    </el-dialog>

    <!-- 用户角色 -->
    <el-dialog
      title="用户角色"
      :visible.sync="isVisible2"
      :close-on-click-modal="false"
      width="600px">
      <grant-role @close="close2()" :id="selectId"></grant-role>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, delUser } from '@/api/login'
import { Message } from 'element-ui'
import addUser from './components/addUser'
import grantAuthorization from './components/grantAuthorization'
import grantRole from './components/grantRole'
import { mapGetters } from 'vuex'
import { validateOperationPermissions } from '@/utils/validate.js'
export default {
  components: {
    addUser,
    grantAuthorization,
    grantRole
  },
  computed: {
    ...mapGetters([
    ])
  },
  data() {
    return {
      selectId: 0,
      title: '',
      isVisible: false,
      isVisible1: false,
      isVisible2: false,
      selectRow: {
      },
      searchForm: {
        pageIndex: 1,
        pageSize: 10
      },
      total: 0,
      userList: []
    }
  },
  methods: {
    validatePermissions(authoritiesName) {
      return validateOperationPermissions(authoritiesName)
    },
    grantRole(data) {
      this.isVisible2 = true
      this.selectId = data.id
    },
    grant(data) {
      this.selectId = data.id
      this.isVisible1 = true
    },
    close() {
      this.isVisible = false
      this.getUserList()
    },
    close1() {
      this.isVisible1 = false
    },
    close2() {
      this.isVisible2 = false
    },
    addUser(title, data) {
      this.selectRow = {}
      this.isVisible = true
      this.title = title
      if (data) {
        this.selectRow = data
        this.selectRow.edit = false
      } else {
        this.selectRow.edit = true
      }
    },
    handleSizeChange(val) {
      this.searchForm.pageSize = val
      this.getUserList()
    },
    handleCurrentChange(val) {
      this.searchForm.pageIndex = val
      this.getUserList()
    },
    disable(data, enabled) {
      delUser(data.id, enabled)
        .then(response => {
          data.enabled = enabled
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
    getUserList() {
      getUserList(this.searchForm)
        .then(response => {
          this.userList = response.dataObject.result
          this.total = this.userList.length
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
    this.getUserList()
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