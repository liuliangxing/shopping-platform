<template>
  <div class="dashboard-editor-container">
    <el-container>
      <el-aside width="400px" style="overflow: hidden;">
          <el-input class="search_key" placeholder="搜索关键字"
          v-model="filterText" suffix-icon="el-icon-search"  v-if="validatePermissions('SELECT_AUTHORITIES')"></el-input>
        <el-tree
          :data="authoritiesList"
          node-key="id"
          ref="tree"
          :default-expand-all="true"
          :filter-node-method="filterNode"
          :expand-on-click-node="false">
          <span  @click="selectNode(data)" class="custom-tree-node"  slot-scope="{ node, data }">
            <span >{{ node.label}}</span>
            <span v-if="data.type">
              <el-button @click="add(data)" v-if="(data.type === 1 || data.type === 2) && validatePermissions('ADD_AUTHORITIES')" icon="el-icon-plus" type="text"></el-button>
              <el-button @click="edit(data)" icon="el-icon-edit" type="text" v-if="validatePermissions('EDIT_AUTHORITIES')"></el-button>
              <el-button @click="deleteMenu(data)" icon="el-icon-delete" type="text" v-if="validatePermissions('DEL_AUTHORITES')"></el-button>
            </span>
          </span>
        </el-tree>
        <div class="add_menu" @click="add" v-if="validatePermissions('ADD_AUTHORITIES')">
         <i class="el-icon-plus"></i> 添加菜单
        </div>
      </el-aside>
      <el-main class="data_body">
          <!-- <el-button type="primary" size="small" @click="add" style="float:right;">添加菜单</el-button> -->
           <el-table :data="selectAuthoritesList" stripe style="width: 100%;">
            <!-- <el-table-column prop="id" label="ID"></el-table-column> -->
            <el-table-column prop="authoritiesName" label="权限名称" align="center"></el-table-column>
            <el-table-column prop="menuNotes" label="描述" align="center" width="200"></el-table-column>
            <el-table-column prop="type" label="菜单类型" align="center" width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.type === 1"><el-tag type="danger">菜单权限</el-tag></span>
                <span v-else-if="scope.row.type === 2"><el-tag type="success">页面权限</el-tag></span>
                <span v-else><el-tag type="info">操作权限</el-tag></span>
              </template>
            </el-table-column>
            <el-table-column prop="menuPath" label="菜单路径" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.menuPath">
                  {{scope.row.menuPath}}
                </span>
                <span v-else>
                  无
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="200" align="center">
              <template slot-scope="scope">
                <i class="el-icon-date"></i>
                <span>{{scope.row.createTime}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="150">
              <template slot-scope="scope">
                <el-button @click="edit(scope.row)" type="text" size="small" icon="el-icon-edit" v-if="validatePermissions('EDIT_AUTHORITIES')">修改</el-button>
                <el-button @click="deleteMenu(scope.row)" type="text" size="small" icon="el-icon-delete" v-if="validatePermissions('DEL_AUTHORITES')">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--<div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
              :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </div>-->
          <el-dialog
            :title="title"
            :visible.sync="isVisible"
            :close-on-click-modal="false"
            width="600px">
            <addAuthorities :authoritiesForm="selectAuthorities" :menuList="menuList" @close="closeDialog()"></addAuthorities>
          </el-dialog> 
      </el-main>
    </el-container>
    
  </div>
</template>

<script>
import addAuthorities from './components/addAuthorities'
import { authoritiesListSearch, deleteAuthorites, getAuthoritiesByType } from '@/api/authorities.js'
import { validateOperationPermissions } from '@/utils/validate.js'
import { Message } from 'element-ui'
// import draggable from 'vuedraggable'
export default {
  components: {
    addAuthorities
  },
  data() {
    return {
      menuList: [],
      filterText: '',
      isVisible: false,
      menu: {
      },
      title: '菜单添加',
      authoritiesList: [
        {
          label: '权限列表',
          children: []
        }
      ],
      selectAuthoritesList: [],
      selectAuthorities: {
        parentId: -1,
        type: 1
      }
    }
  },
  methods: {
    validatePermissions(authoritiesName) {
      return validateOperationPermissions(authoritiesName)
    },
    closeDialog() {
      this.isVisible = false
      this.getAuthoritiesList()
    },
    edit(data) {
      this.selectAuthorities = {
        parentId: data.parentId,
        id: data.id,
        authoritiesName: data.authoritiesName,
        menuNotes: data.menuNotes,
        menuPath: data.menuPath,
        iconName: data.iconName,
        type: data.type
      }
      console.info(this.selectAuthorities)
      this.getAuthoritiesByType(this.selectAuthorities.type)
      this.title = '菜单修改'
      this.isVisible = true
    },
    add(data) {
      this.selectAuthorities = {}
      if (data.id) {
        this.selectAuthorities.id = 0
        this.selectAuthorities.parentId = data.id
        if (data.type < 3) {
          this.selectAuthorities.type = data.type + 1
        }
      } else {
        this.selectAuthorities.id = 0
        this.selectAuthorities.parentId = -1
        this.selectAuthorities.type = 1
      }
      this.getAuthoritiesByType(this.selectAuthorities.type)
      this.isVisible = true
      this.title = '菜单添加'
    },
    deleteMenu(obj) {
      this.$confirm('删除菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAuthorites(obj.id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
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
      }).catch(() => {
      })
    },
    getAuthoritiesList() {
      authoritiesListSearch()
        .then(response => {
          this.authoritiesList[0].children = response.dataObject.result
          this.selectAuthoritesList = response.dataObject.result
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
    // handleSizeChange(val) {
    //   this.listQuery.pageSize = val
    //   this.getAuthoritiesList()
    // },
    // handleCurrentChange(val) {
    //   this.listQuery.pageIndex = val
    //   this.getAuthoritiesList()
    // },
    selectNode(data) {
      this.selectAuthoritesList = []
      // this.selectMenuList.push(data)
      if (data.children.length) {
        data.children.forEach((obj) => {
          this.selectAuthoritesList.push(obj)
        })
      } else {
        this.selectAuthoritesList.push(data)
      }
    },
    // childrenNode(data) {
    //   data.forEach((obj) => {
    //     this.selectMenuList.push(obj)
    //     if (obj.children.length) {
    //       this.childrenNode(obj.children)
    //     }
    //   })
    // },
    filterNode(value, data) {
      if (!value) {
        return true
      }
      return data.label.indexOf(value) !== -1
    },
    getAuthoritiesByType(type) {
      getAuthoritiesByType(type)
        .then(response => {
          this.menuList = response.dataObject.result
          // if (this.authorities.type === type) {
          //   if (this.authorities.parentId) {
          //     this.selectParentId = this.authorities.parentId
          //   } else {
          //     this.selectParentId = -1
          //   }
          // } else {
          //   if (this.menuList.length) {
          //     this.selectParentId = this.menuList[0].id
          //   } else {
          //     this.selectParentId = -1
          //   }
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
    }
  },
  mounted() {
    this.getAuthoritiesList()
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 20px;
  width:100%;
  .search_key {
    border: 0;
    // border-bottom: 1px solid #888;
    font-size: 14px;
    width: 380px;
    outline: 0;
    overflow: hidden;
    background: 0 0;
    margin-left: 10px;
    margin-bottom: 20px;
    padding: 5px 0px;
    &:focus{
      border-bottom: 1px solid #3e3e3e;
    }
  }
  .search_icon {
    cursor: pointer;
  }
  .add_menu {
    border: 1px dashed #888;
    border-radius: 3px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
    margin-top: 10px;
    &:hover{
      border: 1px dashed #65a6df;
    }
  }
  .data_body {
    // border: 1px solid black;
    padding-top: 5px;
  }
}
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
    height: 26px;
    line-height: 26px;
  }
</style>
