import React from 'react';
import "@/styles/Sendorders.less";
import FileSaver from 'file-saver';
import moment from "moment"
import { parFilter, signStatus, bookStatus } from '@/utils';
import { Button, Table, Input, Tag, Modal, Icon, message, Popconfirm, DatePicker, Form, Select, Row, Col } from 'antd';
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const signOption = signStatus();
const book_status = bookStatus();
class Selectcert extends React.Component {
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
			size: [],
			isEdit: true,
			isCancelEdit: false,
			swWork: {},
			info: {},
			isDetail: false,
			ruleForm: {},
			loading: true,
			visible: false,
			loadingSub: false,
			confirmLoading: false,
			workeType: [],
			downLoadData: []
		}
	}
	componentDidMount() {
		this.getParServicecategoryList();
		this.getSignList();

	}
	async getSignList() {
		let params = parFilter(this.state.params);

		console.log(params);
		// let arr = [];
		const { errCode,  data } = await this.$api.comm.getSignList(params);
		let newData = [];
		let diangong = [];
		let str = ''
		// data.map((item, index) => {

		// 	if (!item['swWorker']) {
		// 		data.splice(index, 1)

		// 	}
		// 	else {

		// 		let bigobj = JSON.stringify(item['swWorker'])
		// 		let obj = JSON.parse(bigobj)
		// 		if (obj) {
		// 			if ((obj.phone * 1 >= 10000000000) && obj.workersn && obj.nickName && obj.name && obj.idNo) {


		// 				arr.push(data[index])


		// 			}

		// 		}



		// 	}
		// })


		data.map((item, index) => {
			// console.log(item);

			if (item.status === -1) {//失败
				str = 3
			} else if (item.status === 0) {
				str = 1
			} else if (item.status === 1 && item.parServicecategoryid === (1 || 21)) {//成功
				str = 2
				diangong.push(item)


			}

			newData.push(Object.assign({}, item, { sign_status: str }))
		})

		newData.sort((a, b) => {

			return (a.sign_status + '') > (b.sign_status + '') ? 1 : -1;
		})



		if (errCode === 0) {
			this.setState({
				tableData: { data: newData, total: newData.length },
				loading: false,
				size: newData,
				loadingSub: false,
				downLoadData: diangong
			})

		}


	}
	// //获取工种列表
	async getParServicecategoryList() {
		let params = { page: 1, limit: 20 };
		const { errCode, data } = await this.$api.comm.getParServicecategoryList(params);
		if (errCode === 0) {
			this.setState({ workeType: data });



		}
	}
	//查询
	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFields(async (err, values) => {
			let { workNickName, workName, phone, status, timeArr } = values;
			console.log(values);

			let strBeginTime = "", strEndTime = "";
			if (timeArr && timeArr.length > 0) {
				strBeginTime = timeArr[0].format('YYYY-MM-DD HH:mm:ss');
				strEndTime = timeArr[1].format('YYYY-MM-DD HH:mm:ss');
			}
			let params = Object.assign({}, this.state.params, { page: 1, workNickName, workName, phone, status, strBeginTime, strEndTime });
			console.log(params);

			await this.setState({ params, loadingSub: true });
			this.getSignList();
		})
	}
	//分页
	async pageChange(page, pageSize) {
		let params = Object.assign({}, this.state.params, { page, limit: pageSize });
		await this.setState({ params, loading: true });
		this.getSignList();
	}
	async onShowSizeChange(current, size) {
		let params = Object.assign({}, this.state.params, { page: current, limit: size });
		await this.setState({ params, loading: true });
		this.getSignList();
	}
	//通过审核
	async handSubmitSign(id) {
		let data = { checkId: id, passFlag: 1 };
		const { errCode, errMsg } = await this.$api.comm.passOrReject(data);
		if (errCode === 0) {
			message.success('审核成功');
			await this.setState({ loading: true });
			this.getSignList();
		} else {
			message.error(errMsg);
		}
	}
	getReason(e) {
		let ruleForm = Object.assign({}, this.state.ruleForm, { reason: e.target.value });
		this.setState({
			ruleForm
		})
	}
	handleOk = async () => {
		let { ruleForm } = this.state;
		if (!ruleForm.reason) {
			message.warning('请输入拒绝理由');
			return
		}
		await this.setState({ confirmLoading: true });
		const { errCode, errMsg } = await this.$api.comm.passOrReject(ruleForm);
		if (errCode === 0) {
			message.success('操作成功');
			this.getSignList();
		} else {
			message.error(errMsg);
		}
		this.setState({ confirmLoading: false, visible: false });
	}
	handleCancel(id, isPase) {
		let ruleForm = {}, visible = this.state.visible;
		if (isPase) {
			ruleForm = Object.assign({}, this.state.ruleForm, { checkId: id, passFlag: -1 });
		}
		this.setState({
			ruleForm,
			visible: !visible,

		})
	}
	handleOff = () => {
		this.setState({
			isDetail: false
		})
	}
	showDetail(row) {
		console.log(row);

		this.setState({
			isDetail: true,
			info: row,
			swWork: row.swWorker
		})
		console.log(row);

	}
	// 清空
	cancelContent = () => {
		this.props.form.resetFields();
	}
	// 导出已签约电工数据
	// csv文件的导出
	//方法调用
	downloadCsv(data) {

		console.log(data);

		//str:table的每一列的标题，即为导出后的csv文件的每一列的标题
		let str = '作业员编号,作业员昵称,作业员姓名,作业员手机号,作业员身份证号,签约类型,工种类型,签约团队编号,签约团队名称,状态,创建时间,复审时间,订单量';
		//通过循环拿出data数据源里的数据，并塞到str中
		for (const i in data) {
			console.log(data[i]);
			let eStatus = '';
			let eParServicecategoryid = "";
			let eType = '';

			// 审核状态
			if (data[i].status === 0) {
				eStatus = "待审核"
			} else if (data[i].status === 1) {
				eStatus = '认证成功'
			} else if (data[i].status === -1) {
				eStatus = "认证失败"
			}
			// 证书类型
			if (data[i].parServicecategoryid === 1) {
				eParServicecategoryid = "电工"
			} else if (data[i].parServicecategoryid === 2) {
				eParServicecategoryid = "焊工"
			} else if (data[i].parServicecategoryid === 12) {
				eParServicecategoryid = "空调作业工"
			} else if (data[i].parServicecategoryid === 13) {
				eParServicecategoryid = "高空作业工"
			} else if (data[i].parServicecategoryid === 21) {
				eParServicecategoryid = "电工"
			}
			// 签约类型
			if (data[i].type === 0) {
				eType = "签约作业员"
			} else if (data[i].status === 1) {
				eType = '签约团队'
			}
			str += '\n' +
				data[i].swWorker["workersn"] + ',' +
				data[i].swWorker["nickName"] + ',' +
				data[i].swWorker["name"] + ',' +"\t"+
				data[i].swWorker["phone"] + ',' +"\t"+
				data[i].swWorker["idNo"] + ',' +
				eType + ',' +
				eParServicecategoryid + ',' +
				(data[i].swSignTeam ? data[i].swSignTeam["teamsn"] : '') + ',' +
				(data[i].swSignTeam ? data[i].swSignTeam["name"] : '') + ',' +
				eStatus + ','  +"\t"+
				data[i].createtime + ','  +"\t"+
				data[i].reauthtime + ',' +
				data[i].orderCount

		}
		//Excel打开后中文乱码添加如下字符串解决
		let exportContent = "\uFEFF";
		let blob = new Blob([exportContent + str], {
			type: "text/plain;charset=utf-8"
		});
		FileSaver.saveAs(blob, "签约电工列表.csv");
	};

	// 编辑时间
	// 我把这个可编辑表格的值存在state中的size中，通过key进行匹配
	// （这里key代表我这个表格的rowkey，也就是用来区分行数据的一个标识），
	// 然后修改指定行的指定数据，通过改变state中的size更新视图，同时吧更改的数据替换掉原来的  
	//  这就实现了对表格数据的实时监听，同时表格的所有数据存在了state中的size中，
	// 想要获取表格数据直接用this.state.size即可。
	handleChange = (value, record) => {


		for (var i in value) {
			record[i] = value[i];//这一句是必须的，不然状态无法更改
			this.setState({
				size: this.state.size.map((item, key) => item.key === record.key ? { ...item, [i]: value[i] } : item)
			}, () => { console.log(this.state.size) })
		}
	}
	// 保存气泡编辑
	async handleSave(key, record) {
		const { id, reauthtime } = record
		this.setState({ isCancelEdit: false });
		const { errCode, data } = await this.$api.comm.updateSignAudit({ id, reAuthTime: reauthtime });
		if (errCode === 0) {
			console.log(data);
			this.getSignList();
			message.success("编辑成功")
		}
	}


	// 编辑

	toEdit(key) {
		console.log(key);
		this.setState({ isCancelEdit: key, });
	}

	// 取消编辑
	editCancel(key) {
		console.log(key);
		this.setState({ isCancelEdit: false });
	}

	render() {
		const columns = [
			{
				title: '作业员编号',
				dataIndex: 'swWorker[workersn]',
				key: 'swWorker[workersn]',
				width: 130,
				align: "center"
			},
			{
				title: '作业员昵称',
				dataIndex: 'swWorker[nickName]',
				key: 'swWorker[nickName]',
				width: 100,
				align: "center"
			},
			{
				title: '作业员姓名',
				dataIndex: 'swWorker[name]',
				key: 'swWorker[name]',
				width: 100,
				slign: "center"
			},
			{
				title: '作业员手机号',
				dataIndex: 'swWorker[phone]',
				key: 'swWorker[phone]',
				align: "center",
				width: 100
			},
			{
				title: '作业员身份证号',
				dataIndex: 'swWorker[idNo]',
				key: 'swWorker[idNo]',
				width: 150,
				align: "center"
			},
			{
				title: '签约类型',
				dataIndex: 'type',
				key: 'type',
				width: 100,
				align: "cener",
				render: (type) => {
					let value = '', color = '';
					signOption.some(item => {
						if (item.id === type) {
							value = item.value;
							color = item.color;
							return true;
						}
					})
					return <Tag color={color}>{value}</Tag>
				}
			},
			{
				title: '工种类型',
				dataIndex: 'parServicecategoryid',
				key: 'parServicecategoryid',
				width: 100,
				align: "center",
				render: (id) => {
					let name = "";
					this.state.workeType.some(item => {
						if (item.id === id) {
							name = item.name;
							return true;
						}
					})
					return <span>{name}</span>
				}
			},
			{
				title: '签约团队编号',
				key: 'swSignTeam[teamsn]',
				width: 130,
				align: "center",
				dataIndex: 'swSignTeam[teamsn]',


			},
			{
				title: '签约团队名称',
				key: 'swSignTeam[name]',
				width: 130,
				align: "center",
				dataIndex: 'swSignTeam[name]',
			},
			{
				title: '状态',
				dataIndex: 'status',
				key: 'status',
				sortOrder: "decend",
				width: 100,
				align: "center",
				render: (status) => {
					let value = '', color = '';
					book_status.some(item => {
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
				title: '创建时间',
				dataIndex: 'createtime',
				key: 'createtime',
				width: 160,
				align: "center",
			},
			{
				title: '复审时间',
				dataIndex: 'reauthtime',
				align: 'center',
				width: 200,
				key: 'reauthtime',
				filterDropdown: true,
				filterIcon: <Icon type="edit" />,
				render: (text, record) => <DatePicker disabled={this.state.isCancelEdit===record.id?false:true} showTime  placeholder="请选择时间" defaultValue={text === "" || isNaN(text) ? moment(text, "YYYY-MM-DD HH:mm:ss") : null} onChange={(e, value, dateString) => this.handleChange({ reauthtime: value }, record)} />,
			},
			{
				title: '订单量',
				dataIndex: 'orderCount',
				key: 'orderCount',
				width: 100,
				align: "center",
				render:(text,record)=>{
					return text?text:0
				}
			},
			{
				title: '编辑',
				dataIndex: 'workerid',
				align: 'center',
				key: "workerid",
				width: 160,
				render: (text, record) => (


					this.state.size.length >= 1 ? (
						<div>
							{<Button size="small" type="primary" disabled={this.state.isCancelEdit} style={{ display: this.state.isCancelEdit === record.id ? "none" : "block", marginLeft: "45px", fontSize: "14px" }} onClick={() => { this.toEdit(record.id) }}>编辑</Button>}
							{this.state.isCancelEdit === record.id && (<div> <Popconfirm onCancel={() => this.editCancel(record.key)} title="确定保存该信息?" onConfirm={() => this.handleSave(record.id, record)}>
								<Button size="small" type="primary" style={{ marginRight: "5px", fontSize: "14px" }}>保存</Button>
							</Popconfirm>
								<Button size="small" style={{ fontSize: "14px" }} onClick={() => this.editCancel(record.key)}>取消</Button>

							</div>)}

						</div>) : null)
			},
			{
				title: "详情",
				dataIndex: 'operation',
				width: 80,
				align: "center",
				fixed:"right",
				render: (id, row) => {

					return <Button size="small" type="primary" style={{ fontSize: "14px" }} onClick={() => {
						this.showDetail(row)
					}} >详情</Button>
				}

			},
			{
				title: '操作',
				dataIndex: 'id',
				key: "id",
				width: 100,
				align: "center",
				fixed:'right',
				render: (id, row) => {
					if (row.status === 1||row.status === -1) {
						return <Tag color="cyan">已审核</Tag>
					// 	return <Button size="small" style={{ backgroundColor: " rgb(103, 194, 58)", color: "#fff" }}>认证成功</Button>
					// } else if (row.status === -1) {
					// 	// return <span>失败原因: {row.failreason}</span>
					// 	return <Button size="small" style={{ backgroundColor: " #f50", color: "#fff" }}>认证失败</Button>
					} else {
						return (
							<div className="btn">
								<Popconfirm
									placement="rightTop"
									title="是否继续通过审核?"
									onConfirm={() => { this.handSubmitSign(id) }}
									okText="确定"
									cancelText="取消"
								>
									<Tag size="small" className="btn1" color="#67C23A">通过</Tag>
								</Popconfirm>
								<Tag size="small" className="btn1" color="#F56C6C" onClick={() => { this.handleCancel(row.id, true) }} >拒绝</Tag>
							</div>
						)
					}
				},
			},
		];
		const { getFieldDecorator } = this.props.form;
		return (
			<div>
				<Form layout="inline" onSubmit={this.handleSubmit}>
					<Form.Item label="作业员昵称：">
						{getFieldDecorator('workNickName', {})(<Input allowClear />)}
					</Form.Item>
					<Form.Item label="作业员姓名：">
						{getFieldDecorator('workName', {})(<Input allowClear />)}
					</Form.Item>
					<Form.Item label="电话">
						{getFieldDecorator('phone', {})(<Input allowClear />)}
					</Form.Item>
					<Form.Item label="状态">
						{getFieldDecorator('status', {})(
							<Select style={{ width: 200 }}>
								{
									book_status.map((item, index) => {
										return <Option key={index} value={item.id}>{item.value}</Option>
									})
								}
							</Select>
						)}
					</Form.Item>
					<Form.Item label="创建时间">
						{getFieldDecorator('timeArr', {})(
							<RangePicker />
						)}
					</Form.Item>
					<Form.Item>
						<Button icon="search" type="primary" htmlType="submit" onClick={this.handleSubmit} loading={this.state.loadingSub}>查询</Button>
						<Button style={{ margin: "0 13px" }} type="default" onClick={this.cancelContent}>重置</Button>
						<Button className="btn1"  type="primary" onClick={() => { this.downloadCsv(this.state.downLoadData) }}><Icon type="download" /> 导出认证成功电工</Button>
					</Form.Item>
				</Form>
				<div className='table-wrapper'>
					<Table
						pagination={
							{
								showTotal: () => `共${this.state.tableData.total}条`,
								total: this.state.tableData.total,
								pageSize: this.state.params.limit,
								current: this.state.params.page,
								showSizeChanger: true,
								pageSizeOptions: ['10', '20', '30', '50', '100'],
								onChange: this.pageChange.bind(this),
								onShowSizeChange: this.onShowSizeChange.bind(this)
							}
						}
						scroll={{ x: 1200 }}
						rowKey={(record, index) => index}
						size="middle" align="center"
						columns={columns} dataSource={this.state.tableData.data} loading={this.state.loading} />
					<div className="btn2">
				

					</div>

				</div>
				<Modal
					title="请输入拒绝理由"
					centered
					visible={this.state.visible}
					onOk={this.handleOk.bind(this)}
					confirmLoading={this.state.confirmLoading}
					onCancel={this.handleCancel.bind(this)}
					okText="提交"
					cancelText="取消"
				>
					<TextArea rows={4} onChange={(e) => { this.getReason(e) }} allowClear placeholder="请输入拒绝理由"></TextArea>
				</Modal>


				{/* 详情 */}

				<Modal
					title="签约详情"
					visible={this.state.isDetail}
					footer={false}
					onCancel={this.handleOff}
					width={800}
				>
					<Row>
						<Col className='col-item' span={12}>
							<span className='title'>作业员编号：</span>
							<span>{this.state.swWork ? this.state.swWork.workersn : ''}</span>
						</Col>
						<Col className='col-item' span={12}>
							<span className='title'>作业员姓名：</span>
							<span>{this.state.swWork ? this.state.swWork.name : ''}</span>
						</Col>
						<Col className='col-item' span={12}>
							<span className='title'>作业员昵称：</span>
							<span>{this.state.swWork ? this.state.swWork.nickName : ''}</span>
						</Col>
						<Col className='col-item' span={12}>
							<span className='title'>作业员手机号：</span>
							<span>{this.state.swWork ? this.state.swWork.phone : ''}</span>


						</Col>
						<Col className='col-item' span={12}>
							<span className='title'>身份证号：</span>
							<span>{this.state.swWork ? this.state.swWork.phone : ''}</span>

						</Col>
						<Col className='col-item' span={12}>
							<span className='title'>工作类型：</span>
							<span>{this.state.info.orderStatus === "CANCELLED" && "已取消"}</span>
							<span>{this.state.info.orderStatus === "WAIT_PAY" && "待支付"}</span>

						</Col>
						<Col className='col-item' span={12}>
							<span className='title'>签约团队编号:</span>
							<span>{this.state.info.teamsn}</span>
						</Col>
						<Col className='col-item' span={12}>
							<span className='title'>创建时间:</span>
							<span>{this.state.info.createtime}</span>
						</Col>
						<Col className='col-item' span={12}>
							<span className='title'>复审时间:</span>
							<span>{this.state.info.reauthtime}</span>
						</Col>
						<Col className='col-item' span={12}>
							<span className='title'>订单量:</span>
							<span>{this.state.info.orderCount}</span>
						</Col>
						<Col className='col-item' span={12}>
							<span className='title'>签约类型:</span>
							<span>{this.state.info.type === 0 && "签约作业员"}</span>
							<span>{this.state.info.type === 0 && "签约团队"}</span>

						</Col>
						<Col className='col-item' span={12}>
							<span className='title'>签约状态:</span>
							<span>{this.state.info.status === 1 && "成功"}</span>
							<span>{this.state.info.status === -1 && "失败"}</span>
							<span>{this.state.info.status === 0 && "待审核"}</span>
						</Col>
						{this.state.info.status === -1 && <Col className='col-item' span={12}>
							<span className='title'>失败原因：</span>
							<span>{this.state.info.failreason}</span>

						</Col>
						}
					</Row>
				</Modal>


			</div>
		)
	}
}

const Selectcert_From = Form.create()(Selectcert);

export default Selectcert_From