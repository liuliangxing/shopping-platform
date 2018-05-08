<template>
  <div class="dashboard-editor-container">
    <el-form :model="citicesForm" :rules="rules" ref="citicesForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="市名称" prop="name">
          <el-input v-model="citicesForm.name"></el-input>
      </el-form-item>
      <el-form-item label="省份id" prop="provinceId">
          <el-input v-model="citicesForm.provinceId" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="省份名称" prop="provinceName">
          <el-input v-model="citicesForm.provinceName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="身份证号编号" prop="areaCode">
          <el-input v-model="citicesForm.areaCode"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="seq">
          <el-input v-model="citicesForm.seq"></el-input>
      </el-form-item>
      <el-form-item label="经度" prop="longitude">
          <el-input v-model="citicesForm.longitude"></el-input>
      </el-form-item>
      <el-form-item label="纬度" prop="latitude">
          <el-input v-model="citicesForm.latitude"></el-input>
      </el-form-item>
      <el-form-item>
          <el-button type="primary" @click="submitForm('citicesForm')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { saveCitices, updateCitices } from '@/api/citices.js'
export default {
  props: {
    citices: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      citicesForm: {
        id: '',
        name: '',
        provinceId: 0,
        areaCode: '',
        seq: 0,
        status: 0,
        longitude: '',
        latitude: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入市名称', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5个字符', trigger: 'blur' }
        ],
        areaCode: [
          { required: true, message: '请输入身份证号编号', trigger: 'blur' },
          { min: 2, max: 2, message: '长度 2 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    // this.citicesForm.provinceId = this.citices.provinceId
    // this.citicesForm.provinceName = this.citices.provinceName
    this.citicesForm = this.citices
  },
  watch: {
    citices() {
    // this.citicesForm.provinceId = this.selectProvince.id
    // this.citicesForm.provinceName = this.selectProvince.Name
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.citicesForm.id) {
            updateCitices(this.citicesForm)
              .then(response => {
                Message({
                  message: '市修改成功~',
                  type: 'success',
                  duration: 3 * 1000
                })
                this.$emit('closeCitices')
              }).catch(e => {
                this.$emit('closeCitices')
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
            saveCitices(this.citicesForm)
              .then(response => {
                Message({
                  message: '市添加成功~',
                  type: 'success',
                  duration: 3 * 1000
                })
                this.$emit('closeCitices')
              }).catch(e => {
                this.$emit('closeCitices')
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
