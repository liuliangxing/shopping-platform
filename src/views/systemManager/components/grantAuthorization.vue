<template>
<div>
  <el-tree
  :data="authoritiesList"
  show-checkbox
  check-strictly
  default-expand-all
  node-key="id"
  ref="tree"
  :default-checked-keys="selectAuthorities"
  :props="defaultProps">
</el-tree>
<el-button type="primary" class="sure" @click="sure">确定</el-button>
</div>
</template>

<script>
import { authoritiesListByRole, getAuthoritiesListByUserId, grantAuthoritiesListByUserId } from '@/api/authorities.js'
import { Message } from 'element-ui'
export default {
  props: {
    id: {
      type: Number
    }
  },
  watch: {
    id() {
      this.getAuthoritiesListByUserId()
    }
  },
  data() {
    return {
      authoritiesList: [],
      selectAuthorities: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    sure() {
      const nodes = this.$refs.tree.getCheckedNodes()
      const selectNode = []
      nodes.forEach((o, i) => {
        const obj = { 'userId': this.id, 'authoritiesId': o.id }
        selectNode.push(obj)
      })
      grantAuthoritiesListByUserId(this.id, selectNode)
        .then(response => {
          Message({
            message: '授权成功',
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
    getAuthoritiesListByUserId() {
      getAuthoritiesListByUserId(this.id)
        .then(response => {
          this.selectAuthorities = response.dataObject.result
          this.getAuthoritiesList()
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
    getAuthoritiesList() {
      authoritiesListByRole(this.id)
        .then(response => {
          this.authoritiesList = response.dataObject.result
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
    this.getAuthoritiesListByUserId()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.sure {
  margin-top: 20px;
  width: 100%;
}
</style>
