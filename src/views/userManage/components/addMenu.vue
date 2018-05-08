<template>
  <div class="dashboard-editor-container">
    <el-form :model="menuForm" :rules="rules" label-position="left" ref="menuForm" label-width="80px" class="demo-ruleForm">
      <el-form-item label="显示标题" prop="notes">
          <el-input v-model="menuForm.notes"></el-input>
      </el-form-item>
      <el-form-item label="英文名称" prop="name">
          <el-input v-model="menuForm.name"></el-input>
      </el-form-item>
      <el-form-item label="路径" prop="path">
          <el-input v-model="menuForm.path"></el-input>
      </el-form-item>
      <el-form-item label="图标" prop="iconName" v-if="menuForm.parentId === -1">
          <el-input v-model="menuForm.iconName"></el-input>
      </el-form-item>
      <el-form-item label="菜单类型" prop="type">
        <el-radio-group v-model="menuForm.type" @change="changeType">
          <el-radio :label="1" :disabled="menuForm.id !== ''">菜单权限</el-radio>
          <el-radio :label="2" :disabled="menuForm.id !== ''">操作权限</el-radio>
        </el-radio-group>
    </el-form-item>
      <el-form-item label="上级菜单">
          <el-select v-model="menuForm.parentId" placeholder="选择上级菜单" style="width:100%" :disabled="menuForm.id !== ''">
            <el-option label="顶级菜单" :value="-1"></el-option>
            <el-option v-for="item in menuListTemp" :label="item.notes" :value="item.id" :key="item.id"></el-option>
          </el-select>
      </el-form-item>
      <!-- <el-form-item label="所属项目" prop="projectId">
          <el-select v-model="menuForm.projectId" placeholder="选择项目" disabled style="width:100%">
            <el-option v-for="item in projectList" :label="item.projectName" :value="item.id" :key="item.id"></el-option>
          </el-select>
      </el-form-item> -->
      <el-form-item>
          <el-button type="primary" @click="submitForm('menuForm')" style="width:100%">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import { getCatalogueMenuList, saveMenu, updateMenu } from '@/api/menu.js'
import { projectListAll } from '@/api/projects.js'
export default {
  props: {
    menu: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      menuForm: {
        id: '',
        name: '',
        notes: '',
        parentId: -1,
        path: '',
        type: 1,
        sort: 1,
        projectId: 1,
        enabled: 1,
        userId: 0,
        position: 'left',
        iconName: ''
      },
      menuList: [],
      menuListTemp: [],
      projectList: [],
      rules: {
        name: [
          { required: true, message: '请输入英文名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20个字符', trigger: 'blur' }
        ],
        notes: [
          { required: true, message: '请输入显示标题', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20个字符', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '请输入菜单路径', trigger: 'blur' }
        ]
        // projectId: [
        //   { required: true, message: '请选择项目', trigger: 'change' }
        // ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'userId'
    ])
  },
  created() {
    this.menuForm = this.menu
  },
  watch: {
    menu() {
      this.menuForm = this.menu
    }
  },
  methods: {
    changeType(value) {
      if (value === 1) {
        this.menuListTemp = []
        this.menuForm.parentId = -1
      } else {
        this.menuListTemp = this.menuList
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.menuForm.parentId) {
            this.menuForm.parentId = -1
          }
          if (this.menuForm.id) {
            this.menuForm.userId = this.userId
            updateMenu(this.menuForm)
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
            // this.menuForm.type = 1
            this.menuForm.enabled = 1
            this.menuForm.sort = 3
            this.menuForm.userId = this.userId
            saveMenu(this.menuForm)
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
    },
    closeDialog(formName) {
      this.$emit('close')
    },
    getMenuList() {
      getCatalogueMenuList()
        .then(response => {
          this.menuList = response.dataObject.menuList
          if (this.menuForm.type === 2) {
            this.menuListTemp = this.menuList
          }
        }).catch(e => {
          this.$router.push('/408')
        })
    },
    getProjectList() {
      projectListAll()
        .then(response => {
          this.projectList = response.dataObject.projectsList
        }).catch(e => {
          this.$router.push('/408')
        })
    }
  },
  mounted() {
    this.getMenuList()
    this.getProjectList()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 20px;
  width:100%;
}
</style>
