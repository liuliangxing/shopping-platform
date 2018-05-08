<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>

    <breadcrumb class="breadcrumb-container"></breadcrumb>
    <el-dialog
        title="技术支持"
        :visible.sync="dialogVisible"
        width="30%">
        <div>如遇问题</div>
      </el-dialog>
    <div class="right-menu">
      <div>
        <span style="color: #888;">{{datestr}}</span>
        <span class="sp"></span>
          <i class="iconfont icon-shezhi" title="设置"></i>
        <span class="sp"></span>
        <el-badge :value="logCount" class="badge_item">
          <i class="iconfont icon-yujing" title="消息"></i>
        </el-badge>
        <span class="sp"></span>
        <i class="iconfont icon-bangzhu" title="帮助" @click="dialogVisible = true"></i>
        <span class="sp"></span>
        <i class="iconfont icon-tuichu" title="退出" @click="logout"></i>
        <!-- <el-button type="text" @click="logout" class="btn_logout">退出</el-button> -->
      </div>
      <!-- <el-tooltip effect="dark" content="全屏" placement="bottom">
        <screenfull class="screenfull right-menu-item"></screenfull>
      </el-tooltip> -->
      <!-- <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img class="user-avatar" :src="avatar">
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils/index.js'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  data() {
    return {
      logCount: 1,
      datestr: '',
      dialogVisible: false
    }
  },
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    },
    gen_date() {
      window.setInterval(() => {
        this.datestr = parseTime(new Date(), '{y}年{m}月{d}日 {h}:{i}:{s} 星期{a}')
      }, 1000)
    }
  },
  mounted() {
    this.gen_date()
    document.querySelector('.badge_item .el-badge__content.is-fixed').style.top = '10px'
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container{
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    margin-right: 20px;
    height: 100%;
    &:focus{
     outline: none;
    }
    i{
      cursor: pointer;
    }
    .sp{
      width: 1px;
      // border: 1px solid black;
      margin: 0px 15px 0px 10px;
      &::before{
        content: "";
        position: absolute;
        top: calc(50% - 8px);
        width: 1px;
        height: 16px;
        background: #ebebeb;
      }
    }
    .btn_logout {
      margin-left: 10px;
      color: #888;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international{
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
