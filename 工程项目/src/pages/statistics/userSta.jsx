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

class UserSta extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			columnarData: [],
			totalData: 0,
			catrgoryData: [],
			userThirtyLine: [],
			userdayCount: [],
	
		};
	}
	componentWillMount() {
		echarts.registerTheme('tzzy', echartTheme);
		this.getDataValue();
	}
	async getDataValue() {
		const { errCode, data } = await this.$api.comm.userCount();
		if (errCode === 0) {
			let { todayData, yesterdayData, sevenDaysAgoData, toMonthData, monthAgoData, totalData, user30Count } = data;
			let columnarData = [todayData ? todayData : 0, yesterdayData ? yesterdayData : 0, sevenDaysAgoData ? sevenDaysAgoData : 0, toMonthData ? toMonthData : 0, monthAgoData ? monthAgoData : 0,];
			let newLine = []
			let newCount = []
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
			this.setState({ columnarData, totalData, userThirtyLine: newLine, userdayCount: newCount });
		}
	}
	
	getOption() {
		let option = {
			title: {
				text: `用户统计表 - 总数: ${this.state.totalData}`
			},
			legend: {
				data: ["用户人数"],
				x: '70%',      //可设定图例在左、右、居中
				y: 6,
			},
			tooltip: {
				trigger: 'axis',//鼠标移动到图上面时，显示的背景颜色
				axisPointer: {            // 坐标轴指示器，坐标轴触发有效
					type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				},
			},
			toolbox: {
				show: true,
				x:"right",
				y:"top",
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
					min: 0,
					max: 50,
					interval: 10,
					type: 'value'
				}
			],
			series: [
				{
					name: '用户人数',
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
				text: '用户当月折现统计'
			},
			tooltip: {
				trigger: "axis"
			},
			legend: {
				data: ["用户人数"],
				x: '70%',      //可设定图例在左、右、居中
				y: 6,
			},
			xAxis: {
				type: 'category',
				data: this.state.userThirtyLine,
			},
			yAxis: {
				type: 'value'
			},
			toolbox: {
				show: true,
				color:"#000",
				marginLeft:20,
				x:"right",
				y:'top',
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
			series: [{
				data: this.state.userdayCount,
				name: "用户人数",
				stack: "总量",
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
	
	render() {
	return (
			<div className="ke_main" >
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
					
					</Row>
				</div>
			</div>
		)
	}
}

export default UserSta