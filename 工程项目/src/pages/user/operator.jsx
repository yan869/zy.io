import React from 'react';
import "@/styles/operator.less";
import "@/styles/proprietary.less";
import FileSaver from 'file-saver';
import axios from "../../http/axios";
import { Resizable } from 'react-resizable';
import { Modal, Row, Col, Upload, Input, Button, DatePicker, Divider, Table, Icon, Avatar, Form, message, Tag } from 'antd';
import { parFilter, fileUpload } from '@/utils';
const { RangePicker } = DatePicker;
const actionUrl = fileUpload();
// const ResizeableTitle = props => {
//   const { onResize, width, ...restProps } = props;
//   if (!width) {
//     return <th {...restProps} />;
//   }

//   return (
//     <Resizable
//       width={width}
//       height={0}
//       onResize={onResize}
//       draggableOpts={{ enableUserSelectHack: false }}
//     >
//       <th {...restProps} />
//     </Resizable>
//   );
// };

class Operator extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      loadingSub: false,
      visible: false,
      isDownLoad: false,
      exportData: [],
      isBetray: false,
      tableData: {
        data: [],
        total: 0
      },
      betrayList: [],
      detailData: {},
      params: {
        page: 1,
        limit: 10
      },
     columns : [
        {
          title: '作业员编号',
          dataIndex: 'workersn',
          key: 'workersn',
          align: 'center',
          width: 100,
          // fixed: 'left',
          render: text => <span>{text}</span>,
        },
        {
          title: '头像',
          dataIndex: 'avataimg',
          key: 'avataimg',
          align: "center",
          width: 100,
          // fixed: 'left',
          render: text => (
            <Avatar shape="square" size={64} src={text} icon="user"></Avatar>
          ),
        },
  
        {
          title: '昵称',
          align: "center",
          width: 100,
          dataIndex: 'nickName',
          key: 'nickName',
        },
        {
          align: "center",
          title: '手机账号',
          width: 120,
          key: 'phone',
          dataIndex: 'phone',
        },
        {
          align: "center",
          title: '可提现金额',
          width: 100,
          dataIndex: 'allowcash',
          key: 'allowcash',
          render: (allowcash) => {
            if (allowcash) {
              return <span>￥{(allowcash * 1).toFixed(2)}</span>
            } else {
              return <span>￥0.00</span>
            }
          }
        },
        {
          align: "center",
          width: 130,
          title: '累计提现金额',
          dataIndex: 'cashtotal',
          key: 'cashtotal',
          render: (cashtotal) => {
            if (cashtotal) {
              return <span>￥{(cashtotal * 1).toFixed(2)}</span>
            } else {
              return <span>￥0.00</span>
            }
          }
        },
        {
          width: 100,
          align: "center",
          title: '评分',
          dataIndex: 'score',
          key: 'score',
        },
        {
          title: '支付宝账号',
          width: 120,
          align: "center",
          dataIndex: 'alipay',
          key: 'alipay',
        },
        {
          title: '支付宝实名',
          width: 100,
          align: "center",
          dataIndex: 'alipayname',
          key: 'alipayname',
        },
        {
          title: '邀请人数',
          width: 100,
          align: 'center',
          dataIndex: 'inviteNumber',
          key: 'inviteNumber',
          render:(text)=>{
            return <span>{text?text:0}</span>
          }
        },
        {
          title: '注册时间',
          align: "center",
          dataIndex: 'createtime',
          key: 'createtime',
          width: 150,
        },
        {
          title: '工种',
          dataIndex: '',
          key: '',
          align: "center",
          width: 100,
          render: () => <span>电工</span>
        },
        {
          title: '角色',
          dataIndex: 'teamleaderflag',
          align: "center",
          width: 100,
          key: 'teamleaderflag',
          width: 150,
          render: (item, record) => {
            if (item == 1) {
              return <span>签约作业员 </span>
            } else {
              return <span>普通作业员 </span>
            }
  
  
          }
        },
    
        {
          title: '完成订单数',
          dataIndex: 'worktimes',
          key: 'worktimes',
          align: "center",
          width: 100,
        },
        {
          title: '违约次数',
          dataIndex: 'count',
          align: "center",
          key: 'count',
          width: 80,
          render: (text, record) => {
            return <div>
              {
                text ? <span>{text + "次"}</span> : "0次"
              }
            </div>
          }
        },
        {
          title: '作业员状态',
          dataIndex: 'workstatus',
          align: "center",
          width: 100,
          key: 'workstatus',
          render: (item, record) => {
            if (item == 0) {
              return <span>正常接单</span>
            } else if (item == 1) {
              return <span>暂停接单</span>
            } else if (item == 2) {
              return <span>封号中</span>
            }
            return <span>暂无数据</span>
          }
        },
        {
          title: '操作',
          key: 'id',
          fixed: 'right',
          align: 'center',
          width: 180,
          render: (text, row) => (
            <div className="btn">
              <Tag className="btn1" onClick={() => {
                this.showDetail(true, row)
              }} size='small' color="#2db7f5">作业员详情</Tag>
             {/*&&row.workstatus===1   */}
              {(row.count >= 1&&row.workstatus===1)? <Tag className="btn1" onClick={() => {
                this.betrayDetail(true, row)
              }} size='small' color="#f50">违约详情</Tag>:""}
            </div>
          ),
        },
      ]
  
    }
  }
  handleCancel = e => {
    this.setState({
      visible: false,
      isBetray: false
    });
  };
  componentDidMount() {
    this.getWorkerList()
  }
  async getWorkerList() {
    let param = parFilter(this.state.params);
    let par = { page: 1 }

    let params = await this.state.isDownLoad ? par : param
    const { res, errCode, total, data } = await this.$api.comm.getWorkerList(this.state.isDownLoad ? par : param);
    if (errCode === 0) {
      this.setState({
        tableData: {
          data,
          total,
        },
        exportData: data,
        loading: false,
        loadingSub: false,
      })

    }
  }
  //作业员 详情
  async showDetail(isPase = false, row) {
    const { errCode, data } = await this.$api.comm.getWorkerDetail({ id: row.id });

    if (errCode == 0) {
      this.setState({
        visible: true,
        detailData: data
      })
    }
  }
  // 违约详情
  betrayDetail(isPase = false, row) {
    let that = this
    axios(`/SwSignCheck/getAdultAccountDetail?workId=${row.id}`).then(function (res) {


      if (res.errCode === 0) {
        that.setState({
          isBetray: true,
          betrayList: res.data
        })
      }
    })
  }
  //查询
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      let { workerSn, phone, nickname, name, strTime, alipay } = values;
      let strBeginTime = "", strEndTime = ""
      if (strTime && strTime.length > 0) {
        strBeginTime = strTime[0].format('YYYY-MM-DD HH:mm:ss');
        strEndTime = strTime[1].format('YYYY-MM-DD HH:mm:ss');
      }
      let params = Object.assign({}, this.state.params, { page: 1, workerSn, phone, strBeginTime, strEndTime, name, nickname, alipay });
      await this.setState({ params, loadingSub: true });
      this.getWorkerList();
    })
  }
  // 数据导入
  uploadMibfiles = file => {
		this.fileList = file;
	}
	fileState = info => {
		let that=this
		if (info.file.status === 'uploading') {
			this.setState({ loadingImg: true });
			return;
		  }
		  if (info.file.status === 'done') {
			let { response } = info.file;
			if (response.errCode === 0) {
			  message.success('上传成功！');
			  that.getWorkerList()
			} else {
			  message.error(response.errMsg);
			}
		  }
	}
  pageChange(page, pageSize) {
    let params = Object.assign({}, this.state.params, { page, limit: pageSize });
    this.setState({
      params,
      loading: true
    }, () => {
      this.getWorkerList()
    })
  }
  onShowSizeChange(current, size) {
    let params = Object.assign({}, this.state.params, { page: current, limit: size });
    this.setState({
      params,
      loading: true
    }, () => {
      this.getWorkerList()
    })
  }
  // 清空
  cancelContent = () => {
    this.props.form.resetFields();
  }
  // 导入文件
  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loadingImg: true });
      return;
    }
    if (info.file.status === 'done') {
      let { response } = info.file;
      if (response.errCode === 0) {
        message.success('上传成功！');
        this.getWorkerList()
      } else {
        message.error(response.errMsg);

      }
    }
  }
  // csv文件的导出
  //方法调用
  downloadCsv = (data) => {
    this.setState({
      isDownLoad: true
    })
    //str:table的每一列的标题，即为导出后的csv文件的每一列的标题
    let str = '序号,作业员编号,昵称,支付宝姓名,手机号,累计提现金额,注册时间,角色,完成订单数';
    //通过循环拿出data数据源里的数据，并塞到str中
    for (const i in data) {
      str += '\n' +
        data[i].id + ',' +
        data[i].workersn + ',' +
        data[i].nickName + ',' +
        data[i].alipayname + ',' +
        data[i].phone + ',' +
        data[i].cashtotal + ',' +
        data[i].createtime + ',' +
        (data[i].teamleaderflag === 0 ? '普通作业员' : '签约作业员') + ',' +
        data[i].worktimes
    }
    //Excel打开后中文乱码添加如下字符串解决
    let exportContent = "\uFEFF";
    let blob = new Blob([exportContent + str], {
      type: "text/plain;charset=utf-8"
    });
    FileSaver.saveAs(blob, "作业人员列表.csv");
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const columns =this.state.columns.map((col, index) => ({
      ...col,
    }));
    const props = {
      name: 'file',
      action: "http://47.110.140.230:90/excel/upload",
      headers: {
        authorization: 'authorization-text',
      },
    };
    const { betrayList } = this.state;
    return (
      <div>
        <Form layout="inline" onSubmit={this.handleSubmit}>
          <Form.Item label="作业员编号">
            {getFieldDecorator('workerSn', {})(<Input allowClear />)}
          </Form.Item>
          <Form.Item label="电话">
            {getFieldDecorator('phone', {})(<Input allowClear />)}
          </Form.Item>
          <Form.Item label="昵称">
            {getFieldDecorator('nickname', {})(<Input allowClear />)}
          </Form.Item>
          <Form.Item label="姓名">
            {getFieldDecorator('name', {})(<Input allowClear />)}
          </Form.Item>
          <Form.Item label="支付宝">
            {getFieldDecorator('alipay', {})(<Input allowClear />)}
          </Form.Item>
          <Form.Item label="注册时间">
            {getFieldDecorator('strTime', {})(
              <RangePicker />
            )}
          </Form.Item>
          <Form.Item>
            <Button icon="search" type="primary" htmlType="submit" onClick={this.handleSubmit} loading={this.state.loadingSub}>查询</Button>
            <Button style={{ margin: "0 13px" }} type="default" onClick={this.cancelContent} >重置</Button>
          </Form.Item>
        </Form>
        <div style={{position:'relative'}} className='table-wrapper' id='components-table-resizable-column'>
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
            columns={columns} dataSource={this.state.tableData.data} size="middle" align="center"
            loading={this.state.loading} />
            <Button style={{position:'absolute',bottom:10}} className="btn1"
              onClick={async () => {
                await this.setState({
                  isDownLoad: true
                })
                await this.getWorkerList()
                console.log(this.state.exportData);

                this.downloadCsv(this.state.exportData)
              }}
            ><Icon type="download" /> 导出</Button>
        </div>
        <Modal
          title="作业员详情"
          visible={this.state.visible}
          footer={false}
          onCancel={this.handleCancel}
          width={800}
        >
          <Row>
            <Col className='col-item ' span={12}>
              <span className='title'> 昵称：</span>
              <span>{this.state.detailData.nickName}</span>
            </Col>
            <Col className='col-item' span={12}>
              <span className='title'>作业员编号:</span>
              <span>{this.state.detailData.workersn}</span>
            </Col>
            <Col className='col-item' span={12}>
              <span className='title'>用户头像：</span>
              <span><img src={this.state.detailData.avataimg} alt="" /></span>
            </Col>
            <Col className='col-item' span={12}>
              <span className='title'>是否通过身份认证:</span>
              <span>{this.state.detailData.isfacedetect ? "已认证" : "未认证"}</span>
            </Col>
            <Col className='col-item' span={12}>
              <span className='title'>支付宝实名:</span>
              <span>{this.state.detailData.alipayname}</span>
            </Col>
            <Col className='col-item' span={12}>
              <span className='title'>余额</span>
              <span>￥{this.state.detailData.allowcash ? (this.state.detailData.allowcash * 1).toFixed(2) : '0.00'}</span>
            </Col>
            <Col className='col-item' span={12}>
              <span className='title'>工种:</span>
              <span>电工</span>
            </Col>
            <Col className='col-item' span={12}>
              <span className='title'>保证金:</span>
              <span>￥{this.state.detailData.marginmoney ? (this.state.detailData.marginmoney * 1).toFixed(2) : '0.00'}</span>
            </Col>
            <Col className='col-item' span={12}>
              <span className='title'>评分:</span>
              <span>{this.state.detailData.score}</span>
            </Col>
            <Col className='col-item' span={12}>
              <span className='title'>角色:</span>
              <span>{this.state.detailData.signflag == 0 ? '普通作业员' : '签约作业员'}</span>
            </Col>


            <Col className='col-item' span={12}>
              <span className='title'>可提现金额</span>
              <span>￥{this.state.detailData.allowcash ? (this.state.detailData.allowcash * 1).toFixed(2) : "0.00"}</span>
            </Col>
            <Col className='col-item' span={12}>
              <span className='title'>作业员状态:</span>
              <span>
                {this.state.detailData.workstatus == "0" && '正常接单'}
                {this.state.detailData.workstatus == "1" && '暂停接单'}
                {this.state.detailData.workstatus == "2" && '封号中'}
              </span>
            </Col>
            <Col className='col-item' span={12}>
              <span className='title'>累计提现金额:</span>
              <span>￥{this.state.detailData.cashtotal ? (this.state.detailData.cashtotal).toFixed(2) : '0.00'}</span>
            </Col>
            <Col className='col-item' span={12}>
              <span className='title'>手机号:</span>
              <span>{this.state.detailData.phone}</span>
            </Col>
            <Col className='col-item' span={12}>
              <span className='title'>完成订单数:</span>
              <span>{this.state.detailData.worktimes}</span>
            </Col>
            <Col className='col-item' span={12}>
              <span className='title'>支付宝账号:</span>
              <span>{this.state.detailData.alipay}</span>
            </Col>
            <Col className='col-item' span={12}>
              <span className='title'>注册时间:</span>
              <span>{this.state.detailData.createtime}</span>
            </Col>
          </Row>
        </Modal>
        <Modal
          title="作业员违约详情"
          visible={this.state.isBetray}
          footer={false}
          onCancel={this.handleCancel}
          width={800}
        >
          <div style={{ width: "100%" }}>
            {
              betrayList.map((item, index) => {
                return <div key={index} style={{ height: 200 * (index + 1) }}>
                  <Col className='col-item' span={12}>
                    <span className='title'>作业员编号:</span>
                    <span>{item.workid}</span>
                  </Col>
                  <Col className='col-item' span={12}>
                    <span className='title'>违约订单号:</span>
                    <span>{item.orderid}</span>
                  </Col>
                  <Col className='col-item' span={12}>
                    <span className='title'>违约类型:</span>
                    {
                      item.type === 0 && <span>作业员违约</span>
                    }
                    {
                      item.type === 1 && <span>业主违约</span>
                    }
                  </Col>
                  <Col className='col-item' span={12}>
                    <span className='title'>违约金额:</span>
                    <span>￥{item.money?item.money:"0.00"}</span>
                  </Col>
             
                  <Col className='col-item' span={12}>
                    <span className='title'>订单标题:</span>
                    <span>{item.createTime}</span>
                  </Col>
                  <Col className='col-item' span={12}>
                    <span className='title'>订单预约上门时间:</span>
                    <span>{item.lastUpdateTime}</span>
                  </Col>
                  <Col className='col-item' span={12}>
                    <span className='title'>订单取消时间:</span>
                    <span>{item.lastUpdateTime}</span>
                  </Col>
                  <Col className='col-item' span={12}>
                    <span className='title'>违约扣除金额:</span>
                    <span>￥{item.lastUpdateTime?item.lastUpdateTime:"0.00"}</span>
                  </Col>
                  <Col className='col-item' span={12}>
                    <span className='title'>删除标志:</span>
                    {
                      item.delFlag === 0 && <span>正常</span>
                    }
                    {
                      item.delFlag === 1 && <span>删除(恢复接单)</span>
                    }
                  </Col>
                </div>
              })
            }
          </div>

        </Modal>
      </div>
    )
  }
}
const Operator_From = Form.create()(Operator);
export default Operator_From