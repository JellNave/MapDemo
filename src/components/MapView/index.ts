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
import pointData from "@/geojson/test.json";
import XYZ from "ol/source/XYZ";

const component = defineComponent({
  /* eslint-disable*/
  setup() {
    let map: any = null;
    let layer: any = null;
    let tileLayer = new TileLayer();
    /**
     * 初始化一个 openlayers 地图
     */
    const initMap = () => {
      let target = "mapDiv"; //跟页面元素的 id 绑定来进行渲染
      layer = [
        tileLayer,
        // new TileLayer({
        // source: new OSM(),
        // source: new XYZ({
        //   url: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
        // }),
        // source: new XYZ({
        // url: "https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=134b8b7227e74640bfaa05398ab99200",
        // }),
        // }),
      ];
      // layer = [
      //   new TileLayer({
      //     source: new Stamen({
      //       layer: "watercolor",
      //     }),
      //   }),
      // ];
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
    const addArea = (geo: any) => {
      let features: any[] = [];
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

      [...geo][0].features.forEach((g: any) => {});
      // 设置图层
      let routeLayer = new VectorLayer({
        source: new VectorSource({
          features: features,
        }),
      });
      // 添加图层
      map.addLayer(routeLayer);
    };
    /**
     * 添加热力图
     */
    const addHeatMap = () => {
      let colors = ["#2200FF", "#16D9CC", "#4DEE12", "#E8D225", "#EF1616"];
      let zoomLevel = map.getView().getZoom();
      let radius = Math.pow(2, zoomLevel) * 0.002;
      let opacity = 1 - (zoomLevel * 2) / 100;
      layer = new HeatmapLayer({
        source: new VectorSource(),
        blur: 30,
        radius: radius,
        gradient: colors,
        opacity: opacity,
      });
      map.addLayer(layer);
      AppendFeatures(pointData.obj.deviceheat, colors);
      map.on("moveend", () => {
        var zoom = map.getView().getZoom(); //获取当前地图的缩放级别
        layer.setRadius(Math.pow(2, zoom) * 0.002);
        layer.setOpacity(1 - (zoom * 2) / 100);
      });
    };
    /**
     * 增加要素至热力图
     */
    const AppendFeatures = (hatmapData: any, colors: any) => {
      for (var i in hatmapData) {
        var f = new Feature({
          geometry: new Point(
            fromLonLat([
              Number(hatmapData[i].longitude),
              Number(hatmapData[i].latitude),
            ])
          ),
        });
        layer.getSource().addFeature(f);
      }
    };
    onMounted(() => {
      initMap(); //初始化地图
      addArea([areaGeo]); //添加geojson的边界描边和填充
      addHeatMap(); //添加热力图数据
    });
    return {
      layer,
      tileLayer,
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
  watch(
    //监听选中状态调用方法加载打点
    checkedSource,
    (values) => {
      switch (values) {
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
      }
    }
  );
  onMounted(() => {
    checkedSource.value = "OSMOO";
  });
  return {
    mapComponent,
    checkedSource,
  };
}
