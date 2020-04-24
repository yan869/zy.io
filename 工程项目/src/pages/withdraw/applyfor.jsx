import React from 'react';
import "@/styles/Sendorders.less";
import "@/styles/applyfor.less";
import FileSaver from 'file-saver';
import { Input, Button, Table, Icon, Tag, Form, Avatar, Modal, message, DatePicker } from 'antd';
import { parFilter, withdrawStatus } from '@/utils';
const { TextArea } = Input;
const { confirm } = Modal;
const { RangePicker } = DatePicker;
const withdraw_status = withdrawStatus();
class Applyfor extends React.Component {
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
				status: 0
			},
			visible: false,
			loading: true,
			loadingSub: false,
			confirmLoading: false,
			ruleForm: {},
			isDownLoad: false,
		}
	}
	componentDidMount() {
		this.getList();
	}
	//获取列表
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
	//改变limit
	async onShowSizeChange(current, size) {
		let params = Object.assign({}, this.state.params, { page: 1, limit: size });
		await this.setState({ params, loading: true });
		this.getList();
	}
	//监听拒绝理由
	getReason(e) {
		let ruleForm = Object.assign({}, this.state.ruleForm, { rejectreason: e.target.value });
		this.setState({
			ruleForm
		})
	}
	//通过
	async handleTonguo(id) {
		confirm({
			title: '通过提现',
			centered: true,
			content: '是否继续通过提现审核?',
			okText: "通过",
			cancelText: "取消",
			onOk: async () => {
				let ruleForm = { id, status: 2 };
				const { errCode, errMsg } = await this.$api.comm.cashrecordAudit(ruleForm);
				if (errCode === 0) {
					message.success('通过成功！');
				} else {
					message.error(errMsg);
				}
			},
			onCancel() { }
		})
	}
	//提交拒绝
	async handleOk() {
		let { ruleForm } = this.state;
		if (!ruleForm.rejectreason) {
			message.warning('请输入拒绝理由');
			return
		}
		await this.setState({ confirmLoading: true });
		const { errCode, errMsg } = await this.$api.comm.cashrecordAudit(ruleForm);
		if (errCode === 0) {
			message.success('提交成功！');
		} else {
			message.error(errMsg);
		}
		this.setState({ confirmLoading: false, visible: false });
	}
	//拒绝
	handConcel(id, isPase) {
		let ruleForm = {}, visible = this.state.visible;
		if (isPase) {
			ruleForm = Object.assign({}, this.state.ruleForm, { id, status: 1 });
		}
		this.setState({ ruleForm, visible: !visible });
	}
	// 重置
	// 清空
	cancelContent = () => {
		this.props.form.resetFields();
	}
	// 导出csv数据
	downloadCsv = (data) => {


		let str = "微信头像,微信昵称,电话,支付宝实名,支付宝账号,申请时间,提现金额,提现状态"//表头
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
				data[i].nickName + ',' +
				data[i].phone + ',' +
				data[i].alipayname + ',' +
				data[i].alipay + ',' +
				data[i].createtime + ',' +
				data[i].money + ',' +
				eStatus
		}
		//Excel打开后中文乱码添加如下字符串解决
		let exportContent = "\uFEFF";
		let blob = new Blob([exportContent + str], {
			type: "text/plain;charset=utf-8"
		});
		FileSaver.saveAs(blob, "提现申请列表.csv");
		// }
	}
	render() {
		const columns = [
			{
				title: '微信头像',
				dataIndex: 'avataimg',
				key: 'avataimg',
				width: 90,
				align:"center",
				render: (url) => (
					<Avatar shape="square" size={64} icon="user" src={url}></Avatar>
				)
			},
			{
				title: '微信昵称',
				width: 90,
				dataIndex: 'nickName',
				key: 'nickName',
				align:"center",

			},
			{
				title: '电话',
				width: 120,
				dataIndex: 'phone',
				align:"center",
				key: 'phone',
			},
			{
				title: '支付宝实名',
				width: 90,
				dataIndex: 'alipayname',
				align:"center",
				key: 'alipayname',
			},
			{
				title: '支付宝账号',
				align:"center",
				width: 120,
				dataIndex: 'alipay',
				key: 'alipay',
			},
			{
				title: '申请时间',
				key: 'createtime',
				align:"center",
				dataIndex: 'createtime'
			},
			{
				title: '提现金额',
				align:"center",
				dataIndex: 'money',
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
				align:"center",
				dataIndex: 'status',
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
				title: '操作',
				align:"center",
				dataIndex: 'id',
				key: 'id',
				width: 120,
				render: (id, row) => (
					<div className="btn">
						<Tag color="#67C23A"className="btn1" onClick={() => { this.handleTonguo(id) }}>通过</Tag>
						<Tag color="#F56C6C" className="btn1" onClick={() => { this.handConcel(id, true) }}>拒绝</Tag>
					</div>
				),
			},
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
				{/* 导出 */}
				<div className="btn2">
					<Button className="btn1" onClick={async () => {
						await this.setState({
							isDownLoad: true
						})
						await this.getList();
						this.downloadCsv(this.state.tableData.data)
					}}><Icon type="download" /> 导出</Button>
				</div>




				<Modal
					title="请输入拒绝理由"
					centered
					confirmLoading={this.state.confirmLoading}
					visible={this.state.visible}
					onOk={() => this.handleOk()}
					onCancel={() => this.handConcel()}
					okText="提交"
					cancelText="取消"
				>
					<TextArea rows={4} onChange={(e) => { this.getReason(e) }} allowClear placeholder="请输入拒绝理由"></TextArea>
				</Modal>
			</div>
		)
	}
}

const Applyfor_From = Form.create()(Applyfor);

export default Applyfor_From