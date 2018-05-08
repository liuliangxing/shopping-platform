<template>
  <div class="dashboard-editor-container">
    <el-form :model="articleForm" :rules="rules" ref="articleForm" label-width="100px" class="demo-articleForm">
      <el-form-item label="公告标题" prop="title">
          <el-input v-model="articleForm.title"></el-input>
      </el-form-item>
      <el-form-item label="项目" prop="projectId">
          <el-select v-model="articleForm.projectId" placeholder="请选择项目">
          <el-option v-for="item in projectsList" :label="item.projectName" :value="item.id" :key="item.id"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="公告内容" prop="content">
          <el-input v-model="articleForm.content"></el-input>
      </el-form-item>
      <el-form-item label="版本号" prop="version">
          <el-input v-model="articleForm.version"></el-input>
      </el-form-item>
      <el-form-item label="作者" prop="author">
          <el-input v-model="articleForm.author"></el-input>
      </el-form-item>
      <el-form-item>
          <el-button type="primary" @click="submitForm('articleForm')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { projectListAll } from '@/api/projects.js'
import { saveArticle, updateArticle } from '@/api/article.js'
export default {
  props: {
    article: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      projectsList: [],
      articleForm: {
        id: '',
        title: '',
        projectId: 0,
        content: '',
        version: '',
        author: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入公告标题', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请填写公告内容', trigger: 'blur' },
          { min: 3, max: 5000, message: '长度在 3 到 5000个字符', trigger: 'blur' }
        ],
        projectId: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        version: [
          { required: true, message: '请输入版本号', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50个字符', trigger: 'blur' }
        ],
        author: [
          { required: true, message: '请输入作者', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.articleForm = this.article
  },
  watch: {
    article() {
      this.articleForm = this.article
    }
  },
  methods: {
    closeDialog(formName) {
      this.$emit('close')
    },
    getProjectListAll() {
      projectListAll()
        .then(response => {
          this.projectsList = response.dataObject.projectsList
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
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.articleForm.id) {
            updateArticle(this.articleForm)
              .then(response => {
                Message({
                  message: '公告修改成功~',
                  type: 'success',
                  duration: 3 * 1000
                })
                this.$emit('close')
              }).catch(e => {
                this.$emit('close')
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
            saveArticle(this.articleForm)
              .then(response => {
                Message({
                  message: '公告添加成功~',
                  type: 'success',
                  duration: 3 * 1000
                })
                this.$emit('close')
              }).catch(e => {
                this.$emit('close')
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
          // this.$emit('close')
        }
      })
    }
  },
  mounted() {
    this.getProjectListAll()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 20px;
  width:100%;
}
</style>
