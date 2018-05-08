<template>
  <div class="dashboard-editor-container">
    <el-form :model="districtsForm" :rules="rules" ref="districtsForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="区名称" prop="name">
          <el-input v-model="districtsForm.name"></el-input>
      </el-form-item>
      <el-form-item label="市id" prop="cityId">
          <el-input v-model="districtsForm.cityId" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="市名称" prop="cityName">
          <el-input v-model="districtsForm.cityName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="seq">
          <el-input v-model="districtsForm.seq"></el-input>
      </el-form-item>
      <el-form-item>
          <el-button type="primary" @click="submitForm('districtsForm')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { saveDistricts, updateDistricts } from '@/api/districts.js'
export default {
  props: {
    districts: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      districtsForm: {
        id: '',
        name: '',
        cityId: 0,
        seq: 0
      },
      rules: {
        name: [
          { required: true, message: '请输入区名称', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    // this.citicesForm.provinceId = this.citices.provinceId
    // this.citicesForm.provinceName = this.citices.provinceName
    this.districtsForm = this.districts
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
          if (this.districtsForm.id) {
            updateDistricts(this.districtsForm)
              .then(response => {
                Message({
                  message: '区修改成功~',
                  type: 'success',
                  duration: 3 * 1000
                })
                this.$emit('closeDistricts')
              }).catch(e => {
                this.$emit('closeDistricts')
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
            saveDistricts(this.districtsForm)
              .then(response => {
                Message({
                  message: '区添加成功~',
                  type: 'success',
                  duration: 3 * 1000
                })
                this.$emit('closeDistricts')
              }).catch(e => {
                this.$emit('closeDistricts')
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
