<template>
  <div class="dashboard-editor-container">
    <el-form :model="contentForm" :rules="rules" ref="contentForm" label-width="100px" class="demo-contentForm">
      <el-form-item label="发送内容" prop="content">
          <el-input v-model="contentForm.content"></el-input>
      </el-form-item>
      <el-form-item>
          <el-button type="primary" @click="submitForm('contentForm')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { saveContent, updateContent } from '@/api/content.js'
export default {
  props: {
    content: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      contentForm: {
        id: '',
        content: ''
      },
      rules: {
        content: [
          { required: true, message: '请填写发送内容', trigger: 'blur' },
          { min: 3, max: 5000, message: '长度在 3 到 5000个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.contentForm = this.content
  },
  watch: {
    content() {
      this.contentForm = this.content
    }
  },
  methods: {
    closeDialog(formName) {
      this.$emit('close')
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.contentForm.id) {
            updateContent(this.contentForm)
              .then(response => {
                Message({
                  message: '内容修改成功~',
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
            saveContent(this.contentForm)
              .then(response => {
                Message({
                  message: '内容添加成功~',
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
