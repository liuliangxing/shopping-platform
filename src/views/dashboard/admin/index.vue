<template>
  <section class="main_content" resize="Rem()">
    <el-container>
        <el-aside style="width:70%;overflow:inherit;" class="aside_class">
            <el-row :gutter="20">
                <el-col :span="15">
                  <div>
                    <el-card>
                        <el-row>
                            <el-col>
                              <div class="box-title">账户概览 ( 4月27日 ) </div>
                            </el-col>
                            <el-row>
                              <el-col :span="8">
                                  <div class="box-info">
                                    <div class="info">
                                      <span class="money">
                                        <el-progress type="circle" style="" :percentage="source" color="#8e71c7">
                                        </el-progress>
                                      </span>
                                    </div>
                                  </div>
                              </el-col>
                              <el-col :span="8">
                                  <div class="box-info">
                                    <div class="info">
                                      <span class="money">
                                        <el-progress type="circle" style="" :percentage="user" color="#67C23A">
                                        </el-progress>
                                      </span>
                                    </div>
                                  </div>
                              </el-col>
                              <el-col :span="8">
                                  <div class="box-info">
                                    <div class="info">
                                      <span class="money">
                                        <el-progress type="circle" style="" :percentage="sale" color="#409EFF">
                                        </el-progress>
                                      </span>
                                    </div>
                                  </div>
                              </el-col>
                            </el-row>
                        </el-row>
                    </el-card>
                  </div>
                </el-col>
                <el-col :span="9">
                  <div>
                      <el-card>
                        <el-row>
                          <el-col>
                              <div class="box-title">资源信息 </div>
                          </el-col>
                          <el-col>
                            <div class="resource-info">
                                  <ul>
                                    <li>供货商 
                                      <span style="float:right;"> 
                                        <span style="color:red;">3</span> 家
                                      </span>
                                    </li>
                                    <li>分销商 
                                      <span style="float:right;"> 
                                        <span style="color:red;">3</span> 人
                                      </span>
                                    </li>
                                    <li>商品数量
                                      <span style="float:right;"> 
                                        <span style="color:red;">10</span> 件
                                      </span>
                                    </li>
                                  </ul>
                                </div>
                          </el-col>
                        </el-row>
                      </el-card>
                  </div>
                </el-col>
            </el-row>
        </el-aside>
        <el-main class="main_class">
          <el-card >
              <el-tabs v-model="activeName" style="width：100%;">
                <el-tab-pane label="本日排行" name="day-index-1">
                  <div class="rang_info">
                    <div class="rang_info_img">

                    </div>
                    <div class="rang_info_content">
                      <div class="rang_info_name">
                        联想ThinkPad
                      </div>
                      <div class="rang_info_price">

                      </div>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="本月排行" name="month-index-1">

                </el-tab-pane>
                <el-tab-pane label="总排行" name="total-index-1">

                </el-tab-pane>
              </el-tabs>
          </el-card>
        </el-main>
      </el-container>
  </section>
</template>

<script>
// import Rem from '@/utils/rem.js'
import { mapGetters } from 'vuex'
// Rem()
// window.addEventListener('resize', Rem, false)
export default {
  name: 'dashboard-admin',
  components: {
  },
  data() {
    return {
      activeName: 'day-index-1',
      source: 30,
      source_money: 3000,
      user: 60,
      user_money: 6000,
      sale: 10,
      sale_maoney: 1000
    }
  },
  computed: {
    ...mapGetters([
      'nickname'
    ])
  },
  methods: {
    setStyle() {
      this.$el.querySelector('.el-tabs__nav').style.width = '100%'
    }
  },
  mounted() {
    this.setStyle()
    const nickname = this.nickname
    this.$el.querySelectorAll('.el-progress__text')[0].innerHTML = `
      <div class="circle-custom" style="font-size: 12px;">
            <h3 style="color:red;margin-top:0px;">￥${this.source_money}</h3>
            <p><b>供货商</b></p>
            <span>
                占收入
                <i>${this.source}%</i>
            </span>
        </div>
    `
    this.$el.querySelectorAll('.el-progress__text')[1].innerHTML = `
      <div class="circle-custom" style="font-size: 12px;">
            <h3 style="color:red;margin-top:0px;">￥${this.user_money}</h3>
            <p><b>${nickname}</b></p>
            <span>
                占总收入
                <i>${this.user}%</i>
            </span>
        </div>
    `
    this.$el.querySelectorAll('.el-progress__text')[2].innerHTML = `
      <div class="circle-custom" style="font-size: 12px;">
            <h3 style="color:red;margin-top:0px;">￥${this.sale_maoney}</h3>
            <p><b>分销商</b></p>
            <span>
                占总收入
                <i>${this.sale}%</i>
            </span>
        </div>
    `
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.main_content {
  width:100%;
  padding: 10px;
}
.box-info {
  height: 145px;
  width: 100%;
  text-align: center;
  .info{
    .money {
      display: block;
      height: 70px;
      font-size: 32px;
      margin-top: 10px;
      color: #9B9EA0;
    }
    .target{
      display: block;
    }
  }
}
.box-card {
  background-color: #F5F5F6;
  &:hover{
    background-color: #ffffff;
    border: 1px solid #409EFF;
    cursor: pointer;
  }
}
.resource-info {
  color: gray;
  ul{
    padding-left: 0px;
  }
  li{
    padding-left: 10px; 
    padding-right: 10px; 
    list-style: none;
    height: 38px;
    line-height: 38px;
    width: 100%;
    margin-bottom: 5px; 
    border: 1px solid #F5F5F6;
    background-color: #F5F5F6;
    cursor: pointer;
    &:hover{
      border: 1px solid #409EFF;
      background-color: #ffffff;
    }
  }
}
.box-title{
  font-size: 14px;
    margin-bottom: 15px;
}
.border {
  border: 1px solid red;
}
.goods_ranking {
  height: 600px;
}
.aside_class{
  // width: 1150px;
}
.main_class{
  // width: 50px;
  // margin-left: 10px;
  padding: 0px 0px 10px 20px;
  // padding: 10px;
}
.rang_info {
  // border: 1px solid black;
  height: 80px;
  .rang_info_img{
    border: 1px solid red;
    float: left;
    height: 80px;
    width: 80px;
  }
  .rang_info_content {
    float: left;
    border: 1px solid yellow;
    height: 80px;
    .rang_info_name{
      font-size: .14rem;
    }
  }

}

</style>