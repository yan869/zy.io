import { parFilter } from '@/utils'
import React from "react";
import { withRouter } from "react-router-dom";
import ReactEcharts from 'echarts-for-react';
import echartTheme from '../../assets/js/echartTheme'
import echarts from 'echarts/lib/echarts';
import { connect } from 'react-redux'
import { MenuList } from '@/redux/action'

// 引入饼图和折线图
import 'echarts/lib/chart/bar'
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
import { Card, Button, Row, Col, List, Modal, Table, message } from 'antd';
import { createHashHistory } from 'history';  // hash路由
import { createBrowserHistory } from 'history';  // history路由
import '@/styles/index.less';
import "@/styles/info.less";
const history = createHashHistory()
class Info extends React.Component {
    constructor(props) {
        super(props)
        // console.log(this.props);

        this.state = {
            info: {},
            year: '',
            params: {
                page: 1,
                limit: 10
            },
            avg: '',
            title: "平台数据汇总",
            tableData: [],
            teamData: [],
            success: false
        }
        this.toAudit = this.toAudit.bind(this)
    }
    componentDidMount() {
        this.getHomeInfo();
        this.getTeamInfo();
        echarts.registerTheme('tzzy', echartTheme);
    }
    // 获取管理员权限信息
    async getHomeInfo() {
        let params = parFilter(this.state.params);
        const { errCode, data } = await this.$api.comm.getHomeInfo(params);
        let date = new Date()
        let year = date.getFullYear()
        if (errCode == 0) {
            this.setState({
                info: data,
                year: year,
            })
        }
    }
    // 获取团队管理人权限信息
    async getTeamInfo() {
        const { errCode, data, errMsg } = await this.$api.comm.teamAll();
        if (errCode == 0) {
            this.setState({
                teamData: data,
                success: true
            })
        } else {
            // message.error(errMsg)
        }
    }
    // 获取参数
    getOption() {
        let option = {
            title: {
                text: '评论评分图'
            },

            legend: {
                backgroundColor: '#FFFFFF',
                color: '#5475f5',
                orient: 'vertical',
                left: 'center',
            },
            toolbox: {

                show: true,

                feature: {

                    saveAsImage: {

                        show: true,

                        excludeComponents: ['toolbox'],

                        pixelRatio: 2

                    }

                }
            },
            data: ["评论星级/人数"],
            tooltip: {
                trigger: 'item',
                backgroundColor: 'gray',  //鼠标移动到图上面时，显示的背景颜色
            },
            radar: {
                indicator: [
                    { text: '1星', max: 50 },
                    { text: '2星', max: 50 },
                    { text: '3星', max: 50 },
                    { text: '4星', max: 50 },
                    { text: '5星', max: 50 }
                ],
                radius: 120,
                center: ['50%', '60%'],
            },
            series: {
                type: 'radar',
                areaStyle: {},
                data: [
                    {
                        value: [this.state.info.star1, this.state.info.star2, this.state.info.star3, this.state.info.star4, this.state.info.star5],
                        name: '评论星级人数',
                        label: {
                            show: true,
                            formatter: function (params) {
                                return params.value;
                            }
                        }
                    },
                ]
            },
            calculable: true,

        }
        return option
    }
    getOption1() {
        let option = {
            title: {
                text: '评论平均分'
            },
            tooltip: {
                formatter: "{a} <br/>{b} : {c}分"
            },
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: {
                        show: true,
                        excludeComponents: ['toolbox'],
                        pixelRatio: 2,
                    },
                    featureTitle: {
                        saveAsImage: "保存图片"
                    }
                }
            },
            series: [{
                name: '评论平均分',
                type: 'gauge',
                min: 0,
                max: 5,
                detail: { formatter: '{value}分' },
                data: [{ value: this.state.info.countAvgLevel, name: '评论平均分' }]
            }]
        }
        return option


    }
    // 获取团队关系数据
    getOption2() {
        let info = this.state.success && this.state.teamData

        console.log(info);
        let option = {
            title: {
                text: '团队管理人数据信息'
            },
            series: [{
                name: '树图',
                type: 'tree',
                orient: 'vertical',//垂直方向
                rootLocation: { x: 100, y: '60%' },//根节点位置
                nodePadding: 20,//节点间距
                symbol: 'circle',
                top: "40%",
                symbolSize: 40,
                itemStyle: {
                    backgroundColor: "red",
                    normal: {
                        label: {
                            show: true,
                            position: 'inside',
                            textStyle: {
                                color: '#fff',
                                fontSize: 15,
                                fontWeight: 'bolder',
                            }
                        },
                        borderType: 'solid', //图形描边类型，默认为实线，支持 'solid'（实线）, 'dashed'(虚线), 'dotted'（点线）。
                        borderColor: '#fff', //设置图形边框为淡金色,透明度为0.4
                        borderWidth: 2, //图形的描边线宽。为 0 时无描边。
                        opacity: 1,
                        borderRadius:'80%',
                        lineStyle: {
                            color: '#000',
                            width: 1,
                            borderRadius:10,
                            type: 'solid' // 'curve'|'broken'|'solid'|'dotted'|'dashed'
                        }
                    }
                },
                data: [
                    {
                        name: `团队管理人`,
                        value: 6,
                        symbolSize: [100, 60],
                        symbol: 'https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1925436222,738093984&fm=111&gp=0.jpg',
                        itemStyle: {
                            normal: {
                                
                                label: {
                                    show: true,
                                    position: 'top',
                                   
                                }
                            },
                            color: '#F70968',
                            
                        },
                        children: [
                            {
                                name: `成员人数:${info.workerNumber ? info.workerNumber : 0}`,
                                value: 4,
                                symbol: 'https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1925436222,738093984&fm=111&gp=0.jpg',
                                itemStyle: {
                                    normal: {
                                        label: {
                                            show: true,
                                            position: 'bottom'
                                        }
                                    },
                                    color: "#FB8CB9"
                                },
                                symbolSize: [120, 60],
                            },
                            {
                                name: `订单接单数:${info.orderNumber ? info.orderNumber : 0}`,
                                symbol: 'https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1925436222,738093984&fm=111&gp=0.jpg',
                                symbolSize: [120, 60],
                                itemStyle: {
                                    normal: {
                                        label: {
                                            show: false
                                        }

                                    },
                                    color: '#D4A3F5'
                                },
                                value: 4
                            },
                            {
                                name: `定单总金额:￥${info.orderMoney ? info.orderMoney : 0}`,
                                symbol: 'https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1925436222,738093984&fm=111&gp=0.jpg',
                                symbolSize: [160, 60],
                                itemStyle: {
                                    normal: {
                                        label: {
                                            show: false
                                        }

                                    },
                                    backgroundColor: '#9DC3FC',
                                    color: '#F70968'
                                },
                                value: 2
                            },
                            {
                                name: `订单提现金额:￥${info.reflectMoney ? info.reflectMoney : 0}`,
                                symbol: 'https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1925436222,738093984&fm=111&gp=0.jpg',
                                symbolSize: [160, 60],
                                itemStyle: {
                                    normal: {
                                        label: {
                                            show: false
                                        }

                                    },
                                    color: '#E61A1A'
                                },
                                value: 2
                            }
                        ]
                    }
                ]

            }]
        }
        return option
    }
    // 仪表盘

    toAudit = () => {
        history.push("/certificates/auditor")
    }
    withward = () => {
        history.push("/certificates/selectcert");
    }
    toComment = () => {
        history.push("/user/operator")
    }
    render() {
        // 表格
        const isteam = JSON.parse(sessionStorage.getItem('team'))
        const { info } = this.state
        return (
            <div className="container">
                <div className="main-container" style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                }} >
                    {isteam ? <div style={{ padding: '20px', width: '100%', height: '100%' }}>
                        {this.state.success && <ReactEcharts option={this.getOption2()} theme="Imooc" notMerge={true} lazyUpdate={true} style={{ width: '90%', height: '90%' }} />}
                    </div> : <div style={{ padding: '0 20px' }}>
                            <div className="main-content" style={{ padding: '10px 0' }}>

                                <div style={{ display: "flex", justifyContent: "space-between", width: "90%", margin: "0 auto" }}>
                                    <Card title="待审核证书数" className='card' bordered={false} style={{ width: 300 }}>
                                        <div className="item">
                                            {info.numberOfCertificatesToBeAudited}
                                        </div>
                                        <p>
                                            <Button onClick={this.toAudit}>立即前往</Button>
                                        </p>

                                    </Card><Card title="待审核提现数" className='card' bordered={false} style={{ width: 300 }}>
                                        <div className="item">
                                            {info.withdrawalToBeReviewed}

                                        </div>
                                        <p>
                                            <Button onClick={this.withward}>立即前往</Button>
                                        </p>

                                    </Card>
                                    <Card title="作业违约数" className='card' bordered={false} style={{ width: 300 }}>
                                        <div className="item">
                                            {info.numberOfCommentsToBeReviewed}
                                        </div>
                                        <p>
                                            <Button onClick={this.toComment}>立即前往</Button>
                                        </p>
                                    </Card>
                                </div>

                            </div>
                            <Row style={{ width: "90%", display: 'flex', justifyContent: 'space-between', margin: "0 auto" }}>
                                <Col
                                    style={{ width: '50%', margin: '10px 0 20px 10px' }} >
                                    <Card bordered={false} style={{ borderRadius: 20 }}>
                                        <ReactEcharts option={this.getOption()} theme="Imooc" notMerge={true} lazyUpdate={true} style={{ height: 400 }} />
                                    </Card>
                                </Col>
                                <Col
                                    style={{ width: '50%', margin: '10px 0 20px 10px' }} >
                                    <Card bordered={false} style={{ borderRadius: 20 }}>
                                        <ReactEcharts option={this.getOption1()} theme="Imooc" notMerge={true} lazyUpdate={true} style={{ height: 400 }} />
                                    </Card>
                                </Col>
                            </Row>
                            <div className="today" style={{ width: "86%", margin: "0 auto" }}>
                                <table>
                                    <thead className="title" style={{ width: "100%", margin: "0 auto", display: "flex", justifyContent: "center", alignItems: "center" }}><tr><td>{this.state.title}</td></tr></thead>
                                    <tbody>
                                        <tr style={{ backgroundColor: "rgb(250, 250, 250)", color: "rgba(0, 0, 0, 0.85)", fontWeight: 500 }}>
                                            <td><div style={{ color: "white" }}>
                                            </div></td>
                                            <td>作业人员数</td>
                                            <td>用户数</td>
                                            <td>订单数</td>
                                            <td>订单金额</td>
                                            <td >提现金额</td>
                                        </tr>
                                        <tr>
                                            <td>日/活动</td>
                                            <td>{info.workerToday ? info.workerToday : 0}</td>
                                            <td>{info.userToday ? info.userToday : 0}</td>
                                            <td>{info.orderToday ? info.orderToday : 0}</td>
                                            <td>￥{info.orderMoneyToday ? (info.orderMoneyToday * 1).toFixed(2) : "0.00"}</td>
                                            <td>￥{info.withdrawalToday ? (info.withdrawalToday).toFixed(2) : "0.00"}</td>

                                        </tr>
                                        <tr>
                                            <td>周/活动</td>
                                            <td>{info.workerWeek ? info.workerWeek : 0}</td>
                                            <td>{info.userWeek ? info.userWeek : 0}</td>
                                            <td>{info.orderWeek ? info.orderWeek : 0}</td>
                                            <td>￥{info.orderMoneyWeek ? (info.orderMoneyWeek * 1).toFixed(2) : "0.00"}</td>
                                            <td>￥{info.swCashrecordWeek ? (info.swCashrecordWeek).toFixed(2) : "0.00"}</td>


                                        </tr>
                                        <tr>
                                            <td>月/活动</td>
                                            <td>{info.workerMonth ? info.workerMonth : 0}</td>
                                            <td>{info.userMonth ? info.userMonth : 0}</td>
                                            <td>{info.ordeMonth ? info.orderMonth : 0}</td>
                                            <td>￥{info.orderMoneyMonth ? (info.orderMoneyMonth * 1).toFixed(2) : "0.00"}</td>
                                            <td>￥{info.swCashrecordMonth ? (info.swCashrecordMonth).toFixed(2) : "0.00"}</td>
                                        </tr>
                                        <tr>
                                            <td>{this.state.year}年/活动</td>
                                            <td>{info.workerYear ? info.workerYear : 0}</td>
                                            <td>{info.userYear ? info.userYear : 0}</td>
                                            <td>{info.orderYear ? info.orderYear : 0}</td>
                                            <td>￥{info.orderMoneyYear ? (info.orderMoneyYear * 1).toFixed(2) : "0.00"}</td>
                                            <td>￥{info.swCashrecordYear ? (info.swCashrecordYear).toFixed(2) : "0.00"}</td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    }
                </div>
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        MenuList: state.MenuList,
        treePost: state.treePost
    }
};
export default connect(mapStateToProps)(Info)