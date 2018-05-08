<template>
  <div class="dashboard-editor-container">
    <el-card class="box-card">
    <div slot="header" class="clearfix">
      <div>设置密码</div>
    </div>
    <setPwd></setPwd>
  </el-card>
  </div>
</template>

<script>

import setPwd from '@/views/dashboard/components/setPwd'
export default {
  components: {
    setPwd
  },
  data() {
    return {
    }
  },
  methods: {
  },
  mounted() {

  }
}
</script>
<style scoped>
.dashboard-editor-container {
  padding: 20px;
  width:100%;
  height: 880px;
}
</style>