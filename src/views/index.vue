<template>
  <div id="index">
    <div class="cityname">
      <div>杭州<i class="el-icon-plus" /></div>
    </div>
    <div class="banner">
      <div class="temperature">25<span v-bind:style="{fontSize: '0.12rem'}">℃</span></div>
      <div class="weather"><i class="drawing"/><span class="text" v-bind:style="{fontSize: '0.12rem'}" >&nbsp;&nbsp;晴</span></div>
      <div class="synthesize"><span class="wind"><img src="../assets/img/index/wind.png" alt="" />&nbsp;西南风</span><span class="hum" v-bind:style="{marginLeft:'0.1rem'}"><img src="../assets/img/index/humidity.png" alt="" />&nbsp;86%</span><span class="level" v-bind:style="{marginLeft:'0.1rem'}"><img src="../assets/img/index/weather.png" alt="" />&nbsp;中等</span></div>
      <div class="tip">
      <ul>
        <li>穿衣<span>暖</span></li>
        <li>感冒<span>过敏</span></li>
        <li>洗车<span>不宜</span></li>
        <li>雨伞<span>带伞</span></li>
        <li>过敏<span>不易</span></li>
        <li>口罩<span>无需</span></li>
      </ul>
    </div>
    </div>
    <div class="AQI">
      <img src="../assets/img/index/aqiimg.png" alt="" >
      <div class="left">
        <div class="top">55</div>
        <div class="bot">空气质量指数</div>
      </div>
      <div class="right">
        <div class="top">优</div>
        <div class="bot">空气质量等级</div>
      </div>
      <div v-bind:style="{clear: 'both'}"></div>
      <div class="wire"></div>
      <div class="details" v-if="aqiflag">
        <div class="details-left">
          <div class="left-top">
            <div class="rank">121</div>
            <div class="day">日排名</div>
          </div>
          <div class="left-bot">
            <div class="rank">121</div>
            <div class="day">月排名</div>
          </div>
        </div>
        <div class="details-right">
          <div class="schedule-left">
            <div class="six">PM2.5</div>
            <div class="val">25</div>
            <div v-bind:style="{clear: 'both'}"></div>
            <el-progress :show-text="false" :stroke-width="7" :percentage="10"></el-progress>
          </div>
          <div class="schedule-right">
            <div class="six">PM10</div>
            <div class="val">25</div>
            <div v-bind:style="{clear: 'both'}"></div>
            <el-progress :show-text="false" :stroke-width="7" :percentage="10"></el-progress>
          </div>
          <div class="schedule-left">
            <div class="six">SO2</div>
            <div class="val">25</div>
            <div v-bind:style="{clear: 'both'}"></div>
            <el-progress :show-text="false" :stroke-width="7" :percentage="10"></el-progress>
          </div>
          <div class="schedule-right">
            <div class="six">NO2</div>
            <div class="val">25</div>
            <div v-bind:style="{clear: 'both'}"></div>
            <el-progress :show-text="false" :stroke-width="7" :percentage="10"></el-progress>
          </div>
          <div class="schedule-left">
            <div class="six">CO</div>
            <div class="val">25</div>
            <div v-bind:style="{clear: 'both'}"></div>
            <el-progress :show-text="false" :stroke-width="7" :percentage="10"></el-progress>
          </div>
          <div class="schedule-right">
            <div class="six">O3</div>
            <div class="val">25</div>
            <div v-bind:style="{clear: 'both'}"></div>
            <el-progress :show-text="false" :stroke-width="7" :percentage="10"></el-progress>
          </div>
        </div>
      </div>
      <div :class="'btn ' + icon" @click="aqishow()" />
    </div>
    <div class="water">
      <div class="site" ><img src="../assets/img/index/place.png" alt="" />&nbsp;浙江杭州鸠坑口</div>
      <div v-bind:style="{clear: 'both'}"></div>
      <img src="../assets/img/index/waterimg.png" alt="" >
      <div class="left">
        <div class="top">类</div>
        <div class="bot">水质量等级</div>
      </div>
      <div class="right">
        <div class="top">正常</div>
        <div class="bot">站点情况</div>
      </div>
      <div v-bind:style="{clear: 'both'}"></div>
      <div class="wire"></div>
      <div class="details" v-if="waterflag">
        <div class="details-left">
          <div class="left-top">
            <div class="rank">地表水</div>
            <div class="day">类型</div>
          </div>
        </div>
        <div class="details-right">
          <div class="schedule-left">
            <div class="six">PH</div>
            <div class="val">25</div>
            <div v-bind:style="{clear: 'both'}"></div>
            <el-progress :show-text="false" :stroke-width="7" :percentage="10"></el-progress>
          </div>
          <div class="schedule-right">
            <div class="six">溶解氧</div>
            <div class="val">25</div>
            <div v-bind:style="{clear: 'both'}"></div>
            <el-progress :show-text="false" :stroke-width="7" :percentage="10"></el-progress>
          </div>
          <div class="schedule-left">
            <div class="six">氢氮</div>
            <div class="val">25</div>
            <div v-bind:style="{clear: 'both'}"></div>
            <el-progress :show-text="false" :stroke-width="7" :percentage="10"></el-progress>
          </div>
          <div class="schedule-right">
            <div class="six">高锰酸钾</div>
            <div class="val">25</div>
            <div v-bind:style="{clear: 'both'}"></div>
            <el-progress :show-text="false" :stroke-width="7" :percentage="10"></el-progress>
          </div>
        </div>
      </div>
     <div :class="'btn ' + watericon" @click="watershow()" />
    </div>
    <div class="enterprise">
      <div class="left">
        <div class="top">类</div>
        <div class="bot">空气质量监测点</div>
      </div>
      <div class="left">
        <div class="top">类</div>
        <div class="bot">水质量监测点</div>
      </div>
      <div class="left">
        <div class="top">正常</div>
        <div class="bot">企业</div>
      </div>
    </div>
    <div class="table">
      <div class="title"><div v-bind:style="{float: 'left'}" >城市站点列表</div><div v-bind:style="{float: 'right'}">详情>></div></div>
      <div v-bind:style="{clear: 'both'}"></div>
      <div>
        <el-table :data="tableData" border  height="255">
          <el-table-column prop="site" label="站点"></el-table-column>
          <el-table-column prop="region" label="区域"></el-table-column>
          <el-table-column prop="aqi" label="AQI"></el-table-column>
          <el-table-column prop="level" label="等级"></el-table-column>
          <el-table-column prop="chiefly" label="首要污染物"></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="forecast">
      <div class="title"><i class="chunk" />24小时预报</div>
      <div class="wire"></div>
      <div id="myChart" :style="{width: '100%', height: '200px'}"></div>
    </div>
  </div>
</template>
 <script>
import { getServerData } from "../util/data/";
import { getFormatDate } from "../util/timeformat";
import Config from "../util/config";
import echarts from "echarts";
import "@/assets/css/index.less";
import "@/assets/css/override.less";
import {
  returnAQIColor,
  returnStyleByPollName,
  returnColorByPollName,
  getColorByIndex,
  getWindDirectionIcon,
  getColorByWater,
  getstyleByWater,
  getUrlKey
} from "../util/tools";
var home_img = require("@/assets/img/index/home.png");
var home_img_on = require("@/assets/img/index/home_on.png");
var rank_img = require("@/assets/img/index/rank.png");
var rank_img_on = require("@/assets/img/index/rank_on.png");
var map_img = require("@/assets/img/index/map.png");
var map_img_on = require("@/assets/img/index/map_on.png");
var char_img = require("@/assets/img/index/q.png");
export default {
  components: {},

  data() {
    return {
      aqiflag: false,
      waterflag: false,
      currentTab: "home",
      homeimg: home_img_on,
      rankimg: rank_img,
      mapimg: map_img,
      icon: "el-icon-arrow-down",
      watericon: "el-icon-arrow-down",
      tableData: [
        {
          site: "城厢镇",
          region: "萧山区",
          aqi: "102",
          level: "中等",
          chiefly: "O3"
        },
        {
          site: "城厢镇",
          region: "萧山区",
          aqi: "102",
          level: "中等",
          chiefly: "O3"
        },
        {
          site: "城厢镇",
          region: "萧山区",
          aqi: "102",
          level: "中等",
          chiefly: "O3"
        },
        {
          site: "城厢镇",
          region: "萧山区",
          aqi: "102",
          level: "中等",
          chiefly: "O3"
        },
        {
          site: "城厢镇",
          region: "萧山区",
          aqi: "102",
          level: "中等",
          chiefly: "O3"
        },
        {
          site: "城厢镇",
          region: "萧山区",
          aqi: "102",
          level: "中等",
          chiefly: "O3"
        },
        {
          site: "城厢镇",
          region: "萧山区",
          aqi: "102",
          level: "中等",
          chiefly: "O3"
        },
        {
          site: "城厢镇",
          region: "萧山区",
          aqi: "102",
          level: "中等",
          chiefly: "O3"
        },
        {
          site: "城厢镇",
          region: "萧山区",
          aqi: "102",
          level: "中等",
          chiefly: "O3"
        }
      ]
    };
  },

  mounted() {
    this.drawLine();
  },
  methods: {
    aqishow() {
      if (this.aqiflag) {
        this.aqiflag = false;
        this.icon = "el-icon-arrow-down";
      } else {
        this.aqiflag = true;
        this.icon = "el-icon-arrow-up";
      }
    },
    watershow() {
      if (this.waterflag) {
        this.waterflag = false;
        this.watericon = "el-icon-arrow-down";
      } else {
        this.waterflag = true;
        this.watericon = "el-icon-arrow-up";
      }
    },
    renderWeather(param, api) {
      var dims = {
        time: 0,
        windSpeed: 1,
        R: 2,
        waveHeight: 3,
        weatherIcon: 2,
        minTemp: 3,
        maxTemp: 2
      };
      var arrowSize = 18;
      var weatherIconSize = 35;
      var point = api.coord([api.value(dims.time) + +3600 * 24 * 1000 / 2, 0]);
      // console.log(api.value(dims.time));
      console.log(api.value(dims.time) + +3600 * 24 * 1000 / 2);
      return {
        type: "group",
        children: [
          {
            type: "image",
            style: {
              image: api.value(dims.weatherIcon),
              x: weatherIconSize * 3.5,
              y: weatherIconSize * 3.5,
              width: weatherIconSize,
              height: weatherIconSize
            },
            position: [point[0], 110]
          },
          {
            type: "text",
            style: {
              text:
                api.value(dims.minTemp) + " - " + api.value(dims.maxTemp) + "°",
              textFont: api.font({ fontSize: 14 }),
              textAlign: "center",
              textVerticalAlign: "bottom"
            },
            position: [point[0], 80]
          }
        ]
      };
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例

      let myChart = echarts.init(document.getElementById("myChart"));
      var data = [
        [new Date("2017/06/28").getTime(), 0, char_img, 4, 13],
        [new Date("2017/06/29").getTime(), 0, char_img, 4, 13],
        [new Date("2017/06/30").getTime(), 0, char_img, 4, 13],
        [new Date("2017/07/01").getTime(), 0, char_img, 4, 13],
        [new Date("2017/07/02").getTime(), 0, char_img, 4, 13],
        [new Date("2017/07/03").getTime(), 0, char_img, 4, 13],
        [new Date("2017/08/04").getTime(), 0, char_img, 4, 13],
      ];
      console.log(data);
      // 绘制图表
      myChart.setOption({
        title: {
          show: false
        },
        grid: {
          top: "20%",
          bottom: "15%",
          left: "1%",
          right: "1%"
        },
        xAxis: {
          type: "category",
          axisTick: {
            show: false
          },
          axisLabel: {
            color: "#696E75"
          },
          axisLine: {
            lineStyle: {
              color: "#F2F7F7",
              width: 4
            }
          },
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        },
        yAxis: {
          show: false
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line",
            smooth: true,
            itemStyle: {
              normal: {
                color: "#00CA70",
                lineStyle: {
                  color: "#00CA70"
                }
              }
            }
          },
          {
            type: "custom",
            renderItem: this.renderWeather,
            data: data,
            tooltip: {}
          }
        ]
      });
    }
  }
};
</script>




