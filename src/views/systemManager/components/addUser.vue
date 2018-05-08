<template>
  <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
    <el-form-item prop="username">
      <el-input type="text" v-model="loginForm.username" autoComplete="on" placeholder="用户名（由字母 和 数字 组成）" />
    </el-form-item>
    <el-form-item prop="nickname">
      <el-input type="text" v-model="loginForm.nickname" autoComplete="on" placeholder="昵称" />
    </el-form-item>
    <el-form-item prop="password" :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }, 
                                { min: 1, max: 32, message: '长度在 1 到 32个字符', trigger: 'blur' }]" v-if="loginForm.edit">
    <el-input type="password"  v-model="loginForm.password" placeholder="密码" />
    </el-form-item>
    <el-button type="primary" style="width:100%;margin-bottom:20px;margin-top:20px;" :loading="loading" @click.native.prevent="sure('loginForm')">确定</el-button>
 </el-form>
</template>

<script>
import { register, editUser } from '@/api/login'
import { Message } from 'element-ui'
export default {
  props: {
    loginForm: {
      type: Object,
      default: {
      }
    }
  },
  data() {
    return {
      loading: false,
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20个字符', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    sure(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.loginForm.edit) {
            register(this.loginForm)
              .then(response => {
                Message({
                  message: '用户添加成功',
                  type: 'success',
                  duration: 3 * 1000
                })
                this.$emit('close')
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
            this.loginForm.userId = this.loginForm.id
            editUser(this.loginForm)
              .then(response => {
                Message({
                  message: '用户编辑成功',
                  type: 'success',
                  duration: 3 * 1000
                })
                this.$emit('close')
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
        }
      })
    }
  }
}
</script>

<style>

</style>
