/*
 * action 类型
 */

export const type = {
    SWITCH_MENU : 'SWITCH_MENU',
    SWITCH_SUBMENU:'SWITCH_SUBMENU',
    SWITCH_INLINECOLLAPSED:'SWITCH_INLINECOLLAPSED',
    MENU_LIST:'MENU_LIST',
    TREE_POST:'TREE_POST',
    GetInfo:"GetInfo",
    Share_Data:'Share_Data'
}

// 菜单点击切换，修改面包屑名称
export function switchMenu(switchName) {
    return {
        type:type.SWITCH_MENU,
        switchName,
    }
}

export function switchSubMenu(subMenuActive) {
    return {
        type:type.SWITCH_SUBMENU,
        subMenuActive
    }
}

export function setInlineCollapsed(inlineCollapsed) {
    return {
        type:type.SWITCH_INLINECOLLAPSED,
        inlineCollapsed
    }
}
// 菜单点击切换，修改面包屑名称
export function MenuList(MenuList) {
    return {
        type:type.MENU_LIST,
        MenuList,
    }
}

export function treePost(treePost){
    return {
        type:type.TREE_POST,
        treePost
    }
}
// 获取顶部Bar的相关数据
export function GetInfo(GetInfo){
    return {
        type:type.GetInfo,
        GetInfo
    }
}
// 左侧导航栏的共享数据
export function ShareData(ShareData){
    return {
        type:type.ShareData,
        ShareData
    }
}
