<template>
  <div class="home">
    <!-- 地图组件 -->
    <map-view ref="mapComponent"></map-view>
    <!-- 地图资源切换单选组 -->
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
    <!-- 热力图控制复选 -->
    <div class="heatmap-checkbox">
      <div>
        <input type="checkbox" id="heatmap" v-model="checkedHeatmap" />
        <label for="heatmap">Show Heatmap of Vistors Flow Fate</label>
      </div>
    </div>
    <!-- 区划控制复选 -->
    <div class="area-checkbox">
      <div>
        <input type="checkbox" id="area" v-model="checkedArea" />
        <label for="area">Show Administrative Fivisions </label>
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
    //组合式api引入对应变量
    const { mapComponent, checkedSource, checkedHeatmap, checkedArea } =
      useIndexMap();
    //地图底图资源列表
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
          url: "https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=134b8b7227e74640bfaa05398ab99200", //自己注册的thunderforest apikey
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
      checkedArea,
      checkedHeatmap,
    };
  },
});
</script>

<style lang="less" scoped>
.home {
  width: 100vw;
  height: 100vh;
  user-select: none;
}
.btn-style () {
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
      cursor: pointer;
      height: 40px;
      line-height: 40px;
      display: block;
      text-align: center;
      background-color: rgba(0, 60, 136, 0.5);
      color: #fff;
    }
  }
}
.radio-group {
  position: fixed;
  bottom: 0.5em;
  left: 0.5em;
  padding: 2px;
  .btn-style();
  label {
    width: 300px;
  }
}
.heatmap-checkbox {
  position: fixed;
  left: 0.5em;
  top: 7em;
  padding: 2px;
  .btn-style();
  label {
    width: 300px;
  }
}
.area-checkbox {
  position: fixed;
  left: 0.5em;
  top: 10em;
  padding: 2px;
  .btn-style();
  label {
    width: 300px;
  }
}
</style>
