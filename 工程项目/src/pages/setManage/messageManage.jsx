import React from 'react';
import "@/styles/Sendorders.less";
import { Select, Input, Button, Table, Tag, Modal, Form, message } from 'antd'
import { parFilter } from '@/utils';
const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal;

class MessageManage extends React.Component {
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
			loading: true,
			visible: false,
			loadingSub: false,
			confirmLoading: false
		}
	}
	componentDidMount(){
		this.getList();
	}
	async getList(){
		let params = parFilter(this.state.params)
		const { errCode, data, total } = await this.$api.comm.getSwPushMessageList(params);
		if(errCode === 0){
			this.setState({
				tableData: { data, total },
				loading: false,
				loadingSub: false
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
	//查询
	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFields(async (err, values) => {
			let { title_search, sendRole_search } = values;
			let params = Object.assign({}, this.state.params, { page: 1, title: title_search, sendRole: sendRole_search });
			await this.setState({ loadingSub: true, params });
			this.getList();
		})
	}
	//新增
	handChange(){
		let { visible } = this.state;
		this.setState({
			visible: !visible
		})
	}
	//删除
	deleteNotie(row){
		let that = this;
		confirm({
			title: '提示',
			centered: true,
			content: `是否继续删除标题为 '${ row.title }' 公告?`,
			okText: '是',
			okType: 'danger',
			cancelText: '否',
			async onOk() {
				const { errCode, errMsg } = await that.$api.comm.deteleSwPushMessage(row.id);
				if(errCode === 0){
					message.success('删除成功！')
					that.getList();
				}else{
					message.error(errMsg);
				}
			},
			onCancel() {},
		});
	}
	//提交表单
	handleAddSubmit(){
		this.props.form.validateFieldsAndScroll(async (err, values) => {
			if (!err) {
				let { sendRole, title, content } = values;
				await this.setState({ confirmLoading: true });
				let data = { sendRole, title, content };
				const res = await this.$api.comm.addSwPushMessage(data);
				if(res.errCode === 0){
					message.success('新增成功！');
					this.setState({
						confirmLoading: false,
						visible: false
					});
					this.getList();
				}else{
					message.error(res.errMsg);
					this.setState({ confirmLoading: false });
				}
			}
		});
	};
	// 清空
	cancelContent = () => {
		this.props.form.resetFields();
	}
	render() {
		const columns = [
			{
				title: '通知类型',
				dataIndex: 'sendType',
				key: 'sendType',
				width: 120,
				align:"center",
				render: (type) => {
					if(type === 1){
						return <span>系统通知</span>
					}else{
						return <span>个人通知</span>
					}
				}
			},
			{
				title: '通知对象',
				dataIndex: 'sendRole',
				key: 'sendRole',
				width: 120,
				align:"center",
				render: (role) => {
					let color = 'green', label = '业主用户';
					if(role === 'ALL'){
						color = 'volcano'
						label = '全部'
					}else if(role === 'WORKER'){
						color = 'blue'
						label = '作业员'
					}
					return <Tag color={ color }>{ label }</Tag>
				}
			},
			{
				title: '标题',
				dataIndex: 'title',
				key: 'title',
				width: 120,
				align:"center"
			},
			{
				title: '内容',
				key: 'content',
				width:120,
				align:"center",
				dataIndex: 'content',
			},
			{
				title: '发送时间',
				dataIndex: 'createtime',
				key: 'createtime',
				width: 120,
				align:"center",
			},
			{
				title: '操作',
				key: 'id',
				width: 110,
				align:"center",

				render: (text, row) => (
					<Button type="danger" onClick={ () => this.deleteNotie(row) }>删除</Button>
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
		const { getFieldDecorator } = this.props.form;
		return (
			<div>
				<Form layout="inline" >
					<Form.Item label="通知标题">
						{ getFieldDecorator('title_search', {})( <Input allowClear /> ) }
					</Form.Item>
					<Form.Item label="通知对象">
						{ getFieldDecorator('sendRole_search', {})( 
							<Select style={{ width: 180 }}>
								<Option value="ALL">全部</Option>
								<Option value="WORKER">作业员</Option>
								<Option value="USER">业主用户</Option>
							</Select>
						) }
					</Form.Item>
					<Form.Item>
						<Button icon="search" type="primary" htmlType="submit" onClick={ this.handleSubmit } loading={ this.state.loadingSub }>查询</Button>
						<Button style={{ margin: "0 13px" }} type="default" onClick={this.cancelContent} >重置</Button>

					</Form.Item>
					<Form.Item>
						<Button icon="plus" type="primary" onClick={ () => this.handChange() }>新增</Button>
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
						scroll={{ x: 1250 }}
						rowKey={(record, index) => index}
						size="middle"
						align="center"
						columns={ columns } dataSource={ this.state.tableData.data } loading={ this.state.loading } 
					/>
				</div>
				<Modal
					title="新增通知"
					visible={ this.state.visible }
					confirmLoading={ this.state.confirmLoading }
					onOk={ () => this.handleAddSubmit() }
					onCancel={ () => this.handChange() }
					okText="提交"
					cancelText="取消"
				>
					<Form { ...formItemLayout }>
						<Form.Item label="通知对象">
							{getFieldDecorator('sendRole', {
								rules: [{ required: this.state.visible, message: '请选择通知对象' }]
							})(
								<Select>
									<Option value="ALL">全部</Option>
									<Option value="WORKER">作业员</Option>
									<Option value="USER">业主用户</Option>
								</Select>
							)}
						</Form.Item>
						<Form.Item label="通知标题">
							{getFieldDecorator('title', {
								rules: [{ required: this.state.visible, message: '请输入通知标题' }]
							})( <Input allowClear /> )}
						</Form.Item>
						<Form.Item label="通知内容">
							{getFieldDecorator('content', {
								rules: [{ required: this.state.visible, message: '请输入通知内容' }]
							})( <TextArea rows={ 3 } className="label" allowClear placeholder="请输入通知内容"/>)}
						</Form.Item>
					</Form>
				</Modal>
			</div>
		)
	}
}

const MessageManages = Form.create({ name: 'MessageManage' })(MessageManage);

export default MessageManages