<template>
  <scroll-bar>
    <div class="menu_head" v-show="!isCollapse">
      <div class="head_img">
        <img :src="logo" alt="">
      </div> 
      <div class="head_name">
        {{nickname}}
      </div>
    </div>
    <el-menu mode="vertical" :default-active="$route.path" :collapse="isCollapse"  background-color="#3e3e3e" text-color="#fff" active-text-color="#65a6df">
      <sidebar-item :routes="permission_routers"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'
import logo from '@/assets/li_logo.png'

export default {
  data() {
    return {
      logo
    }
  },
  components: { SidebarItem, ScrollBar },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar',
      'username',
      'id',
      'nickname'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
<style scoped>
.menu_head {
  padding-bottom: 20px; 
  border-bottom: 1px solid #242424;
}
/* .head_img {
  position: relative;
  left: 90px;
  margin-left: -50px;
  margin-top: 30px;
  border: 1px solid black;
} */
.head_img img{
  height: 100px;
  width: 100px;
  position: relative;
  left: 90px;
  margin-left: -50px;
  margin-top: 30px;
  border-radius: 50px;
}
.head_name {
  width: 180px;
  text-align: center;
  color: #fff;
  margin-top: 10px;
}

</style>
