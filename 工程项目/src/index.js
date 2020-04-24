import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import configureStore from './redux/store.js';
import App from './App.jsx';
import 'antd/dist/antd.css';
import * as serviceWorker from './serviceWorker';
import api from '@/http/index'
import moment from 'moment';
import 'moment/locale/zh-cn';


moment.locale('zh-cn');
React.Component.prototype.$api = api;

const store = configureStore();
ReactDOM.render(
    <ConfigProvider locale={zhCN}>
        <Provider store={store}>
            <App />
        </Provider>
    </ConfigProvider>
    ,
    document.getElementById('root'));
serviceWorker.unregister();
