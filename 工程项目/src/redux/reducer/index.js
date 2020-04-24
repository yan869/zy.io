/**
 * reducer
 */
import { type } from '../action';
export const ebikeData = (state, action) => {
    // console.log(action);

    switch (action.type) {
        case type.SWITCH_MENU:
            // console.log(action.switchName)
            return {
                ...state,
                swtichActive: action.switchName,
            };
        case type.SWITCH_SUBMENU:
            return {
                ...state,
                subMenuActive: action.subMenuActive
            };
        case type.SWITCH_INLINECOLLAPSED:
            return {
                ...state,
                inlineCollapsed: action.inlineCollapsed
            };
        case type.MENU_LIST:
            return {
                ...state,
                MenuList: action.MenuList
            };
        case type.TREE_POST:
            return {
                ...state,
                treePost: action.treePost
            };
        case type.GetInfo:
            return {
                ...state,
                GetInfo: action.GetInfo
            };
        case type.ShareData:
            return {
                ...state,
                ShareData: action.ShareData
            };
        default:
            return { ...state };
    }
};
