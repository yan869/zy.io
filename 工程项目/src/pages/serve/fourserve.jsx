import React from 'react';
import "@/styles/Sendorders.less";
import { Upload, Icon, message,InputNumber , Form, Select, Input, Modal, Button, Table, Tag, Avatar } from 'antd';
import { parFilter } from '@/utils';
const { Option } = Select;

class Fourserve extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			tableData: {
				data: [],
				total: 0
			},
			params: {
				page: 1,
				limit: 10
			},
			ruleForm: {},
			visible: false,
			loading: true,
			confirmLoading: false,
			itemShow: false
		}
	}
	componentDidMount() {
		this.getList();
	}
	async getList() {
		let params = parFilter(this.state.params);
		const { errCode, data, total } = await this.$api.comm.getConsumptionEquipmentList(params);
		if (errCode == 0) {
			this.setState({
				tableData: { data, total },
				loading: false
			})
		}
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
	//提交表单
	handleSubmit() {
		this.props.form.validateFieldsAndScroll(async (err, values) => {
			if (!err) {
				let { name, unit, status } = values;
				let api = '';
				if (status !== undefined) {
					let { id } = this.state.ruleForm;
					let data = { id, name, unit, status };
					console.log(data);

					api = this.$api.comm.updateConsumptionEquipmen(data);
				} else {
					let data = { name, unit };
					console.log(data);

					api = this.$api.comm.addConsumptionEquipmen(data);
				}
				await this.setState({ confirmLoading: true });
				const res = await api;
				if (res.errCode == 0) {
					message.success(status === undefined ? '新增成功' : '编辑成功')
					this.setState({ confirmLoading: false, visible: false });
					this.getList();
				} else {
					message.error(res.errMsg);
					this.setState({ confirmLoading: false });
				}
			}
		});
	};
	function (form, fieldName, value, num = 2) {
		const valueStr = `${value || ''}`;
		const valueSplit = valueStr.split('.');
		
		if (valueSplit.length > 1 && (valueSplit[1].length > num || valueSplit.length > 2)) {
		  return form.getFieldValue(fieldName);;
		} 
		return value;
	  }
	render() {
		const columns = [
			{
				title: '序号',
				dataIndex: 'id',
				key: 'id',
				width: 80,
				align: "center"
			},
			{
				title: '器材名称',
				dataIndex: 'name',
				width: 100,
				align: "center",
				key: 'name',
			},
			// {
			// 	title: '器材图片',
			// 	dataIndex: 'image',
			// 	width: 80,
			// 	align: "center",
			// 	key: 'image',
			// 	render: (url) => (
			// 		<Avatar shape="square" icon="user" src={url} size={64}></Avatar>
			// 	)
			// },
			{
				title: '单位',
				dataIndex: 'unit',
				width: 80,
				align: "center",
				key: 'unit',
			},
			// {
			// 	title: '排序',
			// 	dataIndex: 'sortsn',
			// 	key: 'sortsn',
			// 	width: 80,
			// 	align: "center",
			// },
			{
				title: '状态',
				dataIndex: 'status',
				width: 80,
				align: "center",
				key: 'status',
				render: (status) => {
					let color = '#67c23a', label = '启用';
					if (status == 1) {
						color = '#f56c6c';
						label = '禁用'
					}
					return <Tag color={color}>{label}</Tag>
				}
			},
			{
				title: '创建时间',
				dataIndex: 'createdtime',
				width: 120,
				align: "center",
				key: 'createdtime',
			},
			{
				title: '操作',
				width: 100,
				align: "center",
				render: (text, row) => (
					<Tag color="#4a90e2" type="primary" onClick={() => this.handleChange(true, row)}>编辑</Tag>
				), 
			},
		];
		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 5 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 18 },
			},
		};
		const { ruleForm, itemShow } = this.state;
		const { getFieldDecorator } = this.props.form;
		const FormItem = (
			<Form.Item label="状态">
				{getFieldDecorator('status', {
					initialValue: ruleForm.status,
					rules: [{ required: itemShow, message: '请选择状态' }]
				})(
					<Select>
						<Option value={0}>启用</Option>
						<Option value={1}>禁用</Option>
					</Select>
				)}
			</Form.Item>
		)
		return (
			<div>
				<Button onClick={() => this.handleChange()} icon="plus" type="primary">新增</Button>
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
						// scroll={{ x:0 }}
						rowKey={(record, index) => index}
						size="middle"
						columns={columns} dataSource={this.state.tableData.data} loading={this.state.loading} />
				</div>
				<Modal
					title={(itemShow ? '编辑' : '新增') + '器材'}
					visible={this.state.visible}
					onOk={() => this.handleSubmit()}
					onCancel={() => this.handleChange()}
					confirmLoading={this.state.confirmLoading}
					okText="提交"
					cancelText="取消"
				>
					<Form {...formItemLayout}>
						<Form.Item label="名称">
							{getFieldDecorator('name', {
								initialValue: ruleForm.name,
								rules: [{ required: true, message: '请输入服务名称' }]
							})(<Input allowClear />)}
						</Form.Item>
						{/* <Form.Item label="价格">
							{getFieldDecorator('price', {
								initialValue: ruleForm.price,
								rules: [{ required: true, message: '请输入器材价格' }]
							})(<InputNumber precision={2} min={0} type="text" allowClear />)}
						</Form.Item> */}
						<Form.Item label="单位">
							{getFieldDecorator('unit', {
								initialValue: ruleForm.unit,
								rules: [{ required: true, message: '请输入器材的单位' }]
							})(<Input allowClear />)}
						</Form.Item>
						{itemShow ? FormItem : null}
					</Form>
				</Modal>
			</div>
		)
	}
}
const Fourserves = Form.create({ name: 'Fourserve' })(Fourserve);

export default Fourserves