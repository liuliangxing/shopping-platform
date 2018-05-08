<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="20">
    <el-col style="width: 33%">
    <el-input placeholder="请输入内容" @change="searchProvinces" prefix-icon="el-icon-search" v-model="searchProvincesValue" size="small"> </el-input>
    <el-button @click="addProvinces()" type="primary" size="small" style="float:right;">添加省</el-button>
    <el-table :data="provincesListTemp" row-key="id" @current-change="provincesCurrentChange" v-loading.body="listLoading" border fit highlight-current-row >
      <el-table-column align="center" label="省">
        <template slot-scope="scope">
          <span>{{scope.row.name}}<el-button @click="editProvinces(scope.row)" type="text" size="small" style="float:right;">修改</el-button></span>
        </template>
      </el-table-column>
    </el-table>
    </el-col>
    <el-col style="width: 33%">
    <el-input placeholder="请输入内容" @change="searchCitices" prefix-icon="el-icon-search" v-model="searchCiticesValue" size="small"> </el-input>
    <el-button @click="addCitices()" type="primary" size="small" style="float:right;">添加市</el-button>
    <el-table :data="citicesListTemp" row-key="id" @current-change="citicesCurrentChange"  v-loading.body="listLoading" border fit highlight-current-row >
      <el-table-column align="center" label="市">
        <template slot-scope="scope">
          <span>{{scope.row.name}}<el-button @click="editCitices(scope.row)" type="text" size="small" style="float:right;">修改</el-button></span>
        </template>
      </el-table-column>
    </el-table>
    </el-col>
    <el-col style="width: 33%">
      <el-input placeholder="请输入内容" @change="searchDistricts" prefix-icon="el-icon-search" v-model="searchDistrictsValue" size="small"> </el-input>
      <el-button @click="addDistricts()" type="primary" size="small" style="float:right;">添加区</el-button>
    <el-table :data="districtsListTemp" row-key="id"  v-loading.body="listLoading" border fit highlight-current-row >
      <el-table-column align="center" label="区">
        <template slot-scope="scope">
          <span>{{scope.row.name}}<el-button @click="editDistricts(scope.row)" type="text" size="small" style="float:right;">修改</el-button></span>
        </template>
      </el-table-column>
    </el-table>
    </el-col>
    </el-row>

    <el-dialog
      :title="title"
      :visible.sync="isProvincesVisible"
      :close-on-click-modal="false"
      width="50%">
      <add-Provinces :provinces="selectProvinceTemp"  @closeProvinces="closeProvincesDialog()" v-if="isProvincesVisible"></add-Provinces>
    </el-dialog>
    <el-dialog
      :title="title"
      :visible.sync="isCiticesVisible"
      :close-on-click-modal="false"
      width="50%">
      <add-Citices :citices="selectCityTemp" @closeCitices="closeCiticesDialog()" v-if="isCiticesVisible"></add-Citices>
    </el-dialog>
    <el-dialog
      :title="title"
      :visible.sync="isDistrictsVisible"
      :close-on-click-modal="false"
      width="50%">
      <add-Districts :districts="selectDistrictsTemp" @closeDistricts="closeDistrictsDialog()" v-if="isDistrictsVisible"></add-Districts>
    </el-dialog>
  </div>
</template>

<script>
import addProvinces from './components/addProvinces'
import addCitices from './components/addCitices'
import addDistricts from './components/addDistricts'
import { getProvincesList, getProvincesById } from '@/api/provinces.js'
import { getCiticesList } from '@/api/citices.js'
import { getDistrictsList } from '@/api/districts.js'
import { Message } from 'element-ui'
export default {
  components: {
    addProvinces,
    addCitices,
    addDistricts
  },
  data() {
    return {
      searchProvincesValue: '',
      searchCiticesValue: '',
      searchDistrictsValue: '',
      title: '',
      listLoading: false,
      provincesList: [],
      provincesListTemp: [],
      citicesList: [],
      citicesListTemp: [],
      districtsList: [],
      districtsListTemp: [],
      isProvincesVisible: false,
      isCiticesVisible: false,
      isDistrictsVisible: false,
      provincesId: 0,
      provincesName: '',
      citicesId: 0,
      citicesName: '',
      provinces: [],
      citices: [],
      selectProvince: {},
      selectProvinceTemp: {},
      selectCity: {},
      selectCityTemp: {},
      selectDistricts: {},
      selectDistrictsTemp: {}
    }
  },
  methods: {
    getProvincesList() {
      getProvincesList()
        .then(response => {
          this.provincesList = response.dataObject.provincesList
          this.provincesListTemp = this.provincesList
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
    getCiticesList(provinceId) {
      getCiticesList(provinceId)
        .then(response => {
          this.citicesList = response.dataObject.citiesList
          this.citicesListTemp = this.citicesList
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
    getDistrictsList(citicesId) {
      getDistrictsList(citicesId)
        .then(response => {
          this.districtsList = response.dataObject.districtsList
          this.districtsListTemp = this.districtsList
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
    getProvincesById(provincesId) {
      getProvincesById(provincesId)
        .then(response => {
          this.provinces = response.dataObject.provincesList
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
    provincesCurrentChange(val) {
      this.selectProvince = val
      this.provincesId = val.id
      this.provincesName = val.name
      this.getCiticesList(val.id)
      this.districtsList = []
    },
    citicesCurrentChange(val) {
      this.selectCity = val
      this.selectCityTemp.provinceId = this.selectProvince.id
      this.selectCityTemp.provinceName = this.selectProvince.name
      this.citicesId = val.id
      this.citicesName = val.name
      this.getDistrictsList(val.id)
    },
    addProvinces() {
      this.selectProvinceTemp = {}
      this.isProvincesVisible = true
      this.title = '省份添加'
    },
    editProvinces(obj) {
      this.isProvincesVisible = true
      this.selectProvinceTemp = obj
      this.title = '省份修改'
    },
    addCitices() {
      if (this.provincesId === 0) {
        Message({
          message: '请选择省份进行添加',
          type: 'error',
          duration: 3 * 1000
        })
      } else {
        this.selectCityTemp = {}
        this.selectCityTemp.provinceId = this.selectProvince.id
        this.selectCityTemp.provinceName = this.selectProvince.name
        this.isCiticesVisible = true
        this.title = '市添加'
      }
    },
    editCitices(obj) {
      this.isCiticesVisible = true
      this.selectCityTemp = obj
      this.selectCityTemp.provinceId = this.provincesId
      this.selectCityTemp.provinceName = this.provincesName
      this.title = '市修改'
    },
    addDistricts() {
      if (this.citicesId === 0) {
        Message({
          message: '请选择市进行添加',
          type: 'error',
          duration: 3 * 1000
        })
      } else {
        this.selectDistrictsTemp = {}
        this.selectDistrictsTemp.cityId = this.selectCity.id
        this.selectDistrictsTemp.cityName = this.selectCity.name
        this.isDistrictsVisible = true
        this.title = '区添加'
      }
    },
    editDistricts(obj) {
      this.isDistrictsVisible = true
      this.selectDistrictsTemp = obj
      this.selectDistrictsTemp.cityId = this.citicesId
      this.selectDistrictsTemp.cityName = this.citicesName
      this.title = '区修改'
    },
    closeProvincesDialog() {
      this.isProvincesVisible = false
      this.getProvincesList()
    },
    closeCiticesDialog() {
      this.isCiticesVisible = false
      this.getCiticesList(this.provincesId)
    },
    closeDistrictsDialog() {
      this.isDistrictsVisible = false
      this.getDistrictsList(this.citicesId)
    },
    searchProvinces(val) {
      this.provincesListTemp = this.provincesList.filter((value, index) => {
        if (value.name.includes(val)) {
          return true
        }
        return false
      })
    },
    searchCitices(val) {
      this.citicesListTemp = this.citicesList.filter((value, index) => {
        if (value.name.includes(val)) {
          return true
        }
        return false
      })
    },
    searchDistricts(val) {
      this.districtsListTemp = this.districtsList.filter((value, index) => {
        if (value.name.includes(val)) {
          return true
        }
        return false
      })
    }
  },
  mounted() {
    this.getProvincesList()
  }
}
</script>
<style scoped>
.dashboard-editor-container {
  padding: 20px;
  width:100%;
  height: 880px;
}
</style>