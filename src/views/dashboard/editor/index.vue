<template>
  <div class="main_content">
    <el-row>
      <el-col :span="6" v-for="(item) in projectList" :key="item.id" :offset="1" style="margin-top:20px">
        <el-card :body-style="{ padding: '0px'}" class="project_module">
          <img :src="projectImg" class="image">
          <div style="padding:14px;height:150px">
            <span class="title">{{item.projectName}}</span>
            <div class="bottom clearfix">
              <div class="description">{{ item.projectDescription }}</div>
              <el-button type="text" v-if="item.projectStatus === 1" class="button"><a :href="item.projectLink" target="_blank">进入项目</a></el-button>
              <el-button type="text" v-else-if="item.projectStatus === 2" class="button">项目正在维护</el-button>
              <el-button type="text" v-else class="button">项目已停用</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import projectImg from '@/assets/project.jpg'
import { mapGetters } from 'vuex'
import { userProjectList } from '@/api/user.js'

export default {
  name: 'not_dashboard-admin',
  components: {
  },
  data() {
    return {
      projectImg: projectImg,
      projectList: []
    }
  },
  computed: {
    ...mapGetters([
      'userId'
    ])
  },
  methods: {
    getProjectList() {
      userProjectList(this.userId)
        .then(response => {
          this.projectList = response.dataObject.projectList
        }).catch(e => {
          this.$router.push('/408')
        })
    }
  },
  mounted() {
    this.getProjectList()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.main_content {
  width:100%;
}
.title {
  font-weight: bold;
}
.description {
  font-size: 14px;
  line-height: 25px;
  height:75px;
}
.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  height: 230px;
  display: block;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both
}
.project_module {
  cursor: pointer;
  position: relative;
  &:hover {
    border: 1px solid #65a6df;
  }
}
</style>
