
import React, { Component } from 'react';

class BaiDuMap extends Component {
    constructor(props) {
        super(props)
        this.state = {
            x: this.props.x * 1,
            y: this.props.y * 1
        }
        console.log(sessionStorage.lng, sessionStorage.lat);
    }


    componentDidMount() {
        const { BMap,BMapLib } = window
        var map = new BMap.Map("allmap", { enableMapClick: false });//构造底
        const { row, flag } = this.props
        const { distance} = row;
        var size = new BMap.Size(20, 20);
        map.addControl(new BMap.CityListControl({
            offset: size,
        }));
        map.centerAndZoom(new BMap.Point(sessionStorage.lng, sessionStorage.lat), 11); // 初始化地图,设置中心点坐标和地图级别

        map.enableScrollWheelZoom(true);//对滚轮有效
        // 将控件（平移缩放控件）添加到地图上
        map.addControl(new BMap.NavigationControl());
        //控制地图的最大和最小缩放级别
        map.setMinZoom(16);
        map.setMaxZoom(18);
        // 创建位置检索、周边检索和范围检索
        let local = new BMap.LocalSearch(map, {
            renderOptions: {
                map: map
            }
        });
        var bs = map.getBounds();   //获取可视区域
        var bssw = bs.getSouthWest();   //可视区域左下角
        var bsne = bs.getNorthEast();   //可视区域右上角
     
        bssw.lat = -distance * 0.00000899 / 2 + bssw.lat
        bssw.lng = -distance * 0.00001141 / 2 + bssw.lng

        bsne.lat = distance * 0.00000899 / 2 + bsne.lat
        bsne.lng = distance * 0.00001141 / 2 + bsne.lng
        // console.log(bsne.lng, bsne.lat);
        // console.log(bssw.lng, bssw.lat);
        var b = new BMap.Bounds(new BMap.Point(bssw.lng, bssw.lat), new BMap.Point(bsne.lng, bsne.lat));
        BMapLib.AreaRestriction.setBounds(map, b);//设置初始化的显示范围

        var point = new BMap.Point(sessionStorage.lng * 1, sessionStorage.lat * 1)
        var marker = new BMap.Marker(point);
        // 添加覆盖物

        map.addOverlay(marker);            //增加点
        // console.log(marker);
        if (JSON.stringify(row) !== "{}" && !flag) {
            var opts = {
                width: 200,     // 信息窗口宽度
                // height: 100,     // 信息窗口高度
                title: row.name, // 信息窗口标题
                enableMessage: true,//设置允许信息窗发送短息
            }

            var infoWindow = new BMap.InfoWindow(row.detailedaddress ? row.detailedaddress : `${row.province.indexOf("省" || "市") !== -1 ? row.province : (row.province === row.city ? '' : row.province + '省')}${row.city.indexOf("市") !== -1 ? row.city : row.city + '市'}${row.county.indexOf("区" || "县") === -1 ? row.county + '区' : row.county}${row.name}`, opts);
            map.openInfoWindow(infoWindow, point); //开启信息窗口
        } else {
            return
        }

        window.local = local

        var geocoder = new BMap.Geocoder();
        map.addEventListener("change", function (e) { //给地图添加点击事件

            geocoder.getLocation(e.point, function (rs) {

                alert(rs.address); //地址描述(string)

                // console.log(rs.addressComponents); //结构化的地址描述(object)
                // console.log(rs.addressComponents.province); //省
                // console.log(rs.addressComponents.city); //城市
                // console.log(rs.addressComponents.district); //区县
                alert(rs.addressComponents.street); //街道
                alert(rs.addressComponents.streetNumber); //门牌号
                // console.log(rs.surroundingPois); //附近的POI点(array)
                // console.log(rs.business); //商圈字段，代表此点所属的商圈(string)
            });

        });




    }
    render() {

        return (
            <div>
                <div id="allmap" style={{ position: "absolute", top: 0, left: "25px", width: '600px', height: '300px', margin: "0 auto" }}>

                </div>
                <div id="result" ref="result" style={{ position: "absolute", display: "flex", bottom: '-327px', left: "27px" }}>

                </div>
            </div>

        );
    }
}

export default BaiDuMap;
