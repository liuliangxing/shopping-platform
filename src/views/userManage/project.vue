<template>
  <div class="dashboard-editor-container">
    <el-container>
      <el-header class="search_body" style="height:100px;">
        <div class="search_form">
          <el-form ref="form" :model="searchForm" label-width="80px">
            <el-row>
              <el-col :span="6">
                <el-form-item label="项目名称">
                  <el-input v-model="searchForm.name" placeholder=""></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="1">
                <el-form-item label="开始时间">
                  <el-date-picker type="date" placeholder="选择日期" v-model="searchForm.startDate" style="width:100%"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="结束时间">
                  <el-date-picker type="date" placeholder="选择日期" v-model="searchForm.endDate" style="width:100%"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-button type="primary" size="small" round @click="add" style="float:right;" icon="el-icon-plus">添加项目</el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-header>
      <el-main>
          <!-- <el-button type="primary" size="small" @click="add" style="float:right;">添加项目</el-button> -->
          <el-table :data="projectList" style="width: 100%;margin-top:10px;">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="项目编码">
                        <span>{{ props.row.projectNum }}</span>
                        <el-button  icon="el-icon-tickets" size="mini" title="复制" type="text" v-clipboard:copy="props.row.projectNum" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</el-button>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="项目名称">
                        <span>{{ props.row.projectName }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="项目地址">
                          <span>{{ props.row.projectLink }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="项目状态">
                          <span v-if="props.row.projectStatus === 1"><el-tag type="success">运行中</el-tag></span>
                          <span v-else-if="props.row.projectStatus === 2"><el-tag type="danger">维护中</el-tag></span>
                          <span v-else><el-tag type="warning">已停用</el-tag></span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="项目描述">
                        <span>{{ props.row.projectDescription }}</span>
                      </el-form-item>
                    </el-col>
                    
                  </el-row>
                
                </el-form>
              </template>
            </el-table-column>
            <el-table-column prop="projectNum" align="center" label="项目编码" width="330">
              <template slot-scope="scope">
                <span>{{scope.row.projectNum}}</span>
                <el-button  icon="el-icon-tickets" size="mini" title="复制" type="text" v-clipboard:copy="scope.row.projectNum" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="projectName" align="center" label="项目名称"></el-table-column>
            <!-- <el-table-column prop="projectDescription" label="项目描述"></el-table-column> -->
            <el-table-column prop="projectLink" align="center" label="项目链接"></el-table-column>
            <el-table-column prop="projectStatus" align="center" label="项目状态" width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.projectStatus === 1"><el-tag type="success">运行中</el-tag></span>
                <span v-else-if="scope.row.projectStatus === 2"><el-tag type="danger">维护中</el-tag></span>
                <span v-else><el-tag type="warning">已停用</el-tag></span>
              </template>
            </el-table-column>
            <el-table-column prop="createDate" align="center"  label="创建时间" width="200">
              <template slot-scope="scope">
                <i class="el-icon-date"></i>
                <span>{{scope.row.createDate}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="150">
              <template slot-scope="scope">
                <el-button @click="run(scope.row, scope.$index)" type="text" size="small" v-if="scope.row.projectStatus === 2 || scope.row.projectStatus === 3">运行</el-button>
                <el-button @click="maintain(scope.row, scope.$index)" type="text" size="small" v-if="scope.row.projectStatus === 1 ">维护</el-button>
                <el-button @click="stop(scope.row, scope.$index)" type="text" size="small" v-if="scope.row.projectStatus === 1 || scope.row.projectStatus === 2">停用</el-button>
                <el-button @click="edit(scope.row)" type="text" size="small">修改</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
              :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </div>
      </el-main>
    </el-container>
    
    <el-dialog
      :title="title"
      :visible.sync="isVisible"
      :close-on-click-modal="false"
      top="10vh"
      width="50%">
      <add-Project :project="project" @close="closeDialog()" v-if="isVisible"></add-Project>
    </el-dialog>
  </div>
</template>

<script>
import addProject from './components/addProject'
import { projectsListSearch, updateProject } from '@/api/projects.js'
import { Message } from 'element-ui'
export default {
  components: {
    addProject
  },
  data() {
    return {
      isVisible: false,
      project: {},
      searchForm: {},
      title: '项目添加',
      projectList: [],
      total: 0,
      listQuery: {
        projectName: '',
        projectStatus: '',
        time: Date.parse(new Date()),
        pageIndex: 1,
        pageSize: 10
      }
    }
  },
  methods: {
    onCopy(e) {
      this.$message({
        message: '复制成功！ 内容：' + e.text,
        type: 'success'
      })
    },
    onError(e) {
      this.$message({
        message: '复制失败！',
        type: 'error'
      })
    },
    copyNum(projectNum) {
      projectNum.select()
    },
    run(row, index) {
      row.projectStatus = 1
      this.updateProject(row)
    },
    maintain(row, index) {
      row.projectStatus = 2
      this.updateProject(row)
    },
    stop(row, index) {
      row.projectStatus = 3
      this.updateProject(row)
    },
    updateProject(obj) {
      updateProject(obj)
        .then(response => {
          this.getProjectList()
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
    closeDialog() {
      this.isVisible = false
      this.getProjectList()
    },
    edit(obj) {
      this.isVisible = true
      this.project = obj
      this.title = '项目修改'
    },
    add() {
      this.project = {}
      this.isVisible = true
      this.title = '项目添加'
    },
    getProjectList() {
      projectsListSearch(this.listQuery)
        .then(response => {
          this.projectList = response.dataObject.projectsList
          this.total = response.dataObject.total
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
      this.getProjectList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val
      this.getProjectList()
    }
  },
  mounted() {
    this.getProjectList()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 20px;
  width:100%;
}
.demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
.search_body {
  border: 1px solid #B3C0D1;
  // border-radius: 5px;
  .search_form {
    margin-top: 30px;
  }
}
.pagination-container {
    text-align: center;
  }
</style>
