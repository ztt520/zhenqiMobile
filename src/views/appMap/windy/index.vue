<template>
    <div class="windtip" />
</template>
<script>
const BMap = window.BMap;
import * as d3 from 'd3';
import Windy from '../wind/windy';
import { getGzipData } from '@/util/data';
export default {
    
    props : ["map","showflag","time"],
    data(){
      
      return{
        _windy: '',
        _canvas: '',
        _overlay:'',
      }
    },
    watch: {
        showflag(newValue, oldValue) {
            if (newValue) {
              this.startWind();
            } else {
              this.stopWind();
            }
        }

    },
    mounted() {
        setTimeout(() => this.init(), 100);
        setTimeout(() => this.startWind(), 5);
    },
    methods:{
      init() {
        var map = this.map;
        if (this._overlay === undefined) {
          this._overlay = d3.select('.BMap_mask').append('canvas')
            .attr('width', map.width)
            .attr('height', map.height)
            .attr('style', 'position: absolute; left: 0px; z-index: 0;');
        }

        if (this._canvas === undefined) {
          this._canvas = d3.select('.BMap_mask').append('canvas')
            .attr('width', map.width)
            .attr('height', map.height)
            .attr('style', 'position: absolute; left: 0px; z-index: 1;');
        }

        this._windy = new Windy({ canvas: this._canvas.node(), overlay: this._overlay.node(), map });

        map.addEventListener('zoomstart', () => {
          this.stopWind();
          this.clearOverlay();
        });
        map.addEventListener('zoomend', () => {
          // this.stopWind();
          this.updateWind();
        });
        map.addEventListener('dragstart', () => {
          this.stopWind();
          this.clearOverlay();
        });
        map.addEventListener('dragend', () => {
          // this.stopWind();
          this.updateWind();
        });
        map.addEventListener('mousemove', e => {
          // console.log(e.point.lat, e.point.lng);
          if (this._windy && (this.showflag || this.props.bgtypeobj.mode === 2)) {
            let tip = '';
            const wind = this._windy.getWindByLatlng(e.point.lat, e.point.lng);
            if (wind && wind.ws) {
              tip += `${wind.wd} ${parseInt(wind.ws, 10)}km/h (${wind.wl}级)<br />`;
            }
            if (this.props.bgtypeobj.mode === 2 && this.props.bgtypeobj.item !== 'wind') {
              const obj = this._windy.getOverlayByLatlng(e.point.lat, e.point.lng);
              if (obj) {
                tip += `${obj.name}: ${obj.val}${obj.unit}`;
              }
            }
            // const x = e.pixel.x + 110 > map.width ? -200 : e.pixel.x + 6;
            // const y = e.pixel.y + 55 > map.height ? -200 : e.pixel.y + 12;
            // this.windtip.style.left = x + 'px';
            // this.windtip.style.top = y + 'px';
            // this.windtip.innerHTML = tip;
          }
        });

        this.init = true;
      },

      startWind() {
        var map = this.map;
        getGzipData(this.time, 'wind', map.getZoom(), data => {
          this._windy.setData(data);
          this.windData = data;
          setTimeout(() => this.updateWind(), 20);
          data = {};
        });
      },

      stopWind() {
        if (this._windy) {
          this._windy.stop();
          const ctx = this._canvas.node().getContext('2d');
          var map = this.map;
          ctx.clearRect(0, 0, map.width, map.height);
          this.clearWindTip();
        }
      },

      clearOverlay() {
        const ctx = this._overlay.node().getContext('2d');
        var map = this.map;
        ctx.clearRect(0, 0, map.width, map.height);
        this.clearWindTip();
      },

      clearWindTip() {
        // this.windtip.style.left = '-200px';
        // this.windtip.style.top = '-200px';
      },

      updateWind() {
        // this.stopWind();
        console.log('update wind');
        if (this.showflag) {
          setTimeout(() => {
            if (this._windy) {
            var map = this.map;
              const width = map.width;
              const height = map.height;
              this._windy.start([[0, 0], [width, height]], width, height);
            }
          }, 20);
        } else {
          this.stopWind();
        }
      },

      showOverlay(typeobj) {
        var map = this.map;
        if (typeobj.mode === 2) {
          // 显示覆盖物
          if (typeobj.item !== 'wind' || (typeobj.item === 'wind' && !this.state.windData)) {
            getGzipData(this.time, typeobj.item, map.getZoom(), data => {
              this._windy.setOverlay(typeobj.item, data);
              data = {};
            });
          } else {
            this._windy.setOverlay(typeobj.item, this.state.windData);
            this.updateWind();
          }
        } else {
          this.clearOverlay();
          this._windy.releaseOverlay();
        }
      }
    }
}
</script>
