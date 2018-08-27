<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <router-view/>
    <div class="foot">
      <div class="home" @click="homeclick(1)">
        <router-link :to="{name:'index'}" tag="div">   
          <img :src="homeimg" alt=""/>
          <div>首页</div>
        </router-link>
      </div>
      <div class="home" @click="homeclick(2)">
        <router-link :to="{name:'rank'}" tag="div">
          <img :src="rankimg" alt=""/>
          <div>排名</div>
        </router-link>
      </div>
      <div class="home" @click="homeclick(3)">
        <router-link :to="{name:'appMap'}" tag="div">
          <img :src="mapimg" alt=""/>
          <div>地图</div>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
import "@/assets/css/app.less";
var home_img = require("@/assets/img/index/home.png");
var home_img_on = require("@/assets/img/index/home_on.png");
var rank_img = require("@/assets/img/index/rank.png");
var rank_img_on = require("@/assets/img/index/rank_on.png");
var map_img = require("@/assets/img/index/map.png");
var map_img_on = require("@/assets/img/index/map_on.png");
export default {
  name: "App",
  components: {},
  data() {
    return {
      homeimg: home_img_on,
      rankimg: rank_img,
      mapimg: map_img
    };
  },

  mounted() {},
  methods: {
    homeclick(e) {
      if (e == 1) {
        this.homeimg = home_img_on;
        this.rankimg = rank_img;
        this.mapimg = map_img;
      } else if (e == 2) {
        this.homeimg = home_img;
        this.rankimg = rank_img_on;
        this.mapimg = map_img;
      } else {
        this.homeimg = home_img;
        this.rankimg = rank_img;
        this.mapimg = map_img_on;
      }
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
</style>
