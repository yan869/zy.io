import React from 'react';
import "@/styles/Sendorders.less";
import ReactEcharts from 'echarts-for-react';
import { connect } from 'react-redux';
import { treePost, ShareData } from '@/redux/action';
import { Input, Button, Form, Table, Icon, Tree, message, Tag, Modal, Popconfirm, Divider } from 'antd'
import {
  DownOutlined,
} from '@ant-design/icons';
const { TreeNode } = Tree;
class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      itemShow: false,//模态窗显隐
      hasPath: false,//路径是否存在
      datalist: {
        name: '特种作业云',
        children: []
      },
      categoryId: '',
      updateCategoryId: '',
      updateCaidanId: '',
      modalTitle: '',
      handleSubmit: false,
      ruleForm: {}
    }
  }
  componentDidMount() {
    this.allMenu()
  }
  // 获取初始化菜单数据
  async allMenu() {
    const { data, errCode, errMsg } = await this.$api.comm.allMenu();
    if (errCode === 0) {
      this.setState({
        loading: false,
        datalist: {
          name: '特种作业云',
          children: data
        }
      })
      const { dispatch } = this.props
      dispatch(treePost(data))
    } else {
      message.error(errMsg)
    }
  }
  // 删除目录或角色
  async deleteCategoryOrMenu(id) {
    console.log(id);

    const { data, errMsg, errCode } = await this.$api.comm.delMenus({ id })
    if (errCode === 0) {
      message.success("删除成功")
      this.allMenu()
    } else {
      message.error(errMsg)
    }
  }
  // 新增或修改目录
  addMenu(item) {
    this.setState({
      itemShow: true,
      updateCategoryId: item && item.id,
      modalTitle: '新增目录',
      handleSubmit: false
    }, () => {
      if (item.id) {
        this.setState({
          modalTitle: this.state.updateCategoryId ? "编辑目录" : "新增目录",
          ruleForm: { id: item && item.id, name: item.name, icon: item.icon, url: item.url }
        })
      }
    })
  }
  // 新增或修改菜单
  addCaidan(item) {
    console.log(item);

    this.setState({
      itemShow: true,
      categoryId: item && item.id,
      updateCaidanId: item && item.parentId,
      modalTitle: '新增菜单',
      handleSubmit: true
      // handleSubmit: item&&item.parentId ? () => this.handleCaidan(item.id, parentId) : () => this.handleCaidan(item),
    }, () => {
      if (item && item.type === 1) {
        this.setState({
          modalTitle: "编辑菜单",
          ruleForm: { id: item.id, parentId: item.parentId, name: item.name, icon: item.icon, url: item.url }
        })
      }
    })
  }

  // 提交新增或编辑目录
  handleCategory() {
    this.props.form.validateFields((err, values) => {
      const { icon, path, name } = values
      // this.getUniqueUrl(path, this.state.categoryId)
      // 无id的时候就是新增目录；
      this.setState({
        ruleForm: !this.state.updateCategoryId ? { name, icon, url: path } : { id: this.state.updateCategoryId, name, icon, url: path },
      }, async () => {
        const { data, errMsg, errCode } = await this.$api.comm.addOrUpdateCatalog(this.state.ruleForm);
        if (errCode === 0) {
          this.setState({
            itemShow: false
          })
          // 如果id存在就编辑目录
          !this.state.updateCategoryId ? message.success("新增目录成功") : message.success("编辑目录成功")
          this.props.form.resetFields()
          this.allMenu()
        } else {
          message.error(errMsg)
        }
      })
    })
  }
  // 提交新增或编辑菜单
  handleCaidan() {
    this.props.form.validateFields(async (err, values) => {
      const { icon, path, name } = values;
      console.log(this.state.categoryId);

      this.setState({
        ruleForm: !this.state.updateCaidanId ? { parentId: this.state.categoryId, name, icon, url: path } : { id: this.state.categoryId, parentId: this.state.updateCaidanId, name, icon, url: path }
      }, async () => {
        console.log(this.state.ruleForm);
        const { data, errMsg, errCode } = await this.$api.comm.addOrUpdateMenu(this.state.ruleForm);
        if (errCode === 0) {
          this.setState({
            itemShow: false
          })
          // 如果id存在就编辑目录
          !this.state.updateCaidanId ? message.success("新增菜单成功") : message.success("编辑菜单成功")
          this.props.form.resetFields()
          this.allMenu()
        } else {
          message.error(errMsg)
        }
      })
    })
  }
  // 提交或取消后
  handlecancel() {
    this.setState({
      itemShow: false,
      ruleForm: {}
    })
    this.props.form.resetFields();
  }
  // 去重路径
  getUniqueUrl(path, id) {
    this.props.treePost.map((item, index) => {
      if (id != item.id) {
        if ((item.url || item.children.url) === path) {
          sessionStorage.setItem('hasPath', true)

          message.error('该路径已存在')
        }
      }

    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { ruleForm } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    const columns = [

      {
        title: "名称",
        dataIndex: "name",
        key: "name",
        align: "center",
      },
      {
        title: "图标",
        dataIndex: "icon",
        key: "icon",
        align: "center",
        render: (text) => (<Icon type={text} />)
      },
      {
        title: "类型",
        dataIndex: "parenId",
        key: "parenId",
        align: "center",
        render: (record, text) => {
          if (text.parentId === 0) {
            return <Tag color="blue">目录</Tag>
          } else {
            return <Tag color="green">菜单</Tag>
          }
        }
      },
      {
        title: "路径",
        dataIndex: "url",
        key: "url",
        align: "center",
      },
      {
        title: "操作",
        dataIndex: "id",
        key: "id",
        align: "center",
        render: (record, text) => (<div>
          {/* 修改目录或菜单 */}

          <Icon type="edit" theme="filled" style={{ color: "#087cd8" }} onClick={text.parentId === 0 ? () => this.addMenu(text) : () => this.addCaidan(text)}></Icon>
          <Divider type="vertical" />
          {/* 新增菜单 */}
          {text.type === 0 ? <span>
            <Icon type="plus-circle" theme="filled" style={{ color: "#119d5a" }} onClick={() => this.addCaidan(text)}></Icon>
            <Divider type="vertical" />
          </span> : ''}

          <Popconfirm
            placement="rightTop"
            title='是否确定删除'
            onConfirm={() => { this.deleteCategoryOrMenu(text.id) }}
            okText="确定"
            cancelText="取消"
          >
            <Icon type="delete" theme="filled" style={{ color: "#dd5044" }}></Icon>
          </Popconfirm>
        </div>)
      },
    ]
    return (
      <div>
        {/* 新增目录 */}
        <Button icon="plus" type="primary" style={{ marginBottom: '20px' }} onClick={() => this.addMenu(false)}>新增目录</Button>
        {/* 表格数据 */}
        <Table
          columns={columns}
          dataSource={this.state.datalist.children}
          pagination={false}
          rowKey={(record, index) => record.id}
          scroll={{ x: 1200 }}
          loading={this.state.loading}
          bordered
        >
        </Table>
        {/* 模态窗 */}
        <Modal
          title={this.state.modalTitle ? this.state.modalTitle : "新增目录"}
          visible={this.state.itemShow}
          onOk={!this.state.handleSubmit ? () => this.handleCategory() : () => this.handleCaidan()}
          onCancel={() => this.handlecancel()}
          okText="确认"
          cancelText="取消"
        >
          <Form  {...formItemLayout} >
            <Form.Item label="名称">
              {getFieldDecorator('name', {
                initialValue: ruleForm.id ? ruleForm.name : ''
              })(<Input allowClear />)}
            </Form.Item>
            <Form.Item label="Icon">
              {getFieldDecorator('icon', {
                initialValue: ruleForm.id ? ruleForm.icon : ''
              })(<Input allowClear />)}
            </Form.Item>
            <Form.Item label="路径">
              {getFieldDecorator('path', {
                initialValue: ruleForm.id ? ruleForm.url : ''
              })(<Input allowClear />)}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    MenuList: state.MenuList,
    treePost: state.treePost,
    ShareData: state.ShareData
  }
};
const menu_Form = Form.create()(Menu)
export default connect(mapStateToProps)(menu_Form)