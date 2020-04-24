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

class workSta extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			columnarData: [],
			totalData: 0,
			params: {
				page: 1,
				limit: 10,
			},
			workThirtyLine: [],
			workdayCount: [],
			nameList:[],
			dataList:[]
		};
	}
	componentWillMount() {
		echarts.registerTheme('tzzy', echartTheme);
		this.getDataValue();	
		this.getCategory()
	}
	async getDataValue(){
		const { errCode, data } = await this.$api.comm.workerCountAll();
		if(errCode === 0){
			let { totalData, todayData, yesterdayData, sevenDaysAgoData, toMonthData, monthAgoData, user30Count } = data;
			let columnarData = [
				todayData ? todayData : 0,
				yesterdayData ? yesterdayData : 0,
				sevenDaysAgoData ? sevenDaysAgoData : 0,
				toMonthData ? toMonthData : 0,
				monthAgoData ? monthAgoData : 0
			]
			let newLine = []
			let newCount = []
			user30Count.map((item, index) => {
				var date = new Date();
				var year = date.getFullYear()
				let count = item.dayCount;
				item = item.day.split(" ")[0].split(`${year}-`)[1];



				newCount.push(count)
				newLine.push(item)
				return { newLine, newCount }
			})
			this.setState({ columnarData, totalData: totalData ? totalData : 0,workThirtyLine:newLine,workdayCount:newCount });
		}
	}
	// 获取工种数据
	async getCategory() {
		const { errCode, data } = await this.$api.comm.getParServicecategoryList(this.state.params);
		let nameList = []
		let dataList=[]
		data.map((item) => {
			nameList.push(item.name)
			dataList.push({value:item.id,name:item.name})
		})
		if (errCode === 0) {

			this.setState({
				catrgoryData: data,
				nameList,
				dataList
			})
		}
	}

	getOption() {
		let option = {
			title: {
				text: `作业员统计表 - 总数: ${ this.state.totalData }`
			},
			color: ['#3398DB'],
			tooltip: {
				trigger: 'axis',
				axisPointer: {            // 坐标轴指示器，坐标轴触发有效
					type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			legend: {
				data: ["作业员人数"],
				x: '70%',      //可设定图例在左、右、居中
				y: 6,
			},
		
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
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
				{	min:0,
					max:50,
					interval:10,
					type: 'value'
				}
			],
			series: [
				{
					name: '作业员人数',
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
			legend: {
				data: ["作业员人数"],
				x: '70%',      //可设定图例在左、右、居中
				y: 6,
			},
			tooltip: {
				trigger: "axis"
			},
			xAxis: {
				type: 'category',
				data: this.state.workThirtyLine
			},
			yAxis: {
				type: 'value'
			},
			toolbox: {
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
			series: [{
				data: this.state.workdayCount,
				name: "作业员人数",
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
	getOption3() {
		let option = {
			title: {
				text: '某站点用户访问来源',
				subtext: '纯属虚构',
				x: 'center'
			},
			tooltip: {
				trigger: 'item',
				formatter: "{a} <br/>{b} : {c} ({d}%)"
			},
			legend: {
				orient: 'vertical',
				left: 'left',
				data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
			},
			toolbox: {
				x:"right",
                show: true,
                feature: {
                    saveAsImage: {
                        show: true,
                        excludeComponents: ['toolbox'],
						pixelRatio: 2,
						color:["#000"]
                    },
                    featureTitle:{
                        saveAsImage:"保存图片"
                    }
                }
            },
			series: [
				{
					name: '访问来源',
					type: 'pie',
					radius: '55%',
					center: ['50%', '60%'],
					data: [
						{ value: 335, name: '直接访问' },
						{ value: 310, name: '邮件营销' },
						{ value: 234, name: '联盟广告' },
						{ value: 135, name: '视频广告' },
						{ value: 1548, name: '搜索引擎' }
					],
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
	getOption4() {
		let option = {
			title: {
				text: `作业员数据分类 `,
				x: 'center'
			},
			tooltip: {
				trigger: 'item',
				formatter: "{a} <br/>{b} : {c} ({d}%)"
			},
			legend: {
				orient: 'vertical',
				left: 'left',
				data:this.state.nameList
			},
			toolbox: {
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
					name: '作业员类别',
					type: 'pie',
					radius: '55%',
					center: ['50%', '60%'],
					data: this.state.dataList,
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
			<div className="ke_main" style={{width:"100%"}}>
				<div>
					<Row>
					<Col span={12}>
							<Card bordered={false}>
								<ReactEcharts option={this.getOption()} theme="Imooc" notMerge={true} lazyUpdate={true} style={{ height: 500 }} />
							</Card>
						</Col>
						<Col span={12}>
							<Card bordered={false}>
								<ReactEcharts option={this.getOption2()} theme="Imooc" notMerge={true} lazyUpdate={true} style={{ height: 500 }} />
							</Card>
						</Col>
						<Col span={12}>
							<Card bordered={false}>
								<ReactEcharts option={this.getOption4()} theme="Imooc" notMerge={true} lazyUpdate={true} style={{ height: 400 }} />
							</Card>
						</Col>
					</Row>
				</div>
			</div>
		)
	}
}

export default workSta