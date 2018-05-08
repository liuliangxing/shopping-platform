<template>
  <section>
      <el-transfer
        filterable
        filter-placeholder="角色名称"
        :titles="['系统角色列表', '用户角色列表']"
        :button-texts="['移除', '添加']"
        v-model="selectRoleList"
        :props="props"
        :data="roleList">
        <el-button class="transfer-footer save_button" type="text" slot="left-footer"  size="medium" @click="getDefaultRole">还原</el-button>
        <el-button class="transfer-footer save_button" type="text" slot="right-footer"  size="medium" @click="save()">保存</el-button>
    </el-transfer>
  </section>
</template>

<script>
import { roleListSearch, getRoleByUserId, editUserRole } from '@/api/role'
import { Message } from 'element-ui'
export default {
  props: {
    id: {
      type: Number
    }
  },
  watch: {
    id() {
      this.getDefaultRole()
    }
  },
  data() {
    return {
      props: {
        'key': 'id',
        'label': 'roleName'
      },
      roleList: [],
      selectRoleList: []
    }
  },
  methods: {
    save() {
      const obj = {
        userId: this.id,
        roleIds: this.selectRoleList
      }
      editUserRole(obj)
        .then(response => {
          Message({
            message: '角色保存成功',
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
    },
    getRoleList() {
      roleListSearch({})
        .then(response => {
          this.roleList = response.dataObject.result
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
    getDefaultRole() {
      getRoleByUserId(this.id)
        .then(response => {
          this.selectRoleList = response.dataObject.result
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
  },
  mounted() {
    this.getRoleList()
    this.getDefaultRole()
  }
}
</script>

<style scoped rel="stylesheet/scss" lang="scss">
.save_button{
  // text-align: center;
  // position: relative;
  // left: 50%;
  // margin-left: 
  width: 100%;
  height: 100%;
}
</style>
