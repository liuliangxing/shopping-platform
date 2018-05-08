<template>
  <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
    <!-- <el-form-item prop="mobile">
    <el-input name="mobile" type="text" v-model="loginForm.mobile" autoComplete="on" placeholder="手机号" />
    </el-form-item> -->
    <el-form-item prop="code">
    <el-input name="code" type="text" v-model="loginForm.code" placeholder="输入6位短信验证码" :maxlength="6"/>
    <div class="get_code">
        <el-button type="text" @click="sendCode(loginForm.mobile)" :disabled="isClick">{{checkCodeName}}</el-button>
    </div>
    </el-form-item>
    <el-form-item prop="password">
    <el-input name="password" type="password" @keyup.enter.native="forgetPwd" v-model="loginForm.password" placeholder="密码"/>
    </el-form-item>
    <el-button type="primary" style="width:100%;margin-bottom:20px;margin-top:20px;" :loading="loading" @click.native.prevent="forgetPwd">确定</el-button>
</el-form>
</template>

<script>
import { Message } from 'element-ui'
import { retrievePassword } from '@/api/login.js'
import { sendCode } from '@/api/code.js'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      isClick: false,
      checkCodeName: '获取短信验证码',
      countDown: 60,
      loading: false,
      loginForm: {
      },
      loginRules: {
        // mobile: [{ required: true, trigger: 'blur', message: '手机号不能为空' },
        //   { min: 11, max: 11, message: '手机号格式不正确', trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur', message: '密码不能为空' }],
        code: [{ required: true, trigger: 'blur', message: '短信验证码不能为空' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'mobile'
    ])
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    sendCode() {
      debugger
      if (!this.mobile || this.mobile.length !== 11) {
        Message({
          message: '手机号格式不正确',
          type: 'error',
          duration: 3 * 1000
        })
        return
      }
      const obj = {
        mobile: this.mobile,
        contentId: 3
      }
      sendCode(obj).then(response => {
        this.isClick = true
        const time = setInterval(() => {
          if (this.countDown === 0) {
            this.isClick = false
            this.checkCodeName = '获取验证码'
            this.countDown = 60
            clearInterval(time)
          } else {
            this.checkCodeName = this.countDown + 's'
            this.countDown--
          }
        }, 1000)
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
    forgetPwd() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loginForm.mobile = this.mobile
          retrievePassword(this.loginForm).then(() => {
            Message({
              message: '密码设置成功',
              type: 'success',
              duration: 3 * 1000
            })
            this.$emit('cancel')
            this.resetForm('loginForm')
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
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-input {
  display: inline-block;
  height: 48px;
  width: 100%;
  // border: 1px solid red;
  margin-top: 16px;
  font-size: 14px;
  input {
    background: transparent;
    border: 0px;
    border-bottom: 1px solid #eee;
    -webkit-appearance: none;
    border-radius: 0px;
    padding: 12px 0px 12px 0px;
    // color: $light_gray;
    height: 47px;
    // &:-webkit-autofill {
    //   -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
    //   -webkit-text-fill-color: #fff !important;
    // }
  }
}
.get_code {
  position: absolute;
  top: 16px;
  right: 10px;
}
</style>
