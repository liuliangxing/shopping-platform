<template>
  <div class="login-container">
    <!-- <div class="logo">
      <img :src="logo" width="162" height="162">
    </div> -->
    <div class="login-form">
      <div class="title-container">
        <p class="title">商城后台管理系统</p>
      </div>
      <!-- 使用用户名登录 -->
      <div class="pwd_login">
        <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
          <el-form-item prop="username">
            <el-input type="text" v-model="loginForm.username" autoComplete="on" :maxlength='11' placeholder="用户名"/>
          </el-form-item>

          <el-form-item prop="password">
            <el-input type="password" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="密码"/>
          </el-form-item>
          <el-button type="primary" style="width:100%;margin-bottom:20px;margin-top:20px;" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>
        </el-form>
      </div>
    </div>
    <div class="footer">
      <p>版权所有京ICP备15038343号-3 Copyright©2018 All Right Reserved</p>
    </div>
  </div>
</template>

<script>
import logo from '@/assets/logo.png'
import { Message } from 'element-ui'
export default {
  name: 'login',
  data() {
    return {
      loading: false,
      logo,
      isClick: false,
      loginForm: {
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
        password: [{ required: true, trigger: 'blur', message: '密码不能为空' }]
      }
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({ path: '/' })
          }).catch(e => {
            this.loading = false
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

<style rel="stylesheet/scss" scoped lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

/* reset element-ui css */
.login-container {
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
  // .el-form-item {
  //   border: 1px solid rgba(255, 255, 255, 0.1);
  //   background: rgba(0, 0, 0, 0.1);
  //   border-radius: 5px;
  //   color: #454545;
  // }
}
.forget_pwd {
  text-align: right;
  color: gray;
  span {
    cursor: pointer;
  }
}
.get_code {
  position: absolute;
  top: 19px;
  right: 0px;
}
.dingding_qrCode{
  position: absolute;
  left: 50%;
  margin-left: -125px;
}
.pwd_login {
  margin-top: 30px;
}
.tip{
  text-align: center;
}
.to_pwd_login {
  border-top: 1px solid #ebebeb;
  padding: 14px 0;
  font-size: 14px;
  color: #175199;
  text-align: center;
  span {
    cursor: pointer;
  }
}
.logo{
  width: 100%;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99;
}
.logo img{
  width: 162px;
  height: 162px;
  display: block;
  margin: 0 auto;
  margin-top: 120px;
}
.footer{
  width: 100%;
  overflow: hidden;
  position: absolute;
  top: 830px;
  z-index: 99;
}
.footer p{
  text-align: center;
  font-size: 14px;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  @include relative;
  height: 100vh;
  background-image: url(../../assets/login_background.png);
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 420px;
    height:540px;
    padding: 35px 35px 15px 35px;
    background: #ffffff;
    margin: 200px auto;
    border-radius: 10px;
    -moz-box-shadow: 10px 10px 5px #888888; /* 老的 Firefox */
    box-shadow:0px 0px 30px 10px #abcdef;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title-container {
    position: relative;
    margin-top:60px;
    .title {
      font-size: 26px;
      font-weight: 400;
      color: #65a6df;
      margin: 0px auto 0px auto;
      text-align: center;
      font-weight: bold;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
}
</style>
