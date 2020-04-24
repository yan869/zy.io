import { createStore } from 'redux';
// 引入所有的reducer
import {ebikeData} from './reducer';
const initialState = {
    swtichActive: '',
    subMenuActive: [],
    menulist: sessionStorage.getItem("team") ? true : false,
    inlineCollapsed: false,
    treelist:[],
    routeConfig:{}
}
const configureStore = () => createStore(ebikeData, initialState);
export default configureStore;

// import { createStore } from 'redux'
// const default_store = {
//     user: {
//         user_id: 0,
//         user_name: ""
//     },
//     switchActive:''
// };
// function rootRedux(state = default_store, action) {
//     let new_store = Object.assign({}, state);
//     switch (action.type) {
//         case "UPDATE_USER":
//             new_store.user = action.user
//             break;
//         case "SWITCH_TAB":
//             new_store.switchActive = action.switchActive
//             break;
//     }
//     return new_store;
// }
// let store = createStore(rootRedux);
// export default store;