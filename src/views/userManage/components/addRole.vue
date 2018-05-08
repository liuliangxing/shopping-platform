<template>
  <div class="dashboard-editor-container">
    <el-form :model="roleForm" :rules="rules" ref="roleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="所属项目" prop="projectId">
          <el-select v-model="roleForm.projectId" placeholder="选择项目" @change="changeProject">
          <el-option v-for="item in projectList" :label="item.projectName" :value="item.id" :key="item.id"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="权限">
          <!-- <el-select v-model="roleForm.authoritiesIds" placeholder="选择权限">
            <el-option v-for="item in authorityList" :label="item.notes" :value="item.id" :key="item.id"></el-option>
          </el-select> -->
          <el-tree
            :data="authorityTree"
            show-checkbox
            ref="tree"
            node-key="id"
            :default-checked-keys="defaultCheckKeys"
            :props="defaultProps">
          </el-tree>
      </el-form-item>
      <el-form-item>
          <el-button type="primary" @click="submitForm('roleForm')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { saveRole, updateRole, selectRoleAuthoritiesList } from '@/api/role.js'
import { projectListAll, projectAuthortiesList } from '@/api/projects.js'
export default {
  props: {
    role: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      roleForm: {
        id: '',
        name: '',
        roleId: '',
        projectId: 0,
        authoritiesIds: []
      },
      projectList: [],
      authorityList: [],
      authorityTree: [],
      defaultCheckKeys: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' }
        ],
        projectId: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.roleForm = this.role
  },
  watch: {
    role() {
      this.roleForm = this.role
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const temp1 = this.$refs.tree.getCheckedNodes()
          const temp2 = this.$refs.tree.getHalfCheckedNodes()
          const tempArr = []
          if (temp1.length > 0) {
            temp1.forEach(o => {
              tempArr.push(o.id)
            })
          }
          if (temp2.length > 0) {
            temp2.forEach(o => {
              tempArr.push(o.id)
            })
          }
          if (tempArr.length > 0) {
            this.roleForm.authoritiesIds = tempArr
            this.roleForm.roleId = this.roleForm.id
            if (this.roleForm.id) {
              updateRole(this.roleForm)
                .then(response => {
                  Message({
                    message: '角色修改成功~',
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
            } else {
              saveRole(this.roleForm)
                .then(response => {
                  Message({
                    message: '角色添加成功~',
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
            this.$emit('close')
          } else {
            return
          }
        }
      })
    },
    closeDialog(formName) {
      this.$emit('close')
    },
    changeProject(projectId) {
      projectAuthortiesList(projectId)
        .then(response => {
          this.authorityTree = response.dataObject.vos
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
    getProjectList() {
      projectListAll()
        .then(response => {
          this.projectList = response.dataObject.projectsList
        }).catch(e => {
          this.$router.push('/408')
        })
    },
    getRoleAuthotitesList(id) {
      selectRoleAuthoritiesList(id)
        .then(response => {
          const arr = response.dataObject.roleAuthoritiesList
          const selected = []
          if (arr && arr.length > 0) {
            arr.forEach((o) => {
              const leafNode = arr.filter(o2 => o.id !== o2.parentId)
              if (!leafNode) {
                selected.push(o.authoritiesId)
              }
            })
          }
          this.defaultCheckKeys = selected
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
    this.getProjectList()
    if (this.roleForm.projectId) {
      this.changeProject(this.roleForm.projectId)
    }
    if (this.roleForm.id) {
      this.getRoleAuthotitesList(this.roleForm.id)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 20px;
  width:100%;
}
</style>
