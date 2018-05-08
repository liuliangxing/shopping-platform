<template>
  <div class="dashboard-editor-container">
    <el-form :model="authorities" :rules="rules" label-position="left" ref="authoritiesForm" label-width="80px" class="demo-ruleForm">
      <el-form-item label="显示标题" prop="menuNotes">
          <el-input v-model="authorities.menuNotes"></el-input>
      </el-form-item>
      <el-form-item label="英文名称" prop="authoritiesName">
          <el-input v-model="authorities.authoritiesName"></el-input>
      </el-form-item>
      <el-form-item label="路径" prop="menuPath" v-if="authorities.type !== 3">
          <el-input v-model="authorities.menuPath"></el-input>
      </el-form-item>
      <el-form-item label="图标" prop="iconName" v-if="authorities.type !== 3">
          <el-input v-model="authorities.iconName">
            <template slot="prepend">
              <i :class="'iconfont ' + authorities.iconName "></i>
            </template>
          </el-input>
      </el-form-item>
      <el-form-item label="菜单类型" prop="type">
        <el-radio-group v-model="authorities.type" @change="getAuthoritiesByType" :disabled="authorities.id !== 0">
            <el-radio :label="1" >菜单权限</el-radio>
            <el-radio :label="2" >页面权限</el-radio>
            <el-radio :label="3" >操作权限</el-radio>
        </el-radio-group>
    </el-form-item>
      <el-form-item label="上级菜单">
          <el-select v-model="authorities.parentId" @change="changeSelect"  placeholder="选择上级菜单" style="width:100%" :disabled="authorities.id !== 0">
            <el-option label="顶级菜单" :value="-1" v-if="authorities.type !== 3"></el-option>
            <el-option v-for="item in menuListTemp" :label="item.menuNotes" :value="item.id" :key="item.id"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item>
          <el-button type="primary" @click="submitForm('authoritiesForm')" style="width:100%">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import { saveAuthorities, updateAuthorities, getAuthoritiesByType } from '@/api/authorities.js'
export default {
  props: {
    authoritiesForm: {
      type: Object,
      default: {
      }
    },
    menuList: {
      type: Array
    }
  },
  data() {
    const menuPathValidata = (rule, value, callback) => {
      if (this.authorities.type === 3) {
        callback()
      } else {
        if (value === '') {
          callback(new Error('请输入菜单目录'))
        }
      }
      callback()
    }
    return {
      authorities: {
        id: null,
        parentId: null,
        menuNotes: null,
        authoritiesName: null,
        menuPath: null,
        type: null,
        iconName: null
      },
      selectParentId: -1,
      temp: '',
      authorities1: {},
      menuListTemp: [],
      rules: {
        authoritiesName: [
          { required: true, message: '请输入英文名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20个字符', trigger: 'blur' }
        ],
        menuNotes: [
          { required: true, message: '请输入显示标题', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20个字符', trigger: 'blur' }
        ],
        menuPath: [
          { validator: menuPathValidata, trigger: 'blur' }
        ]
        // projectId: [
        //   { required: true, message: '请选择项目', trigger: 'change' }
        // ]
      }
    }
  },
  watch: {
    menuList() {
      this.menuListTemp = this.menuList
    },
    authoritiesForm() {
      this.setValue()
    }
  },
  computed: {
    ...mapGetters([
      'id'
    ])
  },
  created() {
    this.menuListTemp = this.menuList
    this.setValue()
    // console.info(this.authorities)
  },
  methods: {
    setValue() {
      this.authorities.id = this.authoritiesForm.id
      this.authorities.menuNotes = this.authoritiesForm.menuNotes
      this.authorities.authoritiesName = this.authoritiesForm.authoritiesName
      this.authorities.menuPath = this.authoritiesForm.menuPath
      this.authorities.parentId = this.authoritiesForm.parentId
      this.authorities.type = this.authoritiesForm.type
      this.authorities.iconName = this.authoritiesForm.iconName
    },
    getAuthoritiesByType(type) {
      getAuthoritiesByType(type)
        .then(response => {
          this.menuListTemp = response.dataObject.result
          this.authorities.parentId = null
          // if (this.menuList.length) {
          //   this.authorities.parentId = this.menuList[0].id
          // } else {
          //   this.authorities.parentId = -1
          // }
          // console.info(this.authorities.parentId)
        }).catch(e => {
          this.$emit('close')
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
    changeType(value) {
      // getAuthoritiesByType
      // console.info(value)
      // console.info(this.authorities.type)
      this.getAuthoritiesByType(this.authorities.type)
    },
    changeSelect(value) {
      // console.info(value)
      console.info(this.authorities)
      // this.authorities.parentId = value
      // console.info(value)
      // this.authorities.parentId = -1
      // console.info(this.authorities)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.authorities.id) {
            updateAuthorities(this.authorities)
              .then(response => {
                Message({
                  message: '菜单修改成功~',
                  type: 'success',
                  duration: 3 * 1000
                })
                this.$emit('close')
              }).catch(e => {
                this.$emit('close')
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
            saveAuthorities(this.authorities)
              .then(response => {
                Message({
                  message: '菜单添加成功~',
                  type: 'success',
                  duration: 3 * 1000
                })
                this.$emit('close')
              }).catch(e => {
                this.$emit('close')
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
    // closeDialog(formName) {
    //   this.$emit('close')
    // },
    // getMenuList() {
    //   getCatalogueMenuList()
    //     .then(response => {
    //       this.menuList = response.dataObject.menuList
    //       if (this.menuForm.type === 2) {
    //         this.menuListTemp = this.menuList
    //       }
    //     }).catch(e => {
    //       this.$router.push('/408')
    //     })
    // },
    // getProjectList() {
    //   projectListAll()
    //     .then(response => {
    //       this.projectList = response.dataObject.projectsList
    //     }).catch(e => {
    //       this.$router.push('/408')
    //     })
    // }
  },
  mounted() {
    // this.getAuthoritiesByType(this.authorities.type)
    // this.getMenuList()
    // this.getProjectList()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 20px;
  width:100%;
}
</style>
