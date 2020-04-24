import React from 'react';
import BaiDuMap from "./mapUtil"
import "@/styles/map.less";
import { showKm, isValiable } from "@/utils"
import { parFilter } from '@/utils';
import addressOptions from "./mapData.js"
import { Modal, Button, Table, Cascader, Select, Popconfirm, Divider, Form, Input, message } from 'antd'
const { Option } = Select;
const km_select = showKm();
const map_valiable = isValiable()

class Map extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loadingSub: false,
            visible: false,
            itemShow: false,
            flag: false,
            ruleForm: {},
            autoCompleteResult: [],
            s_km: '',
            row: {},
            initlng: 116.404,
            initlat: 39.915,
            lng: "",
            lat: "",
            detailAddress: '',
            adds: [],
            newMarker: [],
            data: [],
            markdress: '',
            params: {
                page: 1,
                limit: 10,
            },
            tableData: {
                data: [],
                total: 0
            },
        }
    }

    componentWillMount() {
        this.getLandMarkList();
    }
    // 获取地图列表
    async getLandMarkList() {
        let param = parFilter(this.state.params);
        const {  data, total } = await this.$api.comm.getSwLandmarkList(param);
        this.setState({
            tableData: { data, total },
            data: data
        })
    }
    //查询
    queryinfo = e => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            let { t_name, t_status, t_city } = values;
            console.log(values);

            let params = Object.assign({}, this.state.params, { page: 1, name: t_name, status: t_status * 1, city: t_city });
            await this.setState({ params });
            this.getLandMarkList();
        })
    }
    // 提交表单


    // 重置
    cancelContent = () => {
        this.props.form.resetFields();
    }
    //新增-编辑
    handletoChange(isPase = false, row) {
        var that = this
        const { visible } = this.state;

        sessionStorage.removeItem("lng")
        sessionStorage.removeItem("lat")
        if (row) {
            sessionStorage.lng = row.x;
            sessionStorage.lat = row.y;
            that.setState({
                row,
            })
        }

        if (isPase) {
            // let { id, name, province, city, county, status, distance, x, y } = row;
            //    编辑的时候初次展示也是需要设置一下显示范围的
            that.setState({
                visible: !visible,
                ruleForm: row,
                flag: false,
                itemShow: isPase,
            })

        } else {
            sessionStorage.lng = 116.404
            sessionStorage.lat = 39.915
            that.setState({
                visible: !visible,
                flag: true,
                ruleForm: {},
                itemShow: isPase,
            })
        }


    }
    // 取消表单
    handleChange() {
        this.props.form.resetFields();
        this.setState({
            visible: false
        })
    }
    //提交表单
    handleSubmit() {
        this.props.form.validateFieldsAndScroll(async (err, values) => {
            if (!err) {
                let { id, status, name, city,  addressDetail, distance } = values;
                let api = '';
                if (this.state.itemShow) {
                    let { id } = this.state.ruleForm;//编辑
                    let data = { id, status, name, detailedAddress: addressDetail, city: city[1] ? city[1] : "", province: city[0], county: city[2] ? city[2] : "", x: this.state.initlng + "", y: this.state.initlat + "", distance: distance*1000 + "" };
                    api = this.$api.comm.updateSwLandmark(data);
                } else {
                    this.props.form.resetFields();
                    let data = { id, status, name, detailedAddress: addressDetail, city: city[1] ? city[1] : "", province: city[0], county: city[2] ? city[2] : "", x: this.state.initlng + "", y: this.state.initlat + "", distance: distance*1000 + "" };
                    api = this.$api.comm.addSwLandmark(data);
                }

                const res = await api;
                if (res.errCode === 0) {
                    message.success(!this.state.itemShow ? '新增成功' : '编辑成功')
                    this.props.form.resetFields();
                    this.setState({ visible: false });
                    this.getLandMarkList();
                } else {

                    message.error(res.errMsg);

                }
            }
        });
    };
    // 点击删除
    async handleDelete(row) {
        const { errCode } = await this.$api.comm.deleteSwLandmark({ id: row.id });
        if (errCode === 0) {

            this.getLandMarkList();
        }
    }
    // 页面改变
    async  pageChange(page, pageSize) {
        let params = Object.assign({}, this.state.params, { page });
        await this.setState({ params });
        this.getLandMarkList();
    }
    // 展示数量
    async  onShowSizeChange(current, size) {
        let params = Object.assign({}, this.state.params, { page: 1, limit: size });
        await this.setState({ params });
        this.getList();
    }

    handleOk = e => {
        this.setState({
            visible: false,
        });
    };
    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };
    theLocation = (e) => {
        var that = this

        this.props.form.validateFields((err, values) => {
            let city = values.name;
            const { BMap, BMAP_STATUS_SUCCESS } = window
            var map = new BMap.Map("allmap"); // 创建Map实例
            // 将控件（平移缩放控件）添加到地图上

            //清除覆盖物
            function remove_overlay() {
                map.clearOverlays();
            }
            remove_overlay()
            map.addControl(new BMap.NavigationControl());
            map.centerAndZoom(values.city.join(','), 11);
            var local = new BMap.LocalSearch(map, {
                renderOptions: { map: map }
            });


            // var geocoder = new BMap.Geocoder();
            // var bounds = map.getBounds();
            var options = {
                onSearchComplete: function (results) {
                    // 判断状态是否正确
                    if (local.getStatus() === BMAP_STATUS_SUCCESS) {
                        var s = [];
                        // let bd = [];
                        for (var i = 0; i < results.getCurrentNumPois(); i++) {

                            s.push(results.getPoi(i).point.lng + ',' + results.getPoi(i).point.lat);
                            let lng = s[i].split(',')[0] * 1
                            let lat = s[i].split(',')[1] * 1
                            let address = results.getPoi(i).address
                            let title = results.getPoi(i).title
                            var point = new BMap.Point(lng, lat);
                            // 自定义信息窗口
                            var opts = {
                                width: 250,     // 信息窗口宽度
                                // height: 180,     // 信息窗口高度
                                title: "信息窗口", // 信息窗口标题
                                enableMessage: true//设置允许信息窗发送短息
                            };

                            var infoWindow = new BMap.InfoWindow(title + "," + address, opts);
                            map.openInfoWindow(infoWindow, point); //开启信息窗口
                            addMarker(point, address, infoWindow);
                            that.setState({
                                initlng: point.lng,
                                initlat: point.lat,
                                adds: s,
                                detailAddress: address
                            })

                        }

                    }
                }
            };


            // 编写自定义函数,创建标注
            function addMarker(point, address, infoWindow) {

                var marker = new BMap.Marker(point);
                map.addOverlay(marker);
                marker.addEventListener("click", getAttr);
                function getAttr() {
                    var p = marker.getPosition();
                    // var geoc = new BMap.Geocoder();
                    map.openInfoWindow(infoWindow, point); //开启信息窗口
                    console.log(p, address);//获取marker的位置
                    sessionStorage.setItem('lng', p.lng)
                    sessionStorage.setItem('lat', p.lat)
                    that.setState({
                        detailAddress: address,
                        initlng: p.lng,
                        initlat: p.lat
                    })


                }

            }
            var local = new BMap.LocalSearch(map, options);
            local.search(city)
        })
    }
    // 地图上面的地址解析
    theLocationCity = (e) => {

        this.props.form.validateFields((err, values) => {
            const { chooseAddress } = values
            if ((!chooseAddress) && e) {
                let s_province = e[0];
                let s_city = e[1];
                let s_district = e[2];
                let local = window.local
                local.search(s_province + s_city + s_district);
            } else if (values.chooseAddress === "" && e) {
                console.log(values.e);

                let s_province = e[0];
                let s_city = e[1];
                let s_district = e[2];
                let local = window.local
                local.search(s_province + s_city + s_district);
            }
        })
    }
    // 点击确定---bian
    onSure = () => {
        let that = this;
        this.props.form.validateFields((err, values) => {
            let address = that.state.detailAddress
            alert(`您确定选择${address}作为详细地址吗？`)
            const detail = address
            this.props.form.setFieldsValue({
                addressDetail: detail
            });
        })
    };
    // 获取距离
    getValue = (e) => {
        const { BMap, BMapLib } = window

        var map = new BMap.Map("allmap"); // 创建Map实例
        var size = new BMap.Size(20, 20);
        let that = this
        this.props.form.validateFields((err, values) => {
            var adds = values.addressDetail

            if (values.addressDetail && values.city) {
                adds = values.addressDetail
            } else if ((!values.addressDetail) && values.city) {
                adds = values.city.join(',')
            } else {
                adds = "北京"
            }
            let myGeo = new BMap.Geocoder();
            // 将地址解析结果显示在地图上,并调整地图视野
            myGeo.getPoint(adds, function (point) {
                // let nuns = JSON.stringify(point);
                // let du = JSON.parse(nuns)
                that.setState({
                    initlng: point.lng,
                    initlat: point.lat
                })
                setRange()
            }, values.city);
            // 创建位置检索、周边检索和范围检索

        })
        async function setRange() {
            map.addControl(new BMap.CityListControl({
                offset: size,
            }));
            map.enableScrollWheelZoom();//对滚轮有效
            // 将控件（平移缩放控件）添加到地图上
            map.addControl(new BMap.NavigationControl());
            map.centerAndZoom(await new BMap.Point(that.state.initlng, that.state.initlat), 13); // 初始化地图,设置中心点坐标和地图级别
            //控制地图的最大和最小缩放级别
            map.setMinZoom(16);
            map.setMaxZoom(18);
            // var overlays = [];
            // var overlaycomplete = function (e) {
            //     overlays.push(e.overlay);

            // };
            let local = new BMap.LocalSearch(map, {
                renderOptions: {
                    map: map
                }
            });
            window.local = local
            var bs = map.getBounds();   //获取可视区域
            var bssw = bs.getSouthWest();   //可视区域左下角
            var bsne = bs.getNorthEast();   //可视区域右上角
            var center = bs.getCenter();//获取中心点的位置
            // var span = bs.toSpan();
            // console.log("当前地图可视范围是：" + bssw.lng + "," + bssw.lat + "到" + bsne.lng + "," + bsne.lat);
            // console.log("中心点" + center.lng + ',' + center.lat);
            var marker = new BMap.Marker(new BMap.Point(center.lng, center.lat)); // 创建点
            map.addOverlay(marker);
            // console.log("横跨" + span.lng + "," + span.lat);
            // let radio_x = span.lng / 0.00001141 / 2;//中心点到最左边的距离
            // console.log(e);

            bssw.lat = -e * 1000 * 0.00000899 / 2 + bssw.lat
            bssw.lng = -e * 1000 * 0.00001141 / 2 + bssw.lng

            bsne.lat = e * 1000 * 0.00000899 / 2 + bsne.lat
            bsne.lng = e * 1000 * 0.00001141 / 2 + bsne.lng

            // console.log(bsne.lng, bsne.lat);
            // console.log(bssw.lng, bssw.lat);
            var b = new BMap.Bounds(new BMap.Point(bssw.lng, bssw.lat), new BMap.Point(bsne.lng, bsne.lat));
            BMapLib.AreaRestriction.setBounds(map, b);
        }
        this.setState({
            s_km: e,
        })

    }

    //获取有效性
    getEffect = (e) => {
        // console.log(e);

    }
    // 点击提交前清空
    handleOk = () => {
        this.setState({
            visible: false
        })

        this.props.form.resetFields();
    }



    render() {
        const { getFieldDecorator } = this.props.form;

        const columns = [
            {
                title: '序号',
                dataIndex: 'id',
                key: 'id',
                render: text => <span>{text}</span>,
            },
            {
                title: '所属城市',
                dataIndex: 'city',
                key: 'city',
                render: (text, record) => {
                    return <div>
                        <span>{record.city}</span>
                    </div>
                }
            },
            {
                title: '展示名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '详细地址',
                key: 'ass',
                dataIndex: 'ass',
                render: (text, row) => {
                    // console.log(record);
                    return <span>{row.detailedaddress ? row.detailedaddress : `${row.province.indexOf("省" || "市") !== -1 ? row.province : (row.province === row.city ? '' : row.province + '省')}${row.city.indexOf("市") !== -1 ? row.city : row.city + '市'}${row.county.indexOf("县" || "区") !== -1 ? row.county : row.county + '区'}${row.name}`}</span>
                },
            },
            {
                title: '统计范围（KM）',
                key: 'distance',
                dataIndex: 'distance',
                render: (text, record) => {
                    return <span>{text / 1000}千米</span>
                }
            },
            {
                title: '创建时间',
                key: 'createtime',
                width: 160,
                dataIndex: 'createtime',
            },

            {
                title: '是否有效',
                key: 'status',
                dataIndex: 'status',
                render: (text, record) => (
                    <span>
                        {text === 0 && "无效"}
                        {text === 1 && "有效"}
                    </span>
                ),
            },
            {
                title: '操作',
                key: 'action',
                width: 200,
                render: (text, row) => (
                    <span>
                        <Button type="primary" onClick={() => this.handletoChange(true, row)}> 修改 </Button>
                        <Divider type="vertical" />
                        <Popconfirm title="确定删除吗？" okText="确定" onConfirm={() => this.handleDelete(row)} cancelText="取消">
                            <Button type="danger" >删除</Button>
                        </Popconfirm>,

                    </span>
                ),
            },
        ];

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const { ruleForm, itemShow } = this.state;

        return (


            <div className="myMap">
                <div className="mapContent">
                    {/* 查询 */}
                    <Form layout="inline" onSubmit={this.handleSubmit} style={{ padding: "30px 50px" }}>
                        <Form.Item label="城市">
                            {getFieldDecorator('t_city', {})(<Input allowClear />)}
                        </Form.Item>
                        <Form.Item label="地标名称">
                            {getFieldDecorator('t_name', {})(<Input allowClear />)}
                        </Form.Item>
                        <Form.Item label="是否有效">
                            {getFieldDecorator('t_status', {})(
                                <Select style={{ width: 160 }}  >
                                    {
                                        map_valiable.map((item, index) => {
                                            return <Option key={index} >{item.value}</Option>
                                        })
                                    }
                                </Select>
                            )}
                        </Form.Item>

                        <Form.Item>
                            <Button icon="search" type="primary" htmlType="submit" onClick={this.queryinfo} loading={this.state.loadingSub}>查询</Button>
                            <Button style={{ margin: "0 13px" }} type="default" onClick={this.cancelContent} loading={this.state.loadingSub}>重置</Button>
                        </Form.Item>
                        <Form.Item>
                            <Button icon="plus" type="primary" className="plus" onClick={() => this.handletoChange()} >新增</Button>

                        </Form.Item>
                    </Form>
                    {/* 新增 */}

                    {/* 列表内容 */}
                    <Table
                        pagination={
                            {
                                showTotal: () => `共${this.state.tableData.total}条`,
                                total: this.state.tableData.total,
                                current: this.state.params.page,
                                pageSize: this.state.params.limit,
                                pageSizeOptions: ['10', '20', '30', '50', '100'],
                                showSizeChanger: true,
                                onChange: this.pageChange.bind(this),
                                onShowSizeChange: this.onShowSizeChange.bind(this)
                            }
                        }
                        scroll={{ x: 1250 }}
                        rowKey={(record, index) => index}
                        size="middle"
                        align="center"
                        columns={columns} dataSource={this.state.tableData.data} />
                    {/* 新增地址 */}

                    <Modal
                        title={(itemShow ? '编辑' : '新增') + '地标'}
                        visible={this.state.visible}
                        onCancel={() => this.handleChange()}
                        onOk={() => this.handleSubmit()}
                        width={700}
                    >
                        {/* 内嵌地图 */}
                        <Form {...formItemLayout}  >
                            <Form.Item label="所属城市">
                                {getFieldDecorator('city', {
                                    initialValue: itemShow && [
                                        `${ruleForm.province.indexOf("省") !== -1 ? ruleForm.province : "999"}`,
                                        `${ruleForm.city}`,
                                        `${ruleForm.county}`
                                    ],
                                    rules: [
                                        { type: 'array', required: true, message: '请选择所属城市' },
                                    ],
                                })(<Cascader options={addressOptions} onChange={(e) => this.theLocationCity(e)} placeholder="请选择所属城市" />)}
                            </Form.Item>
                            <div style={{ position: "relative" }}>
                                <Form.Item label="地标选择" style={{ display: "flex" }}>
                                    {getFieldDecorator('name', {
                                        initialValue: itemShow ? ruleForm.name : '',
                                        rules: [{ required: true, message: '请选择地标' }]
                                    })(<Input allowClear placeholder="请输入地址名称" style={{ width: "400px" }} />)}

                                </Form.Item>
                                <div className="map_btn" style={{ position: "absolute", top: "8px", right: 0, margin: "0 10px" }}>
                                    <Button size="small" style={{ margin: "0 10px" }} onClick={(e) => this.theLocation(e)}> 地图搜索</Button>
                                    <Button size="small" onClick={this.onSure}>确定</Button>
                                </div>

                            </div>
                            <Form.Item className="Item">
                                <div id="omap" ref="omap" style={{ width: 400, height: 300, margin: "0 auto" }}>
                                    {this.state.visible &&
                                        <BaiDuMap
                                            width="400px"
                                            height="300px"
                                            row={this.state.row}
                                            x={sessionStorage.lng}
                                            y={sessionStorage.lat}
                                            flag={this.state.flag}

                                        // b1={}
                                        // b2={}
                                        ></BaiDuMap>}
                                </div>
                            </Form.Item >


                            <Form.Item label="详细地址">
                                {getFieldDecorator('addressDetail', {
                                    initialValue: itemShow ? (ruleForm.detailedaddress ? ruleForm.detailedaddress :
                                        `${ruleForm.province.indexOf("省" || "市") !== -1 ? ruleForm.province : (ruleForm.province === ruleForm.city ? '' : ruleForm.province + '省')}${ruleForm.city.indexOf("市") !== -1 ? ruleForm.city : ruleForm.city + '市'}${ruleForm.county.indexOf("县" || "区") !== -1 ? ruleForm.county : ruleForm.county + '区'}${ruleForm.name}`) : '',
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入详细地址',
                                        },
                                    ],
                                })(<Input allowClear />)}
                            </Form.Item>
                            <Form.Item label="展示名称">
                                {getFieldDecorator('showName', {
                                    initialValue: itemShow ? ruleForm.name : '',
                                    rules: [
                                        {
                                            required: true,
                                            max: 6,
                                            message: '请输入少于6字符的展示名称',

                                        },
                                    ],
                                })(<Input placeholder="该地址用于其前端页面的展示名称" maxLength={6} allowClear />)}
                            </Form.Item>
                            <Form.Item label="统计范围">
                                {getFieldDecorator('distance', {
                                    initialValue: `${itemShow ? ruleForm.distance / 1000 : '0'}KM`,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择统计范围',
                                        },
                                    ],
                                })(
                                    <Select onChange={(e) => this.getValue(e)} style={{ width: 160 }}>
                                        {
                                            km_select.map((item, index) => {
                                                return <Option key={index} value={item.value}>{item.value + "KM"}</Option>
                                            })
                                        }
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item label="是否有效">
                                {getFieldDecorator('status', {
                                    initialValue: itemShow && ruleForm.status,
                                    rules: [{ required: true, message: '请选择状态' }]
                                })(
                                    <Select style={{ width: 160 }} onChange={(e) => this.getEffect(e)} >
                                        {
                                            map_valiable.map((item, index) => {
                                                return <Option key={index} value={item.id}>{item.value}</Option>
                                            })
                                        }
                                    </Select>
                                )}
                            </Form.Item>

                        </Form>



                    </Modal>
                </div>



            </div>
        )
    }

}

const map_Form = Form.create()(Map)
export default map_Form