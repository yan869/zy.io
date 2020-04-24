import React from 'react';
import FileSaver from 'file-saver';
import moment from "moment"
import { parFilter, bookStatus } from '@/utils';
import "@/styles/Sendorders.less";
import { Select, Input, Button, Icon, Table, DatePicker, Tag, Form, Modal, message, Popconfirm } from 'antd';
import RcViewer from '@hanyk/rc-viewer';
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const book_status = bookStatus()

class Auditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      params: {
        page: 1,
        limit: 10
      },
      isCancelEdit: false,
      loading: true,
      visible: false,
      loadingSub: false,
      confirmLoading: false,
      isEdit: false,
      tableData: {
        data: [],
        total: 0
      },
      ruleForm: {},
      workeType: [],
      isDownLoad: false,
      exportData: [],
      size: [],
    }
  }
  componentDidMount() {
    this.getParServicecategoryList();
    this.getBookList();
  }
  //获取工种列表
  async getParServicecategoryList() {
    let params = parFilter(this.state.params);
    const { errCode, data } = await this.$api.comm.getParServicecategoryList(params);
    if (errCode === 0) {
      this.setState({ workeType: data });
    }
  }
  async getBookList() {
    let param = parFilter(this.state.params);
    let par = { page: 1 }
    let params = await this.state.isDownLoad ? par : param
    const res = await this.$api.comm.certSortSearch(this.state.isDownLoad ? par : param)
    if (res.errCode === 0) {
      let { data, total } = res;
      let newData = [];
      let arr = [];
      let str = ''
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
    }
  }

  async getList() {
    let params = parFilter(this.state.params);
    const { errCode, data, total } = await this.$api.comm.certSearch(params);
    if (errCode === 0) {
      this.setState({
        loading: false,
        loadingSub: false,
        exportData: data,
        size: data,
        tableData: { data: data, total }
      })
    }

  }

  async pageChange(page) {
    let params = Object.assign({}, this.state.params, { page });
    await this.setState({ params, loading: true });
    this.getBookList();
  }
  async onShowSizeChange(current, size){
    let params = Object.assign({}, this.state.params, { page: 1, limit: size });
    await this.setState({ params, loading: true });
    this.getBookList();
  }
  //查询
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      // parServicecategoryid
      let { workerSn, status, timeArr,name } = values;
      let strBeginTime = "", strEndTime = "";
      if (timeArr && timeArr.length > 0) {
        strBeginTime = timeArr[0].format('YYYY-MM-DD HH:mm:ss');
        strEndTime = timeArr[1].format('YYYY-MM-DD HH:mm:ss');
      }
      let params = Object.assign({}, this.state.params, { page: 1,name, workerSn, status, strBeginTime, strEndTime });
      console.log(params);

      await this.setState({ params, loadingSub: true });
      // ||parServicecategoryid
      if (workerSn || status || timeArr||name ) {
        this.getList();
      } else {
        this.getBookList();
      }

    })
  }
  //通过审核
  async handSubmitBook(id) {
    let data = { id, status: 1 };
    const { errCode, errMsg } = await this.$api.comm.certAudit(data);
    if (errCode === 0) {
      message.success('审核成功');
      await this.setState({ loading: true });
      this.getBookList();
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
    const { errCode, errMsg } = await this.$api.comm.certAudit(ruleForm);
    if (errCode === 0) {
      message.success('操作成功');
      this.getBookList();
    } else {
      message.error(errMsg);
    }
    this.setState({ confirmLoading: false, visible: false });
  }
  async handleCancel(id, isPase) {
    if (isPase) {
      let ruleForm = Object.assign({}, this.state.ruleForm, { id, status: -1 });
      await this.setState({ ruleForm });
    }
    let visible = this.state.visible;
    this.setState({
      visible: !visible
    })
  }
  // 重置
  cancelContent = () => {
    this.props.form.resetFields();
  }
  // 数据导出
  //方法调用
  downloadCsv = (data) => {
    //str:table的每一列的标题，即为导出后的csv文件的每一列的标题
    let str = '作业员编号,作业员姓名,身份证号,提交时间,审核状态,失败原因,证书名称,证书类型,证书编号,证书开始有效时间,证书失效时间,复审时间';
    //通过循环拿出data数据源里的数据，并塞到str中
    for (const i in data) {

      let eStatus = '';
      let eParServicecategoryid = "";
      // 审核状态
      if (data[i].status === 0) {
        eStatus = "待审核"
      } else if (data[i].status === 1) {
        eStatus = "认证成功"
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

      if (eStatus === "认证成功" && eParServicecategoryid === "电工") {
        str += '\n' +
          data[i].workerSn + ',' +
          data[i].name + ',' +
          data[i].idNo + ',' +
          data[i].createtime + ',' +
          eStatus + ',' +
          data[i].failreason + ',' +
          data[i].certname + ',' +
          eParServicecategoryid + ',' +
          data[i].certno + ',' +
          data[i].certstarttime + ',' +
          data[i].certendtime + ',' +
          data[i].reauthtime
      }


    }
    //Excel打开后中文乱码添加如下字符串解决
    let exportContent = "\uFEFF";
    let blob = new Blob([exportContent + str], {
      type: "text/plain;charset=utf-8"
    });

    FileSaver.saveAs(blob, "证书审核列表.csv");
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
      }, () => { })
    }
  }
  // 保存气泡编辑
  async handleSave(key, record) {
    const { id, certstarttime, certendtime, reauthtime,certno } = record
    this.setState({ isCancelEdit: false });
    const { errCode, data } = await this.$api.comm.certUpdate({ id, certStartTime: certstarttime, certEndTime: certendtime, reAuthTime: reauthtime ,certno});
    if (errCode === 0) {
      this.getBookList();
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
    this.setState({ isCancelEdit: false });
  }




  render() {
    const options = {}
    let isEdit = false;
    const { form: { getFieldDecorator }, dataSource } = this.props
    const columns = [
      {
        title: '用户编号',
        dataIndex: 'workerSn',
        align: 'center',
        width: 150,
        key: 'workerSn',

      },
      {
        title: '用户姓名',
        dataIndex: 'name',
        align: 'center',
        width: 100,
        key: 'name',
        width: 90
      },
      {
        title: '身份证号',
        dataIndex: 'idNo',
        align: "center",
        key: 'idNo',
        width: 170
      },
      {
        title: '提交时间',
        align: 'center',
        width: 150,
        dataIndex: 'createtime',
        key: 'createtime',
      },
      {
        title: '审核状态',
        align: 'center',
        width: 150,
        dataIndex: 'status',
        key: 'status',
        width: 140,

        render: (status, row) => {
          let value = '', color = '';
          book_status.some(item => {
            if (item.id === status) {
              value = item.value;
              color = item.color;
              return true;
            }
          })
          if (status === -1) {
            return (
              <div>
                <Tag color={color}>{value}</Tag>
                <div style={{ fontSize: '12px' }}>失败原因：{row.failreason}</div>
              </div>
            )
          }
          return <Tag color={color}>{value}</Tag>
        }
      },
      {
        title: '证书名称',
        key: 'certname',
        align: 'center',
        width: 100,
        dataIndex: 'certname'
      },
      {
        title: '证书类型',
        align: 'center',
        width: 100,
        dataIndex: 'parServicecategoryid',
        key: 'parServicecategoryid',
        width: 90,
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
        title: '证书图',
        dataIndex: 'certimg',
        align: 'center',
        width: 100,
        key: 'certimg',
        width: 90,
        render: (url) => {
          return (
            <RcViewer options={options}>
              <img src={url} className="bookImg" alt="" style={{width:60,height:60,objectFit:'cover'}}></img>
            </RcViewer>
          )
        }
      },
      {
        title: '证书编号',
        align: 'center',
        width: 210,
        dataIndex: 'certno',
        key: 'certno',
        filterDropdown: true,
        filterIcon: <Icon type="edit" />,
        render:(text, record) => <Input value={text} disabled={this.state.isCancelEdit===record.id?false:true} onChange={(e) => this.handleChange({certno: e.target.value}, record)}/>,
      },
      {
        title: '证书开始有效时间',
        dataIndex: 'certstarttime',
        align: 'center',
        width: 200,
        key: 'certstarttime',
        filterDropdown: true,
        filterIcon: <Icon type="edit" />,
        render: (text, record) =><DatePicker disabled={this.state.isCancelEdit===record.id?false:true} showTime style={{ marginRight: "10px", width: "100%",border:0 }} defaultValue={text === "" || isNaN(text) ? moment(text, "YYYY-MM-DD HH:mm:ss") : null} onChange={(e, value, dateString) => this.handleChange({ certstarttime: value }, record)} />,
      },
      {
        title: '证书失效时间',
        align: 'center',
        width: 200,
        dataIndex: 'certendtime',
        key: 'certendtime',
        filterDropdown: true,
        filterIcon: <Icon type="edit" />,
        render: (text, record) => <DatePicker disabled={this.state.isCancelEdit===record.id?false:true} style={{ marginRight: "10px" }} showTime defaultValue={text === "" || isNaN(text) ? moment(text, "YYYY-MM-DD HH:mm:ss") : null} onChange={(e, value, dateString) => this.handleChange({ certendtime: value }, record)} />,
      },
      {
        title: '复审时间',
        dataIndex: 'reauthtime',
        align: 'center',
        width: 200,
        key: 'reauthtime',
        filterDropdown: true,
        filterIcon: <Icon type="edit" />,
        render: (text, record) => <DatePicker disabled={this.state.isCancelEdit===record.id?false:true} showTime placeholder="请选择时间" defaultValue={text === "" || isNaN(text) ? moment(text, "YYYY-MM-DD HH:mm:ss") : null} onChange={(e, value, dateString) => this.handleChange({ reauthtime: value }, record)} />,
      },
      {
        title: '编辑',
        dataIndex: 'workerid',
        align: 'center',
        key: "workerid",
        // fixed: "right",
        width: 160,
        render: (text, record) => (


          this.state.size.length >= 1 ? (
            <div>
              {<Button type="primary" size="small" disabled={this.state.isCancelEdit} style={{ display: this.state.isCancelEdit === record.id ? "none" : "block", marginLeft: "45px", fontSize: "14px" }} onClick={() => { this.toEdit(record.id) }}>编辑</Button>}
              {this.state.isCancelEdit === record.id && (<div> <Popconfirm onCancel={() => this.editCancel(record.key)} title="确定保存该信息?" onConfirm={() => this.handleSave(record.id, record)}>
                <Button type="primary" size="small" style={{ marginRight: "5px", fontSize: "14px" }}>保存</Button>
              </Popconfirm>
                <Button size="small" onClick={() => this.editCancel(record.key)} style={{ fontSize: "14px" }}>取消</Button>

              </div>)}

            </div>) : null)
      },
      {
        title: '操作',
        dataIndex: 'id',
        align: 'center',
        key: 'id',
        width: 80,
        fixed: "right",
        render: (id, row) => {

          if (row.status === 0) {
            return (
              <div className="btn">
                <Popconfirm
                  placement="rightTop"
                  title="是否继续通过审核?"
                  onConfirm={() => { this.handSubmitBook(id) }}
                  okText="确定"
                  cancelText="取消"
                >
                  <Tag className="btn1" color="#67C23A">通过</Tag>
                </Popconfirm>
                <Tag className="btn1" color="#F56C6C" onClick={() => { this.handleCancel(row.id, true) }} >拒绝</Tag>
              </div>
            )
          } else {
            return <Tag color="cyan">已审核</Tag>
          }
        },
      },
    ];

    return (
      <div>
        <Form layout="inline" onSubmit={this.handleSubmit}>
          <Form.Item label="用户编号">
            {getFieldDecorator('workerSn', {})(<Input allowClear />)}
          </Form.Item>
          <Form.Item label="用户姓名">
            {getFieldDecorator('name', {})(<Input allowClear />)}
          </Form.Item>
          <Form.Item label="审核状态">
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
          <Form.Item label="提交时间">
            {getFieldDecorator('timeArr', {})(
              <RangePicker />
            )}
          </Form.Item>
          <Form.Item>
            <Button icon="search" type="primary" htmlType="submit" onClick={this.handleSubmit} loading={this.state.loadingSub}>查询</Button>
            <Button style={{ margin: "0 13px" }} type="default" onClick={this.cancelContent} >重置</Button>


          </Form.Item>
        </Form>
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
            scroll={{ x: 1300 }}
            rowKey={(record, index) => index}
            loading={this.state.loading}
            columns={columns}
             dataSource={this.state.tableData.data} 
             size="middle" 
             align="center" />
          <div className="btn2">
            <Button className="btn1" onClick={async () => {
              await this.setState({
                isDownLoad: true
              })
              await this.getBookList()
              this.downloadCsv(this.state.exportData)
            }}><Icon type="download" /> 导出</Button>
          </div>

        </div>
        <Modal
          title="请输入拒绝理由"
          visible={this.state.visible}
          onOk={this.handleOk.bind(this)}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel.bind(this)}
          okText="提交"
          cancelText="取消"
        >
          <TextArea rows={4} onChange={(e) => { this.getReason(e) }} allowClear placeholder="请输入拒绝理由"></TextArea>
        </Modal>
      </div>
    )
  }
}

const Auditor_From = Form.create()(Auditor);

export default Auditor_From