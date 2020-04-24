const baseUrl = "http://47.110.140.230:90/"


export default {
    method: 'get',
    //基础url前缀
    baseUrl: baseUrl,
    //请求头信息
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    },
    //基础请求超时时间
    timeout: 1000 * 10
}