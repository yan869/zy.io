import React from 'react';
import { Link } from 'react-router';
import { Menu, Icon, message } from 'antd';
import { connect } from 'react-redux'
import { switchMenu, switchSubMenu, MenuList, treePost } from '@/redux/action'
import "@/styles/navtree.less";

const { SubMenu } = Menu;

class NavTree extends React.Component {
    constructor(props) {
        super(props)
        let { dispatch } = props;
        dispatch(MenuList(JSON.parse(sessionStorage.getItem('team'))))
    }


    rootSubmenuKeys = ['user', 'orders', 'certificates', 'withdraws', 'serves', 'comments', 'statistics', 'sys'];
    state = {
        mode: 'inline',
        theme: 'light',
        current: "home",
        openKeys: '',
        isTeam: JSON.parse(sessionStorage.getItem('team')) ? true : false,
        isRender: true,
        datalist: []
    };
    componentDidMount() {
        const { dispatch } = this.props
        dispatch(MenuList(sessionStorage.getItem('team')))
        this.allMenu()
        this.handleSelectedKeys(this.props.props.location.pathname);
    }
    componentWillReceiveProps(nextProps){
    if(nextProps.treePost !== this.props.treePost){
        const { dispatch } = this.props
        dispatch(treePost(nextProps.treePost));
    }
}
    shouldComponentUpdate(nextProps) {
        const { dispatch } = this.props
        dispatch(treePost(nextProps.treePost));
        return true
    }

    // 查询到所有的菜单
    async allMenu() {
        const { data, errCode, errMsg } = await this.$api.comm.allMenu();
        if (errCode === 0) {
            this.setState({
                datalist: data
            })
            const { dispatch } = this.props
            dispatch(treePost(data));
 
        } else {
            message.error(errMsg)
        }
    }
    //   创建菜单
    createMenu = (menuData) => {  //创建菜单
        let submenuIndex = 0; //累计的每一项展开菜单索引
        let menu = [];
        const create = (menuData, el) => {
            for (let i = 0; i < menuData.length; i++) {
                if (menuData[i].children) {  //如果有子级菜单
                    let children = [];
                    create(menuData[i].children, children);
                    submenuIndex++;
                    el.push(
                        <SubMenu
                            key={`sub${submenuIndex}`}
                            title={(
                                <span style={{ height: '100%', display: 'block' }}>
                                    <Icon type={menuData[i].icon} />
                                    {menuData[i].name}
                                </span>
                            )}
                        >
                            {children}
                        </SubMenu>
                    )
                } else {   //如果没有子级菜单
                    //itemIndex++;
                    // console.log(menuData[i]);

                    el.push(
                        <Menu.Item key={menuData[i].url} title={menuData[i].name}>
                            <Link to={menuData[i].url}>
                                {menuData[i].icon ? <Icon type={menuData[i].icon} /> : null}
                                <span>{menuData[i].name}</span>
                            </Link>
                        </Menu.Item>
                    )
                }
            }

        };

        create(menuData, menu);
        return menu;
    }

    handleSelectedKeys(pathname) {
        // /admin = ["/","admin"]
        // 根据'/'把路由地址分割成一个数组
        const temp = pathname.split('/')
        // 如果数组的长度小于2,表示的是只有根路径/,设置为Home. 否则取数组中第二个值
        const key = temp && temp.length < 2 ? 'home' : temp[1];
        this.setState({
            selectedKeys: [key]
        })
    }


    handleTabClick(obj) {
        const { dispatch } = this.props
        dispatch(switchMenu(obj.key))
    }
    onOpenChange = openKeys => {
        const { dispatch } = this.props
        const latestOpenKey = openKeys.find(key => this.props.subMenuActive.indexOf(key) === -1);
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            dispatch(switchSubMenu(openKeys))
        } else {
            dispatch(switchSubMenu(latestOpenKey ? [latestOpenKey] : []))
        }
    };
    render() {
        let path = this.props.props.location.pathname;
        let datalists = this.state.datalist
        return (
            <div className="navtree" >

                <div className="nav-img">
                    <img className="logo" src={require('@/assets/img/logo.png')} alt="" />
                    {
                        !this.props.inlineCollapsed ? (
                            <img className="logTxt" src={require('@/assets/img/logotxt.png')} alt="" />
                        ) : null
                    }
                </div>
                {JSON.parse(sessionStorage.getItem('team')) && (JSON.parse(sessionStorage.getItem('team')) === true) && <Menu
                    openKeys={this.props.subMenuActive}
                    selectedKeys={[path]}
                    mode={this.state.mode}
                    theme={this.state.theme}
                    onOpenChange={this.onOpenChange}
                    onClick={this.handleTabClick.bind(this)}
                    inlineCollapsed={this.props.inlineCollapsed}
                    defaultOpenKeys={this.props.swtichActive}
                    defaultSelectedKeys={["/"]}
                >
                    <Menu.Item key="/">
                        <Link to='/'> <Icon type="home" />
                            <span>首页</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="/user/operator">
                        <Link to='/user/operator'> <Icon type="usergroup-add" />
                            <span>作业员管理</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="/orders/selectOrders">
                        <Link to='/orders/selectOrders'> <Icon type="usergroup-add" />
                            <span>订单管理</span>
                        </Link>
                    </Menu.Item>
                    <SubMenu
                        key="statistics"
                        title={
                            <span>
                                <Icon type="table" />
                                <span>统计管理</span>
                            </span>
                        }>
                        <Menu.Item key="/statistics/orderSta">
                            <Link to='/statistics/orderSta'> <Icon type="file-done" />
                                <span>订单统计</span>
                            </Link>
                        </Menu.Item>
                    </SubMenu>
                    <Menu.Item key="/certificates/payment">
                        <Link to='/certificates/payment'> <Icon type="pay-circle" /><span>支付明细</span></Link>
                    </Menu.Item>
                </Menu>
                }
                {!JSON.parse(sessionStorage.getItem('team')) && <Menu
                    openKeys={this.props.subMenuActive}
                    selectedKeys={[path]}
                    mode={this.state.mode}
                    theme={this.state.theme}
                    onOpenChange={this.onOpenChange}
                    onClick={this.handleTabClick.bind(this)}
                    inlineCollapsed={this.props.inlineCollapsed}
                    defaultOpenKeys={this.props.swtichActive}
                    defaultSelectedKeys={["home"]}
                >
                    {this.createMenu((this.props.treePost && this.props.treePost!== datalists) ? this.props.treePost : datalists)}
                </Menu>
                }
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        swtichActive: state.swtichActive,
        subMenuActive: state.subMenuActive,
        inlineCollapsed: state.inlineCollapsed,
        MenuList: state.MenuList,
        treePost: state.treePost,
    }
}

export default connect(mapStateToProps)(NavTree)
