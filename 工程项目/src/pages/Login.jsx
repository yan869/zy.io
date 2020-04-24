import React from "react";
import { Form, Input, Button, Icon, Checkbox, message } from 'antd';
import { hashHistory } from "react-router";
import "@/styles/login.less";

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
        };
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                this.setState({ loading: true });
                let data = { name: values.username, password: values.password };
                const res = await this.$api.comm.login(data);
                if (res.errCode === 0) {

                    const { userInfo } = res.data;
                    let user = userInfo.sysUserRoles
                    if (user && user.length === 1) {
                        user = user[0];
                        if (user.id === 2) {
                            sessionStorage.setItem('team', true);
                        }
                    }
                    sessionStorage.setItem('user', JSON.stringify(res.data));

                    sessionStorage.setItem('token', res.data.token);

                    hashHistory.push('/')


                } else {
                    message.error(res.errMsg);
                }
                this.setState({ loading: false });
            }
        });
    }
    // 回车登录
    handleLogin = (e) => {
        if (e.keyCode === 13) {
            this.handleSubmit(e)
        }
    }
    componentDidUpdate() {
        document.addEventListener('keydown', this.handleLogin);
    }
    componentWillUnmount = () => {
        this.setState = (state, callback) => {
            return;
        }
    }


    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="login-home">
                <div className="login-back">
                    <img src={require("@/assets/img/back.jpg")} style={{ width: "100vw", height: '133vh', zIndex: -1000 }} alt="" />
                </div>
                <div className="login-card">
                    <div className="right">
                        <h3>特种作业云</h3>
                        <Form onSubmit={this.handleSubmit} className="login-form">
                            <Form.Item>
                                {getFieldDecorator('username', { rules: [{ required: true, message: '请输入您的手机号码' }] })(
                                    <Input
                                        size="large"
                                        placeholder="请输入您的手机号码"
                                        prefix={<Icon type="user" style={{ color: '#2390FF' }} />}
                                    />
                                )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('password', { rules: [{ required: true, message: '请输入登录密码' }] })(
                                    <Input
                                        size="large"
                                        type="password"
                                        placeholder="请输入登录密码"
                                        prefix={<Icon type="lock" style={{ color: '#2390FF' }} />}
                                    />
                                )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('remember', {
                                    valuePropName: 'checked',
                                    initialValue: true,
                                })(<Checkbox>记住用户名和密码</Checkbox>)}
                                <Button type="primary" onKeyDown={(e) => { this.handleLogin(e) }} htmlType="submit" size="large" className="login-form-button" loading={this.state.loading}>登录</Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>

                <div className="footercode">
                    <span className="code">浙ICP备19017399号-5</span>
                    <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33030402000855"
                        className="tolink"><img src="http://www.beian.gov.cn/img/new/gongan.png" alt="" className="gong" />
                        <span className="zhe">浙公网安备&nbsp;33030402000855号</span>
                    </a>
                </div>


            </div>
        )
    }
}

const loginForm = Form.create({ name: 'normal_login' })(Login);

export default loginForm