import React from 'react';
import "@/styles/Sendorders.less";
import ReactEcharts from 'echarts-for-react';
import { connect } from 'react-redux';
import { treePost,ShareData } from '@/redux/action';
import { Input, Button, Form, Table, Icon, Tree, message, Modal, Popconfirm, Divider } from 'antd'
import {
  DownOutlined,
} from '@ant-design/icons';
const { TreeNode } = Tree;
class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itemShow: false,//模态窗显隐
      hasPath: false,//路径是否存在
      datalist: {
        name: '特种作业云',
        children: []
      },
      categoryId: '',
      modalTitle: '',
      handleSubmit: null,
      ruleForm: {}
    }
  }
  componentDidMount() {
    this.allMenu()
  }
  getOption(data) {
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
          left: '20%',
          bottom: '1%',
          right: '25%',

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
  // 查询到所有的菜单
  async allMenu() {
    const { data, errCode, errMsg } = await this.$api.comm.allMenu();
    if (errCode === 0) {
      this.setState({
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
  // 打开新增编辑目录
  addMenu(item) {
    this.setState({
      itemShow: true,
      modalTitle: '新增目录',
      categoryId: item && item.id,
    }, () => {
      if (item && item.id) { 
        this.setState({
          modalTitle: this.state.categoryId ? '编辑目录' : '新增目录',
          ruleForm: { id: item && item.id, name: item.name, icon: item.icon, url: item.url }
        })
      }
    })
  }
  // 新增-修改目录
  handleCategory() {

    this.props.form.validateFields((err, values) => {
      const { icon, path, name } = values
      this.getUniqueUrl(path, this.state.categoryId)
      if (JSON.parse(sessionStorage.getItem('hasPath'))) {
        sessionStorage.removeItem('hasPath')
        return
      } else {
        // 没有id的时候获取
        this.setState({
          ruleForm: this.state.categoryId ? { id: this.state.categoryId, name, icon, url: path } : { name, icon, url: path },
        }, async () => {
          const { data, errMsg, errCode } = await this.$api.comm.addOrUpdateCatalog(this.state.ruleForm);
          if (errCode === 0) {
            this.setState({
              itemShow: false
            })
            // 如果id存在就编辑目录
            this.state.categoryId ? message.success("编辑目录成功"): message.success("新增目录成功")
            this.props.form.resetFields() 
            this.allMenu()
          } else {
            message.error(errMsg)
          }
        })
        sessionStorage.removeItem('hasPath')
      }
      this.props.form.resetFields();
    })
  }
  // 打开新增编辑菜单
  addCaidan(item, parentId) {
    this.setState({
      modalTitle: parentId ? '编辑菜单' : '新增菜单',
      itemShow: true,
      handleSubmit: parentId ? () => this.handleCaidan(item.id, parentId) : () => this.handleCaidan(item),
      ruleForm: { id: item.id, name: item.name, icon: item.icon, url: item.url }
    })
  }
  // 新增-编辑菜单
  handleCaidan(menuId, upId) {
    console.log(menuId, upId);
    this.props.form.validateFields((err, values) => {
      const { icon, path, name } = values;
      this.getUniqueUrl(path, this.state.menuId)
      if (JSON.parse(sessionStorage.getItem('hasPath'))) {
        sessionStorage.removeItem('hasPath')
        return
      } else {
        this.setState({
          ruleForm: upId ? { id: menuId, parentId: upId, name, icon, url: path } : { parentId: menuId, name, icon, url: path },
          handleSubmit: ""
        }, async () => {
          const { data, errMsg, errCode } = await this.$api.comm.addOrUpdateMenu(this.state.ruleForm);
          if (errCode === 0) {
            this.setState({
              itemShow: false
            })
            upId ? message.success("编辑菜单成功") : message.success("新增菜单成功")
            this.allMenu()
          } else {
            message.error(errMsg)
          }
        })
        sessionStorage.removeItem('hasPath')
      }
      this.props.form.resetFields();
    })
  }
  // 删除目录或角色
  async deleteCategoryOrMenu(id) {
    const { data, errMsg, errCode } = await this.$api.comm.delMenus({ id })
    if (errCode === 0) {
      message.success("删除成功")
      this.allMenu()
    } else {
      message.error(errMsg)
    }
  }
  // 关闭模态创
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
  // 创建树结构
  renderTreeNodes = data =>
    data.map(item => {
      let son = item.children
      if (item.children) {
        return (
          <TreeNode title={item.name && (<span>
            <Icon type={item.icon} style={{ marginRight: '10px', }} />
            <span style={{ color: "#555" }}>{item.name}</span>
            {item.parentId == 0 ? <Icon type="edit" style={{ marginLeft: '5px' }} onClick={() => this.addMenu(item)} /> : <Icon style={{ marginLeft: '5px' }} type="edit" onClick={() => { this.addCaidan(item, item.parentId) }} />}
            <Popconfirm
              placement="rightTop"
              title='是否确定删除'
              onConfirm={() => { this.deleteCategoryOrMenu(item.id) }}
              okText="确定"
              cancelText="取消"
            >
              <Icon type="delete" style={{ marginLeft: '5px', }} />
            </Popconfirm>
            {item.parentId === 0 && <Icon type="plus-circle" style={{ marginLeft: '5px' }} onClick={() => this.addCaidan(item.id)} />}
            {/* 这里是添加菜单的地方 */}
          </span>)} key={item.id}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name && (
        <span>
          <Icon type={item.icon} style={{ marginRight: '10px' }} />
          <span style={{ color: "#555" }}>{item.name}</span>
          {item.parentId === 0 ? <Icon type="edit" style={{ marginLeft: '5px' }} onClick={() => this.addMenu(item)} /> : <Icon style={{ marginLeft: '5px' }} type="edit" onClick={() => { this.addCaidan(item, item.parentId) }} />}
          <Popconfirm
            placement="rightTop"
            title='是否确定删除'
            onConfirm={() => { this.deleteCategoryOrMenu(item.id) }}
            okText="确定"
            cancelText="取消"
          >

            <Icon type="delete" style={{ marginLeft: '5px', }} />

          </Popconfirm>
          {

            item.parentId === 0 && <Icon type="plus-circle" style={{ marginLeft: '5px' }} onClick={() => this.addCaidan(item.id)} />}
          {/* 这里是添加菜单的地方 */}
        </span>
      )} key={item.id}></TreeNode>;
    });
  render() {
    const { getFieldDecorator } = this.props.form;

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
    const { ruleForm } = this.state
    return (
      <div>
        <div className='search-wrapper' >
          <Button type="primary" icon="plus" onClick={() => this.addMenu(false)}>新增目录</Button>
          <div className='table-wrapper' style={{ marginTop: '50px' }}>
            <Tree
              switcherIcon={<DownOutlined />}
              style={{ width: "40%", float: 'left' }}
            >
              {this.renderTreeNodes(this.state.datalist.children)}
            </Tree>
            <Divider type='vertical' style={{ height: 400, float: 'left' }} />
            <div style={{ width: "50%", float: 'left' }}>
              <ReactEcharts option={this.getOption(this.state.datalist)} theme="Imooc" notMerge={true} lazyUpdate={true} style={{ height: 400 }} />
            </div>
          </div>


        </div>

        <Modal
          title={this.state.modalTitle ? this.state.modalTitle : "新增目录"}
          visible={this.state.itemShow}
          onOk={this.state.handleSubmit ? this.state.handleSubmit : () => this.handleCategory()}
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
    ShareData:state.ShareData
  }
};
const menu_Form = Form.create()(Menu)
export default connect(mapStateToProps)(menu_Form)