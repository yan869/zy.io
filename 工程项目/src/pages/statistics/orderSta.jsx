import React from 'react';
import { Row, Col, Card } from 'antd';
import ReactEcharts from 'echarts-for-react';
import echartTheme from '../../assets/js/echartTheme'
import echarts from 'echarts/lib/echarts'
// 引入雷达图
import 'echarts/lib/chart/radar'
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
import "@/styles/info.less";
class OrderSta extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			columnarData: [],//柱状数据
			lineValue: [],//折线X轴
			lineData: [],//折线Y轴
			pieData: [],
			totalMoney: 0
		};
	}
	componentWillMount() {
		echarts.registerTheme('tzzy', echartTheme);
		this.getDataValue()
	}
	async getDataValue() {
		const { errCode, data } = await this.$api.comm.orderCountAll();
		if (errCode === 0) {
			let {todayData, yesterdayData, sevenDaysAgoData, toMonthData, monthAgoData, user30Count, orderCount } = data;
			let columnarData = [ todayData, yesterdayData, sevenDaysAgoData, toMonthData, monthAgoData ];
			let { todayDateMoney, yesterdayDateMoney, sevenDaysAgoDateMoney, toMonthDateMoney, monthAgoDateMoney, totalDataMoney } = orderCount;
			let pieData = [
				{ value: todayDateMoney ? todayDateMoney : 0, name: '今天' },
				{ value: yesterdayDateMoney ? yesterdayDateMoney : 0, name: '昨天' },
				{ value: sevenDaysAgoDateMoney ? sevenDaysAgoDateMoney : 0, name: '近七天' },
				{ value: toMonthDateMoney ? toMonthDateMoney : 0, name: '本月' },
				{ value: monthAgoDateMoney ? monthAgoDateMoney : 0, name: '上月' },
			]
			let newLine = [], newCount = [];
			user30Count.map((item, index) => {
				var date = new Date();
				var year = date.getFullYear()
				let count = item.dayCount;
				// console.log(count);

				item = item.day.split(" ")[0].split(`${year}-`)[1];



				newCount.push(count)
				newLine.push(item)
				return { newLine, newCount }
			})
			this.setState({
				columnarData,
				lineValue:newLine,
				lineData:newCount,
				pieData,
				totalMoney: totalDataMoney
			})
		}
	}
	getOption() {
		let option = {
			title: {
				text: `订单统计表 - 总订单量：${this.state.totalData?this.state.totalData:0}`
			},
			color: ['#3398DB'],
			legend: {
				data: ["订单量"],
				x: '70%',      //可设定图例在左、右、居中
				y: 6,
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {            // 坐标轴指示器，坐标轴触发有效
					type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			toolbox: {
				show: true,
				x:"right",
                feature: {
                    saveAsImage: {
                        show: true,
                        excludeComponents: ['toolbox'],
                        pixelRatio: 2,
                    },
                    featureTitle:{
                        saveAsImage:"保存图片"
                    }
                }
            },
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: [
				{
					type: 'category',
					data: ['今日', '昨日', '近七天', '本月', '上月'],
					axisTick: {
						alignWithLabel: true
					}
				}
			],
			yAxis: [
				{
					type: 'value'
				}
			],
			series: [
				{
					name: '订单量',
					type: 'bar',
					label: {
						normal: {
						  	show: true,
						  	position: "top"
						}
					},
					barWidth: '60%',
					data: this.state.columnarData
				}
			]
		};
		return option
	}
	getOption2() {
		let option = {
			title: {
				text: '订单当月折现统计'
			},
			tooltip: {
				trigger: "axis"
			},
			legend: {
				data: ["订单数量"],
				x: '70%',      //可设定图例在左、右、居中
				y: 6,
			},
			toolbox: {
				x:"right",
                show: true,
                feature: {
                    saveAsImage: {
                        show: true,
                        excludeComponents: ['toolbox'],
                        pixelRatio: 2,
                    },
                    featureTitle:{
                        saveAsImage:"保存图片"
                    }
                }
            },
			grid: {
				left: "3%",
				right: "4%",
				bottom: "3%",
				containLabel: true
			},
			xAxis: {
				type: 'category',
				data: this.state.lineValue
			},
			yAxis: {
				type: 'value'
			},
			series: [{
				name: "订单数量",
            	type: "line",
            	stack: "总量",
				data: this.state.lineData
			}]
		};
		return option
	}
	getOption3() {
		let option = {
			title: {
				text: `订单金额统计 - 总金额:${ this.state.totalMoney?this.state.totalMoney:"0.00"}元`,
			},
			tooltip: {
				trigger: 'item',
				formatter: "{a} <br/>{b} : {c} ({d}%)"
			},
			legend: {
				orient: 'vertical',
				left: 'left',
				top:"60px",
				data: ['今天', '昨日', '近七天', '本月', '上月']
			},
			toolbox: {
				x:"right",
                show: true,
                feature: {
                    saveAsImage: {
                        show: true,
                        excludeComponents: ['toolbox'],
                        pixelRatio: 2,
                    },
                    featureTitle:{
                        saveAsImage:"保存图片"
                    }
                }
            },
			series: [
				{
					name: '订单金额',
					type: 'pie',
					radius: '55%',
					center: ['50%', '60%'],
					data: this.state.pieData,
					itemStyle: {
						emphasis: {
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowColor: 'rgba(0, 0, 0, 0.5)'
						}
					}
				}
			]
		};
		return option
	}
	render() {
		return (
			<div className="ke_main">
				<div>
					<Row>
						<Col span={12}>
							<Card bordered={false}>
								<ReactEcharts option={this.getOption()} theme="Imooc" notMerge={true} lazyUpdate={true} style={{ height: 400 }} />
							</Card>
						</Col>
						<Col span={12}>
							<Card bordered={false}>
								<ReactEcharts option={this.getOption2()} theme="Imooc" notMerge={true} lazyUpdate={true} style={{ height: 400 }} />
							</Card>
						</Col>
						<Col span={12}>
							<Card bordered={false}>
								<ReactEcharts option={this.getOption3()} theme="Imooc" notMerge={true} lazyUpdate={true} style={{ height: 400 }} />
							</Card>
						</Col>
					</Row>
				</div>
			</div>
		)
	}
}

export default OrderSta