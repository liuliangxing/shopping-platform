<template>
  <div class="dashboard-editor-container">
    <el-container>
      <el-aside width="400px" style="">
          <el-input class="search_key" placeholder="搜索关键字"
          v-model="filterText" suffix-icon="el-icon-search"></el-input>
        <el-tree
          :data="menuList"
          node-key="id"
          ref="tree"
          :filter-node-method="filterNode"
          :expand-on-click-node="false">
          <span  @click="selectNode(data)" class="custom-tree-node"  slot-scope="{ node, data }">
            <span >{{ node.label}}</span>
            <span>
              <el-button @click="add(data)" v-if="data.type === 1" icon="el-icon-plus" type="text"></el-button>
              <el-button @click="edit(data)" icon="el-icon-edit" type="text"></el-button>
              <el-button @click="deleteMenu(data)" icon="el-icon-delete" type="text"></el-button>
            </span>
          </span>
        </el-tree>
        <div class="add_menu" @click="add">
         <i class="el-icon-plus"></i> 添加菜单
        </div>
      </el-aside>
      <el-main class="data_body">
          <!-- <el-button type="primary" size="small" @click="add" style="float:right;">添加菜单</el-button> -->
           <el-table :data="selectMenuList" stripe style="width: 100%;">
            <!-- <el-table-column prop="id" label="ID"></el-table-column> -->
            <el-table-column prop="name" label="菜单名称" align="center"></el-table-column>
            <el-table-column prop="notes" label="描述" align="center" width="200"></el-table-column>
            <el-table-column prop="type" label="菜单类型" align="center" width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.type === 1"><el-tag type="danger">菜单权限</el-tag></span>
                <span v-else><el-tag type="success">操作权限</el-tag></span>
              </template>
            </el-table-column>
            <el-table-column prop="path" label="菜单路径" align="center"></el-table-column>
            <el-table-column prop="createDate" label="创建时间" width="200" align="center">
              <template slot-scope="scope">
                <i class="el-icon-date"></i>
                <span>{{scope.row.createDate}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="150">
              <template slot-scope="scope">
                <el-button @click="edit(scope.row)" type="text" size="small" icon="el-icon-edit">修改</el-button>
                <el-button @click="deleteMenu(scope.row)" type="text" size="small" icon="el-icon-delete">删除</el-button>
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
            <add-Menu :menu="menu" @close="closeDialog()"></add-Menu>
          </el-dialog> 
      </el-main>
    </el-container>
    
  </div>
</template>

<script>
import addMenu from './components/addMenu'
import { menuTree, deleteMenuById } from '@/api/menu.js'
import { Message } from 'element-ui'
// import draggable from 'vuedraggable'
export default {
  components: {
    addMenu
  },
  data() {
    return {
      filterText: '',
      isVisible: false,
      menu: {
      },
      title: '菜单添加',
      menuList: [],
      selectMenuList: []
    }
  },
  methods: {
    closeDialog() {
      this.isVisible = false
      this.getMenuList()
    },
    edit(obj) {
      this.isVisible = true
      this.menu = obj
      this.title = '菜单修改'
    },
    add(data) {
      if (data) {
        this.menu = {
          id: '',
          projectId: 1,
          parentId: data.id,
          type: 2
        }
      } else {
        this.menu = {
          id: '',
          projectId: 1,
          type: 1
        }
      }
      this.isVisible = true
      this.title = '菜单添加'
    },
    deleteMenu(obj) {
      this.$confirm('删除菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMenuById(obj.id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getMenuList()
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
    getMenuList() {
      menuTree()
        .then(response => {
          this.menuList = response.dataObject.menuTrees
          this.selectMenuList = this.menuList
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
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getMenuList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val
      this.getMenuList()
    },
    selectNode(data) {
      this.selectMenuList = []
      this.selectMenuList.push(data)
      if (data.children.length) {
        this.childrenNode(data.children)
      }
    },
    childrenNode(data) {
      data.forEach((obj) => {
        this.selectMenuList.push(obj)
        if (obj.children.length) {
          this.childrenNode(obj.children)
        }
      })
    },
    filterNode(value, data) {
      if (!value) {
        return true
      }
      return data.label.indexOf(value) !== -1
    }
  },
  mounted() {
    this.getMenuList()
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
