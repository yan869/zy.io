import React from 'react';
import "@/styles/Sendorders.less";
import { Upload, Icon, message, Form, Select, Input, Modal, Button, Table, Tag } from 'antd';
import { parFilter, fileUpload, orderType } from '@/utils';
const { Option } = Select;
const order_type = orderType();
class Threeserve extends React.Component {
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
		}
	}
	componentDidMount() {
		this.getList();
	}
	//获取数据
	async getList() {
		let params = parFilter(this.state.params);
		const { errCode, data, total } = await this.$api.comm.getBaseServiceList(params);
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
	//提交表单
	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {

			}
		});
	};
	render() {
		const columns = [
			{
				title: '序号',
				dataIndex: 'sortsn',
				key: 'sortsn'
			},
			{
				title: '工种名称',
				dataIndex: 'jobs',
				key: 'jobs',
			},
			{
				title: '订单类型',
				dataIndex: 'ordertype',
				key: 'ordertype',
				render: (id) => {
					let value = '', color = '';
					order_type.some(item => {
						if (item.id == id) {
							value = item.value;
							color = item.color;
							return true;
						}
					})
					return <Tag color={color}>{value}</Tag>
				}
			},
			{
				title: '类别',
				key: 'category',
				dataIndex: 'category',
				render: (id) => {
					let value = "经济型", color = '#FF9600';
					if (id == 1) {
						value = '优享型';
						color = '#267EFF';
					}
					return <Tag color={color}>{value}</Tag>
				}
			},
			{
				title: '价格',
				dataIndex: 'money',
				key: 'money',
				render: (money) => (
					<span>￥{money}</span>
				)
			},
			{
				title: '状态',
				dataIndex: 'status',
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
				dataIndex: 'createTime',
				key: 'createTime',
			},
			{
				title: '操作',
				key: 'id',
				width: 100,
				render: (text, record) => (
					<Button type="primary">详情</Button>
				),
			},
		];
		return (
			<div>
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
const Threeserves = Form.create({ name: 'AddOneserve' })(Threeserve);
export default Threeserves