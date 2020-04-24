import React from 'react';
import "@/styles/userpersonal.less";
import { parFilter, fileUpload } from '@/utils';
import { connect } from 'react-redux'
import { Upload, Select, Avatar, Input, Button, Icon, message, Modal, Form } from 'antd'
import { GetInfo } from '../../redux/action';
const { Option } = Select;
const actionUrl = fileUpload();
function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('只能上传JPG/PNG格式的文件!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('头像大小不能超过 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

class Userpersonal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      imageUrl: '',
      ruleForm: {},
      params: {},
      isChanged: false,
      isChangePassword: false
    }


  }
  componentDidMount() {
    this.setState({
      ruleForm: JSON.parse(sessionStorage.getItem("user")).userInfo,
      imageUrl: JSON.parse(sessionStorage.getItem("user")).userInfo.avatar
    })
    console.log(this.state.ruleForm);

  }
  //图片上传
  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loadingImg: true });
      return;
    }
    if (info.file.status === 'done') {
      let { response } = info.file;
      if (response.errCode === 0) {
        message.success('上传成功！');
        this.setState({ imageUrl: response.data, isChanged: false });
      } else {
        message.error(response.errMsg);
      }
    }
  }
  // 点击修改密码
  isChangePassword = () => {
    const { isChangePassword } = this.state
    this.setState({
      isChangePassword: !isChangePassword
    })
  }
  // 验证密码
  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('newpassword')) {
      callback('两次密码输入不一致!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };
  // 提交修改密码
  handleSubmit = e => {
    let that = this
    e.preventDefault();
    let name = JSON.parse(sessionStorage.getItem('user')).userInfo.name
    this.props.form.validateFields(async (err, values) => {
      let { password, newpassword, confirm } = values

      let params = Object.assign({}, { name, password, newpassword: confirm });
      this.setState({
        params
      }, async () => {
        const { errCode, data } = await this.$api.comm.updatePassword(this.state.params);
        if (errCode === 0) {
          message.success("密码修改成功")
          console.log(confirm);
          let user = JSON.parse(sessionStorage.getItem("user"))
          user.password = confirm;
          let myuser = JSON.stringify(user)
          sessionStorage.setItem("user", myuser)
          console.log(sessionStorage.getItem("user"))

          this.setState({
            isChangePassword: false
          })
        } else {
          message.error("密码修改失败")
        }

      })

    })

  }
  // 修改个人信息
  async changeInfo() {
    this.props.form.validateFields(async (err, values) => {
      const { nickName, mobile, email } = values;
      console.log(values);

      if (!(nickName && mobile && email)) {
        this.setState({
          isChanged: false
        })
        message.error("修改信息不能为空")
      } else {
        let params = { nickName, img: this.state.imageUrl.split("?")[0], phone: mobile, email }
        const { dispatch } = this.props
        dispatch(GetInfo(params))
        const { errCode, errMsg, data } = await this.$api.comm.updateUserInfo(params)
        if (errCode === 0) {
          message.success("修改个人信息成功");
          this.setState({
            isChanged: true,
            // ruleForm:{
            //   nickName,
            //   avatar:params.img,
            //   mobile:params.phone,
            //   email
            // }
          })
          let theUser = JSON.parse(sessionStorage.getItem('user')).userInfo
          theUser.nickName = nickName;
          theUser.avatar = params.img;
          theUser.mobile = params.phone;
          theUser.email = email
          let myInfo = JSON.stringify({ userInfo: theUser })
          sessionStorage.setItem('user', myInfo)
         
        } else {
          message.error("修改个人信息失败")
        }
      }
    })
  }
  // 恢复置灰的按钮
  theFocus() {
    this.setState({
      isChanged: false
    })
  }
  render() {
    let { imageUrl, ruleForm, isChangePassword } = this.state;
    const uploadButton = (
      <div>
        <Avatar size={64} icon="user" type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text" style={{ fontSize: 14 }}>点击上传头像</div>
      </div>
    );
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <div style={{ width: "100%", height: "100%", padding: "30px" }}>
        <div className="myPic">
          {
            isChangePassword ? <p className="title">修改密码</p> : <p className="title">用户个人信息</p>
          }
          {
            !isChangePassword ? <Form {...formItemLayout}>
              <Form.Item label="头像" style={{ display: "flex", justifyContent: "center", marginBottom: 0 }} >
                <Upload
                  name="file"
                  listType="picture-card"
                  showUploadList={false}
                  action={actionUrl}
                  beforeUpload={beforeUpload}
                  onChange={this.handleChange}>
                  {imageUrl ? <Avatar size={64} icon="user" src={imageUrl} alt="avatar" /> : uploadButton}
                </Upload>
              </Form.Item>
              <Form.Item label="昵称" style={{ display: "flex", justifyContent: "center", marginBottom: 0 }}>
                {getFieldDecorator('nickName', {
                  initialValue: ruleForm.nickName,
                  rules: [{ required: true, message: '请输入您的昵称' }]
                })(<Input onChange={() => this.theFocus()} allowClear placeholder="请输入您的昵称" style={{ width: 246 }} />)}
              </Form.Item>
              <Form.Item label="手机号" style={{ display: "flex", justifyContent: "center", marginBottom: 0 }}>
                {getFieldDecorator('mobile', {
                  initialValue: ruleForm.mobile,
                  rules: [{ required: true, message: '请输入您的手机号' }]
                })(<Input onChange={() => this.theFocus()} allowClear placeholder="请输入您的手机号" style={{ width: 246 }} />)}
              </Form.Item>
              <Form.Item label="邮箱" style={{ display: "flex", justifyContent: "center", marginBottom: 0 }}>
                {getFieldDecorator('email', {
                  initialValue: ruleForm.email,
                  rules: [{ required: true, message: '请输入您的邮箱' }]
                })(<Input onChange={() => this.theFocus()} allowClear placeholder="请输入您的邮箱" style={{ width: 246 }} />)}
              </Form.Item>
              <Form.Item style={{ display: "flex", justifyContent: "center", marginBottom: 0 }}>
                <a href="#/personage/userpersonal" onClick={this.isChangePassword}>点击修改密码</a>
              </Form.Item>
              <Form.Item style={{ display: "flex", justifyContent: "center" }}>
                <Button block type="primary" onClick={() => this.changeInfo()} disabled={this.state.isChanged ? true : false}>确定</Button>
              </Form.Item>
            </Form> : <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                <Form.Item label="原始密码" style={{ display: "flex", justifyContent: "center" }} hasFeedback>
                  {getFieldDecorator('password', {
                    initialValue: ruleForm.password,
                    rules: [{ required: true, message: '请输入您的原始密码' }, {
                      validator: this.validateToNextPassword,
                    },]
                  })(<Input.Password allowClear placeholder="请输入您的原始密码" style={{ width: 246 }} />)}
                </Form.Item>
                <Form.Item label="新密码" style={{ display: "flex", justifyContent: "center" }} hasFeedback>
                  {getFieldDecorator('newpassword', {
                    initialValue: ruleForm.password,
                    rules: [{ required: true, message: '请输入您的新密码' }, {
                      validator: this.validateToNextPassword,
                    },]
                  })(<Input.Password allowClear placeholder="请输入您的新密码" style={{ width: 246 }} />)}
                </Form.Item>
                <Form.Item label="确认密码" style={{ display: "flex", justifyContent: "center" }} hasFeedback>
                  {getFieldDecorator('confirm', {
                    initialValue: ruleForm.password,
                    rules: [{ required: true, message: '请再一次输入新密码' }, {
                      validator: this.compareToFirstPassword,
                    },]
                  })(<Input.Password onBlur={this.handleConfirmBlur} allowClear placeholder="请再一次输入新密码" style={{ width: 250 }} />)}
                </Form.Item>
                <Form.Item style={{ display: "flex", justifyContent: "center" }}>
                  <Button block type="primary" onClick={this.handleSubmit}>提交</Button>
                </Form.Item>
              </Form>
          }
        </div>
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    GetInfo: state.GetInfo
  }
}
const Userpersonals = Form.create({ name: 'Userpersonal' })(Userpersonal);
export default connect(mapStateToProps)(Userpersonals)