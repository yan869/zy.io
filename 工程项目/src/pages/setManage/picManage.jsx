import React from 'react';
import Zmage from 'react-zmage'
import { parFilter, bannerRank, bannerStatus, fileUpload } from '@/utils';
import { Upload, Select, Input, Popconfirm, Button, Icon, message, Table, Modal, Form } from 'antd'
import "@/styles/Sendorders.less";
const { Option } = Select;
const banner_rank = bannerRank();
const banner_Status = bannerStatus();
const actionUrl = fileUpload();
/**上传图片校验 */

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('请上传JPG/PNG的图片!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片不能超过2MB!');
  }
  return isJpgOrPng && isLt2M;
}

class PicManage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      imageUrl: '',
      // loading:true,
      itemShow: false,
      bannerList: [],
      loading: true,
      loadingSub: false,
      ruleForm: {

      },
      params: {
        // page: 1,
        limit: 10,
      },
      tableData: {
        data: [],
        total: 0
      },
      params1: {},
      detailMsg: {}
    }
  }


  componentDidMount() {
    this.mounted = true;
    this.getBannerList()
  }
  // 获取Banner列表
  async getBannerList() {
    let params = parFilter(this.state.params);
    const { errCode, data, total } = await this.$api.comm.getBannerList(params);
    if (errCode === 0) {
      this.setState({
        bannerList: data,
        tableData: { data, total },
        loading: false,
        loadingSub: false
      })
      // console.log(this.state.bannerList)
    } else {

    }

  }
  componentWillUnmount() {
    // 卸载异步操作设置状态
    this.setState = (state, callback) => {
      return;
    }
  }


  //新增-编辑
  handleChange(isPase = false, row) {
    let { visible, ruleForm } = this.state;

    if (isPase) {
      let { id, name, url, link, state, status, user, avatar, sort } = row;
      ruleForm = { id, name, url, link, state, status, user, avatar, sort };
      this.setState({
        imageUrl: url
      })
    } else {
      ruleForm = {}
      this.setState({
        imageUrl: ""
      })
    }
    this.setState({
      visible: !visible,
      ruleForm,
      itemShow: isPase
    })


  }


  //提交表单
  handleSubmit() {
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let { imageUrl, itemShow } = this.state;
        if (!imageUrl) {
          message.warning('请上传工种图片!');
          return;
        }
        await this.setState({ confirmLoading: true });
        let { name, link, type, url, status, user, avatar, sort } = values;
        let api = '';
        if (status === "启用") {
          status = 1
        } else if (status === "禁用") {
          status = 0
        }
        if (this.state.itemShow) {
          let { id } = this.state.ruleForm;
          let data = { id, name, link, type: type + '', avatar, url: imageUrl, sort: sort * 1, status };
          console.log(data);

          api = this.$api.comm.editBanner(data);
          this.props.form.resetFields();
        } else {

          let data = { name, link, url: imageUrl, status, type: type + '', avatar, sort: sort * 1 };
          api = this.$api.comm.addBanner(data);
          this.setState({
            imageUrl: url
          })


        }
        await this.setState({ confirmLoading: true });
        const res = await api;
        if (res.errCode === 0) {
          message.success(!this.state.itemShow ? '新增成功' : '编辑成功')
          this.setState({ confirmLoading: false, visible: false });
          this.getBannerList();
        } else {
          message.error(res.errMsg);
          this.setState({ confirmLoading: false });
        }
      }
    });
  };




  //取消
  handleCancel() {
    this.setState({
      visible: false,
      detailMsg: {}
    })
  }


  //上传图片
  handleImageChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loadingImg: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      let { response } = info.file;
      if (response.errCode === 0) {
        message.success('上传成功！');


        this.setState({ imageUrl: response.data.split("?")[0] });
        console.log(this.state.imageUrl);
      } else {
        message.error(response.errMsg);
      }

    }
  };





  // 删除
  async  delComment(row) {
    let data = Object.assign({}, this.state.params, { id: row.id })
    const res = await this.$api.comm.delBannerList(data);
    if (res.errCode === 0) {
      message.success('删除成功！');
      this.getBannerList();


    } else {

    }

  }
  //改变page
  async pageChange(page) {
    let params = Object.assign({}, this.state.params, { page });
    await this.setState({ params, loading: true });
    this.getBannerList();
  }
  //改变limit
  async onShowSizeChange(current, size) {
    let params = Object.assign({}, this.state.params, { page: 1, limit: size });
    await this.setState({ params, loading: true });
    this.getBannerList();
  }
  render() {
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        width: 80,
        align: "center",
        key: 'id',
        render: text => <span>{text}</span>,
      },
      {
        title: '图片名称',
        dataIndex: 'name',
        width: 120,
        align: "center",
        key: 'name',
        render: text => <span>{text}</span>
      },
      {
        title: '分类',
        dataIndex: 'type',
        width: 80,
        align: "center",
        key: 'type',
        render: (text) => {
          return <span>
            {text === 0 && "用户"}
            {text === 1 && "作业人员"}
            {text === 2 && "通用"}
          </span>
        }
      },
      {
        title: '排序',
        key: 'sort',
        width: 80,
        align: "center",
        dataIndex: 'sort',
        render: text => <span>{text}</span>
      },
      {
        title: '链接',
        dataIndex: 'link',
        width: 140,
        align: "center",
        key: 'link',
        render: text => <span>{text}</span>
      },
      {
        title: 'Banner',
        dataIndex: 'url',
        width: 120,
        align: "center",
        key: 'url',
        render: (text) => {
          return <div>
            <Zmage src={text} style={{ width: 120, height: 50 }} alt="" className="picName" />
          </div>
        }
      },
      {
        title: '状态',
        width: 80,
        align: "center",
        dataIndex: 'status',
        key: 'status',
        render: text => <span>{text ? '禁用' : '正常'}</span>
      },
      {
        title: '操作',
        width: 80,
        align: "center",
        key: 'action',
        render: (text, row) => (
          <div className="btn">
            <Button size='small' className="btn1" type="primary" onClick={() => this.handleChange(true, row)} >编辑</Button>
            <Popconfirm
              placement="rightTop"
              title="确定删除吗?"
              okText="确定"
              cancelText="取消"
              onConfirm={() => {
                this.delComment(row)
              }}
            >
              <Button size='small' className="btn1" type="danger" >删除</Button>
            </Popconfirm>

          </div>
        ),
      },
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
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    const { ruleForm, itemShow, imageUrl } = this.state;
    const { getFieldDecorator } = this.props.form;
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div>
        <div className='search-wrapper'>
          <div className='search-item'><Button onClick={() => this.handleChange()} icon="plus" type="primary">新增</Button></div>
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
            columns={columns}
            dataSource={this.state.bannerList}
            scroll={{ x: 1200 }}
            rowKey={(record, index) => index}
            size="middle" align="center"
          />
        </div>


        <Modal
          title={(itemShow ? '编辑' : '新增') + 'Banner'}
          visible={this.state.visible}
          onOk={() => this.handleSubmit()}
          onCancel={() => this.handleChange()}
          confirmLoading={this.state.confirmLoading}
          okText="提交"
          cancelText="取消"

        >
          <Form {...formItemLayout} onSubmit={this.handleSubmit}   >

            <Form.Item label="图片名称" hasFeedback   >
              {getFieldDecorator('name', {
                initialValue: itemShow ? ruleForm.name : "",
                rules: [
                  {
                    required: true,
                    message: '请输入图片名称!',
                  },
                ],
              })(<Input placeholder='请输入图片名称' />)}
            </Form.Item>
            <Form.Item label="图片链接" hasFeedback>
              {getFieldDecorator('url', {
                initialValue: itemShow ? ruleForm.url : "",
                rules: [
                  {
                    required: true,
                    message: '请输入图片链接!',
                  },
                ],
              })(<Input placeholder='请输入图片链接' />)}
            </Form.Item>
            <Form.Item label="跳转链接" hasFeedback>
              {getFieldDecorator('link', {
                initialValue: itemShow ? ruleForm.link : "",
                rules: [
                  {
                    required: true,
                    message: '请输入跳转链接!',
                  },
                ],
              })(<Input placeholder='请输入跳转链接' />)}
            </Form.Item>
            <Form.Item label="图片位置" hasFeedback>
              {getFieldDecorator('type', {
                initialValue: itemShow ? "用户" : "",
                rules: [
                  {
                    required: true,
                    message: '请输入图片位置!',
                  },
                ],

              })(<Select style={{ width: 120 }} >
                {
                  banner_rank.map((item, index) => {
                    return <Option key={index} value={item.id}>{item.value}</Option>
                  })
                }
              </Select>)}
            </Form.Item>
            <Form.Item label="状态" hasFeedback>
              {getFieldDecorator('status', {
                initialValue: itemShow ? "启用" : "",
                rules: [
                  {
                    required: true,
                    message: '请输入广告状态!',
                  },
                ],
              })(<Select style={{ width: 120 }} >
                {
                  banner_Status.map((item, index) => {
                    return <Option key={index} value={item.id}>{item.value}</Option>
                  })
                }
              </Select>)}
            </Form.Item>
            <Form.Item label="图标" hasFeedback extra="推荐首页Banner尺寸: 业主:750 * 372 - 作业人员:690 * 280">
              <Upload
                name="file"
                listType="picture-card"
                showUploadList={false}
                action={actionUrl}
                beforeUpload={beforeUpload}
                showUploadList={false}
                onChange={this.handleImageChange}>
                {this.state.imageUrl ? <img src={this.state.imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
              </Upload>
            </Form.Item>
            <Form.Item label="排序" hasFeedback>
              {getFieldDecorator('sort', {
                initialValue: ruleForm.sort,
                rules: [
                  {
                    required: true,
                    message: '请输入排序!',
                  },
                ],
              })(<Input />)}
            </Form.Item>

          </Form>
        </Modal>



      </div>





    )
  }
}





const PicManages = Form.create({ name: 'PicManage' })(PicManage);
export default PicManages