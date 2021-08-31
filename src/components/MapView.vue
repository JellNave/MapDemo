<template>
  <div id="mapDiv"></div>
</template>

<script lang="ts">
import { Map, View } from "ol";
import Tile from "ol/layer/Tile";
import { fromLonLat } from "ol/proj";
import OSM from "ol/source/OSM";
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {};
  },
  mounted() {
    this.initMap();
  },
  methods: {
    /**
     * 初始化一个 openlayers 地图
     */
    initMap() {
      let target = "mapDiv"; //跟页面元素的 id 绑定来进行渲染
      let tileLayer = [
        new Tile({
          source: new OSM(),
        }),
      ];
      let view = new View({
        center: fromLonLat([105.448391, 28.877139]), //地图中心坐标
        zoom: 16.5, //缩放级别
      });
      let map = new Map({
        target: target, //绑定dom元素进行渲染
        layers: tileLayer, //配置地图数据源
        view: view, //配置地图显示的options配置（坐标系，中心点，缩放级别等）
      });
    },
  },
});
</script>

<style scoped>
@import "~ol/ol.css";
#mapDiv {
  width: 100%;
  height: 100%;
}
</style>
