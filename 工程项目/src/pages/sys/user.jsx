import React from 'react';
import "@/styles/Sendorders.less";
import { userCheck, userRoles } from "@/utils";
import { Input, Button, Table, Tag, Icon, Col, Row, Modal, Form, Select, Checkbox, Divider, Popconfirm, message, Avatar } from 'antd'
const { Option } = Select;

class User extends React.Component {
  constructor(props) {

    super(props)
    this.state = {
      isEdit: true,
      isCancelEdit: false,
      visible: false,
      loading: false,
      isShow: false,
      isAdd: false,
      isAddUser: false,
      isRole: false,
      checkList: [],
      size: [],
      tableData: {
        data: [],
        total: 0
      },
      params: {
        page: 1,
        limit: 10
      },
      detailData: {}
    }
  }
  componentDidMount() {
    this.getUserlist()
  }
  // 获取用户列表
  async getUserlist() {
    const params = this.state.params
    const { data, total, errCode, errMsg } = await this.$api.comm.userList(params);
    if (errCode === 0) {
      this.setState({
        tableData: {
          data,
          total,
        },
        size: data,
        loading: false
      })
    } else {
      message.error(errMsg)
    }

  }
  // 新增用户列表
  addUser() {
    this.setState({
      isAddUser: true
    })
    this.props.form.resetFields();
  }

  //改版page
  async pageChange(page) {
    let params = Object.assign({}, this.state.params, { page });
    await this.setState({ params, loading: true });
    this.getUserlist()
  }
  //改变limit
  async onShowSizeChange(current, size) {
    let params = Object.assign({}, this.state.params, { page: 1, limit: size });
    await this.setState({ params, loading: true });
    this.getUserlist()
  }
  //取消
  handleCancel() {
    this.setState({
      isAddUser: false
    })
    this.props.form.resetFields();
  }
  //提交表单
  handleSubmit() {
    let _this = this;
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let { name, password, role } = values;
        let roleIds = null;
        roleIds = role.join(',')

        let params = { name, password, roleIds }
        console.log(params);

        _this.setState({
          isAddUser: false
        })
        const { res, data, errCode, errMsg } = await this.$api.comm.adduserList(params);
        console.log(data, errCode, errMsg);
        if (errCode == 0) {

          _this.getUserlist()
          message.success('新增成功')
          this.props.form.resetFields();
        } else {
          message.error(errMsg)
          this.props.form.resetFields();
        }
      }
    });
  };
  // 编辑单元格
  handleStatus(value, record) {
    this.setState({
      isShow: record.id
    })
    console.log(this.state.isShow);
  }
  // 打开编辑复选框
  toEdit(id) {
    this.setState({
      isCancelEdit: id
    })
  }
  // 编辑复选框
  async handleSave(key, record) {
    const that = this
    let params = ''
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      const { checkRole } = values;

      const roleIds = checkRole.join(",")
      params = { id: key, roleIds }
      return params

    })
    const { data, errCode } = await that.$api.comm.updateUserRole(params)
    if (errCode === 0) {
      console.log(data);
      that.getUserlist()
      message.success("更新角色成功")
      await that.setState({
        isCancelEdit: false
      })
    } else {
      message.error("更新角色失败")
    }

  }
  // 取消编辑
  editCancel(key) {
    this.setState({ isCancelEdit: false });
  }

  handleChange = (value, record) => {
    for (var i in value) {
      record[i] = value[i];//这一句是必须的，不然状态无法更改
      this.setState({
        size: this.state.size.map((item, key) => item.key == record.key ? { ...item, [i]: value[i] } : item)
      }, () => { console.log(record[i], record[i]) })
    }
  }

  // 单元格失去焦点
  async  offBlur(record) {
    let that = this
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      // console.log(values);
      let params = Object.assign(values, { id: record.id })
      console.log(params);

      const { data, errCode, errMsg } = await this.$api.comm.updateUserStatus(params)
      if (errCode === 0) {
        await setTimeout(() => {
          that.getUserlist()
        }, 100)
        message.success('状态更新成功')
        console.log(data);
      } else {
        message.error(errMsg)
      }

    })
    this.setState({
      isShow: false
    })
  }
  // 新增用户角色
  async addRole(item, record) {
    console.log(record)
  }




  // 验证手机是否被注册
  validateMobile(rule, value, callback) {
    // const reg = /^1[3456789]\d{9}$/;
    const { data } = this.state.tableData
    // if (!reg.test(value) && value) {
    //   callback("请填写正确的手机号码！");
    // }
    data.map((item, index) => {
      //  console.log(item);
      if (item.name == value) {
        callback('该用户已经存在'); //重要！
      }
    })
    callback(); //重要！
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 50,
        align: "center",
        render: text => <span>{text}</span>,
      },
      {
        title: '用户名称',
        align: "center",
        width: 100,
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '用户昵称',
        align: "center",
        dataIndex: 'nickName',
        key: 'nickName',
      },
      {
        title: '用户头像',
        align: "center",
        dataIndex: 'avatar',
        key: 'avatar',
        width: 100,
        render: (text) => (
          <div style={{ display: "flex", justifyContent: "center" }}>
            {text ? <Avatar style={{ display: "inlineBlock", width: 60, height: 60 }} src={text} /> : <Avatar style={{ width: 60, height: 60, display: "flex", justifyContent: "center", alignItems: "center" }}>USER</Avatar>}
          </div>
        )
      },
      {
        title: '邮箱',
        align: "center",
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '手机号',
        align: "center",
        dataIndex: 'mobile',
        key: 'mobile',
      },
      {
        title: '创建时间',
        align: "center",
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '更新时间',
        align: "center",
        dataIndex: 'updateTime',
        key: 'updateTime',
      },
      {
        title: '删除时间',
        align: "center",
        dataIndex: 'deleteTime',
        key: 'deleteTime',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        width: 130,
        filterDropdown: true,
        filterIcon: <Icon type="edit" />,
        render: (text, record) => {
          return <div >{this.state.isShow === record.id ? <Form >
            <Form.Item style={{ marginBottom: 0 }}>
              {
                getFieldDecorator('status', {
                  initialValue: 0
                })(
                  <Select defaultActiveFirstOption={true} onBlur={() => this.offBlur(record)} onChange={(value) => { this.handleChange({ status: value }, record) }} ref={this.myRef} style={{ width: 100 }}>
                    <Option value={0}>正常</Option>
                    <Option value={1}>冻结</Option>
                    <Option value={2}>删除</Option>
                  </Select>
                )
              }
            </Form.Item>
          </Form>
            : <Tag onClick={(e, value) => { this.handleStatus({ status: e.target.value }, record) }} color={text === 0 ? "#67c23a" : (text === 1 ? '#8b8f94' : "#f50")} >
              {text === 0 ? '正常' : (text === 1 ? '冻结' : '删除')}
            </Tag >}

          </div>


        }
      },
      {
        title: "角色",
        align: "center",
        dataIndex: "roles",
        filterDropdown: true,
        filterIcon: <Icon type="edit" />,
        key: "roles",
        width: 120,
        render: (text, record) => {
          return <div >
            {
              this.state.isCancelEdit === record.id ? <Form onSubmit={this.handleSave}>
                <Form.Item style={{ marginBottom: 0 }}>
                  {
                    getFieldDecorator('checkRole', {
                    })(
                      <Checkbox.Group >
                        <Col>
                          <Row >
                            <Checkbox
                              value='1'
                            >
                              系统管理员
                        </Checkbox>
                          </Row>
                          <Row >
                            <Checkbox
                              value='2'
                            >
                              团队管理员
                        </Checkbox>
                          </Row>
                        </Col>

                      </Checkbox.Group>
                    )
                  }
                </Form.Item>
              </Form> : text.map((item, index) => {
                return <span key={index} style={{ display: "flex", flexDirection: "column" }}>{item.name} </span>
              })
            }
          </div>
        }
      },
      {
        title: '操作',
        align: "center",
        width: 150,
        dataIndex: '',
        key: '',
        render: (text, record) => {
          return this.state.size.length >= 1 ? (
            <div>
              {<Button type="primary" size="small" disabled={this.state.isCancelEdit} style={{ display: this.state.isCancelEdit === record.id ? "none" : "block", marginLeft: "45px", fontSize: "14px" }} onClick={() => { this.toEdit(record.id) }}>编辑角色</Button>}
              {this.state.isCancelEdit === record.id && (<div style={{ display: "flex", justifyContent: "center", marginLeft: '15px' }}> <Popconfirm onCancel={() => this.editCancel(record.key)} title="确定保存该信息?" onConfirm={() => this.handleSave(record.id, record)}>
                <Button type="primary" size="small" style={{ margin: "0 5px" }}>保存</Button>
              </Popconfirm>
                <Button size="small" onClick={() => this.editCancel(record.key)} >取消</Button>

              </div>)}

            </div>) : null
        }
      }
    ];


    const formItemLayout = {
      labelCol: {
        xs: { span: 4 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 20 },
        sm: { span: 20 },
      },
    };
 


    return (
      <div>
        <div className='search-wrapper'>
          <Button type="primary" icon="plus" onClick={() => this.addUser()}>新增用户</Button>
        </div>
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
            columns={columns}
            dataSource={this.state.tableData.data}
          />
        </div>
        <Modal
          title="新增用户"
          visible={this.state.isAddUser}
          onOk={() => this.handleSubmit()}
          onCancel={this.handleCancel.bind(this)}
          width={500}
          okText="提交"
          cancelText="取消"
        >
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item label="用户名" hasFeedback>
              {getFieldDecorator('name', {
                rules: [
                  {validator: this.validateMobile.bind(this) }
                ],
              })(<Input placeholder='请输入英文或数字' allowClear />)}
            </Form.Item>
            <Form.Item label="密码" hasFeedback>
              {getFieldDecorator('password', {
              })(<Input placeholder='请输入密码' allowClear />)}
            </Form.Item>
            <Form.Item label="角色" >

              {
                getFieldDecorator('role', {},
                )(<Checkbox.Group>
                  <Row>
                    <Col span={12}>
                      <Checkbox
                        value='1'
                        style={{ lineHeight: 3 }}
                      >
                        系统管理员
        </Checkbox>
                    </Col>
                    <Col span={12}>
                      <Checkbox
                        value='2'
                        style={{ lineHeight: 3 }}
                      >
                        团队管理员
        </Checkbox>
                    </Col>
                  </Row>

                </Checkbox.Group>)
              }
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}
const Users = Form.create({ name: 'User' })(User);
export default Users