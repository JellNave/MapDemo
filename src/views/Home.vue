<template>
  <div class="home">
    <map-view ref="mapComponent"></map-view>
    <div class="radio-group">
      <div v-for="item in sourceList" :key="item.id">
        <input
          type="radio"
          :id="item.id"
          name="radio"
          v-model="checkedSource"
          :value="item.value"
        />
        <label :for="item.id"> {{ item.title }} </label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MapView, { useIndexMap } from "@/components/MapView/index.vue";
import OSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ";
import Stamen from "ol/source/Stamen";
export default defineComponent({
  components: {
    MapView,
  },
  setup() {
    const { mapComponent, checkedSource } = useIndexMap();
    const sourceList = [
      {
        id: "sourceRadio1",
        title: "OSM-openlayers-onlineStreet",
        source: new OSM(),
        value: "OSMOO",
      },
      {
        id: "sourceRadio2",
        title: "XYZ-arcgis-chinaSnlineStreet",
        source: new XYZ({
          url: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
        }),
        value: "XYZAC",
      },
      {
        id: "sourceRadio3",
        title: "XYZ-thunderforest-openCycle",
        source: new XYZ({
          url: "https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=134b8b7227e74640bfaa05398ab99200",
        }),
        value: "XYZTO",
      },
      {
        id: "sourceRadio4",
        title: "XYZ-thunderforest-transport",
        source: new XYZ({
          url: "https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=134b8b7227e74640bfaa05398ab99200",
        }),
        value: "XYZTT",
      },
      {
        id: "sourceRadio5",
        title: "XYZ-thunderforest-spinal",
        source: new XYZ({
          url: "https://tile.thunderforest.com/spinal-map/{z}/{x}/{y}.png?apikey=134b8b7227e74640bfaa05398ab99200",
        }),
        value: "XYZTS",
      },
      {
        id: "sourceRadio6",
        title: "STAMEN-openlayers-waterColor",
        source: new Stamen({
          layer: "watercolor",
        }),
        value: "STAOW",
      },
    ];
    return {
      sourceList,
      checkedSource,
      mapComponent,
    };
  },
});
</script>

<style lang="less" scoped>
.home {
  width: 100vw;
  height: 100vh;
}
.radio-group {
  position: fixed;
  // top: ~"calc(50% - 125.5px)";
  bottom: 0.5em;
  left: 0.5em;
  padding: 2px;
  div {
    margin: 1px;
    height: 40px;
    cursor: pointer;
    input {
      appearance: none;
      display: none;
    }
    input:checked ~ label {
      background-color: rgba(0, 60, 136, 0.7);
    }
    label {
      width: 300px;
      height: 40px;
      line-height: 40px;
      display: block;
      text-align: center;
      background-color: rgba(0, 60, 136, 0.5);
      color: #fff;
    }
  }
}
</style>
