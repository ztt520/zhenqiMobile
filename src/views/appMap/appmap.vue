<template>
    <div class="map" >
      <div class="topmenu">
        <div class="menu_item" @click="showregion()">{{checkedregion}}<i class="el-icon-caret-bottom"></i></div>
        <div class="menu_item" :class="{menu_checked:mapType === 1}" @click="menuclick(1)">污染地图</div>
        <div class="menu_item" :class="{menu_checked:mapType === 2}" @click="menuclick(2)">水质地图</div>
        <div class="menu_item item_menu" @click="golist()"><img src="../../assets/img/appMap/list.png" height="15px" alt="" ></div>
      </div>
      <div class="itemmenu"  v-if="regionlisthid">
        <p v-for="(item, index) in regionlist" :key="'region' + index" @click="change(item)">{{item}}</p>
      </div>
      <div class="wrwdivlist" v-if="mapType == 1">
        <div v-for="item in wrwtype" :class="{type_checked:wrtype === item}" :key="item" @click="wrtypeclick(item)">{{item}}</div>
      </div>
      <div class="controldiv">
        <div class="windandqiye">
          <div class="mao_c_add" @click="trueOnWind()"><img :src="windimg" alt="" ></div>
          <div class="mao_c_reduce" @click="trueOnqiye()"><img :src="qiyeimg" alt="" ></div>
        </div>
        <div class="map_c">
          <div class="mao_c_add" @click="setzoom('+')"><img src="../../assets/img/appMap/+.png" alt="" ></div>
          <div class="mao_c_reduce" @click="setzoom('-')"><img src="../../assets/img/appMap/-.png" alt="" ></div>
        </div>
      </div>
      <div id="allmap" ref="allmap"></div>
      <Wind :map="map" :showflag="windstatus" :time="time"></Wind>
    </div>
</template>
 <script>
import Wind from "@/views/appMap/windy/index";
import "@/assets/css/map.less";
import { getMapJson } from "@/assets/js/map";
import { getServerData } from "../../util/data/";
import { getFormatDate } from "../../util/timeformat";
import Config from "../../util/config";
import {
  returnAQIColor,
  returnStyleByPollName,
  returnColorByPollName,
  getColorByIndex,
  getWindDirectionIcon,
  getColorByWater,
  getstyleByWater,
  getUrlKey
} from "../../util/tools";
var wind_img = require("@/assets/img/appMap/fengchang.png");
var wind_checked_img = require("@/assets/img/appMap/wind_checked.png");
var qiye_img = require("@/assets/img/appMap/qiye_hui.png");
var qiye_checked_img = require("@/assets/img/appMap/qiye_lv.png");
export default {
  components: {
    Wind
  },
  data() {
    return {
      mapType: 1,
      checkedregion: "全国",
      regionlisthid: false,
      wrtype: "AQI",
      mapdata: [],
      mapwaterdata: [],
      time: getFormatDate(),
      map: "",
      level: 11,
      lat1: 0,
      lat2: 0,
      lng1: 0,
      lng2: 0,
      windimg: wind_img,
      qiyeimg: qiye_img,
      windstatus: false,
      qiyestatus: false,
      regionlist: [
        "全国",
        "京津冀",
        "长三角",
        "珠三角",
        "中原地区",
        "西部地区",
        "东北地区"
      ],
      wrwtype: [
        "AQI",
        "PM2.5",
        "PM10",
        "SO2",
        "NO2",
        "CO",
        "O3",
        "综指",
        "温度",
        "湿度",
        "风力",
        "风向"
      ]
    };
  },
  mounted() {
    console.info(getFormatDate());
    this.initialMap("杭州");
  },
  methods: {
    trueOnWind() {
      var status = this.windstatus;
      if (status == true) {
        this.windstatus = false;
        this.windimg = wind_img;
      } else {
        this.windstatus = true;
        this.windimg = wind_checked_img;
      }
    },
    trueOnqiye() {
      var status = this.qiyestatus;
      if (status == true) {
        this.qiyestatus = false;
        this.qiyeimg = qiye_img;
      } else {
        this.qiyestatus = true;
        this.qiyeimg = qiye_checked_img;
      }
    },
    setzoom(type) {
      var zoom = this.map.getZoom();
      if (type == "+") {
        zoom = zoom + 1;
        this.map.setZoom(zoom);
      } else {
        zoom = zoom - 1;
        this.map.setZoom(zoom);
      }
    },
    // 获取还是数据
    fetchData() {
      const url = Config.url.dataapi.url;
      const method = Config.url.dataapi.method.getmap;
      const params = {};
      params.level = this.level;
      params.latitude1 = this.lat1;
      params.latitude2 = this.lat2;
      params.longitude1 = this.lng1;
      params.longitude2 = this.lng2;

      getServerData(
        url,
        method,
        params,
        result => {
          // console.log("返回获取车辆数据", result);
          this.mapdata = result.data;
          this.createMap();
        },
        0.5
      );
    },
    // 获取还是数据
    fetchWaterData() {
      const url = Config.url.dataapi.url;
      const method = Config.url.dataapi.method.getappwatermap;
      const params = {};
      params.latitude1 = this.lat1;
      params.latitude2 = this.lat2;
      params.longitude1 = this.lng1;
      params.longitude2 = this.lng2;

      getServerData(
        url,
        method,
        params,
        result => {
          // console.log("返回获水数据", result.data);
          this.mapwaterdata = result.data;
          this.createWaterMap();
        },
        0.5
      );
    },
    // 初始化地图
    initialMap(city) {
      // 创建Map实例
      var map = new BMap.Map("allmap", {
        enableMapClick: true,
        minZoom: 5,
        maxZoom: 15
      });

      this.map = map;
      var That = this;
      map.addEventListener("zoomend", function() {
        That.level = map.getZoom();
        That.resetmap();
        if (That.mapType == 1) {
          That.fetchData();
        }

        // console.info(map.getZoom());
      });
      map.addEventListener("dragend", function() {
        That.resetmap();
        if (That.mapType == 1) {
          That.fetchData();
        }
      });
      map.enableScrollWheelZoom();

      map.centerAndZoom(city, That.level);
      // map.enableScrollWheelZoom(true);
      map.addControl(new BMap.NavigationControl());
      map.setMapStyle({
        styleJson: getMapJson()
      });
      That.fetchData();
    },
    resetmap() {
      var bs = this.map.getBounds(); //获取可视区域
      // console.info(bs);
      var bssw = bs.getSouthWest(); //可视区域左下角
      var bsne = bs.getNorthEast(); //可视区域右上角
      this.lat1 = bssw.lat;
      this.lat2 = bsne.lat;
      this.lng1 = bssw.lng;
      this.lng2 = bsne.lng;
    },
    menuclick(index) {
      this.mapType = index;
      if (index == 2) {
        this.fetchWaterData();
        window.webkit.messageHandlers.waterMap.postMessage("mapType=1");
      } else {
        this.fetchData();
        window.webkit.messageHandlers.pollutionMap.postMessage("mapType=0");
      }
    },
    wrtypeclick(item) {
      this.wrtype = item;
      this.createMap();
    },
    golist() {
      window.webkit.messageHandlers.jumpList.postMessage(
        "lat1=" +
          lat1 +
          ",lat2=" +
          lat2 +
          ",lon1=" +
          lng1 +
          ",lon2=" +
          lng2 +
          ""
      );
    },
    showregion() {
      this.regionlisthid = !this.regionlisthid;
    },
    change(region) {
      switch (region) {
        case "全国":
          this.map.centerAndZoom("中国", 4);
          break;
        case "京津冀":
          this.map.centerAndZoom("廊坊", 8);
          break;
        case "长三角":
          this.map.centerAndZoom("湖州", 8);
          break;
        case "珠三角":
          this.map.centerAndZoom("广州", 8);
          break;
        case "中原地区":
          this.map.centerAndZoom("武汉", 7);
          break;
        case "西部地区":
          this.map.centerAndZoom("成都", 7);
          break;
        case "东北地区":
          this.map.centerAndZoom("长春", 7);
          break;
      }
      this.checkedregion = region;
      this.regionlisthid = false;
    },
    createMap() {
      this.map.clearOverlays();
      this.mapdata.forEach(item => {
        // console.info(item);
        var city = item.cityname;
        var aqi = parseInt(item.aqi);
        var pm2_5 = parseInt(item.pm2_5);
        var pm10 = parseInt(item.pm10);
        var so2 = parseInt(item.so2);
        var no2 = parseInt(item.no2);
        var co = parseFloat(item.co).toFixed(1);
        var o3 = parseInt(item.o3);
        var complexindex = parseFloat(item.complexindex).toFixed(2);
        var humi = item.humi;
        var temp = item.temp;
        var wind = item.winddirection;
        var ws = item.windspeed;
        var wl = item.windlevel;
        var time = item.time;
        var visi = item.visibility;

        var nametip = this.map.getZoom() < 9 ? item.cityname : item.pointname;
        var name = this.map.getZoom() < 9 ? city : city + "·" + item.pointname;
        var offseth = 12;
        var now_value = "";
        var getcolortype = "aqi";
        switch (this.wrtype) {
          case "AQI":
            now_value = aqi;
            getcolortype = "aqi";
            break;
          case "PM2.5":
            now_value = pm2_5;
            getcolortype = "pm2_5";
            break;
          case "PM10":
            now_value = pm10;
            getcolortype = "pm10";
            break;
          case "SO2":
            now_value = so2;
            getcolortype = "so2";
            break;
          case "NO2":
            now_value = no2;
            getcolortype = "no2";
            break;
          case "CO":
            now_value = co;
            getcolortype = "co";
            break;
          case "O3":
            now_value = o3;
            getcolortype = "o3";
            break;
          case "综指":
            now_value = complexindex;
            getcolortype = "complexindex";
            break;
          case "温度":
            now_value = temp;
            getcolortype = "temp";
            break;
          case "湿度":
            now_value = humi;
            getcolortype = "humi";
            break;
          case "风力":
            now_value = wl;
            getcolortype = "wl";
            break;
          default:
            break;
        }

        var bgcolor = returnColorByPollName(now_value, getcolortype);
        let point = new BMap.Point(item.longitude, item.latitude);
        var opts = {
          position: point, // 指定文本标注所在的地理位置
          offset: new BMap.Size(-16, -16) //设置文本偏移量
        };
        // console.info(nametip);
        var len = nametip.length;
        var opts_tip = {
          position: point, // 指定文本标注所在的地理位置
          offset: new BMap.Size(-len * 6 - 1, offseth) //设置文本偏移量
        };
        var label_tip = new BMap.Label(nametip, opts_tip); // 创建文本标注对象
        label_tip.setStyle({
          color: "black",
          background: "rgba(255,255,255,0.9)",
          fontSize: "12px",
          border: "1px solid " + bgcolor,
          width: "auto",
          padding: "2px 4px",
          textAlign: "center",
          // boxShadow: "0 0 8px " + bgcolor,
          borderRadius: "4px",
          height: "18px",
          lineHeight: "18px"
        });
        if (
          this.wrtype == "风向" &&
          (wind != null && wind != undefined && wind != "")
        ) {
          // console.info(wind);
          var icon = getWindDirectionIcon(wind);
          var myIcon = new BMap.Icon(icon, new BMap.Size(23, 32));
          var littlelabel = new BMap.Marker(point, { icon: myIcon });
        } else {
          var littlelabel = new BMap.Label(
            now_value +
              '<div class="arrow" style="width: 0px;  height: 0px; border-left: 8px solid transparent; border-top: 8px solid; border-right: 8px solid transparent; color:' +
              bgcolor +
              '; position: absolute;  margin-top:-2px;margin-left:10px  " ></div>',
            opts
          ); // 创建文本标注对象, opts); // 创建文本标注对象
          littlelabel.setStyle({
            color: "white",
            background: bgcolor,
            fontSize: "12px",
            borderRadius: "5px",
            border: 0,
            boxShadow: "0 0 8px " + bgcolor,
            width: "40px",
            textAlign: "center",
            height: "20px",
            lineHeight: "20px",
            fontFamily: "微软雅黑"
          });
        }

        this.map.addOverlay(littlelabel);
        this.map.addOverlay(label_tip);

        let content = this.getContent(
          name,
          aqi,
          pm2_5,
          pm10,
          so2,
          no2,
          co,
          o3,
          complexindex,
          humi,
          temp,
          ws,
          wl,
          wind,
          time,
          visi
        );
        this.addClickHander(content, littlelabel, city, "200px");
      });
    },
    // 为可点击的覆盖物添加监听事件
    addClickHander(content, label, city, height) {
      let that = this;
      label.addEventListener("click", function(e) {
        that.openWindow(content, e, city, height);
      });
    },
    // 信息弹窗
    openWindow(content, e, city, height) {
      let lng = e.target.point.lng;
      let lat = e.target.point.lat;
      let nowpoint = new BMap.Point(lng, lat);

      var searchInfoWindow = new BMapLib.SearchInfoWindow(this.map, content, {
        title: "",
        width: "320px",
        height: height,
        backgroundColor: "white",
        enableAutoPan: true,
        enableSendToPhone: false,
        enableCloseOnClick: true,
        searchTypes: []
      });

      searchInfoWindow.open(nowpoint);
    },
    createWaterMap() {
      this.map.clearOverlays();
      this.mapwaterdata.forEach(item => {
        var name = item.section_name;
        var ph = item.ph;
        var time = item.time;
        var andan = item.ammonia_nitrogen;
        var gaomensuanyan = item.permanganate;
        var rongjieyang = item.dissolved_oxygen;
        var status = item.site_situation;
        var level = item.quality_index;
        var bgcolor = getColorByWater(level);
        var city = item.cityname;

        let point = new BMap.Point(item.lng, item.lat);
        // console.info(point);
        var opts = {
          position: point, // 指定文本标注所在的地理位置
          offset: new BMap.Size(-16, -16) //设置文本偏移量
        };
        var littlelabel = new BMap.Label(level, opts); // 创建文本标注对象, opts); // 创建文本标注对象
        littlelabel.setStyle({
          color: "white",
          background: bgcolor,
          fontSize: "12px",
          borderRadius: "5px",
          border: 0,
          boxShadow: "0 0 8px " + bgcolor,
          width: "40px",
          textAlign: "center",
          height: "20px",
          lineHeight: "20px",
          fontFamily: "微软雅黑"
        });
        this.map.addOverlay(littlelabel);
        let content = this.getWaterContent(
          name,
          level,
          status,
          time,
          andan,
          gaomensuanyan,
          rongjieyang,
          ph
        );
        this.addClickHander(content, littlelabel, city, "130px");
      });
    },
    //水弹窗信息
    getWaterContent(
      name,
      level,
      status,
      time,
      andan,
      gaomensuanyan,
      rongjieyang,
      ph
    ) {
      var statuslevel = status == "正常" ? "I2" : "--";
      var content = `<div class="maptip"}>
           <div class="maptip_div">
            <div class="tip_item tip_cityname">
            <p>${name}</p>
            <label style="color:#b9b9b9">${time}</label>
            </div>
            <div class="tip_item tip_aqi">
            <p style="${getstyleByWater(statuslevel)}">状态</p>
            <label>${status}</label>
            </div>
            <div class="tip_item tip_index">
            <p style="${getstyleByWater(level)}">级别</p>
            <label>${level}</label>
            </div>
           </div>
           <div class="maptip_div" style="margin-top:10px">
            <div class="tip_four">
            <p  style="${getstyleByWater(statuslevel)}">高锰酸盐</p>
            <label>${gaomensuanyan}</label>
            </div>
            <div class="tip_four">
            <p  style="${getstyleByWater(statuslevel)}">溶解氧</p>
            <label>${rongjieyang}</label>
            </div>
            <div class="tip_four">
            <p style="${getstyleByWater(statuslevel)}">氨氮</p>
            <label>${andan}</label>
            </div>
            <div class="tip_four">
            <p style="${getstyleByWater(statuslevel)}">PH</p>
            <label>${ph}</label>
            </div>
            
           </div>
          </div>`;
      return content;
    },
    // 弹窗content
    getContent(
      name,
      aqi,
      pm2_5,
      pm10,
      so2,
      no2,
      co,
      o3,
      complexindex,
      humi,
      temp,
      ws,
      wl,
      wind,
      time,
      visi
    ) {
      var img_temp = require("@/assets/img/appMap/temp.png");
      var img_humi = require("@/assets/img/appMap/humi.png");
      var img_qiya = require("@/assets/img/appMap/qiya.png");
      var img_wind = require("@/assets/img/appMap/wind.png");
      var img_ws = require("@/assets/img/appMap/windspeed.png");
      var img_visi = require("@/assets/img/appMap/visibility.png");
      var content = `<div class="maptip"}>
           <div class="maptip_div">
            <div class="tip_item tip_cityname">
            <p>${name}</p>
            <label style="color:#b9b9b9">${time}</label>
            </div>
            <div class="tip_item tip_aqi">
            <p style="background-color:${returnAQIColor(aqi)}">AQI</p>
            <label>${aqi}</label>
            </div>
            <div class="tip_item tip_index">
            <p style="${returnStyleByPollName(
              complexindex,
              "complexindex"
            )}">综合指数</p>
            <label>${complexindex}</label>
            </div>
           </div>
           <div class="maptip_div" style="margin-top:10px">
            <div class="tip_six">
            <p style="${returnStyleByPollName(pm2_5, "pm2_5")}">PM2.5</p>
            <label>${pm2_5}</label>
            </div>
            <div class="tip_six">
            <p style="${returnStyleByPollName(pm10, "pm10")}">PM10</p>
            <label>${pm10}</label>
            </div>
            <div class="tip_six">
            <p style="${returnStyleByPollName(so2, "so2")}">SO2</p>
            <label>${so2}</label>
            </div>
            <div class="tip_six">
            <p style="${returnStyleByPollName(no2, "no2")}">NO2</p>
            <label>${no2}</label>
            </div>
            <div class="tip_six">
            <p style="${returnStyleByPollName(co, "co")}">CO</p>
            <label>${co}</label>
            </div>
            <div class="tip_six">
            <p style="${returnStyleByPollName(o3, "o3")}">O3</p>
            <label>${o3}</label>
            </div>
           </div>
           <div class="maptip_div">
           <div class="tip_weather">
            <img src="${img_temp}"  alt="" >
            <p>${temp}℃</p>
            </div>
            <div class="tip_weather">
            <img src="${img_humi}"  alt="" >
            <p>${humi}%</p>
            </div>
            <div class="tip_weather">
            <img src="${img_qiya}"  alt="" >
            <p>${temp}Pa</p>
            </div>
            <div class="tip_weather">
            <img src="${img_wind}"  alt="" >
            <p>${wind}</p>
            </div>
            <div class="tip_weather">
            <img src="${img_ws}" alt="" >
            <p>${wl}级</p>
            </div>
            <div class="tip_weather">
            <img src="${img_visi}" alt="" >
            <p>${visi == null || visi == undefined ? "∞" : visi}Km</p>
            </div>
           </div>
          </div>`;
      return content;
    }
  }
};
</script>




