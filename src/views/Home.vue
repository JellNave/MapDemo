<template>
  <div class="home">
    <map-view></map-view>
    <div class="radio-group">
      <div v-for="item in sourceList" :key="item.id">
        <input
          type="radio"
          :id="item.id"
          name="radio"
          :ref="'radioRef' + item.id"
          v-model="item.value"
        />
        <label :for="item.id">{{ item.title }}</label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import MapView, { useIndexMap } from "@/components/MapView/index.vue";
import OSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ";
import Stamen from "ol/source/Stamen";
const radioRef1 = ref();
const radioRef2 = ref();
const radioRef3 = ref();
const radioRef4 = ref();
const radioRef5 = ref();
const radioRef6 = ref();
export default defineComponent({
  components: {
    MapView,
  },
  setup() {
    const {
      mapComponent,
      checked1,
      checked2,
      checked3,
      checked4,
      checked5,
      checked6,
    } = useIndexMap();
    const sourceList = [
      {
        id: "1",
        title: "OSM-openlayers-onlineStreet",
        source: new OSM(),
        value: "checked1",
      },
      {
        id: "2",
        title: "XYZ-thunderforest-transport",
        source: new XYZ({
          url: "https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=134b8b7227e74640bfaa05398ab99200",
        }),
        value: "checked2",
      },
      {
        id: "3",
        title: "XYZ-arcgis-chinaSnlineStreet",
        source: new XYZ({
          url: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
        }),
        value: "checked3",
      },
      {
        id: "4",
        title: "STAMEN-openlayers-waterColor",
        source: new Stamen({
          layer: "watercolor",
        }),
        value: "checked4",
      },
      {
        id: "5",
        title: "XYZ-thunderforest-spinal",
        source: new XYZ({
          url: "https://tile.thunderforest.com/spinal-map/{z}/{x}/{y}.png?apikey=134b8b7227e74640bfaa05398ab99200",
        }),
        value: "checked5",
      },
      {
        id: "6",
        title: "XYZ-thunderforest-openCycle",
        source: new XYZ({
          url: "https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=134b8b7227e74640bfaa05398ab99200",
        }),
        value: "checked6",
      },
    ];
    // watch(
    //   //监听选中状态调用方法加载打点
    //   () => [checked1, checked2, checked3, checked4, checked5, checked6],
    //   (values) => {
    //     console.log(values);
    //   }
    // );

    onMounted(() => {
      radioRef1.value.checked = true;
    });
    return {
      sourceList,
      radioRef1,
      radioRef2,
      radioRef3,
      radioRef4,
      radioRef5,
      radioRef6,
      checked1,
      checked2,
      checked3,
      checked4,
      checked5,
      checked6,
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
  top: ~"calc(50% - 174px)";
  left: 0.5em;
  padding: 2px;
  div {
    margin: 1px;
    height: 40px;
    input {
      // appearance: none;
      // display: none;
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
