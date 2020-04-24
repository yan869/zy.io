import React from 'react';
import "@/styles/Sendorders.less";
import { parFilter, commentLabel, commentStatus } from '@/utils';
import { Select, Button, Table, Modal, Input, Form, message } from 'antd'
const { Option } = Select;
const { TextArea } = Input;
const label_status = commentLabel();
const labelFlag = commentStatus()
class CommentLable extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			tableData: {
				data: [],
				total: 0
			},
			visible: false,
			detailData: {},
			loadingSub: false,
			confirmLoading: false,
			itemShow: false,
			ruleForm: {},
			commentLabelList: [],
			params: {
				page: 1,
				limit: 10
			}
		}
	}

	async getLableList() {
		let params = parFilter(this.state.params);
		const { errCode, data, total } = await this.$api.comm.getLabelList(params);
		if (errCode === 0) {
			this.setState({
				commentLabelList: data,
				tableData: { data, total },
				loading: false,
				loadingSub: false,
			})
		}
	}

	//改变page
	async pageChange(page) {
		let params = Object.assign({}, this.state.params, { page });
		await this.setState({ params, loading: true });
		this.getLableList();
	}
	//改变limit
	async onShowSizeChange(current, size) {
		let params = Object.assign({}, this.state.params, { page: 1, limit: size });
		await this.setState({ params, loading: true });
		this.getLableList();
	}
	//添加
	addClick() {
		this.setState({
			visible: true
		})
	}
	//确认
	handleOk() {

	}
	//取消
	handleCancel() {
		this.setState({
			visible: false
		})
	}


	//新增-编辑
	handleChange(isPase = false, row) {
		let { visible, ruleForm } = this.state;
		if (isPase) {
			let { id, name, price, unit, status } = row;
			ruleForm = { id, name, price, unit, status };
		} else {
			ruleForm = {}
		}
		this.setState({
			visible: !visible,
			ruleForm,
			itemShow: isPase
		})
	}






	//查询
	query = e => {
		e.preventDefault();

		this.props.form.validateFields(async (err, values) => {
			let { status } = values;
			let params = Object.assign({}, this.state.params, { status });
			await this.setState({ params, loadingSub: true });
			this.getLableList();
		})

	};


	// 提交表单

	//提交表单
	handleSubmit() {
		this.props.form.validateFieldsAndScroll(async (err, values) => {
			if (!err) {
				let { label, status, delFlag } = values;
				let api = '';
				if (this.state.itemShow) {
					let { id } = this.state.ruleForm;
					let data = { id, label, delFlag, status };
					api = this.$api.comm.editlabel(data);
				} else {
					let data = { label, status, delFlag };
					api = this.$api.comm.addlabel(data);
				}
				await this.setState({ confirmLoading: true });
				const res = await api;
				if (res.errCode === 0) {
					message.success(!this.state.itemShow ? '新增成功' : '编辑成功')
					this.setState({ confirmLoading: false, visible: false });
					this.getLableList()
				} else {
					message.error(res.errMsg);
					this.setState({ confirmLoading: false });
				}
			}
		});
	};


	componentDidMount() {
		this.getLableList()
	}
	// 


	render() {
		this.state.commentLabelList.forEach((item, index) => {
			const text = item;
		})
		const columns = [
			{
				title: '序号',
				dataIndex: 'id',
				width: 80,
				align: "center",
				key: 'id',
				render: text => <span>{text}</span>,
			},
			{
				title: '标签',
				dataIndex: 'label',
				width: 80,
				align: "center",
				key: 'label',
				render: text => <span>{text}</span>,
			},
			{
				title: '分类',
				dataIndex: 'status',
				key: 'status',
				width: 80,
				align: "center",
				render: (text) => {
					return <div>
						<span>{text === 1 && "好评"}</span>
						<span>{text === 2 && "中评"}</span>
						<span>{text === 3 && "差评"}</span>
					</div>
				}
			},
			{
				title: '状态',
				key: 'delFlag',
				width: 80,
				align: "center",
				dataIndex: 'delFlag',
				render: text => <span>{text === 0 ? '显示' : '禁用'}</span>
			},

			{
				title: '操作',
				key: 'action',
				width: 120,
				align: "center",
				render: (text, row) => (
					<div>
						<Button size='small' type="primary"
							onClick={() => this.handleChange(true, row)}
						>编辑</Button>


					</div>
				),
			},
		];
		const formItemLayout = {
			labelCol: {
				xs: { span: 4 },
				sm: { span: 4 },
			},
			wrapperCol: {
				xs: { span: 20 },
				sm: { span: 20 },
			},
		};

		const { itemShow } = this.state;
		const { getFieldDecorator } = this.props.form;
		return (
			<div >
				<Form layout="inline" onSubmit={this.handleSubmit}>
					<Form.Item label="评论等级：">
						{getFieldDecorator('status', {

						})(
							<Select style={{ width: 200 }}>
								{
									label_status.map((item, index) => {
										return <Option key={index} value={item.id}>{item.value}</Option>
									})
								}
							</Select>
						)}
					</Form.Item>
					<Form.Item>
						<Button icon="search" type="primary" htmlType="submit" onClick={this.query} loading={this.state.loadingSub}>查询</Button>
						<Button icon="plus" type="primary" style={{ margin: "0 13px" }}  onClick={() => this.handleChange()}  >新增</Button>
					</Form.Item>
				</Form>
				<div className='table-wrapper' >
					<Table
						pagination={
							{
								showTotal: () => `共${this.state.tableData.total}条`,
								total: this.state.tableData.total,
								current: this.state.params.page,
								pageSize: this.state.params.limit,
								pageSizeOptions: ['10', '20', '30', '50', '100'],
								showSizeChanger: true,
								size: 'small',
								onChange: this.pageChange.bind(this),
								onShowSizeChange: this.onShowSizeChange.bind(this)
							}
						}
						scroll={{ x: 800 }}
						rowKey={(record, index) => index}
						// size="middle"
						columns={columns} dataSource={this.state.tableData.data} />
				</div>
				<Modal
					title={(itemShow ? '编辑' : '新增') + '评论标签'}
					visible={this.state.visible}
					onOk={() => this.handleSubmit()}
					onCancel={() => this.handleChange()}
					confirmLoading={this.state.confirmLoading}
					okText="提交"
					cancelText="取消"
				>
					<Form {...formItemLayout}>
						<Form.Item label="标签内容">
							{getFieldDecorator('label', {

							})(<TextArea allowClear className="label" />)}
						</Form.Item>
						<Form.Item label="评论等级">
							{getFieldDecorator('status', {})(
								<Select style={{ width: 200 }}>
									{
										label_status.map((item, index) => {
											return <Option key={index} value={item.id}>{item.value}</Option>
										})
									}
								</Select>
							)}
						</Form.Item>
						<Form.Item label="标签状态">
							{getFieldDecorator('delFlag', {})(
								<Select style={{ width: 200 }}>
									{
										labelFlag.map((item, index) => {
											return <Option key={index} value={item.id}>{item.value}</Option>
										})
									}
								</Select>
							)}
						</Form.Item>

					</Form>
				</Modal>
			</div>
		)
	}
}
const CommentLables = Form.create({ name: 'CommentLable' })(CommentLable);
export default CommentLables
