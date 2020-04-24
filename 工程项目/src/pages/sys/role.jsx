import React from 'react';
import { Form, Table, Icon, Modal, Tag, Input, Divider, Select, Button, message } from 'antd';
import { parFilter } from '@/utils';
import ReactEcharts from 'echarts-for-react';
import echartTheme from '../../assets/js/echartTheme'
import echarts from 'echarts/lib/echarts'
import {
    DownOutlined,
} from '@ant-design/icons';

const { Option } = Select;

const _this = this
class Role extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tableData: {
                data: [],
                total: 0,
            },
            params: {
                page: 1,
                limit: 10
            },
            isRole: false,
            visible: false,
            ids: '',
            isEdit: false,
            loading: false,
            loadingSub: false,
            isCancelEdit: false,
            datalist: [],
            innerData: [],
            size: [],
        }
    }
    componentDidMount() {
        this.getRole()
        this.getallMenu()
    }
    getOption(data) {
        data = {
            name: '特种作业云',
            children: data
        }
        let option = {
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove'
            },
            series: [
                {
                    type: 'tree',
                    data: [data],
                    top: '1%',
                    left: '13%',
                    bottom: '1%',
                    right: '20%',

                    symbolSize: 7,

                    label: {
                        position: 'left',
                        verticalAlign: 'middle',
                        align: 'right',
                        fontSize: 14
                    },

                    leaves: {
                        label: {
                            position: 'right',
                            verticalAlign: 'middle',
                            align: 'left'
                        }
                    },

                    expandAndCollapse: true,
                    animationDuration: 550,
                    animationDurationUpdate: 750
                }
            ]
        }
        return option
    }

    // 角色管理列表
    async getRole() {
        let data = { page: 1, limit: 10, name: JSON.parse(sessionStorage.user).name };
        const res = await this.$api.comm.getRole(data);
        if (res.errCode === 0) {
            this.setState({
                tableData: { data: res.data, total: res.total },
                size: res.data
            })
        } else {
            message.error("数据错误")
        }

    }

    addRole() {
        this.setState({
            visible: true
        })
    }
    // 新增橘色
    handleSubmit() {
        const _this = this
        this.props.form.validateFieldsAndScroll(async (err, values) => {

            let { name, user, status } = values;
            let params = { name, user, status }
            const { errCode, errMsg, data } = await this.$api.comm.addSysRole(params)
            if (errCode === 0) {
                _this.getRole()
                this.setState({
                    visible: false
                })
            } else {
                message.error(errMsg)
            }
        })
    }

    // 关闭模态创
    handlecancel() {
        this.setState({
            visible: false,
            isRole: false
        })
    }

    //  编辑角色开启
    editRole(key) {
        this.setState({
            isEdit: key
        })
    }

    // 编辑name和id

    handleChange = (value, record) => {
        for (var i in value) {
            record[i] = value[i];//这一句是必须的，不然状态无法更改

            this.setState({
                size: this.state.size.map((item, key) => item.key == record.key ? { ...item, [i]: value[i] } : item)
            }, () => {
            })
        }
    }

    // 保存编辑
    async toSave(key, record) {
        let params = { id: record.id, name: record.name }
        this.setState({
            isEdit: false
        })
        const { errCode, errMsg, data } = await this.$api.comm.editRole(params);
        if (errCode === 0) {
            this.getRole()
            message.success("编辑成功")
        } else {
            message.error(errMsg)
        }
    }
    // 取消编辑
    toCancel() {
        this.setState({
            isEdit: false
        })
    }
    //改版page
    async pageChange(page) {
        let params = Object.assign({}, this.state.params, { page });
        await this.setState({ params, loading: true });
        this.getRole()
    }
    //改变limit
    async onShowSizeChange(current, size) {
        let params = Object.assign({}, this.state.params, { page: 1, limit: size });
        await this.setState({ params, loading: true });
        this.getRole()
    }
    // 展开子表格
    async handleTheRole(record) {
        let params = { id: record.id }
        const { errCode, errMsg, data } = await this.$api.comm.findRoleMenus(params);
        if (errCode === 0) {
            this.setState({
                isRole: true,
                datalist: data,
            })
        }
    }
    handleRole() {
        this.setState({
            isRole: false
        })
    }


    // 获取所有的菜单id
    async getallMenu() {
        let str = '';
        let littleStr = ''
        const { data, errCode, errMsg } = await this.$api.comm.allMenu()
        data.forEach((item, index) => {
            str += item.id + ',';
            item.children && item.children.forEach((ele, i) => {
                littleStr += ele.id + ','
            })

        })
        let ids = str + littleStr
        let reg = /,$/gi
        ids = ids.replace(reg, '')
        this.setState({
            ids,
        })
    }

    // 编辑角色目录
    async editTheRole(record) {
        const params = { roleId: record.id, ids: this.state.ids }
        const { data, errCode, errMsg } = await this.$api.comm.updateRoleMenus(params)
        if (errCode === 0) {
            sessionStorage.setItem('updateMenu',true)
            message.success('目录更新成功')
        } else {
            message.error(errMsg)
        }
    }

    render() {
        let that = this
        const workStatusList = [
            { id: 0, value: '正常接单', color: '' },
            { id: 1, value: '暂停接单', color: '' },
            { id: 2, value: '封号中', color: '' },
        ]
        const columns = [
            {
                title: '序号',
                dataIndex: 'id',
                width: 80,
                filterDropdown: true,
                filterIcon: <Icon type="edit" />,
                align: "center",
                key: 'id',
                render: (text, record) => {
                    return <Input style={{ border: record.id === this.state.isEdit ? "1px solid #d9d9d9" : 0 }} defaultValue={text} readOnly={record.id !== this.state.isEdit?"readOnly":null} onChange={(e) => this.handleChange({ id: e.target.value }, record)} />
                }
            },
            {
                title: '角色名称',
                dataIndex: 'name',
                icon: 'edit',
                key: 'name',
                filterDropdown: true,
                filterIcon: <Icon type="edit" />,
                width: 80,
                align: "center",
                render: (text, record) => {
                    return <Input style={{ border: record.id === this.state.isEdit ? "1px solid #d9d9d9" : 0 }} defaultValue={text} readOnly={record.id !== this.state.isEdit?"readOnly":null} onChange={(e) => this.handleChange({ name: e.target.value }, record)} />
                }
            },
            {
                title: '创建人',
                dataIndex: 'createBy',
                width: 80,
                align: "center",
                key: 'createBy'
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: 120,
                align: "center"
            },
            {
                title: '更新人',
                dataIndex: 'lastUpdateBy',
                width: 80,
                align: "center",
                key: 'lastUpdateBy',
            },
            {
                title: '更新时间',
                dataIndex: 'lastUpdateTime',
                align: "center",
                key: 'lastUpdateTime',
                width: 80,
            },
            {
                title: '账号状态',
                dataIndex: 'delFlag',
                width: 80,
                align: "center",
                key: 'delFlag',
                render: (text, record) => {
                    return <Tag color={text == 1 ? "#f50" : "#87d068"}>{text == 1 ? "已删除" : "正常"}</Tag>
                }
            },
            {
                title: '角色',
                align: "center",
                width: 100,
                render: (text, record) => (this.state.size.length >= 1 ? (<div style={{ marginLeft: '35px' }}>
                    <Button type="primary" size="small" disabled={this.state.isEdit} style={{ height: 25, fontSize: 12, display: this.state.isEdit === record.id ? 'none' : "block", width: 80 }} onClick={() => { this.editRole(record.id) }}>编辑</Button>
                    {this.state.isEdit === record.id && <div style={{ display: 'flex' }}>
                        <Button className="btn1" size="small" style={{ background: "#67C23A", color: "white", height: 25, fontSize: 12 }} onClick={() => { this.toSave(record.id, record) }}>保存</Button>
                        <Button className="btn1" size="small" style={{ background: "gray", color: "white", height: 25, fontSize: 12 }} onClick={() => this.toCancel(record.id)}>取消</Button>
                    </div>

                    }
                </div>) : null)

            },
            {
                title: '角色目录',
                align: "center",
                width: 150,
                render: (text, record) => {
                    return <div>
                        <Button size='small' type='primary' onClick={() => { this.handleTheRole(record) }}>详情</Button>
                        <Divider type='vertical' />
                        <Button size='small' type='default' onClick={() => { this.editTheRole(record) }}>更新目录</Button>
                    </div>
                }

            }


        ]
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
        const { tableData } = this.state
        return (
            <div>
                <Button icon="plus" type="primary" style={{ marginBottom: 10 }} onClick={() => this.addRole()}>新增</Button>
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

                    expandRowByClick={true}
                    scroll={{ x: 1200 }}
                    size="middle" align="center"
                    columns={columns}
                    rowKey={(record, index) => index}
                    dataSource={tableData.data}
                    loading={this.state.loading}
                ></Table>
                <Modal
                    title='新增账号'
                    visible={this.state.visible}
                    onOk={() => this.handleSubmit()}
                    onCancel={() => this.handlecancel()}
                    confirmLoading={this.state.confirmLoading}
                    okText="提交"
                    cancelText="取消"
                >
                    <Form  {...formItemLayout}>
                        <Form.Item label="角色名称">
                            {getFieldDecorator('name', {})(<Input allowClear />)}
                        </Form.Item>
                        <Form.Item label="创建人">
                            {getFieldDecorator('user', {})(<Input allowClear />)}
                        </Form.Item>
                        <Form.Item label="账号状态">
                            {getFieldDecorator('status', {})(<Select>
                                <Option value={0}>正常</Option>
                                <Option value={1}>已删除</Option>
                            </Select>)}
                        </Form.Item>
                    </Form>

                </Modal>

                <Modal
                    title="角色目录详情"
                    width={800}
                    visible={this.state.isRole}
                    onOk={() => this.handleRole()}
                    onCancel={() => this.handlecancel()}
                    confirmLoading={this.state.confirmLoading}
                    footer={false}
                >

                    <div>
                        <ReactEcharts option={this.getOption(this.state.datalist)} theme="Imooc" notMerge={true} lazyUpdate={true} style={{ height: 400 }} />
                    </div>
                </Modal>
            </div>
        )
    }

}
const Roles = Form.create({ name: 'Role' })(Role);
export default Roles