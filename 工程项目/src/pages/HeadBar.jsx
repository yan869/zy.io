import React from 'react';
import { Menu, Icon, Button, Modal } from 'antd';
import { connect } from 'react-redux'
import { setInlineCollapsed, switchMenu, MenuList,GetInfo} from '@/redux/action'
import { hashHistory } from "react-router";
import { createHashHistory } from 'history';  // hash路由
import "@/styles/headBar.less";
const history = createHashHistory()
const { confirm } = Modal;


class HeadBar extends React.Component {
	state = {
		current: '',
		collapsed: false,
		isTeam: false,
		nickName: '',
		avatar: '',
		name:'',
		info:{}
	};
	componentDidMount() {
		let userInfo = JSON.parse(sessionStorage.getItem('user')).userInfo;
		if (userInfo.sysUserRoles && userInfo.sysUserRoles.length >= 2) {
			this.setState({
				isTeam: true
			})
		}
	}
	toggleCollapsed() {
		const { dispatch } = this.props
		dispatch(setInlineCollapsed(!this.props.inlineCollapsed))
	}
	handleTabClick(obj) {
		const { dispatch } = this.props
		dispatch(switchMenu(obj.key))
	}
	// 切换为团队
	async	checkToTeam() {
		const { errCode, errMsg } = await this.$api.comm.teamAll();
		if (errCode === 0) {
			history.push("/")
			sessionStorage.setItem('team', true)
			let { dispatch } = this.props;
			dispatch(MenuList(JSON.parse(sessionStorage.getItem('team'))))
		} else {
			Modal.error({
				title: errMsg,
				content: "请确保你有团队后再进行接下来的操作"
			})
		}
	}
	checkToAdmin() {
		sessionStorage.removeItem('team')
		let { dispatch } = this.props;
		dispatch(MenuList(null))
	}
	logoOut() {
		confirm({
			title: '提示',
			centered: true,
			content: '是否继续退出登录?',
			okText: "确定",
			cancelText: "取消",
			onOk() {
				sessionStorage.removeItem("user");
				sessionStorage.removeItem("token");
				sessionStorage.getItem('team') && sessionStorage.removeItem("team");
				hashHistory.push('/login');
			},
		});
	}
	render() {
		let userInfo = JSON.parse(sessionStorage.getItem('user')).userInfo;
		let theChangeInfo=this.props.GetInfo;
		return (
			<div className="headbar" style={{ position: 'relative' }}>
				<Button type="primary" onClick={this.toggleCollapsed.bind(this)}>
					<Icon type={this.props.inlineCollapsed ? 'menu-unfold' : 'menu-fold'} />
				</Button>
				<div style={{ position: 'absolute', left: 220 }}>
					{
						this.state.isTeam && <div>{
							sessionStorage.getItem('team') === 'true' ? <Button type="primary" onClick={this.checkToAdmin.bind(this)}>切换为管理员</Button> : <Button type="primary" onClick={this.checkToTeam.bind(this)}>
								切换为团队管理人
				       </Button>
						}
						</div>
					}
				</div>
				<div className='menu-wrapper'>
					<Menu
						selectedKeys={this.props.swtichActive}
						mode="horizontal"
						onClick={this.handleTabClick.bind(this)}
					>
						<Menu.Item key="/home">
							<a href="/#">
								<Icon type="home" style={{ marginRight: 0 }} theme="filled" />
							</a>
						</Menu.Item>
						<Menu.Item key="userpersonal">
							<a href="/#/personage/userpersonal">个人中心</a>
						</Menu.Item>
					</Menu>
				</div>
				<div className="userInfo">
					{userInfo.avatar ? <img className="path" src={theChangeInfo?theChangeInfo.img:userInfo.avatar} alt="" /> : <Icon type="user" style={{ fontSize: '18px' }} />}
					<span>{theChangeInfo?(theChangeInfo.nickName):(userInfo.nickName?userInfo.nickName:userInfo.name)}</span>
					<Icon type="logout" className="logOut" onClick={() => this.logoOut()} />
				</div>
			</div>
		)
	}
}
const mapStateToProps = state => {
	return {
		inlineCollapsed: state.inlineCollapsed,
		swtichActive: state.swtichActive,
		MenuList: state.MenuList,
		GetInfo:state.GetInfo
	}
};
export default connect(mapStateToProps)(HeadBar)