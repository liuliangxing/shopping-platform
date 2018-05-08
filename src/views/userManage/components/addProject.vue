<template>
  <div class="dashboard-editor-container">
    <el-form :model="projectForm" :rules="rules" ref="projectForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="projectForm.projectName"></el-input>
      </el-form-item>
      <el-form-item label="项目状态" prop="projectStatus">
          <el-select v-model="projectForm.projectStatus" placeholder="请选择活动状态">
          <el-option v-for="item in projectStatusList" :label="item.name" :value="item.status" :key="item.status"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="项目图片">
        <el-col :span="10">
         <upload-image v-model="projectForm.projectImg"></upload-image>
        </el-col>
      </el-form-item>
      <el-form-item label="项目链接" prop="projectLink">
          <el-input v-model="projectForm.projectLink"></el-input>
      </el-form-item>
      <el-form-item label="接口地址">
          <el-input v-model="projectForm.projectInterface"></el-input>
      </el-form-item>
      <el-form-item label="项目描述" prop="projectDescription">
          <el-input type="textarea" v-model="projectForm.projectDescription"></el-input>
      </el-form-item>
      <el-form-item>
          <el-button type="primary" @click="submitForm('projectForm')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import uploadImage from '@/components/Upload/singleImage2'
import { Message } from 'element-ui'
import { saveProject, updateProject } from '@/api/projects.js'
export default {
  props: {
    project: {
      type: Object,
      default: {}
    }
  },
  components: { uploadImage },
  data() {
    return {
      showProjectImg: false,
      projectStatusList: [
        { status: 1, name: '运行中' },
        { status: 2, name: '维护中' },
        { status: 3, name: '已停用' }
      ],
      projectForm: {
        id: '',
        projectShorthand: '',
        projectName: '',
        projectDescription: '',
        projectLink: '',
        projectInterface: '',
        projectStatus: 0,
        projectImg: ''
      },
      rules: {
        projectName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' }
        ],
        projectLink: [
          { required: true, message: '请输入项目链接', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50个字符', trigger: 'blur' }
        ],
        projectStatus: [
          { required: true, message: '请选择项目状态', trigger: 'change' }
        ],
        projectDescription: [
          { required: true, message: '请填写项目描述', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.projectForm = this.project
  },
  watch: {
    project() {
      this.projectForm = this.project
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.projectForm.id) {
            updateProject(this.projectForm)
              .then(response => {
                Message({
                  message: '项目修改成功~',
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
            saveProject(this.projectForm)
              .then(response => {
                Message({
                  message: '项目添加成功~',
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
