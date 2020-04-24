import React from 'react';
import Zmage from 'react-zmage'
import { Form, Table, Radio, Tag, Popconfirm, Modal, Row, Col, Input, Select, Button, message, Divider, DatePicker } from 'antd';
import { parFilter, bookStatus } from '@/utils';
import "@/styles/realName.less";
const { Option } = Select;
const book_status = bookStatus();
const { RangePicker } = DatePicker;
class RealName extends React.Component {
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
            isButton: true,
            visible: false,
            info: null,
            checkStatus: null,
            theStatus: null,
            exportData: [],
            size: [],
        }
    }
    componentDidMount() {
        this.getIdAuditSortList();
    }
    // 请求排序数据列表
    async getIdAuditSortList() {
        let params = parFilter(this.state.params);

        const { data, errCode, errMsg, total } = await this.$api.comm.idCardSearchListSort(params)
        if (errCode === 0) {
            let newData = [];
            let str = '';
            data.map((item, index) => {
                if (item.status === -1) {//失败
                    str = 3
                } else if (item.status === 0) {
                    str = 1
                } else if (item.status === 1) {//成功
                    str = 2
                }
                newData.push(Object.assign({}, item, { sign_status: str }))
            })
            this.setState({
                loading: false,
                loadingSub: false,
                exportData: newData,
                size: newData,
                tableData: { data: newData, total }
            })

        } else {
            message.error(errMsg)
        }
    }
    // 请求数据列表
    async getIdAuditList() {
        let params = parFilter(this.state.params);

        const { data, errCode, errMsg, total } = await this.$api.comm.idCardSearchList(params);
        if (errCode === 0) {
            console.log(data);
            this.setState({
                loading: false,
                loadingSub: false,
                exportData: data,
                size: data,
                tableData: { data: data, total }
            })

        } else {
            message.error(errMsg)
        }
    }
    // 查询
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (values) {
                let { name, phone, status, timeArr } = values;
                let strBeginTime = "", strEndTime = "";
                console.log(values);
                if (timeArr && timeArr.length > 0) {
                    strBeginTime = timeArr[0].format('YYYY-MM-DD HH:mm:ss');
                    strEndTime = timeArr[1].format('YYYY-MM-DD HH:mm:ss');
                }
                let params = Object.assign({}, this.state.params, { name, phone, status, strBeginTime, strEndTime })
                await this.setState({ params });
                console.log(params);
                if (name || name || status || timeArr) {
                    this.getIdAuditList()
                } else {
                    this.getIdAuditSortList();
                }
            }



        })
    }
    // 清空
    cancelContent = () => {
        this.props.form.resetFields();
    }
    // 身份审核详情
    async showDetail(id) {
        let params = Object.assign({ id }, this.state.params);
        const { data, errCode, errMsg } = await this.$api.comm.idCardDetails(params)
        if (errCode === 0) {
            this.setState({
                visible: true,
                info: data,
                checkStatus: data.status
            })
            console.log(data.status);

        } else {
            message.error(errMsg)
        }
    }
    // 详情收起
    handleCancel = () => {
        this.setState({
            visible: false
        })
    }
    //改变page
    async pageChange(page) {
        let params = Object.assign({}, this.state.params, { page });
        await this.setState({ params });
        this.getIdAuditList();
    }
    //改变limit
    async onShowSizeChange(current, size) {
        let params = Object.assign({}, this.state.params, { page: 1, limit: size });
        await this.setState({ params });
        this.getIdAuditList();
    }
    // 是否通过审核
    changeCheck = async (e) => {
        console.log(e);
        let params = { id: this.state.info.id, status: e.target.value }
        const { errCode, data, errMsg } = await this.$api.comm.idCardAudit(params)
        if (errCode === 0) {
            this.getIdAuditList();

        } else {
            message.error(errMsg)
        }
    }
    // 审核实名认证
    async handleCheck(params) {
        let param = Object.assign({}, params, { id: this.state.info.id })
        const { errCode, data, errMsg } = await this.$api.comm.idCardAudit(param)
        if (errCode === 0) {
            this.getIdAuditList();
            this.setState({
                isButton: false,
                theStatus: params.status
            })
        } else {
            message.error(errMsg)
        }
    }

    render() {

        const columns = [
            {
                title: '用户编号',
                dataIndex: 'workerid',
                width: 80,
                align: "center",
                key: 'workerid',
            },
            {
                title: '用户姓名',
                dataIndex: 'name',
                key: 'name',
                width: 80,
                align: "center",
            },
            {
                title: "用户手机号",
                dataIndex: 'phone',
                key: 'phone',
                width: 80,
                align: "center",
            },
            {
                title: "用户身份证号",
                dataIndex: 'idnumber',
                key: 'idnumber',
                width: 80,
                align: "center",
            },
            {
                title: "本人照片",
                dataIndex: 'photo',
                key: 'photo',
                width: 60,
                align: "center",
                render: (text, record) => {
                    return <Zmage src={text} style={text&&({ display: 'block', width: "100px", height: "60px", objectFit: "cover" })} alt="" />
                }
            },
            {
                title: "身份证照片",
                dataIndex: 'idcardobverse',
                key: 'idcardobverse',
                width: 100,
                align: "center",
                render: (text, record) => {
                    return <div style={{ display: 'flex', flexDirection: "center",justifyContent:"center" }}>
                        <Zmage src={record.idcardobverse} alt="" style={text&&({ width: 60, height: 60, objectFit: "cover", marginRight: "5px" })} />
                        <Zmage src={record.idcardreverse} alt="" style={text&&({width: 60, height: 60, objectFit: "cover"})} />

                    </div>

                }
            },
            {
                title: "提交时间",
                dataIndex: 'createtime',
                key: 'createtime',
                width: 80,
                align: "center",
            },
            {
                title: "认证状态",
                dataIndex: 'status',
                key: 'status',
                width: 80,
                align: "center",
                render: status => {
                    return <span>{(status === 0 ? "待审核" : (status === 1 ? "通过" : '未通过'))}</span>
                }

            } ,
            {
                title: "操作",
                dataIndex: 'action',
                key: 'action',
                width: 80,
                align: "center",
                render: (item, record) => (
                    <div className="btn">
                        <Button className="btn1" size='small' type="primary"
                            onClick={
                                () => {
                                    this.showDetail(record.id)
                                }
                            }
                        >详情</Button>
                    </div>


                )
            }


        ]
        const { getFieldDecorator } = this.props.form;

        return (
            <div>
                {/* 查询 */}
                <Form layout="inline" style={{ marginBottom: "10px" }}>
                    <Form.Item label="用户姓名">
                        {getFieldDecorator('name', {})(<Input allowClear />)}
                    </Form.Item>
                    <Form.Item label="用户手机号">
                        {getFieldDecorator('phone', {})(<Input allowClear />)}
                    </Form.Item>
                    <Form.Item label="认证状态">
                        {getFieldDecorator('status', {})(<Select style={{ width: 200 }}>
                            {
                                book_status.map((item, index) => {
                                    return <Option key={index} value={item.id}>{item.value}</Option>
                                })
                            }
                        </Select>)}
                    </Form.Item>
                    <Form.Item label="提交时间">
                        {getFieldDecorator('timeArr', {})(<RangePicker allowClear />)}
                    </Form.Item>

                    <Form.Item className="btn">
                        <Button icon="search" className="btn1" type="primary" htmlType="submit" onClick={this.handleSubmit} loading={this.state.loadingSub}>查询</Button>
                        <Button className="btn1" type="default" onClick={this.cancelContent} >重置</Button>
                    </Form.Item>
                </Form>

                {/* 表格 */}
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
                ></Table>


                {/* 详情 */}
                <Modal
                    title="实名认证详情"
                    visible={this.state.visible}
                    footer={false}
                    onCancel={this.handleCancel}
                    width={800}
                >
                    <Row>
                        <Col className='col-item ' span={12}>
                            <span className='title'>用户编号</span>
                            <span>{this.state.info && this.state.info.workerid}</span>
                        </Col>
                        <Col className='col-item ' span={12}>
                            <span className='title'>姓名</span>
                            <span>{this.state.info && this.state.info.name}</span>
                        </Col>
                        <Col className='col-item ' span={12}>
                            <span className='title'>用户手机号</span>
                            <span>{this.state.info && this.state.info.phone}</span>
                        </Col>
                        <Col className='col-item ' span={12}>
                            <span className='title'>用户身份证号</span>
                            <span>{this.state.info && this.state.info.idnumber}</span>
                        </Col>
                        <Col className='col-item ' span={12}>
                            <span className='title'>本人照片</span>
                            <span><Zmage style={{ width: 60, height: 80, objectFit: "cover" }} src={this.state.info && this.state.info.photo} /></span>
                        </Col>
                        <Col className='col-item ' span={12}>
                            <span className='title'>本人身份证照片</span>
                            <span style={{ display: "inlineBlock" }}>
                                <Zmage style={{ width: 80, height: 60, objectFit: "fill", marginRight: '3px' }} src={this.state.info && this.state.info.idcardobverse} />
                                <Zmage style={{ width: 80, height: 60, objectFit: "fill" }} src={this.state.info && this.state.info.idcardreverse} />
                            </span>
                        </Col>
                        <Col className='col-item ' span={12}>
                            <span className='title'>创建时间</span>
                            <span>{this.state.info && this.state.info.createtime}</span>
                        </Col>
                        <Col className='col-item ' span={12}>
                            <span className='title'>复审时间</span>
                            <span>{this.state.info && this.state.info.audittime}</span>
                        </Col>
                        <Col className='col-item ' span={12}>
                            <span className='title'>审核状态</span>
                            <span>{this.state.info && (this.state.info.status === -1 || this.state.theStatus === -1 ? "未通过" : (this.state.info.status === 1 || this.state.theStatus === 1 ? "通过" : "待审核"))}</span>
                        </Col>
                        <Col className='col-item ' span={12}>
                        </Col>
                        {
                            this.state.info && this.state.info.status !== (1 || -1) && <Col className='col-item ' span={12}>
                                <span className='title'>结算状态审核</span>
                                <span>
                                    {
                                        this.state.isButton ? <div>
                                            <Button type="primary" size="small" style={{ marginRight: "10px" }} onClick={() => this.handleCheck({ status: 1 })}>
                                                通过
                           </Button>
                                            <Button type="danger" size="small" style={{ marginRight: "10px" }} onClick={() => this.handleCheck({ status: -1 })}>
                                                拒绝
                              </Button>
                                        </div>
                                            : ''
                                    }
                                </span>
                            </Col>
                        }

                    </Row>

                </Modal>
            </div>
        )
    }

}

const RealName_form = Form.create()(RealName)
export default RealName_form