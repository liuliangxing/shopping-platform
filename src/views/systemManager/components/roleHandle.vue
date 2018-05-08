<template>
    <section>
        <el-form ref="form" :model="searchForm" :rules="rules">
                <el-form-item>
                  <el-input v-model="searchForm.roleName" placeholder="角色名称">
                    <template slot="prepend">角色名称</template>
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-input v-model="searchForm.roleDesc" placeholder="角色描述">
                    <template slot="prepend">角色描述</template>
                  </el-input>
                </el-form-item>
        </el-form>
        <div>
            <el-tree
            :data="authoritiesList"
            show-checkbox
            check-strictly
            default-expand-all
            node-key="id"
            ref="tree"
            :default-checked-keys="selectAuthorities"
            :props="defaultProps"
            @check-change="checkChange">
          </el-tree>
        </div>
        <div style="margin-top:20px;">
          <el-button style="width:100%" type="primary" @click="sure">确定</el-button>
        </div>
    </section>
</template>

<script>
import { authoritiesListSearch } from '@/api/authorities.js'
import { saveRole, updateRole, selectRoleAuthoritiesList } from '@/api/role.js'
import { Message } from 'element-ui'
export default {
  props: {
    selectRole: {
      type: Object
    }
  },
  watch: {
    selectRole() {
      this.changeRole()
    }
  },
  data() {
    return {
      searchForm: {
        authoritiesIds: []
      },
      authoritiesList: [],
      selectAuthorities: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      rules: {
        roleName: [{ required: true, trigger: 'blur', message: '角色名不能为空' }]
      }
    }
  },
  methods: {
    selectRoleAuthorities(id) {
      selectRoleAuthoritiesList(id)
        .then(response => {
          this.selectAuthorities = response.dataObject.result
          // this.searchForm.authoritiesIds = []
          // this.searchForm.authoritiesIds = response.dataObject.result
          this.authoritiesListSearch()
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
    edit() {
      updateRole(this.searchForm)
        .then(response => {
          Message({
            message: '修改角色成功',
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
    sure() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.selectRole) {
            this.edit()
          } else {
            this.save()
          }
        } else {
          return false
        }
      })
    },
    authoritiesListSearch() {
      authoritiesListSearch()
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
    },
    save() {
      saveRole(this.searchForm)
        .then(response => {
          Message({
            message: '新增角色成功',
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
    checkChange(node, select, childSelect) {
      const arr = this.searchForm.authoritiesIds
      if (select) {
        arr.push(node.id)
      } else {
        const index = arr.findIndex(item => item === node.id)
        arr.splice(index, 1)
      }
    },
    changeRole() {
      if (this.selectRole) {
        this.searchForm.id = this.selectRole.id
        this.searchForm.roleName = this.selectRole.roleName
        this.searchForm.roleDesc = this.selectRole.roleDesc
        this.selectRoleAuthorities(this.selectRole.id)
      } else {
        this.searchForm = {
          id: null,
          roleName: null,
          roleDesc: null,
          authoritiesIds: []
        }
        this.selectAuthorities = []
        this.authoritiesListSearch()
      }
    }
  },
  mounted() {
    this.authoritiesListSearch()
    this.changeRole()
  }
}
</script>

<style>

</style>
