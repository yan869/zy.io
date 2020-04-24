import React from 'react';
import { Router, hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { ShareData } from '@/redux/action'
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import * as views from "@/pages/views/index"
import * as user from "@/pages/user/index"
import * as orders from "@/pages/order/index"
import * as certificates from "@/pages/certificate/index"
import * as withdraws from "@/pages/withdraw/index"
import * as serves from "@/pages/serve/index"
import * as comments from "@/pages/comment/index"
import * as setManages from "@/pages/setManage/index"
import * as statistics from "@/pages/statistics/index"
import * as sys from "@/pages/sys/index"
import * as personage from "@/pages/personage/index"
import * as setMap from "@/pages/setMap/index"
//路由拦截
const islogin = (nextState, replaceState) => {
    const token = sessionStorage.getItem('token')
    // let path = nextState.location.pathname;

    if (!token) { // 没有token，那就返回首页
        replaceState('/login')
    }
}
const routeConfig = [
    {
        path: '/',
        component: Home,
        indexRoute: { component: views.info },
        // childRoutes: [
        //     { path: '/', component: views.totalKe },
        // ],
        onEnter: islogin
    },
    {
        path: '/user',
        component: Home,
        childRoutes: [
            { path: 'operator', component: user.operator },
            { path: 'proprietary', component: user.proprietary },
        ],
        onEnter: islogin
    },
    {
        path: '/orders',
        component: Home,
        childRoutes: [
            { path: 'selectOrders', component: orders.selectOrders },
            { path: 'Sendorders', component: orders.Sendorders },
        ],
        onEnter: islogin
    },
    {
        path: '/certificates',
        component: Home,
        childRoutes: [
            { path: 'auditor', component: certificates.auditor },
            { path: 'selectcert', component: certificates.selectcert },
            { path: 'payment', component: certificates.payment },
            { path: 'account', component: certificates.account },
            { path: 'realName', component: certificates.realName }
        ],
        onEnter: islogin
    },
    {
        path: '/withdraws',
        component: Home,
        childRoutes: [
            { path: 'applyfor', component: withdraws.applyfor },
            { path: 'succeed', component: withdraws.succeed },
            { path: 'reject', component: withdraws.reject },
            { path: 'failed', component: withdraws.failed },
        ],
        onEnter: islogin
    },
    {
        path: '/serves',
        component: Home,
        childRoutes: [
            { path: 'oneserve', component: serves.oneserve },
            { path: 'twoserve', component: serves.twoserve },
            { path: 'threeserve', component: serves.threeserve },
            { path: 'fourserve', component: serves.fourserve },
        ],
        onEnter: islogin
    },
    {
        path: '/comments',
        component: Home,
        childRoutes: [
            { path: 'findcom', component: comments.findcom },
            { path: 'commentLable', component: comments.commentLable },
        ],
        onEnter: islogin
    },
    {
        path: '/setManages',
        component: Home,
        childRoutes: [
            { path: 'messageManage', component: setManages.messageManage },
            { path: 'picManage', component: setManages.picManage },
        ],
        onEnter: islogin
    },
    {
        path: '/statistics',
        component: Home,
        childRoutes: [
            { path: 'moneySta', component: statistics.moneySta },
            { path: 'orderSta', component: statistics.orderSta },
            { path: 'workSta', component: statistics.workSta },
            { path: 'userSta', component: statistics.userSta },
        ],
        onEnter: islogin
    },
    {
        path: '/sys',
        component: Home,
        childRoutes: [
            { path: 'user', component: sys.user },
            { path: 'role', component: sys.role },
            { path: 'menu', component: sys.menu },
        ],
        onEnter: islogin
    },
    {
        path: '/personage',
        component: Home,
        childRoutes: [
            { path: 'userpersonal', component: personage.userpersonal },
        ],
        onEnter: islogin
    },
    {
        path: '/setMap',
        component: Home,
        childRoutes: [
            { path: 'map', component: setMap.map },
        ],
        onEnter: islogin
    },
    {
        path: '/login',
        component: Login
    }
]
const mapStateToProps = state => {
    return {
        ShareData: state.ShareData
    }
}


export default connect(mapStateToProps)(() => (
    <Router history={hashHistory} routes={routeConfig} />
))
