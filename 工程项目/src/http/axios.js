import axios from 'axios';
import config from './config';
import { hashHistory } from "react-router";

export default function $axios(options){
    return new Promise((resolve,reject) => {
        const instance = axios.create({
            baseURL: config.baseUrl,
            headers: config.headers,
            timeout: config.timeout
        })

        //request 拦截器
        instance.interceptors.request.use(
            config => {
                let token =sessionStorage.getItem('token')
                // let token =JSON.parse(sessionStorage.user).token;
                // console.log(token);
                if (token) {
                    config.headers['token'] = token;
                   
                    
                }

                return config
            },

            error => {
                console.log('request:', error)

                if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
                    console.log('timeout请求超时')
                    // return service.request(originalRequest);// 再重复请求一次
                }
                return Promise.reject(error)
            }
        )

        //response 拦截器
        instance.interceptors.response.use(
            response => {
                let data;
                // IE9时response.data是undefined，因此需要使用response.request.responseText(Stringify后的字符串)
                if (response.data === undefined) {
                    data = JSON.parse(response.request.responseText)
                } else {
                    data = response.data
                }

                //token过期和无效验证码
                if (data.errCode === 1006) {
                    //重定向
                    hashHistory.push({ path: '/404' });
                    sessionStorage.removeItem("token");
                    return;
                }

                return data

            },

            err => {
                console.log('response:', err)
                // console.log(err.response.status)
                return Promise.reject(err)
            }
        )

        //请求处理
        instance(options).then(res => {
            resolve(res)
            return false
        }).catch(error => {
            reject(error)
        })
    })
}