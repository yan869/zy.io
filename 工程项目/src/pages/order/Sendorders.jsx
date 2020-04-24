import React from 'react';
import FileSaver from 'file-saver';
import Zmage from 'react-zmage'
import { Modal, Row, Col, Select, Input, Button, Table, Tag, DatePicker, Form, message, Upload, Icon } from 'antd';
import { parFilter, orderStatus, fileUpload, orderType, selectType } from '@/utils';
const { Option } = Select;
const opstionList = orderStatus();
const orderTypeList = orderType();
const actionUrl = fileUpload();
const selectTypeList = selectType();
const { RangePicker } = DatePicker;

class Sendorders extends React.Component {


	constructor(props) {
		super(props)
		this.state = {
			tableData: {},
			loading: false,
			loadingSub: false,
			filename: null,
			params: {
				page: 1,
				limit: 10,
			},
			params1: null,
			params2: null,
			visible: false,
			detailData: {},
			imgList: [],
			swaddress: '',
			swphone: '',
			start: '',
			end: "",
			workerDownLoad: '',
			isWorker: false,
			swItemList: [],
			price: 0,
			workeType: [],
			props: {},
			isDownLoad: false,
			exportData: []
		}
	}
	// csv文件的导出
	// 时间添0
	addZero = (num) => {
		if (num < 10) {
			return "0" + num
		} else {
			return num
		}
	}

	//方法调用
	downloadCsv = (data) => {
		//str:table的每一列的标题，即为导出后的csv文件的每一列的标题
		let str = this.state.isWorker ? '序号,订单时间,订单号,姓名,作业员编号,手机号,订单标题,订单类型,订单状态,订单金额' : '序号,订单号,业主名称,业主手机号,订单标题,下单时间,订单类别,订单状态,接单员按姓名,接单员手机号,订单金额';
		//通过循环拿出data数据源里的数据，并塞到str中

		for (const i in data) {

			let eType = '';
			let eStatus = '';
			let eselectType = "";
			// 类别
			if (data[i].type === 0) {
				eType = '个人订单'
			} else if (data[i].type === 1) {
				eType = '商户订单'
			} else if (data[i].type === 2) {
				eType = '企业订单'
			} else if (data[i].type === 3) {
				eType = '工程订单'
			} else {
				eType = '其他订单'
			}
			// 类型
			if (data[i].selectType === 0) {
				eselectType = "经济型"
			} else if (data[i].selectType === 1) {
				eselectType = "优享型"
			}
			// 订单状态
			if (data[i].orderStatus === 'WAITING') {
				eStatus = '待接单'
			} else if (data[i].orderStatus === 'CANCELLED') {
				eStatus = '已取消'
			} else if (data[i].orderStatus === 'WAIT_COMMEND') {
				eStatus = '待评论'
			} else if (data[i].orderStatus === 'WAIT_SERVICE') {
				eStatus = '待服务'
			} else if (data[i].orderStatus === 'WAIT_PAY') {
				eStatus = '待支付'
			} else if (data[i].orderStatus === 'FINISHED') {
				eStatus = '已完成'
			}
			if (!this.state.isWorker) {
				str += '\n' +
					data[i].id + ',' +
					data[i].ordersn + ',' +
					data[i].name + ',' +
					data[i].userPhone + ',' +
					data[i].title + ',' +
					data[i].ordertime + ',' +
					eType + ',' +
					eStatus + ',' +
					data[i].workName + ',' +
					data[i].workPhone + ',' +
					data[i].money
			} else {
				str += '\n' +
					data[i].id + ',' +
					data[i].ordertime + ',' +
					data[i].ordersn + ',' +
					data[i].name + ',' +
					data[i].workerid + ',' +
					data[i].workPhone + ',' +
					data[i].title + ',' +
					eselectType + ',' +
					eStatus + ',' +
					data[i].money
			}



		}
		//Excel打开后中文乱码添加如下字符串解决
		let exportContent = "\uFEFF";
		let blob = new Blob([exportContent + str], {
			type: "text/plain;charset=utf-8"
		});
		FileSaver.saveAs(blob, "订单列表.csv");
		// }

	};


	componentDidMount() {
		this.getParServicecategoryList();
		this.getOrdersList()
	}
	//获取工种列表
	async getParServicecategoryList() {
		let params = { page: 1, limit: 20 };
		const { errCode, data } = await this.$api.comm.getParServicecategoryList(params);
		if (errCode === 0) {
			this.setState({ workeType: data });


		}
	}
	async getOrdersList() {
		let param = parFilter(this.state.params);
		let par = { page: 1 }

		let params = await this.state.isDownLoad ? par : param

		console.log(this.state.isDownLoad);
		const res = await this.$api.comm.orderSearch(this.state.isDownLoad ? par : param);

		if (res.errCode === 0) {
			let { total, data } = res;
			this.setState({
				tableData: { total, data },
				exportData: data
			})


		} else {
			message.error(res.errMsg);
		}
		this.setState({ loading: false, loadingSub: false });
	}

	//查询
	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFields(async (err, values) => {

			console.log(values);

			let {  selectType, orderStatus, strTime, name, userPhone, workName, workPhone } = values;
			let strBeginTime = "", strEndTime = "", type = '';
			if (strTime && strTime.length > 0) {
				strBeginTime = strTime[0].format('YYYY-MM-DD HH:mm:ss')
				strEndTime = strTime[1].format('YYYY-MM-DD HH:mm:ss')
			}
			if (selectType === "经济型") {
				type = 0
			}
			if (selectType === "优享型") {
				type = 1
			}
			let params = Object.assign({}, this.state.params, { page: 1, orderSn: values.orderSn, selectType: type, orderStatus, strBeginTime, strEndTime, name, userPhone, workName, workPhone });
			console.log(params);

			await this.setState({
				params,
				loadingSub: true,
				isWorker: params.workName ? true : false
			})
			this.getOrdersList()
		})

	}
	handleCancel = () => {
		this.setState({
			visible: false
		})
	}
	//改变page
	async pageChange(page) {
		let params = Object.assign({}, this.state.params, { page });
		await this.setState({ params, loading: true });
		this.getOrdersList();
	}
	//改变limit
	async onShowSizeChange(current, size) {
		let params = Object.assign({}, this.state.params, { page: 1, limit: size });
		await this.setState({ params, loading: true });
		this.getOrdersList();
	}


	// 请求获取详情数据
	async showDetail(row) {
		let { id } = row;
		const res = await this.$api.comm.getOrderDetail(id);
		if (res.errCode === 0) {
			this.setState({
				visible: true,
				detailData: res.data,
				imgList: res.data.imgurls && res.data.imgurls.split("##"),
				swAddress: res.data.swAddress.address,
				swphone: res.data.swAddress.phone,
				swItemList: res.data.swOrderItems
			})
			console.log(this.state.swItemList);

		} else {
			message.error(res.errMsg);
		}
	}
	// 重置
	// 清空
	cancelContent = () => {
		this.props.form.resetFields();
	}

	// 将获取到的文件进行保存，方便后续进行操作
	uploadMibfiles = file => {
		this.fileList = file;
	}

	fileState = info => {
		let that = this
		if (info.file.status === 'uploading') {
			this.setState({ loadingImg: true });
			return;
		}
		if (info.file.status === 'done') {
			let { response } = info.file;
			if (response.errCode === 0) {
				message.success('上传成功！');
				that.getOrdersList()

				//   this.setState({ imageUrl: response.data });
			} else {
				message.error(response.errMsg);
			}
		}
	}




	render() {

		const columns1 = [
			{
				title: '订单号',
				dataIndex: 'ordersn',
				key: 'ordersn',
				width: 150,
				align: 'center',
			},
			{
				title: '业主昵称',
				width: 100,
				align: 'center',
				dataIndex: 'name',
				key: 'name',
				width: 80,
			},
			{
				title: '业主手机号',
				dataIndex: 'userPhone',
				width: 100,
				align: 'center',
				key: 'userPhone',
			},
			{
				title: '订单标题',
				dataIndex: 'title',
				width: 100,
				align: 'center',
				key: ' title',
			},
			{
				title: '下单时间',
				dataIndex: 'ordertime',
				width: 150,
				align: 'center',
				key: 'ordertime',
			},
			{
				title: '预约时间',
				dataIndex: 'appointment',
				width: 150,
				align: 'center',
				key: 'appointment',
			},
			{
				title: '订单类型',
				dataIndex: 'type',
				align: 'center',
				key: 'type',
				width: 90,
				render: text => {
					let value = "", color = "";
					orderTypeList.some(item => {
						if (item.id === text) {

							value = item.value;
							color = item.color;
							return true;
						}
					})
					return <Tag color={color}>{value}</Tag>
				}
			},
			{
				title: '订单类别',
				align: 'center',
				dataIndex: 'selectType',
				key: 'selectType',
				width: 90,
				render: (text, row) => {
					let value = "", color = "";
					selectTypeList.some(item => { 
						if (row.type === 3) {
							value = ""
						}
						else if (item.id === text) {
							value = item.value;
							color = item.color;
							return true;
						}
					})
					return <Tag color={color}>{value}</Tag>
				}
			},
			{
				title: '订单状态',
				align: 'center',
				key: 'orderStatus',
				dataIndex: 'orderStatus',
				width: 80,
				render: (val) => {
					let label = "", color = "";
					opstionList.some(item => {
						if (item.value === val) {
							label = item.label;
							color = item.color;
							return true;
						}
					})
					return <Tag color={color}>{label}</Tag>
				}
			},
			{
				title: '接单作业员',
				align: 'center',
				dataIndex: 'workName',
				key: 'workName',
				width: 90,
				render: text => {
					if (text) {
						return <span>{text}</span>
					}
				}
			},
			{
				title: '作业员手机号',
				align: 'center',
				dataIndex: 'workPhone',
				key: 'workPhone',
				width: 120,
				render: text => {
					if (text) {
						return <span>{text}</span>
					} else {
						return <span>暂无</span>
					}
				}
			},
			{
				title: '工种',
				align: 'center',
				width: 100,
				dataIndex: 'parServicecategoryid',
				key: 'parServicecategoryid',
				width: 90,
				render: (text, record) => {
					return <span>电工</span>
				}
			},
			{
				title: '订单金额(元)',
				dataIndex: 'money',
				width: 100,
				key: 'money',
				render: (text) => <span>￥{text ? text.toFixed(2) : "0.00"}</span>
			},
			{
				title: '操作',
				dataIndex: 'id',
				key: 'id',
				width: 75,
				fixed: 'right',
				render: (id, row) => (
					<Button onClick={() => {
						this.showDetail(row)
					}} size='small' type="primary">详情</Button>
				),
			},
		];

		const { getFieldDecorator } = this.props.form;
		return (
			<div>
				<Form layout="inline" onSubmit={this.handleSubmit}>
					<Form.Item label="订单号">
						{getFieldDecorator('orderSn', {})(<Input allowClear />)}
					</Form.Item>
					<Form.Item label="订单类别" >
						{getFieldDecorator('selectType', {
							initialValues:"经济型"
						})(
							<Select  style={{ width: 180}}>
								{
									selectTypeList.map((item, index) => {
										return <Option key={index} value={item.value}
										>{item.value}</Option>
									})
								}
							</Select>
						)}
					</Form.Item>
					<Form.Item label="订单状态">
						{getFieldDecorator('orderStatus', {})(
							<Select style={{ width: 180 }}>
								{
									opstionList.map((item, index) => {
										return <Option key={index} value={item.value}>{item.label}</Option>
									})
								}
							</Select>
						)}
					</Form.Item>
					<Form.Item label="下单时间">
						{getFieldDecorator('strTime', {})(
							<RangePicker />
						)}
					</Form.Item>
					<Form.Item label="客户名称">
						{getFieldDecorator('name', {})(<Input allowClear />)}
					</Form.Item>
					<Form.Item label="客户手机号">
						{getFieldDecorator('userPhone', {})(<Input allowClear />)}
					</Form.Item>
					<Form.Item label="作业员名称">
						{getFieldDecorator('workName', {})(<Input allowClear />)}
					</Form.Item>
					<Form.Item label="作业员手机号">
						{getFieldDecorator('workPhone', {})(<Input allowClear />)}
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
						columns={columns1} dataSource={this.state.tableData.data} size="middle" align="center" loading={this.state.loading} />


				</div>
				<div className="file-box btn2" style={{ marginBottom: "10px" }}>
					<div onClick={this.importData}>
						<Upload
							action={actionUrl}
							multiple={true}
							accept='.xlsx,.xls,.csv'
							beforeUpload={this.uploadMibfiles}
							onChange={this.fileState}
							showUploadList={false} className="btn1"

						>
							<Button type="primary"><Icon type="upload" /> 导入</Button>

						</Upload>
					</div>
					<Button className="btn1" onClick={async () => {
						await this.setState({
							isDownLoad: true
						})
						await this.getOrdersList()
						this.downloadCsv(this.state.exportData)
					}}><Icon type="download" /> 导出</Button>



				</div>
				<Modal
					title="订单详情"
					visible={this.state.visible}
					footer={false}
					onCancel={this.handleCancel}
					width={800}
				>
					<Row>
						<Col className='col-item' span={12}>
							<span className='title'>订单编号：</span>
							<span>{this.state.detailData.ordersn}</span>
						</Col>
						<Col className='col-item' span={12}>
							<span className='title'>订单标题：</span>
							<span>{this.state.detailData.title}</span>
						</Col>
						<Col className='col-item' span={12}>
							<span className='title'>订单内容：</span>
							<span>{this.state.detailData.content}</span>
						</Col>
						<Col className='col-item' span={12}>
							<span className='title'>订单类型：</span>
							<span>{this.state.detailData.type === 0 && "个人订单"}</span>
							<span>{this.state.detailData.type === 1 && "商户订单"}</span>
							<span>{this.state.detailData.type === 2 && "企业订单"}</span>
							<span>{this.state.detailData.type === 3 && "工程订单"}</span>
							<span>{this.state.detailData.type === 9 && "其他订单"}</span>
						</Col>
						{this.state.detailData.type === 3 ? '':<Col className='col-item' span={12}>
							<span className='title'>订单类别：</span>

							<span>{this.state.detailData.selectType === 0 && "经济型"}</span>
							<span>{this.state.detailData.selectType === 1 && "优享型"}</span>
						</Col>}
						<Col className='col-item' span={12}>
							<span className='title'>订单状况：</span>
							<span>{this.state.detailData.orderStatus === "CANCELLED" && "已取消"}</span>
							<span>{this.state.detailData.orderStatus === "WAIT_PAY" && "待支付"}</span>
							<span>{this.state.detailData.orderStatus === "WAIT_SERVICE" && "待服务"}</span>
							<span>{this.state.detailData.orderStatus === "FINISHED" && "已完成"}</span>
							<span>{this.state.detailData.orderStatus === "WAITING" && "待接单"}</span>
							<span>{this.state.detailData.orderStatus === "WAIT_COMMEND" && "待评论"}</span>
							<span>{this.state.detailData.orderStatus === "SERVICE_WAITING" && "服务中"}</span>

						</Col>
						<Col className='col-item' span={12}>
							<span className='title'>作业员编号:</span>
							<span>{this.state.detailData.workerSn}</span>
						</Col>
						<Col className='col-item' span={12}>
							<span className='title'>作业员姓名:</span>
							<span>{this.state.detailData.workName}</span>
						</Col>
						<Col className='col-item' span={12}>
							<span className='title'>作业员电话:</span>
							<span>{this.state.detailData.workPhone}</span>
						</Col>
						<Col className='col-item' span={12}>
							<span className='title'>业主姓名:</span>
							<span>{this.state.detailData.name}</span>
						</Col>
						<Col className='col-item' span={12}>
							<span className='title'>业主电话:</span>
							<span>{this.state.detailData.userPhone}</span>
						</Col>
						<Col className='col-item' span={12}>
							<span className='title'>服务地址:</span>
							<span>{this.state.swAddress}</span>
						</Col>
						<Col className='col-item' span={12}>
							<span className='title'>订单生成时间:</span>
							<span>{this.state.detailData.ordertime}</span>
						</Col>
						<Col className='col-item' span={12}>
							<span className='title'>预约时间:</span>
							<span>{this.state.detailData.appointment}</span>
						</Col>
						<Col className='col-item' span={12}>
							<span className='title'>订单更新时间:</span>
							<span>{this.state.detailData.updatetime}</span>
						</Col>
						<Col className='col-item' span={12}>
							<span className='title'>上门费：</span>
							<span>￥{this.state.detailData.visitFee?this.state.detailData.visitFee.toFixed(2):"0.00"}</span>
						</Col>
						<Col className='col-item' span={12}>
							<span className='title'>感谢费：</span>
							<span>￥{this.state.detailData.thanksFree?this.state.detailData.thanksFree.toFixed(2):"0.00"}</span>
						</Col>
						<Col className='col-item' span={12}>
							<span className='title'>器材费：</span>
							{this.state.swItemList.length > 0 ? this.state.swItemList.map((item, index) => {
								this.state.price += item.price
								if (index === this.state.swItemList.length - 1) {
									return <span>￥{this.state.price?this.state.price.toFixed(2):"0.00"}</span>
								}

							}) : <span>￥0.00</span>
							}
						</Col>
						<Col className='col-item' span={12}>
							<span className='title'>订单总金额：</span>
							<span>￥{this.state.detailData.money?this.state.detailData.money:"0.00"}</span>
						</Col>
						<Col className='col-item' span={12}>
							<span className='title'>客户昵称：</span>
							<span>{this.state.detailData.userName}</span>
						</Col>
						<Col className='col-item' span={12}>
							<span className='title'>客户手机号：</span>
							<span>{this.state.detailData.userPhone}</span>
						</Col>
						<Col className='col-item' span={12}>
							<span className='title'>作业员昵称：</span>
							<span>{this.state.detailData.workName}</span>
						</Col>
						<Col className='col-item' span={12}>
							<span className='title'>作业员手机号：</span>
							<span>{this.state.detailData.workPhone}</span>
						</Col>
						<Col className='col-item' span={12}>
							<span className='title'>订单评价：</span>
							<span>{this.state.detailData.descr}</span>
						</Col>
						<Col className='col-item' span={12}>
							<span className='title'>定单照片：</span>
							<span>{this.state.imgList && this.state.imgList.length > 0 && this.state.imgList.map((item, index) => {
								return <Zmage src={item} key={index} style={{ width: 60, margin: 5 }} />
							})}</span>
						</Col>
						<Col className='col-item' span={12}>
							<span className='title'>服务项：</span>
							<div>
								<div className="right">
									{this.state.swItemList.map((item, index) => {
										return <div key={index} style={{ float: 'left', margin: "3px 10px" }}>
											<p>商品名：<span>{item.name}</span></p>
											<p>金额：<span>{item.price}</span></p>
											<p>数量：<span>{item.number}</span></p>
										</div>
									})
									}
								</div>
							</div>
						</Col>
					</Row>
				</Modal>


			</div>


		)

	}
}


const Sendorders_From = Form.create()(Sendorders);


export default Sendorders_From