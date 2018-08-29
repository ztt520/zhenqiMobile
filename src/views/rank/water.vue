<template>
  <div id="rank">
    <div class="topMenu">
      <div class="menu_item" :class="{menu_check:mapType === 1}" @click="menuclick(1)"><a>空气排名</a></div>
      <div class="menu_item" :class="{menu_check:mapType === 2}" @click="menuclick(2)"><a>水质排名</a></div>
    </div>
    <div class="waterNav">
        <el-radio-group v-model="state.waterType" size="mini" class="fl">
            <el-radio label="waterIndex">水质指数</el-radio>
            <el-radio label="andan">氨氮</el-radio>
            <el-radio label="rongjie">溶解盐</el-radio>
            <el-radio label="PH">PH</el-radio>
            <el-radio label="meng">高锰酸盐</el-radio>
        </el-radio-group>
    </div>
    <div class="table1">
       <el-table :data="waterData">
        <el-table-column label="排序" prop="index" width="80" sortable></el-table-column>
        <el-table-column  label="监测点" prop="jiance" width="185"></el-table-column>
        <el-table-column prop="water" label="水质" width="110"></el-table-column>
        <!-- <template slot-scope="scope">
            {{scope.row.cityname}}
          </template> -->
     </el-table>
    </div>
  </div>
</template>
 <script>
import { getServerData } from "../../util/data/";
import { getFormatDate } from "../../util/timeformat";
import Config from "../../util/config";
import { getForFormatNowHour, getFormatDateAdd,getSmpFormatNowHour } from "../../util/timeformat";
const time = getSmpFormatNowHour();
import "@/assets/css/index.less";
import "@/assets/css/rank.less";
export default {
  components: {},

  data() {
    return {
      state: {
        waterType: "waterIndex",
        city: "郑州",
        type: "HOUR",
        order: "ascending",
        time1: getForFormatNowHour(),
        time2: getFormatDateAdd(time, -1, "yyyy-MM-dd"),
        concernedcity:"西安|邯郸|邢台|乌鲁木齐|徐州|石家庄|保定|济南|兰州|太原|宿迁|沧州|常州|衡水|廊坊",
        timeflag: true,
      },
      mapType: 2, //空气水质切换
      regionlisthid: false,
      waterData: [
        {
          index:1,
          jiance:"浙江嘉兴斜路港",
          water:"V"
        },
        {
          index:2,
          jiance:"浙江杭州鸠坑口",
          water:"V"
        },
        {
          index:3,
          jiance:"浙江湖州新塘港",
          water:"IV"
        },
        {
          index:4,
          jiance:"浙江嘉兴王江泾",
          water:"IV"
        },
        {
          index:5,
          jiance:"浙江嘉兴斜路港",
          water:"V"
        },
        {
          index:6,
          jiance:"浙江杭州鸠坑口",
          water:"V"
        },
        {
          index:7,
          jiance:"浙江湖州新塘港",
          water:"IV"
        },
        {
          index:8,
          jiance:"浙江嘉兴王江泾",
          water:"IV"
        },{
          index:9,
          jiance:"浙江嘉兴斜路港",
          water:"V"
        },
        {
          index:10,
          jiance:"浙江杭州鸠坑口",
          water:"V"
        },
        {
          index:11,
          jiance:"浙江湖州新塘港",
          water:"IV"
        },
        {
          index:12,
          jiance:"浙江嘉兴王江泾",
          water:"IV"
        },
      ], //表格数据
      sortData: [],//排序数据
    };
  },

  mounted() {
    this.fetchData();
  },
  methods: {
        // 获取城市排名数据
    fetchData() {
      console.log('date',this.end)
      const url = Config.url.dataapi.url;
      const method = Config.url.dataapi.method.getcityrank;
      const params = {};
      params.type = this.state.type;
      params.cityType = this.state.cityType;
      params.city = this.state.city;
      params.concernedcity = this.state.concernedcity;
      if(this.state.type=='HOUR'){
        this.state.timeflag=true;
        params.date = this.state.time1.slice(0,16);
      } else if(this.state.type!=='DAY'){
        this.state.time2=getFormatDateAdd(time, 0, "yyyy-MM-dd");
        console.log(this.time2)
         params.date = this.state.time2;
      }else{
        this.state.timeflag=false;
        params.date = this.state.time2;
      }
     
    console.log('params',params)
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
      this.mapType = index;
      if(index==1){
       this.$router.push({ name:'rank'});
      }else{
      this.$router.push({ name:'water'});
      }
    },
    // 城市切换
    showregion() {
      this.regionlisthid = !this.regionlisthid;
    },
     //切换表格排序
    changeSort(column, prop, order) {
      // this.sortData=sortDatas(column.prop,column.order,this.cityData);
    }
  }
};
</script>
<style lang="less" scoped>

</style>





