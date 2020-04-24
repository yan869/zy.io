import React from 'react';
import "@/styles/proprietary.less";
import { Upload, Select, Icon, message, Form, Input,Tag, Modal, Button, Table, Avatar } from 'antd';
import { fileUpload } from "@/utils";
const { Option } = Select;
const actionUrl = fileUpload();
function beforeUpload(file) {
	const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
	if (!isJpgOrPng) {
		message.error('请上传JPG/PNG的图片!');
	}
	const isLt2M = file.size / 1024 / 1024 < 2;
	if (!isLt2M) {
		message.error('图片不能超过2MB!');
	}
	return isJpgOrPng && isLt2M;
}
class Oneserve extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			params: {
				page: 1,
				limit: 10
			},
			tableData: {
				data: [],
				total: 0
			},
			ruleForm: {
				name: '',
				sortsn: ''
			},
			itemShow: false,
			imageUrl: "",
			loading: true,
			visible: false,
			confirmLoading: false
		}
	}
	componentDidMount() {
		this.getList();
	}
	//获取列表
	async getList() {
		let params = this.state.params;
		const { errCode, total, data } = await this.$api.comm.getParServicecategoryList(params);
		if (errCode == 0) {
			this.setState({
				tableData: { total, data },
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
	//添加工种
	addClick() {
		let { visible, imageUrl } = this.state;
		if (imageUrl) {
			imageUrl = "";
		}
		this.setState({
			visible: !visible,
			imageUrl,
			ruleForm: {},
			itemShow: false
		})
	}
	//编辑工种
	editClick(row) {
		let { image } = row;
		this.setState({
			ruleForm: row,
			visible: true,
			imageUrl: image,
			itemShow: true
		})
	}
	//图片上传
	handleChange = info => {
		if (info.file.status === 'uploading') {
			this.setState({ loadingImg: true });
			return;
		}
		if (info.file.status === 'done') {
			let { response } = info.file;
			if (response.errCode === 0) {
				message.success('上传成功！');
				this.setState({ imageUrl: response.data });
			} else {
				message.error(response.errMsg);
			}
		}
	}
	//提交新增
	handleSubmit() {
		this.props.form.validateFieldsAndScroll(async (err, values) => {
			if (!err) {
				let { imageUrl, itemShow } = this.state;
				if (!imageUrl) {
					message.warning('请上传工种图片!');
					return;
				}
				await this.setState({ confirmLoading: true });
				let { name, sortSn, status } = values;
				let api = "";
				let data = {};
				if (itemShow) {
					let { id } = this.state.ruleForm;
					data = { id, name, sortSn, status, image: imageUrl };
					api = this.$api.comm.updateParServicecategoryById(data);
				} else {
					data = { name, sortSn, image: imageUrl };
					api = this.$api.comm.addParServicecategory(data);
				}
				const res = await api;
				if (res.errCode == 0) {
					message.success('操作成功!');
					this.getList();
				} else {
					message.error(res.errMsg);
				}
				this.setState({ confirmLoading: false, visible: false });
			}
		});
	};
	render() {
		const columns = [
			{
				title: '顺序',
				key: 'sortsn',
				dataIndex: 'sortsn',
				width: 80,
				align:"center",
			},
			{
				title: '工种名称',
				dataIndex: 'name',
				width: 80,
				align:"center",
				key: 'name'
			},
			{
				title: '工种图标',
				dataIndex: 'image',
				width: 100,
				align:"center",
				key: 'image',
				render: (url) => (
					<Avatar shape="square" size={64} icon="user" src={url}></Avatar>
				)
			},
			{
				title: '状态',
				dataIndex: 'status',
				width: 80,
				align:"center",
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
				key: 'createtime',
				width: 120,
				align:"center",
				dataIndex: 'createtime',
			},
			{
				title: '操作',
				dataIndex: 'id',
				width: 80,
				align:"center",
				key: 'id',
				render: (id, row) => (
					<Tag size="small" type="primary" color="#4a90e2" onClick={() => this.editClick(row)}>编辑</Tag>
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
		const uploadButton = (
			<div>
				<Icon type={ this.state.loading ? 'loading' : 'plus' } />
				<div className="ant-upload-text">Upload</div>
			</div>
		);
		const { imageUrl, ruleForm, itemShow } = this.state;
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
				<Button onClick={ this.addClick.bind(this) } icon="plus" type="primary">新增</Button>
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
								onChange: this.pageChange.bind(this),
								onShowSizeChange: this.onShowSizeChange.bind(this)
							}
						}
						scroll={{ x:800 }}
						rowKey={(record, index) => index}
						size="middle" 
						columns={columns} dataSource={this.state.tableData.data} loading={this.state.loading} />
				</div>
				<Modal
					title={ (itemShow ? '编辑' : '新增') + '工种'} 
					visible={this.state.visible}
					confirmLoading={this.state.confirmLoading}
					onOk={() => this.handleSubmit()}
					onCancel={() => this.addClick()}
					okText="提交"
					cancelText="取消"
				>
					<Form {...formItemLayout}>
						<Form.Item label="工种名称">
							{getFieldDecorator('name', {
								initialValue: ruleForm.name,
								rules: [{ required: true, message: '请输入工种名' }]
							})(<Input allowClear />)}
						</Form.Item>
						<Form.Item label="顺序">
							{getFieldDecorator('sortSn', {
								initialValue: ruleForm.sortsn,
								rules: [{ required: true, message: '请输工种的顺序' }]
							})(<Input type="number" allowClear />)}
						</Form.Item>
						<Form.Item label="工种图片">
							<Upload
								name="file"
								listType="picture-card"
								showUploadList={false}
								action={actionUrl}
								beforeUpload={beforeUpload}
								onChange={this.handleChange}>
								{imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
							</Upload>
						</Form.Item>
						{ itemShow ? FormItem : null }
					</Form>
				</Modal>
			</div>
		)
	}
}
const AddOneserve = Form.create()(Oneserve);

export default AddOneserve