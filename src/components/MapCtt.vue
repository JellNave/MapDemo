<template>
  <div id="mapContainer"></div>
</template>

<script lang="ts">
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
      /* eslint-disable */
      const FMap = (window as any).FMap;
      var fmap = new FMap();
      var options = {
        center: [105.448391, 28.877139],
        zoom: 10,
        navigation: false,
        scalebar: true,
        appKey: "",
        appUserId: "",
        modelView: "2D",
      };
      var renderData = [
        {
          x: 105.448391,
          y: 28.877139,
          name: "测试",
          image: require("../assets/mk.png"),
          width: 10,
          height: 8,
          fontColor: "#FF0000",
          fontSize: "20",
          scale: 0.1,
          fontFamily: "微软雅黑",
          anchor: [0.5, 0.5],
        },
      ];
      fmap.initMap("mapContainer", options);
      fmap.showMarker(renderData, {
        cluster: false,
        showTitle: true,
        zIndex: 100000,
      });
    },
  },
});
</script>

<style scoped>
#mapContainer {
  width: 100%;
  height: 100%;
}
</style>
