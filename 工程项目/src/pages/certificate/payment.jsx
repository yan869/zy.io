import React from 'react';
import "@/styles/operator.less";
import FileSaver from 'file-saver';
import { Table, Tag, Form, Icon, Input, Button, DatePicker, Select } from 'antd'
import { parFilter } from '@/utils';
const { RangePicker } = DatePicker;
const { Option } = Select;
class Payment extends React.Component {
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
            isDownLoad: false,
            loading: true,
            loadingSub: false,
            isTeam: null,
            exportData: [],
        }
    }
    componentDidMount() {
        this.getList();
    }
    async getList() {
        let params = parFilter(this.state.params);
        const { errCode, data, total } = await this.$api.comm.getPaymentList(params);
        if (errCode === 0) {
            this.setState({
                tableData: { data, total },
                exportData: data,
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
            let { userId,  timer, payScene, payCategory } = values;

            userId = userId * 1;
            console.log(values);

            let strBeginTime = "", strEndTime = "";
            if (timer && timer.length > 0) {
                strBeginTime = timer[0].format('YYYY-MM-DD HH:mm:ss');
                strEndTime = timer[1].format('YYYY-MM-DD HH:mm:ss');
            }
            let params = Object.assign({}, this.state.params, { page: 1, userId,  payScene, payCategory, strBeginTime, strEndTime });
            console.log(params);
            await this.setState({ params, loadingSub: true });
            this.getList();
        })
    }
    // 清空
    cancelContent = () => {
        this.props.form.resetFields();
    }
    // 导出收益明细
    downloadCsv = (data) => {
        this.setState({
            isDownLoad: true
        })
        console.log(data);

        let str = '订单编号,业主编号,转账单号,金额,支付方式,支付状态,支付场景,支付时间,处理状态';
        for (const i in data) {
            let money = null;
            let category = null;
            let paystatus = '';
            let handlestatus = "";
            if (data[i].payStatus === 1) {
                handlestatus = '已处理'
            } else {
                handlestatus = '未处理'
            }
            if (data[i].payStatus === 'SUCCESS') {
                paystatus = '支付成功'
            } else {
                paystatus = '支付失败'
            }
            if (data[i].payCategory === 1) {
                category = '微信支付'
            } else if (data[i].payCategory === 2) {
                category = '支付宝'
            }
            if (data[i].money) {
                money = data[i].money
            } else {
                money = 0
            }
            str += '\n' +
                data[i].orderSn + ',' +
                data[i].userId + ',' +
                // data[i].workInfo.workersn + ',' +
                data[i].paysn + ',' +
                money + ',' +
                category + ',' +
                paystatus + ',' +
                data[i].payScene + ',' +
                data[i].payTime + ',' +
                handlestatus
        }
        let exportContent = "\uFEFF";
        let blob = new Blob([exportContent + str], {
            type: "text/plain;charset=utf-8"
        });
        FileSaver.saveAs(blob, "收益明细列表.csv");
    }
    render() {
        const isteam = JSON.parse(sessionStorage.getItem('team'))
        const columns = [
            {
                title: '订单号',
                dataIndex:'ordersn',
                key:'ordersn',
                width: 120,
                align: 'center'
            },
            {
                title: '业主编号',
                dataIndex: 'userid',
                key: 'userid',
                width: 100,
                align: 'center'

            },
            // {
            //     title: '作业员编号',
            //     dataIndex: 'workerSn',
            //     align: 'center',
            //     key: 'workerSn',
            //     width: 100
            // },
            {
                title: '转账单号',
                key: 'paysn',
                dataIndex: 'paysn',
                width: 120,
                align: "center"
            },
            {
                title: '金额(元)',
                dataIndex: 'payMoney',
                key: 'payMoney',
                width: 100,
                align: 'center',
                render: (text) => {
                    return <span>￥{text ? text.toFixed(2) : "0.00"}</span>
                }

            },
            {
                title: '支付方式',
                dataIndex: 'payCategory',
                key: 'payCategory',
                align: 'center',
                width: 100,
                render: (id) => {
                    if (id === 1) {
                        return <Tag color="green">微信支付</Tag>
                    } else if (id === 2) {
                        return <Tag color="blue">支付宝</Tag>
                    }
                }
            },
            {
                title: '支付状态',
                dataIndex: 'payStatus',
                key: 'payStatus',
                width: 100,
                align: 'center',
                render: (val) => {
                    if (val === 'SUCCESS') {
                        return <Tag color="#67C23A">成功</Tag>
                    }
                    return <Tag color="#909399">未支付</Tag>
                }
            },
            {
                title: '支付场景',
                dataIndex: 'payScene',
                key: 'payScene',
                align: 'center',
                width: 100,
                render: (val) => {
                    if (val === 'MINIAPP' || val === 'JSAPI') {
                        return <span>微信小程序</span>
                    } else if (val === 'APP') {
                        return <span>{val}</span>
                    } else if (val === 'WEB') {
                        return <span>网页</span>
                    }
                }
            },
            {
                title: '支付时间',
                dataIndex: 'payTime',
                align: 'center',
                width: 120,
                key: 'payTime',

                render: (time, row) => {
                    if (time && time.indexOf('-') === -1) {
                        const reg = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/;
                        let txt = time.replace(reg, "$1-$2-$3 $4:$5:$6");
                        return <span>{txt}</span>
                    }
                    return <span>{time}</span>
                }
            },
            {
                title: '处理状态',
                dataIndex: 'handleStatus',
                key: 'handleStatus',
                align: 'center',
                width: 100,
                render: (status) => {
                    if (status === 1) {
                        return <Tag color="#67C23A">已处理</Tag>
                    }
                    return <Tag color="#909399">未处理</Tag>
                }
            }
        ];
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Form layout="inline" onSubmit={this.handleSubmit}>
                    <Form.Item label="业主编号">
                        {getFieldDecorator('userId', {})(<Input allowClear />)}
                    </Form.Item>
                    {/* <Form.Item label="作业员编号">
                        {getFieldDecorator('workerSn', {})(<Input allowClear />)}
                    </Form.Item> */}
                    <Form.Item label="支付时间">
                        {getFieldDecorator('timer', {})(
                            <RangePicker />
                        )}
                    </Form.Item>
                    <Form.Item label="支付场景">
                        {getFieldDecorator('payScene', {})(
                            <Select style={{ width: 180 }}>
                                <Option value="JSAPI">微信小程序</Option>
                                <Option value="APP">APP</Option>
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label="支付方式">
                        {getFieldDecorator('payCategory', {})(
                            <Select style={{ width: 180 }}>
                                <Option value={1}>微信</Option>
                                <Option value={2}>支付宝</Option>
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item>
                        <Button icon="search" type="primary" htmlType="submit" onClick={this.handleSubmit} >查询</Button>
                        <Button style={{ margin: "0 13px" }} type="default" onClick={this.cancelContent} >重置</Button>
                    </Form.Item>
                </Form>
                <div className='table-wrapper' style={{ position: 'relative' }}>
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
                    {isteam && <Button style={{ position: 'absolute', bottom: 10 }} className="btn1" type="primary" onClick={async () => {
                        await this.setState({
                            isDownLoad: true
                        })
                        await this.getList()
                        this.downloadCsv(this.state.exportData)
                    }}><Icon type="download" /> 导出</Button>}

                </div>
            </div>
        )
    }
}

const Payment_From = Form.create()(Payment);

export default Payment_From