<template>
  <div class="dashboard-editor-container">
    <el-form :model="provincesForm" :rules="rules" ref="provincesForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="省份名称" prop="name">
          <el-input v-model="provincesForm.name"></el-input>
      </el-form-item>
      <el-form-item label="身份证号前两位" prop="areaCode">
          <el-input v-model="provincesForm.areaCode"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="seq">
          <el-input v-model="provincesForm.seq"></el-input>
      </el-form-item>
      <el-form-item>
          <el-button type="primary" @click="submitForm('provincesForm')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { saveProvinces, updateProvinces } from '@/api/provinces.js'
export default {
  props: {
    provinces: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      provincesForm: {
        id: '',
        name: '',
        areaCode: '',
        seq: 0,
        status: 0
      },
      rules: {
        name: [
          { required: true, message: '请输入省份名称', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5个字符', trigger: 'blur' }
        ],
        areaCode: [
          { required: true, message: '请输入省份证号前两位', trigger: 'blur' },
          { min: 2, max: 2, message: '长度 2 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.provincesForm = this.provinces
  },
  watch: {
    provinces() {
      this.provincesForm = this.provinces
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.provincesForm.id) {
            updateProvinces(this.provincesForm)
              .then(response => {
                Message({
                  message: '省份修改成功~',
                  type: 'success',
                  duration: 3 * 1000
                })
                this.$emit('closeProvinces')
              }).catch(e => {
                this.$emit('closeProvinces')
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
            saveProvinces(this.provincesForm)
              .then(response => {
                Message({
                  message: '省份添加成功~',
                  type: 'success',
                  duration: 3 * 1000
                })
                this.$emit('closeProvinces')
              }).catch(e => {
                this.$emit('closeProvinces')
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
        // this.$emit('close')
      })
    }
  },
  mounted() {

  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 20px;
  width:100%;
}
</style>
