<template>
  
  <div class="dashboard-editor-container">
    <el-container>
    <el-header>
        <div class="search_form">
          <el-form ref="form" :model="listQuery" label-width="80px">
            <el-row>
              <el-col :span="5">
                <el-form-item label="手机号">
                  <el-input v-model="listQuery.mobile" placeholder="手机号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5" :offset="1">
                <el-form-item label="是否有效">
                    <el-select v-model="listQuery.enabled" clearable placeholder="请选择">
                      <el-option
                      size="small"
                        v-for="item in enableds"
                        :key="item.enabled"
                        :label="item.name"
                        :value="item.enabled">
                      </el-option>
                    </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5" >
                <el-form-item label="开始时间">
                  <el-date-picker type="date" placeholder="选择日期" v-model="listQuery.createTime" style="width:100%"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="结束时间">
                  <el-date-picker type="date" placeholder="选择日期" v-model="listQuery.endTime" style="width:100%"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-button type="primary" size="small" round @click="getCodeListSearch()" style="float:right;" icon="el-icon-search">搜索</el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
    </el-header>
    <el-main>
      <el-table :data="mobileValidateList" border style="width: 100%;margin-top:10px;">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="mobile" label="手机号"></el-table-column>
      <el-table-column prop="code" label="验证码"></el-table-column>
      <el-table-column prop="createTime" label="开始时间"></el-table-column>
      <el-table-column prop="endTime" label="结束时间"></el-table-column>
      <el-table-column prop="message" label="返回信息"></el-table-column>
      <el-table-column prop="enabled" label="是否有效"></el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    </el-main>
  </el-container>
    
  </div>
</template>

<script>
import { codeListSearch } from '@/api/code.js'
import { Message } from 'element-ui'
export default {
  data() {
    return {
      total: 0,
      mobileValidateList: [],
      enableds: [
        {
          enabled: 1,
          name: '有效'
        },
        {
          enabled: 2,
          name: '无效'
        }
      ],
      listQuery: {
        mobile: '',
        createTime: '',
        endTime: '',
        enabled: '',
        pageIndex: 1,
        pageSize: 10
      }
    }
  },
  methods: {
    getCodeListSearch() {
      this.getCodeList()
    },
    getCodeList() {
      codeListSearch(this.listQuery)
        .then(response => {
          this.mobileValidateList = response.dataObject.mobileValidateList
          this.mobileValidateList.forEach((o, i) => {
            if (o.enabled === 1) {
              o.enabled = '有效'
            } else {
              o.enabled = '无效'
            }
          })
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
      this.getCodeList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val
      this.getCodeList()
    }
  },
  mounted() {
    this.getCodeList()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 20px;
  width:100%;
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
