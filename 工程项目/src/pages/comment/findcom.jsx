import React from 'react';
import "@/styles/Sendorders.less";
import { parFilter, commentRank, checkStatus } from '@/utils';
import Zmage from 'react-zmage'
import { Modal, Button, Table, Tag, DatePicker, Select, Form, Popconfirm, Input, message } from 'antd'
const { confirm } = Modal;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const rankList = commentRank();
const checkList = checkStatus();
class Findcom extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			detailData: {},
			imgList: [],
			tableData: {
				data: [],
				total: 0
			},
			isCHecked: false,
			visible: false,
			listData: [],
			params: {
				page: 1,
				limit: 10,
			},
			loadingSub: false,
			confirmLoading: false,
			isPass: false,
		}
	}
	handleCancel() {
		this.setState({
			visible: false
		})
	}

	componentWillMount() {
		this.getCommentList();
	}
	async getCommentList() {
		let params = parFilter(this.state.params);
		console.log(params);
		const { errCode, data, total } = await this.$api.comm.getCommentList(params)
		if (errCode === 0) {
			this.setState({
				listData: data,
				loading: false,
				loadingSub: false,
				tableData: { data, total }
			})
		} else {

		}

	}

	//改变page
	async pageChange(page) {
		let params = Object.assign({}, this.state.params, { page });
		await this.setState({ params, loading: true });
		console.log(this.state.params);
		this.getCommentList();
	}
	//改变limit
	async onShowSizeChange(current, size) {
		let params = Object.assign({}, this.state.params, { page: 1, limit: size });
		await this.setState({ params, loading: true });
		this.getCommentList();
	}

	// 查询
	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFields(async (err, values) => {
			let { level, delFlag, orderid, strTime } = values;

			let strBeginTime = "", strEndTime = "";
			if (strTime && strTime.length > 0) {
				strBeginTime = strTime[0].format('YYYY-MM-DD HH:mm:ss')
				strEndTime = strTime[1].format('YYYY-MM-DD HH:mm:ss')
			}
			let params = Object.assign({}, this.state.params, { level, delFlag, orderId: orderid * 1, strBeginTime, strEndTime });
			console.log(params);

			await this.setState({ params, loadingSub: true });
			this.getCommentList();
		})

	}

	// 审核通过
	async handleTonguo(id) {
		console.log(id);

		confirm({
			title: '通过评论',
			centered: true,
			content: '是否继续通过评论审核?',
			okText: "通过",
			cancelText: "取消",
			onOk: async () => {
				let ruleForm = { commendId: id, passFlag: 1 };
				const { errCode, errMsg } = await this.$api.comm.commendPassOrReject(ruleForm);
				if (errCode === 0) {
					message.success('通过成功！');

				} else {
					message.error(errMsg);
				}
			},
			onCancel() { }
		})
	}

	//拒绝
	async handConcel(id, isPase) {
		let params = { commendId: id, passFlag: 0 }

		const { errCode } = await this.$api.comm.cashrecordSearch(params);
		if (errCode === 0) {
			message.success('拒绝成功');
		} else {

		}

	}
	async showDetail(row) {
console.log(row);

		let params = Object.assign({}, { commendId: row })
		const { errCode, data } = await this.$api.comm.getCommentDetail(params);
		if (errCode === 0) {
			console.log(data);
			this.setState({
				visible: true,
				detailData: data,
				imgList: data && data.imageList
			})

		}

	}


	// 清空
	cancelContent = () => {
		this.props.form.resetFields();
	}
	// 删除评论
	async handleDelete(id) {
		let params = Object.assign({}, { commendId: id })
		const { errCode} = await this.$api.comm.deleteCommend(params);
		if (errCode === 0) {

			message.success("删除评论成功");
			this.getCommentList();

		} else {
			message.success("删除评论失败")

		}

	}
	// // 操作评论
	isItPass = (key) => {
		this.setState({
			isPass: key.id
		})
		// console.log(key);
	}
	// 操作评论成功
	async handSubmitComment(row) {
		let that = this
		console.log(row);
		let params = { commendId: row.id, passFlag: 1 }
		const { res, errCode} = await this.$api.comm.updateCommend(params);
		console.log(res);

		if (errCode === 0) {
			this.setState({
				isPass: null
			})
			message.success("评论状态修改成功");
			that.getCommentList();
		} else {
			this.setState({
				isPass: null
			})
			message.error("评论状态修改失败")
		}
	}
	// 操作评论拒绝
	async handleReject(row) {
		let that = this
		let params = { commendId: row.id, passFlag: 0 }
		const {errCode} = await this.$api.comm.updateCommend(params);
		if (errCode === 0) {
			this.setState({
				isPass: null
			})
			message.success("评论状态修改成功");
			that.getCommentList();
		} else {
			this.setState({
				isPass: null
			})
			message.error("评论状态修改失败")
		}
	}
	render() {

		const columns = [
			{
				title: '订单编号',
				dataIndex: 'orderid',
				width: 80,
				align: "center",
				key: 'orderid',
				render: text => <span>{text}</span>,
			},
			{
				title: '用户名称',
				dataIndex: 'username',
				width: 100,
				align: "center",
				key: 'username',
				render: text => <span>{text}</span>,
			},
			{
				title: '作业人员名称',
				dataIndex: 'workername',
				width: 140,
				align: "center",
				key: 'workername',
				render: text => <span>{text}</span>,
			},
			{
				title: '具体项目名称',
				key: 'title',
				width: 150,
				align: "center",
				dataIndex: 'title',
				render: text => <span>{text}</span>,

			},
			{
				title: '评论等级',
				dataIndex: 'level',
				width: 100,
				align: "center",
				key: 'level',
				render: (text) => {
					return <div>
						<span>{text === 5 && "好评"}</span>
						<span>{text === 3 && "中评"}</span>
						<span>{text === 1 && "差评"}</span>
						<span>{text ==='' && "暂无"}</span>


					</div>
				}
			},
			{
				title: '创建时间',
				dataIndex: 'createtime',
				width: 120,
				align: "center",
				key: 'createtime',
				render: text => <span>{text}</span>,
			},
			{
				title: '是否匿名',
				dataIndex: 'isanonymous',
				width: 100,
				align: "center",
				key: 'isanonymous',
				render: text => <span>{text === 0 ? '是' : "否"}</span>,
			},
			{
				title: '审核状态',
				dataIndex: 'delFlag',
				width: 150,
				align: "center",
				key: 'delFlag',
				render: (text, row) => {
					return <div>
						{text === 2 && <Tag color="red"> 未通过</Tag >}
						{text === 1 && <Tag color="green">通过</Tag >}
						{text === 0 && <div>{(this.state.isPass === row.id) ? <div>
							<Tag className="btn1" color="#bae637" onClick={() => this.handSubmitComment(row)}>通过</Tag >
							<Tag className="btn1" color="#ff5f18"
								onClick={() => this.handleReject(row)}>拒绝</Tag >
						</div> : <Tag className="btn1" color="#69c0ff" onClick={() => this.isItPass(row)}>
								待审核
							</Tag>}
						</div>}

					</div>
				},
			},
			{
				title: '查看',
				key: 'id',
				dataIndex: "id",
				width: 80,
				align: "center",
				render: (row) => (

					<div className="btn">
						<Button className="btn1" onClick={() => {
							this.showDetail(row)
						}} size='small' type="primary">详情</Button>
					</div>

				),
			},
			{
				title: "操作",
				dataIndex: "userid",
				align: "center",
				key:"userid",
				width: 180,
				render: (text) => {

					return <div>
						<Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(text)}>
							<Button size='small'>删除</Button>
						</Popconfirm>
					</div>


				}
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

		const { getFieldDecorator } = this.props.form;
		const { detailData } = this.state
		return (
			<div>
				<Form layout="inline" onSubmit={this.handleSubmit}>
					<Form.Item label="订单编号：">
						{getFieldDecorator('orderid', {})(
							<Input allowClear />
						)}
					</Form.Item>
					<Form.Item label="评论等级：">
						{getFieldDecorator('level', {})(
							<Select style={{ width: 200 }}>
								{
									rankList.map((item, index) => {
										return <Option key={index} value={item.id}>{item.value}</Option>
									})
								}
							</Select>
						)}
					</Form.Item>
					<Form.Item label="评论状态：">
						{getFieldDecorator('delFlag', {})(
							<Select style={{ width: 200 }}>
								{
									checkList.map((item, index) => {
										return <Option key={index} value={item.id}>{item.value}</Option>
									})
								}
							</Select>
						)}
					</Form.Item>
					<Form.Item label="创建时间">
						{getFieldDecorator('strTime', {})(
							<RangePicker />
						)}
					</Form.Item>


					<Form.Item>
						<Button icon="search" type="primary" htmlType="submit" onClick={this.handleSubmit} loading={this.state.loadingSub}>查询</Button>
						<Button style={{ margin: "0 13px" }} type="default" onClick={this.cancelContent} >重置</Button>
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
						size="middle"
						columns={columns} dataSource={this.state.listData} />
				</div>
				<Modal
					title="评论详情"
					visible={this.state.visible}
					footer={false}
					onCancel={this.handleCancel.bind(this)}
					width={600}
				>
					<Form {...formItemLayout}>
						<p rows={12} className="formHeader">

							<span rows={12}>用户：{detailData && detailData.username}</span>
							<span rows={12}>作业人员：{detailData && detailData.workername}</span>
						</p>
						<Form.Item label="评论内容">
							<TextArea className="label" value={detailData && detailData.content} disabled rows={6} />
						</Form.Item>
						<Form.Item label="标签">
							<TextArea className="label" value={detailData && detailData.label} disabled rows={2} />
						</Form.Item>
						<Form.Item label="评论图片">
							{
								this.state.imgList && this.state.imgList.map((item, key) => {

									return <div className="pic" key={key}>
										<Zmage src={item.imgurl} style={{ width: 60, height: 80, marginRight: 5 }} alt="" />
									</div>
								})
							}
						</Form.Item>
					</Form>
				</Modal>
			</div>
		)
	}
}
const Findcom_Form = Form.create()(Findcom)
export default Findcom_Form