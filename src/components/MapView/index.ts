/* eslint-disable*/
import { defineComponent, onMounted, ref, watch } from "vue";
import { Tile as TileLayer, Heatmap as HeatmapLayer } from "ol/layer";
import { fromLonLat } from "ol/proj";
import OSM from "ol/source/OSM";
import { Map, View, Feature } from "ol";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Style, Stroke, Fill } from "ol/style";
import { Polygon, Point, MultiPolygon } from "ol/geom";
import { defaults as defaultControls } from "ol/control";
import Stamen from "ol/source/Stamen";
import areaGeo from "@/geojson/luzhou.json";
import pointData from "@/geojson/heatdata.json";
import XYZ from "ol/source/XYZ";

interface IGeoJson {
  type: string;
  features: {
    type: string;
    properties: {
      adcode: number;
      name: string;
      center: number[];
      centroid: number[];
      childrenNum: number;
      level: string;
      parent: { adcode: number };
      subFeatureIndex: number;
      acroutes: number[];
    };
    geometry: {
      type: string;
      coordinates: number[][][][];
    };
    color: string;
  }[];
}
interface IHeatData {
  success: boolean;
  obj: {
    thermograph: {
      geohash: string;
      cnt: number;
      longitude: number;
      latitude: number;
    }[];
    deviceheat: {
      deviceid: string;
      longitude: string;
      latitude: string;
      total: string;
    }[];
  };
  code: number;
}

const component = defineComponent({
  /* eslint-disable*/
  setup() {
    //图层定义
    let map: any = null;
    let layer: any = null;
    let heatLayer: any = null;
    let tileLayer = new TileLayer();
    let areaLayer: any = null;
    /**
     * 初始化一个 openlayers 地图
     */
    const initMap = () => {
      let target = "mapDiv"; //跟页面元素的 id 绑定来进行渲染
      layer = [tileLayer];
      let view = new View({
        center: fromLonLat([105.444493, 28.875237]), //地图中心坐标
        zoom: 11, //缩放级别
      });
      map = new Map({
        target: target, //绑定dom元素进行渲染
        layers: layer, //配置地图数据源
        view: view, //配置地图显示的options配置（坐标系，中心点，缩放级别等）
        controls: defaultControls({
          zoom: true,
        }).extend([]),
      });
    };
    /**
     * 定义行政区划图层
     */
    const declareArea = (geo: any) => {
      let features: any[] = [];
      //遍历geojson添加要素
      geo.forEach((ele: any) => {
        ele.features.forEach((g: any) => {
          let lineData: any = g;
          let routeFeature: any = "";
          if (lineData.geometry.type == "MultiPolygon") {
            routeFeature = new Feature({
              geometry: new MultiPolygon(
                lineData.geometry.coordinates
              ).transform("EPSG:4326", "EPSG:3857"),
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
                color: g.color + "77",
              }),
              stroke: new Stroke({
                width: 3,
                color: "#0066CC",
              }),
            })
          );
          features.push(routeFeature);
        });
      });
      // 配置图层
      areaLayer = new VectorLayer({
        source: new VectorSource({
          features: features,
        }),
        zIndex: 999,
      });
    };
    /**
     * 定义热力图层
     */
    const declareHeatMap = (heatData: any) => {
      //热力图配置
      let colors = ["#2200FF", "#16D9CC", "#4DEE12", "#E8D225", "#EF1616"];
      let zoomLevel = map.getView().getZoom();
      let radius = Math.pow(2, zoomLevel) * 0.002;
      let opacity = 1 - (zoomLevel * 2) / 100;
      heatLayer = new HeatmapLayer({
        source: new VectorSource(),
        blur: 30,
        radius: radius,
        gradient: colors,
        opacity: opacity,
        zIndex: 9999,
      });
      //添加要素至热力图层
      for (var i in heatData) {
        const heatFeatures = new Feature({
          geometry: new Point(
            fromLonLat([
              Number(heatData[i].longitude),
              Number(heatData[i].latitude),
            ])
          ),
          weight: heatData[i].total,
        });
        heatLayer.getSource().addFeature(heatFeatures);
      }
      //绑定监听事件动态控制热力图视效
      map.on("moveend", () => {
        var zoom = map.getView().getZoom(); //获取当前地图的缩放级别
        heatLayer.setRadius(Math.pow(2, zoom) * 0.002);
        heatLayer.setOpacity(1 - (zoom * 2) / 100);
      });
    };
    //添加热力图层
    const addHeatLayer = () => {
      map.addLayer(heatLayer);
    };
    //删除热力图层
    const removeHeatLayer = () => {
      map.removeLayer(heatLayer);
    };
    //添加区划图层
    const addAreaLayer = () => {
      map.addLayer(areaLayer);
    };
    //删除区划图层
    const removeAreaLayer = () => {
      map.removeLayer(areaLayer);
    };
    onMounted(() => {
      initMap(); //初始化地图
      declareHeatMap((pointData as IHeatData).obj.deviceheat); //定义热力图层
      declareArea([areaGeo as IGeoJson]); //添加geojson的边界描边和填充
    });
    return {
      tileLayer,
      addHeatLayer,
      removeHeatLayer,
      addAreaLayer,
      removeAreaLayer,
    };
  },
});

//导出
export default component;

export function useIndexMap() {
  // 地图控制
  const mapComponent = ref<InstanceType<typeof component>>();
  //选中状态
  const checkedSource = ref<string>();
  const checkedHeatmap = ref<boolean>();
  const checkedArea = ref<boolean>();
  watch(
    //监听选中状态调用方法加载地图底图资源
    checkedSource,
    (value) => {
      switch (value) {
        case "OSMOO":
          mapComponent.value!.tileLayer.setSource(new OSM());
          break;
        case "XYZAC":
          mapComponent.value!.tileLayer.setSource(
            new XYZ({
              url: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
            })
          );
          break;
        case "XYZTO":
          mapComponent.value!.tileLayer.setSource(
            new XYZ({
              url: "https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=134b8b7227e74640bfaa05398ab99200",
            })
          );
          break;
        case "XYZTT":
          mapComponent.value!.tileLayer.setSource(
            new XYZ({
              url: "https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=134b8b7227e74640bfaa05398ab99200",
            })
          );
          break;
        case "XYZTS":
          mapComponent.value!.tileLayer.setSource(
            new XYZ({
              url: "https://tile.thunderforest.com/spinal-map/{z}/{x}/{y}.png?apikey=134b8b7227e74640bfaa05398ab99200",
            })
          );
          break;
        case "STAOW":
          mapComponent.value!.tileLayer.setSource(
            new Stamen({
              layer: "watercolor",
            })
          );
          break;
        case "XYZAI":
          mapComponent.value!.tileLayer.setSource(
            new XYZ({
              url: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            })
          );
      }
    }
  );
  watch(checkedArea, (value) => {
    // 监听选中状态控制区划图层显示
    switch (value) {
      case true:
        mapComponent.value!.addAreaLayer();
        break;
      case false:
        mapComponent.value!.removeAreaLayer();
        break;
    }
  });
  watch(checkedHeatmap, (value) => {
    // 监听选中状态控制热力图层显示
    switch (value) {
      case true:
        mapComponent.value!.addHeatLayer();
        break;
      case false:
        mapComponent.value!.removeHeatLayer();
        break;
    }
  });
  onMounted(() => {
    checkedSource.value = "OSMOO"; //默认底图为OSMOO
    checkedArea.value = true; //默认显示热力图
    checkedHeatmap.value = true; //默认显示区划
  });
  return {
    mapComponent,
    checkedSource,
    checkedHeatmap,
    checkedArea,
  };
}
