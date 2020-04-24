import React from 'react';
import "@/styles/Sendorders.less";
import FileSaver from 'file-saver';
import { Button, Table, Radio, Select, Input, Icon, Form, DatePicker, message, Modal, Col, Row } from 'antd';
import { parFilter, orderStatus, commentRank, payStatus } from '@/utils';
import Zmage from 'react-zmage'
const { confirm } = Modal;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const rankList = commentRank();
const pay_Status = payStatus();
const order_status = orderStatus();
class SelectOrders extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      orderSearchData: {},
      detailData: {},
      checkStatus:null,
      userInfo: {},
      workInfo: {},
      visible: false,
      loading: true,
      tableData: {
        data: [],
        total: 0,
      },
      exportData: [],
      isDownLoad: false,
      imgList: [],
      address: {},
      params: {
        page: 1,
        limit: 10,
      }
    }
  }

  componentDidMount() {
    this.getOrderList()

  }
  // 获取订单信息
  async getOrderList() {
    let params = parFilter(this.state.params);
    const { total, data, errCode, errMsg } = await this.$api.comm.getEngineerList(params);
    if (errCode == 0) {
      this.setState({
        tableData: {
          data,
          total
        },
        exportData: data,
        loading: false
      })


    } else {
      // message.error(errMsg)
    }
  }
// async getInfo() {
//   const params = { orderId:25367, passFlag:1}
//   const { data } = await this.$api.comm.checkEngInfo(params)
//   console.log(data);

// }
// 订单详情
async showDetail(id) {
  let params = parFilter({ id: id })
  console.log(params, id);
  // this.getInfo()
  const { errMsg, errCode, data } = await this.$api.comm.getEngineerDetail(params)
  if (errCode === 0) {
    this.setState({
      visible: true,
      detailData: data,
      userInfo: data.userInfo,
      workInfo: data.workInfo,
      imgList: data.imgUrls && data.imgUrls.split("##"),
      address: data.address,
      checkStatus:data.settlementstatus
    })
    console.log(this.state.detailData);
  } else {
    message.error(errMsg)
  }

}
async pageChange(page) {
  let params = Object.assign({}, this.state.params, { page });
  await this.setState({ params, loading: true });
  this.getOrderList()
}
async onShowSizeChange(current, size) {
  let params = Object.assign({}, this.state.params, { page: 1, limit: size });
  await this.setState({ params, loading: true });
  this.getOrderList()
}
// 查询
handleSubmit = e => {
  e.preventDefault();
  this.props.form.validateFields(async (err, values) => {
    console.log(values);
    let { orderSn, settlementStatus, timeArr, userName, userPhone, teamName } = values
    let strBeginTime = "", strEndTime = "", type = '';
    if (timeArr && timeArr.length > 0) {
      strBeginTime = timeArr[0].format('YYYY-MM-DD HH:mm:ss')
      strEndTime = timeArr[1].format('YYYY-MM-DD HH:mm:ss')
    }
    let params = Object.assign({}, this.state.params, { page: 1, orderSn, settlementStatus:(settlementStatus==="已结算"?1:0), strBeginTime, strEndTime, userName, userPhone, teamName });
    console.log(params);

    await this.setState({
      params,
    })
    this.getOrderList();
  })
}
// 取消显示
handleCancel = e => {
  this.setState({
    visible: false,
    detailData:{},
  })
}
// 清空
cancelContent = () => {
  this.props.form.resetFields();
}
// 导出表格
downloadCsv = (data) => {
  this.setState({
    isDownLoad: true
  })
  //str:table的每一列的标题，即为导出后的csv文件的每一列的标题
  let str = '订单号,业主名称,手机号,订单标题,下单时间,预约时间,结算状态,订单总金额';
  for (const i in data) {
    let esettlementstatus = '';
    let money = null;
    if (data[i].money) {
      money = data[i].money
    } else {
      money = 0
    }
    if (data[i].settlementstatus === 1) {
      esettlementstatus = '已结算'
    } else if (data[i].settlementstatus === 0) {
      esettlementstatus = '未结算'
    }
    str += '\n' +
      data[i].orderSn + ',' +
      data[i].userInfo.name + ',' +
      data[i].userInfo.phone + ',' +
      data[i].title + ',' +
      data[i].orderTime + ',' +
      data[i].appointment + ',' +
      esettlementstatus + ',' +
      money
  }
  //Excel打开后中文乱码添加如下字符串解决
  let exportContent = "\uFEFF";
  let blob = new Blob([exportContent + str], {
    type: "text/plain;charset=utf-8"
  });
  FileSaver.saveAs(blob, "订单列表.csv");
}

// 审核结算状态
onChangeCheck = async (e) => {
  console.log(e);
  
  const params = { orderId: this.state.detailData.id, passFlag: e.target.value }
  const { data, errCode, errMsg } = await this.$api.comm.checkEngInfo(params);
  if(errCode===0){
    // console.log(data);
    this.getOrderList()
  }else{
    message.errCode(errMsg)
  }
}
render() {
  const isteam = JSON.parse(sessionStorage.getItem('team'))
  const columns = [
    {
      title: '订单号',
      dataIndex: 'orderSn',
      align: 'center',
      key: 'orderSn',
      render: text => <span>{text}</span>,
    },
    {
      title: '业主名称',
      dataIndex: 'userInfo[name]',
      align: 'center',
      width: 100,
      key: 'userInfo[name]',
    },
    {
      title: '业主手机号',
      width: 120,
      dataIndex: 'userInfo[phone]',
      align: 'center',
      key: 'userInfo[phone]',
    },
    {
      title: '订单标题',
      dataIndex: 'title',
      width: 120,
      align: 'center',
      key: 'title',
    },
    {
      title: !isteam && '团队名称',
      width: !isteam && 90,
      dataIndex: !isteam && 'workInfo[name]',
      align: !isteam && 'center',
      key: !isteam && 'workInfo[name]',
    },
    {
      title: '下单时间',
      dataIndex: 'orderTime',
      width: 150,
      align: 'center',
      key: 'orderTime',
    },
    {
      title: '预约时间',
      dataIndex: 'appointment',
      width: 150,
      align: 'center',
      key: 'appointment',
    },
    {
      title: '结算状态',
      key: 'settlementstatus',
      align: 'center',
      width: 100,
      dataIndex: 'settlementstatus',
      render: (text, record) => {
        if (text === 0) {
          return <span>未结算</span>
        } else if (text === 1) {
          return <span>已结算</span>
        }

      }
    },
    {
      title: '订单总金额(元)',
      width: 150,
      dataIndex: 'money',
      align: 'center',
      key: 'money',
      render: (text) => {
        return <span>￥{text ? text : "0.00"}</span>
      }
    },

    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (item, record) => (
        <Button size='small' type="primary"
          onClick={() => this.showDetail(record.id)}
        >详情</Button>
        // <span>
        //     <Divider type="vertical" />
        // </span>
      ),
    },
  ];


  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },

  };
  const { getFieldDecorator } = this.props.form;
  return (
    <div>
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <Form.Item label="订单号：">
          {getFieldDecorator('orderSn', {})(
            <Input allowClear />
          )}
        </Form.Item>
        <Form.Item label="结算状态">
          {getFieldDecorator('settlementStatus', {})(
            <Select style={{ width: 200 }}>
              {
                pay_Status.map((item, index) => {
                  return <Option key={index} value={item.value}>{item.value}</Option>
                })
              }
            </Select>
          )}
        </Form.Item>
        <Form.Item label="下单时间">
          {getFieldDecorator('timeArr', {})(
            <RangePicker />
          )}
        </Form.Item>
        <Form.Item label="客户昵称：">
          {getFieldDecorator('userName', {})(
            <Input allowClear />
          )}
        </Form.Item>
        <Form.Item label="客户手机号：">
          {getFieldDecorator('userPhone', {})(
            <Input allowClear />
          )}
        </Form.Item>
        {!isteam && <Form.Item label="团队名称：">
          {getFieldDecorator('teamName', {})(
            <Input allowClear />
          )}
        </Form.Item>}

        <Form.Item>
          <Button icon="search" type="primary" htmlType="submit" onClick={this.handleSubmit} loading={this.state.loadingSub}>查询</Button>
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
          columns={columns}
          rowKey={(record, index) => index}
          dataSource={this.state.tableData.data}
          size="middle"
          align="center" />
        <Button style={{ position: 'absolute', bottom: 10 }} className="btn1" type="primary" onClick={async () => {
          await this.setState({
            isDownLoad: true
          })
          await this.getOrderList()
          this.downloadCsv(this.state.exportData)
        }}><Icon type="download" /> 导出</Button>
      </div>
      <Modal
        title='工程订单详情'
        visible={this.state.visible}
        footer={false}
        onCancel={this.handleCancel}
        width={800}
      >

        <Row>
          <Col className='col-item' span={12}>
            <span className='title'>订单编号</span>
            <span>{this.state.detailData.orderSn}</span>
          </Col>
          <Col className='col-item' span={12}>
            <span className='title'>业主名称</span>
            <span>{this.state.userInfo.name}</span>
          </Col>
          <Col className='col-item' span={12}>
            <span className='title'>业主手机号</span>
            <span>{this.state.userInfo.phone}</span>
          </Col>
          <Col className='col-item' span={12}>
            <span className='title'>订单标题</span>
            <span>{this.state.detailData.title}</span>
          </Col>
          <Col className='col-item' span={12}>
            <span className='title'>订单描述</span>
            <span>{this.state.detailData.descr}</span>
          </Col>
          <Col className='col-item' span={12}>
            <span className='title'>下单时间</span>
            <span>{this.state.detailData.orderTime}</span>
          </Col>
          <Col className='col-item' span={12}>
            <span className='title'>预约时间</span>
            <span>{this.state.detailData.appointment}</span>
          </Col>

          <Col className='col-item' span={12}>
            <span className='title'>订单状态</span>
            {order_status.map((item, index) => {
              console.log();

              if (item.value && item.value == this.state.detailData.orderStatus) {
                return (
                  <span color={item.color} key={index}>
                    {item.label}
                  </span>
                );
              }

            })}
          </Col>
          <Col className='col-item' span={12}>
            <span className='title'>订单金额</span>
            <span>{this.state.detailData.money}</span>
          </Col>
          <Col className='col-item' span={12}>
            <span className='title'>服务地址</span>
            <span>{this.state.address.address



            }</span>
          </Col>
          <Col className='col-item' span={12}>
            <span className='title'>订单图片</span>
            <div style={{ width: 300, marginLeft: 70 }}>{this.state.imgList && this.state.imgList.length > 0 && this.state.imgList.map((item, index) => {
              return <Zmage src={item} key={index} style={{ width: 60, margin: 2 }} />

            })}</div>
          </Col>
          <Col className='col-item' span={12}>
            <span className='title'>结算状态审核</span>
            <span>
              <Radio.Group defaultValue={this.state.checkStatus} key={this.state.detailData.id} onChange={this.onChangeCheck}>
                <Radio value={0} key={1}>未结算</Radio>
                <Radio value={1} key={2}>已结算</Radio>
              </Radio.Group>
            </span>
          </Col>
        </Row>
      </Modal>
    </div>
  )

}
}
const select_Form = Form.create()(SelectOrders)
export default select_Form