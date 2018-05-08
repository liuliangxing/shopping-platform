<template>
  <div class="dashboard-editor-container">
    <el-form :model="permissionForm" :rules="rules" ref="permissionForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="权限名称" prop="name">
          <el-input v-model="permissionForm.name"></el-input>
      </el-form-item>
      <el-form-item label="权限描述" prop="notes">
          <el-input v-model="permissionForm.notes"></el-input>
      </el-form-item>
      <el-form-item label="所属项目" prop="projectId">
          <el-select v-model="permissionForm.projectId" placeholder="选择项目" @change="changeProject">
            <el-option v-for="item in projectList" :label="item.projectName" :value="item.id" :key="item.id"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="上级权限">
          <el-select v-model="permissionForm.pid" placeholder="选择上级权限">
            <el-option v-for="item in authorityList" :label="item.notes" :value="item.id" :key="item.id"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item>
          <el-button type="primary" @click="submitForm('permissionForm')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { saveAuthorities, updateAuthorities } from '@/api/authorities.js'
import { projectListAll, projectAuthortiesList } from '@/api/projects.js'
export default {
  props: {
    permission: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      permissionForm: {
        id: '',
        name: '',
        projectId: 0,
        pid: 0,
        notes: ''
      },
      projectList: [],
      roleList: [],
      authorityList: [],
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50个字符', trigger: 'blur' }
        ],
        notes: [
          { required: true, message: '请输入权限描述', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' }
        ],
        projectId: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.permissionForm = this.permission
  },
  watch: {
    permission() {
      this.permissionForm = this.permission
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.permissionForm.id) {
            updateAuthorities(this.permissionForm)
              .then(response => {
                Message({
                  message: '权限修改成功~',
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
            saveAuthorities(this.permissionForm)
              .then(response => {
                Message({
                  message: '权限添加成功~',
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
        }
      })
    },
    closeDialog(formName) {
      this.$emit('close')
    },
    getProjectList() {
      projectListAll()
        .then(response => {
          this.projectList = response.dataObject.projectsList
        }).catch(e => {
          this.$router.push('/408')
        })
    },
    changeProject(projectId) {
      projectAuthortiesList(projectId)
        .then(response => {
          this.authorityList = response.dataObject.authoritiesList
          console.log(this.authorityList)
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
    if (this.permissionForm.projectId) {
      this.changeProject(this.permissionForm.projectId)
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
