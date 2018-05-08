<template>
  <div class="dashboard-editor-container">
    <el-card class="box-card">
    <div slot="header" class="clearfix">
      <div>项目参数设置</div>
    </div>
    <el-form :model="projectForm" :rules="rules" ref="projectForm" label-width="120px" class="demo-ruleForm" >
      <el-form-item label="项目包名" prop="projectPackage">
          <el-input v-model="projectForm.projectPackage" ></el-input>
      </el-form-item>
      <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="projectForm.projectName" @blur="projectModules"></el-input>
      </el-form-item>
      <el-form-item label="模块名称" v-if="projectForm.projectName">
          <el-col :span="8">
            <p>{{projectForm.module1}}</p>
          </el-col>
          <el-col :span="8">
            <p>{{projectForm.module2}}</p>
          </el-col>
          <el-col :span="8">
            <p>{{projectForm.module3}}</p>
          </el-col>
          <el-col :span="8">
            <p>{{projectForm.module4}}</p>
          </el-col>
          <el-col :span="8">
            <p>{{projectForm.module5}}</p>
          </el-col>
          <el-col :span="8">
            <p>{{projectForm.module6}}</p>
          </el-col>
      </el-form-item>
      <el-form-item
        v-for="(item, index) in projectForm.projectNames"
        :label="'模块' + index"
        :key="index"
        :prop="'projectNames.' + index + '.value'"
        :rules="{
          required: true, message: '模块名不能为空', trigger: 'blur'
        }"
      >
        <el-col :span="16"><el-input v-model="item.value">
          <template slot="prepend">{{projectForm.projectName}}-</template>
        </el-input></el-col>
        <el-col :span="2" :offset="2"><el-button @click.prevent="removeModules(index)">删除</el-button></el-col>
      </el-form-item>
      <el-form-item>
          <el-button type="primary" @click="addModule()">添加模块</el-button>
      </el-form-item>
      <el-form-item label="数据库地址" prop="dburl">
          <el-input v-model="projectForm.dburl"></el-input>
      </el-form-item>
      <el-form-item label="数据库用户名" prop="dbUser">
          <el-input v-model="projectForm.dbUser"></el-input>
      </el-form-item>
      <el-form-item label="数据库密码" prop="dbPassword">
          <el-input v-model="projectForm.dbPassword"></el-input>
      </el-form-item>
      <el-form-item label="数据库名称" prop="dbName">
        <el-col :span="8">
          <el-input v-model="projectForm.dbName"></el-input>
        </el-col>   
      </el-form-item>

      <el-form-item>
          <el-button type="primary" @click="submitForm('projectForm')">生成并下载</el-button>
          <el-button type="primary" @click="submitForm('projectForm')">生成并上传至SVN</el-button>
      </el-form-item>
    </el-form>
  </el-card>
    
  </div>
</template>

<script>

export default {
  components: {
  },
  data() {
    return {
      projectForm: {
        projectPackage: '',
        projectName: '',
        module1: '',
        module2: '',
        module3: '',
        module4: '',
        module5: '',
        module6: '',
        projectNames: [
          { value: '' }
        ],
        dburl: '',
        dbUser: '',
        dbPassword: '',
        dbName: ''
      },
      rules: {
        projectPackage: [
          { required: true, message: '请输入项目包名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20个字符', trigger: 'blur' }
        ],
        projectName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20个字符', trigger: 'blur' }
        ],
        dburl: [
          { required: true, message: '请输入数据库地址', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20个字符', trigger: 'blur' }
        ],
        dbUser: [
          { required: true, message: '请输入数据库用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20个字符', trigger: 'blur' }
        ],
        dbPassword: [
          { required: true, message: '请输入数据库密码', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20个字符', trigger: 'blur' }
        ],
        dbName: [
          { required: true, message: '请输入数据库名称', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    projectModules() {
      this.projectForm.module1 = this.projectForm.projectName + '-common'
      this.projectForm.module2 = this.projectForm.projectName + '-config'
      this.projectForm.module3 = this.projectForm.projectName + '-dao'
      this.projectForm.module4 = this.projectForm.projectName + '-service'
      this.projectForm.module5 = this.projectForm.projectName + '-biz'
      this.projectForm.module6 = this.projectForm.projectName + '-job'
    },
    addModule() {
      this.projectForm.projectNames.push(
        { value: '' }
      )
    },
    removeModules(index) {
      this.projectForm.projectNames.splice(index, 1)
    }
  },
  mounted() {

  }
}
</script>
<style scoped>
.dashboard-editor-container {
  padding: 20px;
  width:100%;
}
</style>
