import React from 'react';
import { Row, Col, Card } from 'antd';
import ReactEcharts from 'echarts-for-react';
import echartTheme from '../../assets/js/echartTheme'
import echarts from 'echarts/lib/echarts'
// 引入饼图和折线图
import 'echarts/lib/chart/bar'
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';

import "@/styles/info.less";

class MoneySta extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			wirColumnarData: [],
			totalWithdrawMoney: 0,
			totalPayMoney: 0,
			payColumnarData: [],
			payThirtyLine: [],
			paydayCount: [],
			withdrawThirtyLine: [],
			withdrawdayCount: []
		};
	}
	componentWillMount() {
		echarts.registerTheme('tzzy', echartTheme);
		this.getDataValue();
		this.getPayData();
	}
	//提现统计
	async getDataValue() {
		const { errCode, data } = await this.$api.comm.withdrawalAll();
		if (errCode === 0) {
			let { todayDateMoney, yesterdayDateMoney, sevenDaysAgoDateMoney, toMonthDateMoney, monthAgoDateMoney, totalDataMoney, thirtyLine } = data;
			let wirColumnarData = [
				todayDateMoney ? todayDateMoney : 0,
				yesterdayDateMoney ? yesterdayDateMoney : 0,
				sevenDaysAgoDateMoney ? sevenDaysAgoDateMoney : 0,
				toMonthDateMoney ? toMonthDateMoney : 0,
				monthAgoDateMoney ? monthAgoDateMoney : 0,
				totalDataMoney ? totalDataMoney : 0
			]
			let newLine = []
			let newCount = []
			thirtyLine.map((item, index) => {
				var date = new Date();
				var year = date.getFullYear()
				let count = item.dayCount;
				// console.log(count);

				item = item.day.split(" ")[0].split(`${year}-`)[1];



				newCount.push(count)
				newLine.push(item)
				return { newLine, newCount }
			})

			// console.log(newLine, newCount);
			this.setState({ wirColumnarData, totalWithdrawMoney: totalDataMoney, withdrawThirtyLine: newLine, withdrawdayCount: newCount });
		}
	}
	//支付统计
	async getPayData() {
		const { errCode, data } = await this.$api.comm.payAll();
		if (errCode === 0) {
			let { todayDateMoney, yesterdayDateMoney, sevenDaysAgoDateMoney, toMonthDateMoney, monthAgoDateMoney, totalDataMoney, thirtyLine } = data;
			let payColumnarData = [
				todayDateMoney ? todayDateMoney : 0,
				yesterdayDateMoney ? yesterdayDateMoney : 0,
				sevenDaysAgoDateMoney ? sevenDaysAgoDateMoney : 0,
				toMonthDateMoney ? toMonthDateMoney : 0,
				monthAgoDateMoney ? monthAgoDateMoney : 0,
				totalDataMoney ? totalDataMoney : 0
			]
			let newLine = []
			let newCount = []
			thirtyLine.map((item, index) => {
				var date = new Date();
				var year = date.getFullYear()
				let count = item.dayCount;
				// console.log(count);

				item = item.day.split(" ")[0].split(`${year}-`)[1];



				newCount.push(count)
				newLine.push(item)
				return { newLine, newCount }
			})

			// console.log(newLine, newCount);

			this.setState({ payColumnarData, totalPayMoney: totalDataMoney, payThirtyLine: newLine, paydayCount: newCount });
		}
	}
	getOption() {
		// console.log(this.state.totalWithdrawMoney);

		let option = {
			title: {
				text: `提现统计表-总金额：${this.state.totalWithdrawMoney}元`
			},
			color: ['#3398DB'],
			tooltip: {
				trigger: 'axis',
				axisPointer: {            // 坐标轴指示器，坐标轴触发有效
					type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			legend: {
				data: ["提现金额"],
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
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: [
				{
					type: 'category',
					data: ['今天', '昨天', '七天', '本月', '上个月'],
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
					name: '提现金额',
					type: 'bar',
					barWidth: '60%',
					label: {
						normal: {
							show: true,
							position: "top"
						}
					},
					data: this.state.wirColumnarData
				}
			]
		};
		return option
	}
	getOption1() {
		let option = {
			title: {
				text: '当月提现折现统计'
			},
			legend: {
				data: ["提现折现金额"],
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
			xAxis: {
				type: 'category',
				data: this.state.withdrawThirtyLine,

			},
			yAxis: {
				type: 'value',

			},
			series: [{
				name:"提现折现金额",
				data: this.state.withdrawdayCount,
				label: {
					normal: {
						show: true,
						position: "top"
					}
				},
				type: 'line'
			}]
		};
		return option
	}
	getOption2() {
		let option = {
			title: {
				text: '当月支付折现统计'
			},
			tooltip: {
				trigger: "axis"
			},
			legend: {
				data: ["支付折现金额"],
				x: '70%',      //可设定图例在左、右、居中   //可设定图例在左、右、居中
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
			xAxis: {
				type: 'category',
				data: this.state.payThirtyLine,

			},
			yAxis: {
				type: 'value',

			},
			series: [{
				data: this.state.paydayCount,
				stack: "总量",
				name: "支付折现金额",
				label: {
					normal: {
						show: false,
						position: "top"
					}
				},
				type: 'line'
			}]
		};
		return option
	}
	getOption3() {
		let option = {
			title: {
				text: `支付统计表-总金额:${this.state.totalPayMoney}元`
			},
			color: ['#3398DB'],
			tooltip: {
				trigger: 'axis',
				axisPointer: {            // 坐标轴指示器，坐标轴触发有效
					type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			legend: {
				data: ["支付金额"],
				x: '70%',      //可设定图例在左、右、居中
				y: 6,
			},
			toolbox: {
				x:"right",
				color : ['#1e90ff'],
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
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: [
				{
					type: 'category',
					data: ['今天', '昨天', '近七天', '本月', '上月'],
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
					name: '支付金额',
					type: 'bar',
					barWidth: '60%',
					label: {
						normal: {
							show: true,
							position: "top"
						}
					},
					data: this.state.payColumnarData
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
								<ReactEcharts option={this.getOption1()} theme="Imooc" notMerge={true} lazyUpdate={true} style={{ height: 400 }} />
							</Card>
						</Col>
						<Col span={12}>
							<Card bordered={false}>
								<ReactEcharts option={this.getOption3()} theme="Imooc" notMerge={true} lazyUpdate={true} style={{ height: 400 }} />
							</Card>
						</Col>
						<Col span={12}>
							<Card bordered={false}>
								<ReactEcharts option={this.getOption2()} theme="Imooc" notMerge={true} lazyUpdate={true} style={{ height: 400 }} />
							</Card>
						</Col>

					</Row>
				</div>
			</div>
		)
	}
}

export default MoneySta