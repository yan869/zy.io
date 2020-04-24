import axios from "../axios";

//登录
export const login = (data) => {
    return axios({
        url:'lbSysRole/loginByPassword',
        method:'post',
        data
    })
}
// 修改密码
export const updatePassword=(data)=>{
    return axios({
        url:"lbSysRole/updatePassword",
        method:"post",
        data
    })
}
// 修改用户信息
export const updateUserInfo=(data)=>{
    return axios({
        url:"/lbSysRole/updateUser",
        method:"post",
        data
    })
}
// 角色管理
export const getRole=(data)=>{
    return axios({
        url:"/sysrole/findPage",
        method:"post",
        data
    })
}
// 编辑角色
export const editRole=(data)=>{
    return axios({
        url:'/sysrole/EditSysRole',
        method:"post",
        token:JSON.parse(sessionStorage.user).token,
        data
    })
}
// 新增角色
export const addSysRole=(data)=>{
    return axios({
        url:'/sysrole/addSysRole',
        method:"post",
        token:JSON.parse(sessionStorage.user).token,
        data
    })
}
// 角色菜单
export const findRoleMenus=(data)=>{
    return axios({
        url:'/sysrole/findRoleMenus',
        method:"post",
        token:JSON.parse(sessionStorage.user).token,
        data
    })
}
// 更新角色菜单
export const updateRoleMenus=(data)=>{
    return axios({
        url:'/sysrole/updateRoleMenus',
        method:"post",
        data
    })
}
// 查询所有的菜单
export const allMenu=(data)=>{
    return axios({
        url:'/SysMenu/findMenuTree',
        method:"post",
        headers: {
	        "Authorization": JSON.parse(sessionStorage.user).token,
	    },
        data
    })
}
// 新增或者更新目录
export const addOrUpdateCatalog=(data)=>{
    return axios({
        url:'/SysMenu/addOrUpdateCatalog',
        method:"post",
        data
    })
}
// 新增或者更新菜单
export const addOrUpdateMenu=(data)=>{
    return axios({
        url:'/SysMenu/addOrUpdateMenu',
        method:"post",
        data
    })
}
// 新增或者更新按钮
export const updateOrAddButton=(data)=>{
    return axios({
        url:'/SysMenu/updateOrAddButton',
        method:"post",
        data
    })
}
// 删除目录菜单按钮删除目录菜单按钮(删除目录会删除下面的菜单)
export const delMenus=(data)=>{
    return axios({
        url:'/SysMenu/delMenus',
        method:"post",
        data
    })
}
// 用户管理列表
export const userList=(data)=>{
    return axios({
        url:'/lbSysRole/getList',
        method:"post",
        data
    })
}
// 修改用户状态
export const updateUserStatus=(data)=>{
    return axios({
        url:'/lbSysRole/updateUserStatus',
        method:"post",
        data
    })
}
// 新增用户列表
export const adduserList=(data)=>{
    return axios({
        url:'/lbSysRole/addUser',
        method:"post",
        data
    })
}
// 更新用户角色
export const updateUserRole=(data)=>{
    return axios({
        url:'/lbSysRole/updateUserRole',
        method:"post",
        data
    })
}
// 首页
export const getHomeInfo=(data)=>{
    return axios({
        url:'Dashboard/cashrecordSearch',
        method:'post',
        data
    })
}

//业主用户列表
export const getOwnerList = (data) => {
    return axios({
        url:'SwWorker/getOwnerList',
        method:'post',
        data
    })
}
//作业员用户列表
export const getWorkerList = (data) => {
    return axios({
        url:'SwWorker/getWorkerList',
        method:'post',
        data
    })
}
// 作业人员详情
export const getWorkerDetail = (data) => {
    return axios({
        url:'/SwWorker/getWorkerById',
        method:'post',
        data
    })
}

//订单列表
export const orderSearch = (data) => {
    return axios({
        url:'SwOrder/orderSearch',
        method:'post',
        data
    })
}
//订单详情
export const getOrderDetail=(id)=>{
    return axios({
        url:"SwOrder/orderSearchById",
        method:"post",
        data:{
            id
        }
    })
}
// 工程订单列表
export const getEngineerList=(data)=>{
    return axios({
        url:"/SwOrder/selectEngineeringAll",
        method:'post',
        data,
    })
}
// 工程订单详情
export const getEngineerDetail=(data)=>{
    return axios({
        url:"/SwOrder/selectEngineeringDetail",
        method:'post',
        data,
    })
}
//工程订单审核
export const checkEngInfo=(data)=>{
    return axios({
        url:"SwOrder/orderSettlementStatus",
        method:'post',
        data,
    })
}
//证书审核列表
export const certSearch = (data) => {
    return axios({
        url:'SwCert/certSearch',
        method:'post',
        data
    })
}
//证书审核排序列表
export const certSortSearch = (data) => {
    return axios({
        url:'SwCert/certSearchList',
        method:'post',
        data
    })
}
//审核证书
export const certAudit = (data) => {
    return axios({
        url:'SwCert/certAudit',
        method:'post',
        data
    })
}
// 证书审核时间编辑
export const certUpdate = (data) => {
    return axios({
        url:'SwCert/updateCertAudit',
        method:'post',
        data
    })
}
//签约列表
export const getSignList = (data) => {
    return axios({
        url:'SwSignCheck/getSignList',
        method:'post',
        data
    })
}
//签约排序列表
export const getSignSortList = (data) => {
    return axios({
        url:'SwSignCheck/getSignSortList',
        method:'post',
        data
    })
}
//签约通过-拒绝
export const passOrReject = (data) => {
    return axios({
        url:'SwSignCheck/passOrReject',
        method:'post',
        data
    })
}
// 签约审核时间编辑
export const updateSignAudit = (data) => {
    return axios({
        url:'SwSignCheck/updateSignAudit',
        method:'post',
        data
    })
}
// 身份证审核列表
export const idCardSearchList = (data) => {
    return axios({
        url:'/SwIdCard/idCardSearchList',
        method:'post',
        data
    })
}
// 身份证审核详情
export const idCardDetails = (data) => {
    return axios({
        url:'/SwIdCard/idCardDetails',
        method:'post',
        data
    })
}
// 身份证审核
export const idCardAudit = (data) => {
    return axios({
        url:'/SwIdCard/idCardAudit',
        method:'post',
        data
    })
}
// 身份证审核排序列表
export const idCardSearchListSort = (data) => {
    return axios({
        url:'/SwIdCard/idCardSearchListSort ',
        method:'post',
        data
    })
}
//账号审核
export const getAdultAccountList = (data) => {
    return axios({
        url:'SwSignCheck/getAdultAccountList',
        method:'post',
        data
    })
}
// // 审核账户违约详细信息
// export const getBetrayDetail = (data) => {
//     return axios({
//         url:'/SwSignCheck/getAdultAccountDetail',
//         method:'get',
//         data
//     })
// }

//提现管理
export const cashrecordSearch = (data) => {
    return axios({
        url:'SwCashrecord/cashrecordSearch',
        method:'post',
        data
    })
}
//提现-通过、拒绝
export const cashrecordAudit = (data) => {
    return axios({
        url:'SwCashrecord/cashrecordAudit',
        method:'post',
        data
    })
}

//获得所有工种
export const getParServicecategoryList = (data) => {
    return axios({
        url:'SwParServicecategory/getParServicecategoryList',
        method:'post',
        data
    })
}
//新增工种
export const addParServicecategory = (data) => {
    return axios({
        url:'SwParServicecategory/addParServicecategory',
        method:'post',
        data
    })
}
//编辑工种
export const updateParServicecategoryById = (data) => {
    return axios({
        url:'SwParServicecategory/updateParServicecategoryById',
        method:'post',
        data
    })
}
//服务类别
export const getServicecategoryList = (data) => {
    return axios({
        url:'SwParServicecategory/getServicecategoryList',
        method:'post',
        data
    })
}
//新增服务类别
export const addServicecategory = (data) => {
    return axios({
        url:'SwParServicecategory/addServicecategory',
        method:'post',
        data
    })
}
//修改服务类
export const updateServicecategory = (data) => {
    return axios({
        url:'SwParServicecategory/updateServicecategory',
        method:'post',
        data
    })
}
//服务项
export const getBaseServiceList = (data) => {
    return axios({
        url:'SwParServicecategory/getBaseServiceList',
        method:'post',
        data
    })
}

//器材
export const getConsumptionEquipmentList = (data) => {
    return axios({
        url:'SwParServicecategory/getConsumptionEquipmentList',
        method:'post',
        data
    })
}
//新增器材
export const addConsumptionEquipmen = (data) => {
    return axios({
        url:'SwParServicecategory/addConsumptionEquipmen',
        method:'post',
        data
    })
}
//编辑器材
export const updateConsumptionEquipmen = (data) => {
    return axios({
        url:'SwParServicecategory/updateConsumptionEquipmen',
        method:'post',
        data
    })
}

//业主统计表
export const userCount = () => {
    return axios({
        url:'SwCount/userCount',
        method:'post'
    })
}
//作业员统计
export const workerCountAll = () => {
    return axios({
        url:'SwCount/workerCountAll',
        method:'post'
    })
}
//订单统计
export const orderCountAll = () => {
    return axios({
        url:'SwCount/orderCountAll',
        method:'post'
    })
}
//提现统计
export const withdrawalAll = () => {
    return axios({
        url:'SwCount/withdrawalAll',
        method:'post'
    })
}
//支付统计
export const payAll = () => {
    return axios({
        url:'SwCount/payAll',
        method:'post'
    })
}

// 订单导入
export const orderImport=(data)=>{
    return axios({
        url:"/excel/upload",
        method:'post',
        data
    })
}
// 评论列表
export const getCommentList= (data) => {
    return axios({
        url:"/SwCommend/commendList",
        method:'post',
        data
    })
}

 // 评论详情
export const getCommentDetail= (data) => {
    return axios({
        url:'/SwCommend/commendDetail',
        method:'post',
        data,
        
    })
}
// 删除评论
export const deleteCommend= (data) => {
    return axios({
        url:'/SwCommend/deleteCommend',
        method:'post',
        data,      
    })
}
// 修改评论状态
export const updateCommend= (data) => {
    return axios({
        url:'/SwCommend/commendPassOrReject',
        method:'post',
        data,      
    })
}
// 评论标签列表
export const getLabelList= (data) => {
    return axios({
        url:'/SwLabel/swLabelList',
        method:'post',
        data
    })
}

// 评论标签新增
export const addlabel= (data) => {
    return axios({
        url:'/SwLabel/addSwLabel',
        method:'post',
        data
    })
}

// 评论标签编辑
export const editlabel= (data) => {
    return axios({
        url:'/SwLabel/updateSwLabel',
        method:'post',
        data
    })
}

// 评论审核
export const commendPassOrReject= (data) => {
    return axios({
        url:'/SwCommend/commendPassOrReject',
        method:'post',
        data
    })
}

// 广告列表
export const getBannerList= (data) => {
    return axios({
        url:'/Banner/getBannerList',
        method:'post',
        data
    })
}
// 删除广告
export const delBannerList= (data) => {
    return axios({
        url:'/Banner/deteleBanner',
        method:'post',
        data
    })
}
// 新增广告
export const addBanner= (data) => {
    return axios({
        url:'/Banner/addBanner',
        method:'post',
        data
    })
}
// 编辑广告
export const editBanner= (data) => {
    return axios({
        url:'/Banner/upadteBanner',
        method:'post',
        data
    })
}
//公告通知
export const getSwPushMessageList = (data) => {
    return axios({
        url:'swPushMessage/getSwPushMessageList',
        method:'post',
        data
    })
}
//新增通知
export const addSwPushMessage = (data) => {
    return axios({
        url:'swPushMessage/addSwPushMessage',
        method:'post',
        data
    })
}
//删除通知
export const deteleSwPushMessage = (id) => {
    return axios({
        url:'swPushMessage/deteleSwPushMessage',
        method:'post',
        data:{ id }
    })
}
//收益明细
export const getPaymentList = (data) => {
    return axios({
        url:'payment/getPaymentList',
        method:'post',
        data
    })
}
// 地图列表接口
export const getSwLandmarkList = (data) => {
    return axios({
        url:'SwLandmark/getSwLandmarkList',
        method:'post',
        data
    })
}
// 新增地标接口
export const addSwLandmark = (data) => {
    return axios({
        url:'SwLandmark/addSwLandmark',
        method:'post',
        data
    })
}
// 删除地标接口
export const deleteSwLandmark = (data) => {
    return axios({
        url:'SwLandmark/deleteSwLandmark',
        method:'post',
        data
    })
}
// 修改地标接口
export const updateSwLandmark = (data) => {
    return axios({
        url:'SwLandmark/updateSwLandmark',
        method:'post',
        data
    })
}
// 团队管理统计
export const teamAll = (data) => {
    return axios({
        url:'/SwCount/teamAll',
        method:'post',
        data
    })
}