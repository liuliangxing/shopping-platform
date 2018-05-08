<template>
  <div class="dashboard-container">
    <!-- <component :is="currentRole"></component> -->
    <admin></admin>
    <!-- <el-dialog title="设置密码" v-if="isPassword === 2" :show-close="false" :close-on-click-modal="false" center :visible.sync="dialogTableVisible">
      <setPwd @cancel="closeDialog()"></setPwd>
    </el-dialog> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import admin from './admin'
import other from './editor'
import setPwd from './components/setPwd'

export default {
  name: 'dashboard',
  components: { admin, other, setPwd },
  data() {
    return {
      currentRole: 'admin',
      dialogTableVisible: true
    }
  },
  computed: {
    ...mapGetters([
    ])
  },
  created() {
    // if (!this.roles === 1) {
    //   this.currentRole = 'other'
    // }
  },
  methods: {
    closeDialog() {
      this.dialogTableVisible = false
    }
  }
}
</script>
