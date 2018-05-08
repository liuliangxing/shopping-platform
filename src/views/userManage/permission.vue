<template>
  <div class="dashboard-editor-container">
     <el-row>
      <el-col :span="5">
        <el-tree 
        :data="projectAuthoritiesTree" 
        :props="defaultProps" 
        @node-click="handleNodeClick">
        </el-tree>
    </el-col>
    <el-col :span="19">
    <el-button type="primary" size="small" @click="authorize" style="float:right;">授权</el-button> 
    <el-button type="primary" size="small" @click="add" style="float:right;margin-right:10px;">添加权限</el-button>
    <el-table :data="authorityList" border style="width: 100%;margin-top:10px;">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="权限名称"></el-table-column>
      <el-table-column prop="notes" label="权限描述"></el-table-column>
      <el-table-column prop="projectId" label="项目名称"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small">修改</el-button>
          <el-button @click="deletePermisson(scope.row)" type="text" size="small">删除</el-button>
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
      :title="title"
      :visible.sync="isVisible"
      :close-on-click-modal="false"
      width="50%">
      <add-Authorities :permission="permission" @close="closeDialog()" v-if="isVisible"></add-Authorities>
    </el-dialog>
    <el-dialog
      title="授权"
      :visible.sync="showAuthorize"
      :close-on-click-modal="false"
      top="10vh"
      width="50%">
      <el-form :model="authorizeForm" :rules="rules" ref="authorizeForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="授权类型" prop="authotizeType">
        <el-radio-group v-model="authorizeForm.authotizeType">
          <el-radio label="1">员工</el-radio>
          <el-radio label="2">部门</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="员工" v-if="authorizeForm.authotizeType == 1">
        <el-select v-model="authorizeForm.userId" 
        placeholder="选择员工"
        filterable
        :loading="loading"
        >
            <el-option v-for="item in employeeList" :label="item.userName" :value="item.id" :key="item.id"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="部门" v-if="authorizeForm.authotizeType == 2" prop="departmentId">
        <el-select v-model="authorizeForm.departmentId" 
        placeholder="选择部门"
        filterable
        :loading="loading"
        >
            <el-option v-for="item in deparmentList" :label="item.departmentName" :value="item.id" :key="item.id"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="项目" prop="projectId">
          <el-select v-model="authorizeForm.projectId" placeholder="选择项目" @change="projectAuthortiesList">
            <el-option v-for="item in projectList" :label="item.projectName" :value="item.id" :key="item.id"></el-option>
          </el-select>
      </el-form-item>
     <el-form-item label="角色">
          <el-select v-model="authorizeForm.roleId" placeholder="选择角色" @change="changeRole">
            <el-option v-for="item in roleList" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="权限">
        <el-tree
            :data="authorityTree"
            show-checkbox
            node-key="id"
            ref="tree"
            :default-checked-keys="selectedArr"
            :props="defaultProps">
          </el-tree>
      </el-form-item>
      <el-form-item>
          <el-button type="primary" @click="submitForm('authorizeForm')">授权</el-button>
      </el-form-item>
    </el-form>
    </el-dialog>
  </div>
</template>

<script>
import addAuthorities from './components/addPermission'
import { authoritiesListSearch, userAuthorize, deleteAuthorites } from '@/api/authorities.js'
import { projectListAll, projectAuthortiesList, getRoleListByProjectId, getProjectAuthoritiesTree } from '@/api/projects.js'
import { departmentAuthorities, getDepartmentList } from '@/api/department.js'
import { selectRoleAuthoritiesList } from '@/api/role.js'
import { getAllUserList } from '@/api/user.js'
import { Message } from 'element-ui'
export default {
  components: {
    addAuthorities
  },
  data() {
    return {
      isVisible: false,
      showAuthorize: false,
      permission: {},
      title: '权限添加',
      authorityTree: [],
      selectedArr: [],
      authorityList: [],
      projectList: [],
      roleList: [],
      employeeList: [],
      deparmentList: [],
      projectAuthoritiesList: [],
      projectAuthoritiesTree: [],
      total: 0,
      loading: false,
      listQuery: {
        pid: '',
        projectId: '',
        pageIndex: 1,
        pageSize: 10
      },
      authorizeForm: {
        projectId: '',
        authotizeType: 0,
        roleId: '',
        userId: '',
        departmentId: '',
        authoritiesIds: []
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      rules: {
        projectId: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        roleId: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ],
        authotizeType: [
          { required: true, message: '请选择授权类型', trigger: 'change' }
        ],
        userId: [
          { required: true, message: '请选员工', trigger: 'change' }
        ],
        departmentId: [
          { required: true, message: '请选部门', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    handleNodeClick(data) {
      this.listQuery.projectId = data.projectId
      this.listQuery.pid = data.authoritieId
      this.getAuthorityList()
    },
    getProjectAuthoritiesTree() {
      getProjectAuthoritiesTree()
        .then(response => {
          this.projectAuthoritiesTree = response.dataObject.projectAuthortiesTree
        }).catch(e => {
          if (e.status === 408) {
            this.$router.push('/408')
          } else {
            Message({
              message: e.response.data.message,
              type: 'error',
              duration: 3 * 1000
            })
          }
        })
    },
    closeDialog() {
      this.isVisible = false
      this.getAuthorityList()
    },
    edit(obj) {
      this.isVisible = true
      this.permission = obj
      this.title = '权限修改'
    },
    add() {
      this.permission = {}
      this.isVisible = true
      this.title = '权限添加'
    },
    deletePermisson(obj) {
      this.$confirm('此操作可能会导致其他的权限被删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAuthorites(obj.id)
          .then(response => {
            Message({
              message: '权限删除成功~',
              type: 'success',
              duration: 3 * 1000
            })
          }).catch(e => {
            if (e.status === 408) {
              this.$router.push('/408')
            } else {
              Message({
                message: e.response.data.message,
                type: 'error',
                duration: 3 * 1000
              })
            }
          })
      }).catch(() => {
        console.log('取消')
      })
    },
    getAuthorityList() {
      authoritiesListSearch(this.listQuery)
        .then(response => {
          this.authorityList = response.dataObject.authoritiesList
          this.total = response.dataObject.total
        }).catch(e => {
          if (e.status === 408) {
            this.$router.push('/408')
          } else {
            Message({
              message: e.response.data.message,
              type: 'error',
              duration: 3 * 1000
            })
          }
        })
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getAuthorityList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val
      this.getAuthorityList()
    },
    authorize() {
      this.showAuthorize = true
      this.authorizeForm = {}
      this.authorityTree = []
      this.getProjectList()
    },
    getProjectList() {
      projectListAll()
        .then(response => {
          this.projectList = response.dataObject.projectsList
        }).catch(e => {
          this.$router.push('/408')
        })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const temp = this.$refs.tree.getCheckedNodes()
          const arr = []
          if (temp.length > 0) {
            temp.forEach(o => {
              arr.push(o.id)
            })
            this.authorizeForm.authoritiesIds = arr
          }
          if (this.authorizeForm.authotizeType === '1') {
            userAuthorize(this.authorizeForm)
              .then(response => {
                this.showAuthorize = false
                Message({
                  message: '授权成功~',
                  type: 'success',
                  duration: 3 * 1000
                })
              }).catch(e => {
                this.$router.push('/408')
              })
          } else {
            departmentAuthorities(this.authorizeForm)
              .then(response => {
                this.showAuthorize = false
                Message({
                  message: '授权成功~',
                  type: 'success',
                  duration: 3 * 1000
                })
              }).catch(e => {
                this.$router.push('/408')
              })
          }
        }
      })
    },
    projectAuthortiesList(projectId) {
      projectAuthortiesList(projectId)
        .then(response => {
          this.authorityTree = response.dataObject.vos
        }).catch(e => {
          this.$router.push('/408')
        })
      getRoleListByProjectId(projectId)
        .then(response => {
          this.roleList = response.dataObject.roleList
        }).catch(e => {
          this.$router.push('/408')
        })
    },
    changeRole(roleId) {
      selectRoleAuthoritiesList(roleId)
        .then(response => {
          const roleAuthoritiesList = response.dataObject.roleAuthoritiesList
          const arrTemp = []
          if (roleAuthoritiesList.length > 0) {
            roleAuthoritiesList.forEach((o) => {
              arrTemp.push(o.authoritiesId)
            })
          }
          this.selectedArr = arrTemp
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
    getAllUserList() {
      getAllUserList()
        .then(response => {
          this.employeeList = response.dataObject.usersList
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
    this.getAuthorityList()
    this.getDepartmentList()
    this.getAllUserList()
    this.getProjectAuthoritiesTree()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 20px;
  width:100%;
}
</style>
