import React from 'react';
import "@/styles/proprietary.less";
import FileSaver from 'file-saver';
import { parFilter } from '@/utils';
import { Form, Icon, message, DatePicker, Input, Button, Table, Avatar } from 'antd'
const { RangePicker } = DatePicker;
class Proprietary extends React.Component {
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
      phone: '',
      nick_name: '',
      loading: true,
      loadingSub: false,
      isDownLoad: false,
      exportData: [],
      columns: [
        {
          title: '用户编号',
          dataIndex: 'id',
          width: 100,
          align: 'center',
          key: 'id',
          render: text => <span>{text}</span>,
        },
        {
          title: '头像',
          width: 100,
          align: 'center',
          dataIndex: 'avataimg',
          key: 'avataimg',
          render: text => (
            <Avatar shape="square" size={64} src={text} icon="user"></Avatar>
          ),
        },
        {
          title: '微信昵称',
          width: 100,
          align: 'center',
          dataIndex: 'nickName',
          key: 'nickName',
        },
        {
          title: '微信号',
          width: 100,
          align: 'center',
          dataIndex: 'unionid',
          key: 'unionid',
        },
        {
          title: '邀请人数',
          width: 100,
          align: 'center',
          dataIndex: 'inviteNumber',
          key: 'inviteNumber',
          render: (text) => {
            return <span>{text ? text : 0}</span>
          }
        },
        {
          title: '手机号',
          width: 120,
          align: 'center',
          dataIndex: 'phone',
          key: 'phone',
        },
        {
          title: '注册时间',
          width: 120,
          align: 'center',
          dataIndex: 'createtime',
          key: 'createtime',
        },
      ]
    }

  }
  componentDidMount() {
    this.getOwnerList()
  }
  // 获取列表
  async getOwnerList() {
    let param = parFilter(this.state.params);
    let par = { page: 1 }
    let params = await this.state.isDownLoad ? par : param
    const res = await this.$api.comm.getOwnerList(this.state.isDownLoad ? par : param);
    let { data, total } = res;
    if (res.errCode === 0) {
      this.setState({
        tableData: { data, total, loadingSub: false },
        exportData: data
      })
    } else {
      message.error(res.errMsg)
    }
  }
  //查询
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      let { phone, nickname, strTime, } = values;
      let strBeginTime = "", strEndTime = ""
      if (strTime && strTime.length > 0) {
        strBeginTime = strTime[0].format('YYYY-MM-DD HH:mm:ss');
        strEndTime = strTime[1].format('YYYY-MM-DD HH:mm:ss');
      }
      let params = Object.assign({}, this.state.params, { page: 1, phone, strBeginTime, strEndTime, nick_name: nickname });
      await this.setState({ params, });
      console.log(this.state.params);
      this.getOwnerList()
    })
  }
  // 重置
  cancelContent = () => {
    this.props.form.resetFields();
  }
  // 分页
  async pageChange(page, pageSize) {
    let params = Object.assign({}, this.state.params, { page });
    await this.setState({ params });
    this.getOwnerList()
  }
  async  onShowSizeChange(current, size) {
    let params = Object.assign({}, this.state.params, { page: 1, limit: size });
    await this.setState({ params });
    this.getOwnerList()
  }
  // csv文件的导出
  //方法调用
  downloadCsv = (data) => {
    this.setState({
      isDownLoad: true
    })
    //str:table的每一列的标题，即为导出后的csv文件的每一列的标题
    let str = '用户编号,昵称,业主名称,手机号,注册时间';
    //通过循环拿出data数据源里的数据，并塞到str中
    for (const i in data) {
      str += '\n' +
        data[i].id + ',' +
        data[i].nickName + ',' +
        data[i].name + ',' + "\t" +
        data[i].phone + ',' + "\t" +
        data[i].createtime
    }
    //Excel打开后中文乱码添加如下字符串解决
    let exportContent = "\uFEFF";
    let blob = new Blob([exportContent + str], {
      type: "text/plain;charset=utf-8"
    });
    FileSaver.saveAs(blob, "业主列表.csv");
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const columns = this.state.columns.map((col, index) => ({
      ...col,
    }));
    return (
      <div>
        <Form layout="inline" onSubmit={this.handleSubmit}>
          <Form.Item label="昵称">
            {getFieldDecorator('nickname', {})(<Input allowClear />)}
          </Form.Item>
          <Form.Item label="手机号">
            {getFieldDecorator('phone', {})(<Input allowClear />)}
          </Form.Item>
          <Form.Item label="注册时间">
            {getFieldDecorator('strTime', {})(
              <RangePicker />
            )}
          </Form.Item>
          <Form.Item>
            <Button icon="search" type="primary" htmlType="submit" onClick={this.handleSubmit}>查询</Button>
            <Button style={{ margin: "0 13px" }} type="default" onClick={this.cancelContent} >重置</Button>
            <Button className="btn1" type="primary" onClick={async () => {
              await this.setState({
                isDownLoad: true
              })
              await this.getOwnerList()
              this.downloadCsv(this.state.exportData)
            }}><Icon type="download" /> 导出</Button>

          </Form.Item>
        </Form>
        <div className='table-wrapper' id='components-table-resizable-column'>
          <Table
            pagination={
              {
                showTotal: () => `共${this.state.tableData.total}条`,
                total: this.state.tableData.total,
                current: this.state.params.page,
                pageSize: this.state.params.limit,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '30', '50', '100'],
                onChange: this.pageChange.bind(this),
                onShowSizeChange: this.onShowSizeChange.bind(this)
              }
            }
            scroll={{ x: 1200 }}
            rowKey={(record, index) => index}
            columns={columns} dataSource={this.state.exportData} size="middle" align="center" />
        </div>

      </div>
    )
  }
}
const Proprietary_Form = Form.create()(Proprietary)
export default Proprietary_Form