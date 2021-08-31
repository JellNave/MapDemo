/**
 * Created by fanweihua on 2019/1/16.
 * 资源地址配置
 */
window.resourceConfig = {
  lib: {
    url: 'http://10.68.0.140:9094/' // 此配置只针对开发模式
  },
  // 服务地址
  service: {

 pgisMapServerURL: 'http://80.2.22.29:8883/',
    //GPS后台服务的连接地址
    WebSocketUrl: 'ws://80.2.22.29:8066/websocket',
    // //配置平台图片访问地址
    imgServerUrl:'http://80.2.22.29:8110',
		    //sdk前端所在地址
    sdkURL: "http://10.68.0.140:9094",
		//微服务登录信息
    
   //根据GPS类型配置对应图标(对应SDK部署包里的GPSIcon文件夹里的图标)
    gpsIcon:{
      //业务类型代码（业务类型代码没有时，程序默认01）先根据ywlxdm区分 交警 ，特警 ，治安等类型
      '01':
        {
          '01':'01_01.png',//设备类型代码 图片名称（根据设备类型代码对应图标）
          '02':'01_02.png',//设备类型代码: 图片名称
          '03':'01_03.png',//设备类型代码: 图片名称
          '04':'01_04.png',//设备类型代码: 图片名称
          '05':'01_05.png',//设备类型代码: 图片名称
        },
      '02':
        {
          '02':'02_01.png'
        },
      '03':
        {
          '03':'03_01.png'
        },
    }
  },
  //地图基础信息配置
  baseInfo:{

    /**
     * 参数说明：设置地图显示的最大级别
     */
    maxZoom: 23,
    /**
     * 参数说明：设置地图显示的最小级别
     */
    minZoom: 0,
    scaleInterval:{
      Interval:[10,100,1000],
      scale:[1.3,1.5,2],
    }
  },
  // 底图配置，内置vector 和image，可以更加需求任意增加
  //根据实际情况添加删除不需要的地图服务连接
  baseMapConfig: {
    vector: {             //配图方案关键字，唯一
      label:'天地图矢量',  //配图方案别名，如矢量地图、影像地图、夜色图......
      imgurl: 'http://10.68.0.140:9094/example/mapStyle/shiliang.png',         // 配图方案对应的image图标,url路径。必填项，根据前端应用来设定
      layers:[           //可以任意组合地图服务切片类型，目前支持  xyz谷歌、WMTS天地图、GeoServer、EzServer地图
        {
          layerType: 'IMG', //地图背景图片，叠在地图表面以填充没有底图的区域
          layerName: '地图背景',
          projection: '4326',
          options: {
            url:'http://10.68.0.140:9094/example/mapStyle/satellite.jpg',  //图片的绝对路径
          }
        },
        {
          layerType: 'EzServer',
          layerName: '天地图矢量',
          projection: '4326',
          options: {
            url:'http://10.68.0.140/PGIS_S_TileMapServer/Maps/SL/EzMap?Service=getImage&Type=RGB&ZoomOffset=0&Col={x}&Row={y}&Zoom={z}&V=0.3&key=',
          }
        },
        
        
        /**
         * 配置示范
         */
        // {
        //   layerType: 'TDT',
        //   layerName: '天地图矢量',
        //   projection: '4326',
        //   options: {
        //     url:'http://t{0-6}.tianditu.com/vec_c/wmts?tk=0a58d63560908ef10706475cbfe38007',
        //   }
        // },
        // {
        //   layerType: 'WMTS',
        //   layerName: '红河夜色图',
        //   projection: '4326',
        //   options: {
        //     url:'http://172.29.214.88:8181/geoserver/gwc/service/wmts?layer=HH-MAPS-YS1'
        //   }
        // },
        // {
        //   layerType: 'EzServer',
        //   layerName: '矢量地图注记',
        //   projection: '4326',
        //   options: {
        //     url:'http://172.29.214.88:8011/mapurl/EzServer7/Maps/zjtdt/EzMap?Service=getImage&Type=RGB&ZoomOffset=0&Col={x}&Row={y}&Zoom={z}&V=0.3&key=',
        //   }
        // },
        // {
        //   layerType: 'XYZ',  //通用的xyz切片加载方式
        //   layerName: '谷歌影像', //坐标有偏移，只能开发测试使用
        //   projection: '3857', //坐标系
        //   options:{
        //     url:"http://mt2.google.cn/vt/lyrs=y&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=G"
        //   }
        // }
      ]
    },
    image: {             //配图方案关键字，唯一
      label:'OSM',  //配图方案别名，如矢量地图、影像地图、夜色图......
      imgurl: 'https://www.openstreetmap.org/assets/osm_logo-d4979005d8a03d67bbf051b4e7e6ef1b26c6a34a5cd1b65908e2947c360ca391.svg',         // 配图方案对应的image图标,url路径。必填项，根据前端应用来设定
      layers:[           //可以任意组合地图服务切片类型，目前支持  xyz谷歌、WMTS天地图、GeoServer、EzServer地图
        {
          layerType: 'XYZ', //地图背景图片，叠在地图表面以填充没有底图的区域
          layerName: '地图背景',
          projection: '4326',
          options: {
            url:'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',  //图片的绝对路径
          }
        },
      ]
    }
  }
};