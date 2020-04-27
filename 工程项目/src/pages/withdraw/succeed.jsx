import React from 'react';
import "@/styles/Sendorders.less";
import FileSaver from 'file-saver';
import { Input, Button, Table, Icon, Tag, DatePicker, Form, Avatar } from 'antd';
import { parFilter, withdrawStatus } from '@/utils';
const { RangePicker } = DatePicker;
const withdraw_status = withdrawStatus();
class Succeed extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			tableData: {
				data: [],
				total: 0
			},
			params: {
				page: 1,
				limit: 10,
				status: 2
			},
			exportData:[],
			loading: true,
			loadingSub: false,
			isDownLoad: false,
		}
	}
	componentDidMount() {
		this.getList();
	}
	async getList() {
		let params = parFilter(this.state.params);
		let par = { page: 1,status:2 }
		let param = await this.state.isDownLoad ? par : params
		const { errCode, data, total }=await this.$api.comm.cashrecordSearch(param);
		if (errCode === 0) {
			this.setState({
				tableData: { data, total },
				loading: false,
				exportData:data,
				loadingSub: false,
			})
		}
	}
	//查询
	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFields(async (err, values) => {
			let { alipay, timer } = values;
			let strBeginTime = "", strEndTime = "";
			if (timer && timer.length > 0) {
				strBeginTime = timer[0].format('YYYY-MM-DD HH:mm:ss');
				strEndTime = timer[1].format('YYYY-MM-DD HH:mm:ss');
			}
			let params = Object.assign({}, this.state.params, { page: 1, alipay, strBeginTime, strEndTime });
			await this.setState({ params, loadingSub: true });
			this.getList();
		})
	}
	//改变page
	async pageChange(page) {
		let params = Object.assign({}, this.state.params, { page });
		await this.setState({ params, loading: true });
		this.getList();
	}
	//改版limit
	async onShowSizeChange(current, size) {
		let params = Object.assign({}, this.state.params, { page: 1, limit: size });
		await this.setState({ params, loading: true });
		this.getList();
	}
	// 导出列表
	downloadCsv = (data) => {
		console.log(data);
		let str = "微信头像,微信昵称,电话,支付宝实名,支付宝账号,申请时间,提现金额,提现状态,通过时间"
		for (const i in data) {
			// 判断申请状态
			let eStatus = '';
			if (data[i].status === 0) {
				eStatus = '待处理'
			} else if (data[i].status === 1) {
				eStatus = '已拒绝'
			} else if (data[i].status === 2) {
				eStatus = '已转账'
			} else if (data[i].status === 3) {
				eStatus = '转账失败'
			}
			
			str += '\n' +
				data[i].avataimg + ',' +
				data[i].nickName + ',' +"\t"+
				data[i].phone + ',' +
				data[i].alipayname + ',' +
				data[i].alipay + ',' +"\t"+
				data[i].createtime + ',' +
				data[i].money + ',' +
				eStatus + ','  +"\t"+
				data[i].jiaoyitime
		}
		//Excel打开后中文乱码添加如下字符串解决
		let exportContent = "\uFEFF";
		let blob = new Blob([exportContent + str], {
			type: "text/plain;charset=utf-8"
		});
		FileSaver.saveAs(blob, "提现成功列表.csv");
	}
	// 重置
	cancelContent = () => {
		this.props.form.resetFields();
	  }
	render() {
		const columns = [
			{
				title: '微信头像',
				dataIndex: 'avataimg',
				key: 'avataimg',
				align: "center",
				width: 90,
				render: (url) => (
					<Avatar shape="square" size={64} icon="user" src={url}></Avatar>
				)
			},
			{
				title: '微信昵称',
				dataIndex: 'nickName',
				key: 'nickName',
				align: "center",
				width: 90,
			},
			{
				title: '电话',
				dataIndex: 'phone',
				key: 'phone',
				align: "center",
				width: 120,
			},
			{
				title: '支付宝实名',
				dataIndex: 'alipayname',
				key: 'alipayname',
				align: "center",
				width: 100,
			},
			{
				title: '支付宝账号',
				dataIndex: 'alipay',
				key: 'alipay',
				align: "center",
				width: 120,
			},
			{
				title: '申请时间',
				key: 'createtime',
				dataIndex: 'createtime',
				align: "center",
				width: 150,
			},
			{
				title: '提现金额',
				dataIndex: 'money',
				key: 'money',
				align: "center",
				width: 90,
				render: (money) => {
					if (!money) {
						money = 0;
					}
					return <span>￥{money?money.toFixed(2):"0.00"}</span>
				}
			},
			{
				title: '提现状态',
				dataIndex: 'status',
				align: "center",
				width: 120,
				key: 'status',
				render: (status) => {
					let value = '', color = '';
					withdraw_status.some(item => {
						if (item.id === status) {
							value = item.value;
							color = item.color;
						}
					})
					return <Tag color={color}>{value}</Tag>
				}
			},
			{
				title: '通过时间',
				dataIndex: 'jiaoyitime',
				align: "center",
				width: 120,
				key: 'jiaoyitime'
			}
		];
		const { getFieldDecorator } = this.props.form;
		return (
			<div>
				<Form layout="inline" onSubmit={this.handleSubmit}>
					<Form.Item label="支付宝账号">
						{getFieldDecorator('alipay', {})(<Input allowClear />)}
					</Form.Item>
					<Form.Item label="申请时间">
						{getFieldDecorator('timer', {})(
							<RangePicker />
						)}
					</Form.Item>
					<Form.Item>
						<Button icon="search" type="primary" htmlType="submit" onClick={this.handleSubmit} loading={this.state.loadingSub}>查询</Button>
						<Button style={{ margin: "0 13px" }} type="default" onClick={this.cancelContent} >重置</Button>
						<Button className="btn1"  type="primary" onClick={async () => {
						await this.setState({
							isDownLoad: true
						})
						await this.getList();
						this.downloadCsv(this.state.tableData.data)
					}}><Icon type="download" /> 导出</Button>
					</Form.Item>
				</Form>
				<div className='table-wrapper'>
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
						scroll={{ x: 1200 }}
						rowKey={(record, index) => index}
						size="middle" align="center"
						columns={columns} dataSource={this.state.tableData.data} loading={this.state.loading} />
					{/* 导出 */}
					<div className="btn2">
			
					</div>

				</div>
			</div>
		)
	}
}

const Succeed_From = Form.create()(Succeed);

export default Succeed_From