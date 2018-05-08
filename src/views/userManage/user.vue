<template>
  <div class="dashboard-editor-container">
    <el-container>
    <el-header>
        <div class="search_form">
          <el-form ref="form" :model="listQuery" label-width="80px">
            <el-row>
              <el-col :span="6" offset="4">
                <el-form-item label="用户名">
                  <el-input v-model="listQuery.userName" placeholder="用户名"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="手机号">
                  <el-input v-model="listQuery.mobile" placeholder="手机号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-button type="primary" size="small" round @click="getUserListSearch()" style="float:right;" icon="el-icon-search">搜索</el-button>
              </el-col>
              <el-col :span="2">
                <el-button type="primary" size="small" round @click="allotProject" style="float:right;">项目分配</el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
    </el-header>
    <el-main>
    <el-row>
      <el-col :span="4">
        <el-tree 
        :data="departmentTree" 
        :props="defaultProps" 
        @node-click="handleNodeClick">
        </el-tree>
    </el-col>
    <el-col :span="20">
    <el-table :data="userList" row-key="id"  v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户编码">
        <template slot-scope="scope">
          <span>{{scope.row.userNum}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户姓名">
        <template slot-scope="scope">
          <span>{{scope.row.userName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mobile }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    </el-col>
    </el-row>
    <el-dialog
      title="项目分配"
      :visible.sync="isVisible"
      :close-on-click-modal="false"
      width="50%">
      <el-form :model="userForm" :rules="rules" ref="userForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="部门" prop="deparmentId">
          <el-select v-model="userForm.deparmentId" 
          placeholder="选择部门"
          filterable
          :loading="departmentLoading"
          @change="changeDepartment"
          >
              <el-option v-for="item in deparmentList" :label="item.departmentName" :value="item.id" :key="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="员工" prop="userId">
          <el-select v-model="userForm.userId" 
          placeholder="选择员工"
          filterable
          :loading="userLoading"
          @change="changeUser"
          >
              <el-option v-for="item in allUser" :label="item.userName" :value="item.id" :key="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="项目" prop="projectIds">
          <el-transfer
            v-model="userForm.projectIds"
            :titles="['所有项目', '已选项目']"
            :props="{ key: 'id', label: 'projectName' }"
            :data="projectList">
        </el-transfer>
      </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('userForm')">保存</el-button>
      </el-form-item>
    </el-form>
    </el-dialog>
    </el-main>
    </el-container>
  </div>
</template>

<script>
import { getUserList, saveOrUpdateUserProject, userProjectList, getDepartmentTree } from '@/api/user.js'
import { projectListAll } from '@/api/projects.js'
import { getDepartmentList, getUserListByDepartmentId } from '@/api/department.js'
import { Message } from 'element-ui'
export default {
  components: {
  },
  data() {
    return {
      listLoading: false,
      departmentLoading: false,
      userLoading: false,
      isVisible: false,
      total: 100,
      allUser: [],
      userList: [],
      deparmentList: [],
      projectList: [],
      listQuery: {
        userNum: '',
        mobile: '',
        userName: '',
        departmentId: '',
        pageIndex: 1,
        pageSize: 10
      },
      userForm: {
        deparmentId: '',
        projectIds: [],
        userId: ''
      },
      rules: {
        deparmentId: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        userId: [
          { required: true, message: '请选择员工', trigger: 'change' }
        ],
        projectIds: [
          { type: 'array', required: true, message: '请至少选择一个项目', trigger: 'change' }
        ]
      },
      departmentTree: []
    }
  },
  methods: {
    getUserListSearch() {
      this.getUserList()
    },
    handleNodeClick(data) {
      this.listQuery.departmentId = data.id
      this.getUserList()
    },
    changeDepartment(id) {
      getUserListByDepartmentId(id)
        .then(response => {
          this.allUser = response.dataObject.usersList
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
    allotProject() {
      this.isVisible = true
      this.userForm = {}
      this.getDepartmentList()
    },
    getUserList() {
      getUserList(this.listQuery)
        .then(response => {
          this.userList = response.dataObject.userList
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
    getDepartmentTree() {
      getDepartmentTree()
        .then(response => {
          this.departmentTree = response.dataObject.departmentTree
          console.log(this.departmentTree)
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
    getAllUserList() {
      getUserList(this.listQuery)
        .then(response => {
          this.allUser = response.dataObject.userList
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
      this.getUserList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val
      this.getUserList()
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveOrUpdateUserProject(this.userForm)
            .then(response => {
              this.isVisible = false
              this.userForm = {}
              this.getUserList()
              Message({
                message: 'success~',
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
        }
      })
    },
    projectListAll(userId) {
      projectListAll()
        .then(response => {
          this.projectList = response.dataObject.projectsList
          this.getUserProject(userId)
        }).catch(e => {
          this.$router.push('/408')
        })
    },
    getDepartmentList() {
      getDepartmentList()
        .then(response => {
          this.deparmentList = response.dataObject.departmentsList
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
    changeUser(userId) {
      this.userForm.projectIds = []
      this.projectListAll(userId)
    },
    getUserProject(userId) {
      userProjectList(userId)
        .then(response => {
          const projectList = response.dataObject.projectList
          const arr = []
          if (projectList && projectList.length > 0) {
            projectList.forEach(o => {
              arr.push(o.id)
            })
            debugger
            this.userForm.projectIds = arr
          }
        })
    }
  },
  mounted() {
    this.getUserList()
    this.getDepartmentTree()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
}
</style>
