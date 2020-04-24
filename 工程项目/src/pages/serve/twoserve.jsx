import React from 'react';
import "@/styles/Sendorders.less";
import { Upload, Icon, message, Form, Select, Input, Modal, Button, Table, Tag, Avatar } from 'antd';
import { parFilter, fileUpload } from '@/utils';
const { Option } = Select;
const { TextArea } = Input;
const actionUrl = fileUpload();
class Twoserve extends React.Component {
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
			ruleForm: {},
			loading: true,
			visible: false,
			itemShow: false,
			confirmLoading: false,
			workeList: []
		}
	}
	componentDidMount() {
		this.getParServiceList();
		this.getList();
	}
	//获取数据
	async getList() {
		let params = parFilter(this.state.params);
		const { errCode, data, total } = await this.$api.comm.getServicecategoryList(params);
		if (errCode === 0) {
			this.setState({
				tableData: { data, total },
				loading: false
			})
		}
	}
	//获取工种信息
	async getParServiceList() {
		let params = { page: 1, limit: 20 };
		const { errCode, data } = await this.$api.comm.getParServicecategoryList(params);
		if (errCode === 0) {
			this.setState({ workeList: data });
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
	//新增-编辑-取消
	handleChange(isPase = false, row) {
		let { visible, ruleForm, itemShow } = this.state;
		if (isPase) {
			let { id, parServicecategoryid, name, discription, infoimage, iconimage, thumimage, status, sortsn } = row;
			ruleForm = { id, parServiceCategoryId: parServicecategoryid, name, discription, infoImage: infoimage, iconImage: iconimage, thumImage: thumimage, status, sortSn: parseInt(sortsn) };
			itemShow = true;
		} else {
			ruleForm = {};
			itemShow = false;
		}
		this.setState({
			visible: !visible,
			itemShow,
			ruleForm
		});
	}
	//提交
	handleSubmit = () => {
		this.props.form.validateFieldsAndScroll(async (err, values) => {
			if (!err) {
				let { parServiceCategoryId, name, sortSn, discription, status } = values;
				let { id, iconImage, thumImage, infoImage } = this.state.ruleForm;
				let api = '';
				if (this.state.itemShow) {
					let data = { id, parServiceCategoryId, name, sortSn: parseInt(sortSn), discription, iconImage, thumImage, infoImage, status: parseInt(status) };
					api = this.$api.comm.updateServicecategory(data);
				} else {
					let data = { parServiceCategoryId, name, sortSn: parseInt(sortSn), discription, iconImage, thumImage, infoImage };
					api = this.$api.comm.addServicecategory(data);
				}
				await this.setState({ confirmLoading: true });
				const { errCode, errMsg } = await api;
				if (errCode === 0) {
					message.success(this.state.itemShow ? '编辑成功' : '新增成功');
					this.setState({ confirmLoading: false, visible: false });
					this.getList();
				} else {
					message.error(errMsg)
					this.setState({ confirmLoading: false });
				}
			}
		});
	};
	//上传图片
	handleUpload(info, prop) {
		if (info.file.status === 'uploading') {
			return;
		}
		if (info.file.status === 'done') {
			let { response } = info.file;
			if (response.errCode === 0) {
				let ruleForm = Object.assign({}, this.state.ruleForm);
				ruleForm[prop] = response.data;
				message.success('上传成功！');
				this.setState({ ruleForm });
			} else {
				message.error(response.errMsg);
			}
		}
	}
	render() {
		const columns = [
			{
				title: '工种所属编号',
				dataIndex: 'parServicecategoryid',
				key: 'parServicecategoryid',
				width: 80
			},
			{
				title: '名称',
				dataIndex: 'name',
				key: 'name',
				width: 130,
			},
			{
				title: '服务图标',
				key: 'iconimage',
				dataIndex: 'iconimage',
				width: 130,
				render: (url) => (
					<Avatar shape="square" icon="user" src={url} size={64}></Avatar>
				)
			},
			{
				title: '订单显示图',
				dataIndex: 'thumimage',
				key: 'thumimage',
				width: 130,
				render: (url) => (
					<Avatar shape="square" icon="user" src={url} size={64}></Avatar>
				)
			},
			{
				title: '详情图',
				dataIndex: 'infoimage',
				key: 'infoimage',
				width: 210,
				render: (url) => (
					<img src={url} alt="" style={{ height: '64px' }}></img>
				)
			},
			{
				title: '排序',
				dataIndex: 'sortsn',
				key: 'sortsn3',
				width: 60
			},
			{
				title: '状态',
				dataIndex: 'status',
				key: 'status',
				width: 80,
				render: (status) => {
					let color = '#67c23a', label = '启用';
					if (status === 1) {
						color = '#f56c6c';
						label = '禁用'
					}
					return <Tag color={color}>{label}</Tag>
				}
			},
			{
				title: '创建时间',
				dataIndex: 'createdtime',
				key: 'createdtime',
				width: 180
			},
			{
				title: '介绍',
				dataIndex: 'discription',
				key: 'discription'
			},
			{
				title: '操作',
				key: 'id',
				width: 100,
				render: (id, row) => (
					<Button type="primary" onClick={() => this.handleChange(true, row)}>详情</Button>
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
		const { workeList, ruleForm, itemShow } = this.state;
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
		const uploadButton = (
			<div>
				<Icon type="plus" />
				<div className="ant-upload-text">Upload</div>
			</div>
		);
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
						scroll={{ x: 1200 }}
						rowKey={(record, index) => index}
						size="middle" align="center"
						columns={columns} dataSource={this.state.tableData.data} loading={this.state.loading}
					/>
				</div>
				<Modal
					title={ (itemShow ? '编辑' : '新增') + '服务分类' }
					centered
					visible={this.state.visible}
					onOk={() => this.handleSubmit()}
					onCancel={() => this.handleChange()}
					confirmLoading={this.state.confirmLoading}
					okText="提交"
					cancelText="取消"
					className="modal-body"
				>
					<Form {...formItemLayout}>
						<Form.Item label="工种选择">
							{getFieldDecorator('parServiceCategoryId', {
								initialValue: ruleForm.parServiceCategoryId,
								rules: [{ required: true, message: '请选择工种' }]
							})(
								<Select>
									{
										workeList.map((item, i) => {
											return <Option key={i} value={item.id} disabled={item.status === 1}>{item.name}</Option>
										})
									}
								</Select>
							)}
						</Form.Item>
						<Form.Item label="名称">
							{getFieldDecorator('name', {
								initialValue: ruleForm.name,
								rules: [{ required: true, message: '请输入服务名称' }]
							})(<Input allowClear />)}
						</Form.Item>
						<Form.Item label="图标" extra="推荐图片尺寸: 60 * 60">
							{getFieldDecorator('iconImage', {
								initialValue: ruleForm.iconImage,
								rules: [{ required: true, message: '请上传图标' }]
							})(
								<Upload name="file" listType="picture-card" action={actionUrl} className="icon-img" showUploadList={false} onChange={(info) => this.handleUpload(info, 'iconImage')}>
									{ruleForm.iconImage ? <img src={ruleForm.iconImage} alt="" style={{ width: '100%' }}></img> : uploadButton}
								</Upload>
							)}
						</Form.Item>
						<Form.Item label="订单显示图" extra="推荐图片尺寸: 130 * 130">
							{getFieldDecorator('thumImage', {
								initialValue: ruleForm.thumImage,
								rules: [{ required: true, message: '请上传订单显示图' }]
							})(
								<Upload name="file" listType="picture-card" action={actionUrl} className="thum-image" showUploadList={false} onChange={(info) => this.handleUpload(info, 'thumImage')}>
									{ruleForm.thumImage ? <img src={ruleForm.thumImage} alt="" style={{ width: '100%' }}></img> : uploadButton}
								</Upload>
							)}
						</Form.Item>
						<Form.Item label="详情图" extra="推荐图片尺寸: 750 * 340">
							{getFieldDecorator('infoImage', {
								initialValue: ruleForm.infoImage,
								rules: [{ required: true, message: '请上传详情图' }]
							})(
								<Upload name="file" listType="picture-card" action={actionUrl} className="info-image" showUploadList={false} onChange={(info) => this.handleUpload(info, 'infoImage')}>
									{ruleForm.infoImage ? <img src={ruleForm.infoImage} alt="" style={{ width: '100%' }}></img> : uploadButton}
								</Upload>
							)}
						</Form.Item>
						<Form.Item label="排序">
							{getFieldDecorator('sortSn', {
								initialValue: ruleForm.sortSn,
								rules: [{ required: true, message: '请输入服务排序' }]
							})(<Input type="number" allowClear />)}
						</Form.Item>
						<Form.Item label="介绍">
							{getFieldDecorator('discription', {
								initialValue: ruleForm.discription,
								rules: [{ required: true, message: '请输入服务介绍' }]
							})(
								<TextArea row={4} allowClear placeholder="请输入服务介绍"></TextArea>
							)}
						</Form.Item>
						{ itemShow ? FormItem : null }
					</Form>
				</Modal>
			</div>
		)
	}
}
const Twoserves = Form.create({ name: 'AddOneserve' })(Twoserve);
export default Twoserves
