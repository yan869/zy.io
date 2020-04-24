import React from 'react';
import "@/styles/Sendorders.less";
import { Input, Button, Table, Tag, DatePicker, Form, Avatar } from 'antd'
import { parFilter, withdrawStatus } from '@/utils';
const { RangePicker } = DatePicker;
const withdraw_status = withdrawStatus();
class Reject extends React.Component {
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
				status: 1
			},
			loading: true,
			loadingSub: false
		}
	}
	componentDidMount() {
		this.getList();
	}
	async getList() {
		let params = parFilter(this.state.params);
		const { errCode, data, total } = await this.$api.comm.cashrecordSearch(params);
		if (errCode === 0) {
			this.setState({
				tableData: { data, total },
				loading: false,
				loadingSub: false
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
	// 清空
	cancelContent = () => {
		this.props.form.resetFields();
	}

	render() {
		const columns = [
			{
				title: '微信头像',
				dataIndex: 'avataimg',
				key: 'avataimg',
				align:"center",
				width: 90,
				render: (url) => (
					<Avatar shape="square" size={64} icon="user" src={url}></Avatar>
				)
			},
			{
				title: '微信昵称',
				dataIndex: 'nickName',
				key: 'nickName',
				align:"center",
				width: 90,
			},
			{
				title: '电话',
				dataIndex: 'phone',
				align:"center",
				width: 90,
				key: 'phone',
			},
			{
				title: '支付宝实名',
				dataIndex: 'alipayname',
				align:"center",
				width: 90,
				key: 'alipayname',
			},
			{
				title: '支付宝账号',
				dataIndex: 'alipay',
				align:"center",
				width: 90,
				key: 'alipay',
			},
			{
				title: '申请时间',
				key: 'createtime',
				align:"center",
				width: 120,
				dataIndex: 'createtime'
			},
			{
				title: '提现金额',
				dataIndex: 'money',
				align:"center",
				width: 90,
				key: 'money',
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
				align:"center",
				width: 90,
				key: 'status',
				render: (status) => {
					let value = '', color = '';
					withdraw_status.some(item => {
						if (item.id === status) {
							value = item.value;
							color = item.color;
							return true;
						}
					})
					return <Tag color={color}>{value}</Tag>
				}
			},
			{
				title: '审核时间',
				align:"center",
				width: 120,
				dataIndex: 'shenhetime',
				key: 'shenhetime'
			},
			{
				title: '拒绝理由',
				align:"center",
				width: 90,
				dataIndex: 'rejectreason',
				key: 'rejectreason'
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
						<Button style={{ margin: "0 13px" }} type="default" onClick={this.cancelContent} loading={this.state.loadingSub}>重置</Button>

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
				</div>
			</div>
		)
	}
}

const Reject_From = Form.create()(Reject);

export default Reject_From