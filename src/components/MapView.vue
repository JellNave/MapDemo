<template>
  <div id="mapDiv"></div>
</template>

<script lang="ts">
import { Tile as TileLayer, Heatmap as HeatmapLayer } from "ol/layer";
import { fromLonLat } from "ol/proj";
import OSM from "ol/source/OSM";
import { defineComponent } from "vue";
import { Map, View, Feature } from "ol";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Style, Stroke, Fill } from "ol/style";
import { Polygon, Point, MultiPolygon } from "ol/geom";
import { defaults as defaultControls } from "ol/control";

import areaGeo from "@/geojson/sichuan.json";
import pointData from "@/geojson/test.json";
import XYZ from "ol/source/XYZ";

export default defineComponent({
  data() {
    let map: any = null;
    const layer: any = null;
    const max: any = null;
    return {
      map,
      layer,
      max,
    };
  },
  mounted() {
    this.initMap(); //初始化地图
    // this.addArea([areaGeo]); //添加四川省的边界描边和填充
    this.addHeatMap(); //添加热力图数据
  },
  methods: {
    /**
     * 初始化一个 openlayers 地图
     */
    initMap() {
      let target = "mapDiv"; //跟页面元素的 id 绑定来进行渲染
      this.layer = [
        new TileLayer({
          // source: new OSM(),
          source: new XYZ({
            url: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
          }),
        }),
      ];
      let view = new View({
        center: fromLonLat([105.444493, 28.875237]), //地图中心坐标
        zoom: 12, //缩放级别
      });
      this.map = new Map({
        target: target, //绑定dom元素进行渲染
        layers: this.layer, //配置地图数据源
        view: view, //配置地图显示的options配置（坐标系，中心点，缩放级别等）
        controls: defaultControls({
          zoom: true,
        }).extend([]),
      });
    },
    addArea(geo = []) {
      if (geo.length == 0) {
        return false;
      }
      let features: any[] = [];
      [...geo].forEach((g: any) => {
        let lineData: any = g.features[0];
        let routeFeature: any = "";
        if (lineData.geometry.type == "MultiPolygon") {
          routeFeature = new Feature({
            geometry: new MultiPolygon(lineData.geometry.coordinates).transform(
              "EPSG:4326",
              "EPSG:3857"
            ),
          });
        } else if (lineData.geometry.type == "Polygon") {
          routeFeature = new Feature({
            geometry: new Polygon(lineData.geometry.coordinates).transform(
              "EPSG:4326",
              "EPSG:3857"
            ),
          });
        }
        routeFeature.setStyle(
          new Style({
            fill: new Fill({
              color: "#4e98f444",
            }),
            stroke: new Stroke({
              width: 3,
              color: [71, 137, 227, 1],
            }),
          })
        );
        features.push(routeFeature);
      });
      // 设置图层
      let routeLayer = new VectorLayer({
        source: new VectorSource({
          features: features,
        }),
      });
      // 添加图层
      this.map.addLayer(routeLayer);
    },
    /**
     * 添加热力图
     */
    addHeatMap() {
      let colors = ["#2200FF", "#16D9CC", "#4DEE12", "#E8D225", "#EF1616"];
      let zoomLevel = this.map.getView().getZoom();
      let radius = Math.pow(2, zoomLevel) * 0.002;
      let opacity = 1 - (zoomLevel * 2) / 100;
      this.layer = new HeatmapLayer({
        source: new VectorSource(),
        blur: 30,
        radius: radius,
        gradient: colors,
        opacity: opacity,
      });
      this.map.addLayer(this.layer);
      this.AppendFeatures(pointData.obj.deviceheat, colors);
      this.map.on("moveend", () => {
        var zoom = this.map.getView().getZoom(); //获取当前地图的缩放级别
        this.layer.setRadius(Math.pow(2, zoom) * 0.002);
        this.layer.setOpacity(1 - (zoom * 2) / 100);
      });
    },
    /**
     * 增加要素至热力图
     */
    AppendFeatures(hatmapData: any, colors: any) {
      for (var i in hatmapData) {
        var f = new Feature({
          geometry: new Point(
            fromLonLat([
              Number(hatmapData[i].longitude),
              Number(hatmapData[i].latitude),
            ])
          ),
        });
        this.layer.getSource().addFeature(f);
      }
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
