<template>
  <div id="rank">
    <div class="topMenu">
      <div class="menu_item" :class="{menu_check:mapType === 1}" @click="menuclick(1)"><a>空气排名</a></div>
      <div class="menu_item" :class="{menu_check:mapType === 2}" @click="menuclick(2)"><a>水质排名</a></div>
    </div>
    <div class="rankNav">
      <div class="city fl" @click="showregion()">{{checkedregion}}<i class="el-icon-caret-bottom" style="margin-left:5px;"></i></div>
       <div class="itemmenu"  v-if="regionlisthid">
        <p v-for="(item, index) in regionlist" :key="'region' + index" @click="change(item)">{{item}}</p>
      </div>
      <el-radio-group v-model="state.cityType" size="mini" class="fl" style="text-align:left;">
        <el-radio label="169" style="margin-left:.40rem;">PM2.5</el-radio>
        <el-radio label="338" style="margin-left:.48rem;">PM10</el-radio>
      </el-radio-group>
      <div class="city fr" @click="showtimeregion()">{{checkTime}}<i class="el-icon-caret-bottom"></i></div>
       <div class="itemmenu time"  v-if="timeflag">
        <p v-for="(item, index) in timelist" :key="'region' + index" @click="changeTime(item)">{{item}}</p>
      </div>
    </div>
    <div class="airSort">
      <p class="sort_t">全国31省空气质量指数排序</p>
      <p class="sort_b">2018年8月1日-8月7日累计排序</p>
    </div>
    <div class="table">
       <el-table :data="testData">
        <el-table-column  prop="rank" label="排序"  sortable></el-table-column>
        <el-table-column  label="城市">
          <template slot-scope="scope">
            {{scope.row.cityname}}
          </template>
        </el-table-column>
        <el-table-column prop="provincename" label="省份" width="60"></el-table-column>
        <el-table-column prop="aqi" label="AQI"  width="60">
          <template slot-scope="scope">
            <span :style="{'backgroundColor':returnAQIColor(scope.row.aqi)}"> {{scope.row.aqi}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="primary_pollutant" style="width:30%" label="首要污染物">
           <template slot-scope="scope">
            <p v-if="scope.row.primary_pollutant">{{scope.row.primary_pollutant}}</p>
            <p v-if="!scope.row.primary_pollutant">无</p>
          </template>
        </el-table-column>
     </el-table>
    </div>
  </div>
</template>
 <script>
import { getServerData } from "../../util/data/";
import { getFormatDate } from "../../util/timeformat";
import Config from "../../util/config";
import {
  getForFormatNowHour,
  getFormatDateAdd,
  getSmpFormatNowHour
} from "../../util/timeformat";
const time = getSmpFormatNowHour();
import "@/assets/css/index.less";
import "@/assets/css/rank.less";
export default {
  components: {},

  data() {
    return {
      state: {
        cityType: "169",
        city: "郑州",
        type: "HOUR",
        order: "ascending",
        time1: getForFormatNowHour(),
        time2: getFormatDateAdd(time, -1, "yyyy-MM-dd"),
        concernedcity:
          "西安|邯郸|邢台|乌鲁木齐|徐州|石家庄|保定|济南|兰州|太原|宿迁|沧州|常州|衡水|廊坊",
        timeflag: true
      },
      mapType: 1, //空气水质切换
      checkedregion: "省份",
      checkTime: "时",
      regionlisthid: false,
      timeflag: false,
      cityData: [], //表格数据
      sortData: [], //排序数据
      regionlist: ["省份","城市"],
      timelist:["时","日","月","年"],
      testData:[
        {rank:1,cityname:'杭州',provincename:'浙江',aqi:150},
        {rank:2,cityname:'杭州',provincename:'浙江',aqi:32,primary_pollutant:'NO'},
        {rank:3,cityname:'杭州',provincename:'浙江',aqi:60},
        {rank:4,cityname:'杭州',provincename:'浙江',aqi:100,primary_pollutant:'NO'},
      ]
    };
  },

  mounted() {
    this.fetchData();
  },
  methods: {
    // 获取城市排名数据
    fetchData() {
      console.log("date", this.end);
      const url = Config.url.dataapi.url;
      const method = Config.url.dataapi.method.getcityrank;
      const params = {};
      params.type = this.state.type;
      params.cityType = this.state.cityType;
      params.city = this.state.city;
      params.concernedcity = this.state.concernedcity;
      if (this.state.type == "HOUR") {
        this.state.timeflag = true;
        params.date = this.state.time1.slice(0, 16);
      } else if (this.state.type !== "DAY") {
        this.state.time2 = getFormatDateAdd(time, 0, "yyyy-MM-dd");
        console.log(this.time2);
        params.date = this.state.time2;
      } else {
        this.state.timeflag = false;
        params.date = this.state.time2;
      }

      console.log("params", params);
      getServerData(
        url,
        method,
        params,
        result => {
          console.log("城市排名", result);
          this.cityData = result.data;
          // this.sortData=sortDatas('complexindex','ascending',this.cityData)
        },
        1
      );
    },
    // 空气水质切换
    menuclick(index) {
      if(index==1){
       this.$router.push({ name:'rank'});
      }else{
      this.$router.push({ name:'water'});
      }
      this.mapType = index;
      this.rankType=!this.rankType;
    },
    // 城市切换
    showregion() {
      this.regionlisthid = !this.regionlisthid;
    },
    // 右侧日期选择
    showtimeregion(){
      this.timeflag=!this.timeflag;
    },
    // 城市省份选择
   change(region) {
      if(region=='城市'){
       this.$router.push({ name:'rank'});
      }else{
      this.$router.push({ name:'provinceRank'});
      }
      this.checkedregion = region;
      this.regionlisthid = false;
    },
    // 日期选择
    changeTime(val){
       this.checkTime = val;
       this.timeflag=false;
    },
    // aqi北京颜色
    returnAQIColor(aqi) {
      let color = "";
      if (aqi <= 0) {
        color = "#f0f0f0";
      } else if (aqi <= 50) {
        color = "#43ce17";
      } else if (aqi <= 100) {
        color = "#efdc31";
      } else if (aqi <= 150) {
        color = "#FFAE00";
      } else if (aqi <= 200) {
        color = "#ff401a";
      } else if (aqi <= 300) {
        color = "#d20040";
      } else {
        color = "#9c0a4e";
      }
      return color;
    },
  }
};
</script>
<style lang="less" scoped>
</style>





