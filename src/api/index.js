/*
 * @Author: your name
 * @Date: 2020-02-26 09:09:50
 * @LastEditTime: 2020-08-03 11:48:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \QiongLaiBigDataWeb\src\api\index.js
 */
import axios from 'axios'
import qs from 'qs';
import {
    message
} from 'antd';

window.BaseUrl = window.location.hostname == 'localhost' ? 'http://121.42.181.96.8087' : '/api/v1.1/';
// window.BaseUrl = 'http://192.168.2.116:8087';
// window.BaseUrl = 'http://192.168.1.155:8080/api/v1.1/';

// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/json';

// 请求拦截器
axios.interceptors.request.use((config) => {
    // 获取token
    const access = window.localStorage.getItem('access_token');
    // 在请求头中携带token
    config.headers.authorization = `${access}`;
    // config.headers.authorization ='Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjcxZjA5ZDNkODY0NDY1N2RmYzQ5NTIxNDg4NDNlYmRhODM1NzY4NmU2NTkzNDNiMmNiN2Y0MjhhNDExYjk4MzU0N2NjNDgxY2FjNTU2YjVlIn0.eyJhdWQiOiIxIiwianRpIjoiNzFmMDlkM2Q4NjQ0NjU3ZGZjNDk1MjE0ODg0M2ViZGE4MzU3Njg2ZTY1OTM0M2IyY2I3ZjQyOGE0MTFiOTgzNTQ3Y2M0ODFjYWM1NTZiNWUiLCJpYXQiOjE1NjMzMjg0NTUsIm5iZiI6MTU2MzMyODQ1NSwiZXhwIjoxNTk0OTUwODU1LCJzdWIiOiI0Iiwic2NvcGVzIjpbIioiXX0.KIr20LsEnjRq0Z-YT0_bpGUkHrMkGL7WXVcpjo-fBk3w4l58Zqrz30vyCXlcdpGID_lvD7g4HwdOAA540i7WDfLigygBY8VsOAAH8Eq3IUnL4p-seqmF_dotShqCqT5m6wd1PsDbgOVlxmBfMtBiIPjlNcEnGILVlObB2i8IbzHc3qbEa2A5jBRxjXc-2aVt6DAvdtYZ2jvXMtwYRJUc-QPUNKz4a-HNGrCAtbg92vp9jUz0T0GTNirSjtdFxSnVubDPVgnBWL3_cM0oRiT51Mz93kaniVYVVoL5CzpKVak7ptun7ER_CTxbqAEo5lc_FovWvd0UDbJlVfa5Ly0113YlXhbt5uZ7EfnAgISLGUEGX7UU85umvvNWQeVUAP2iFNWsYolr2YhJzN6Cd_Rgzq9nnEwDcQgVlwjEv_xlYl9NF1n-lCCl26Qng_OPvIas0K3FO6zUajZnHn4Ehn85PZwkqTgwdjlEcvLynBj9jfYdB4ZArkQE2aqWbcw3eYWoLTB7sJO4srEAQPO-oqaBap3WRteKAzg5uJGs4aFPO6miwCwDkCa2AnQYJsOCJwUE3Tdtss2oVNdGaEpisJoNwSNw6aUEU4B742cSLClTkZRk_SAGWQ_dByY_EtePDy4dDQkmgZKCtlswqh7pQHTthgm1c0PmIAvYBgSi91joaZ8'
    return config
});

// 请求超时时间
axios.defaults.timeout = 10000;

//设置axios的请求拦截
// axios.interceptors.request.use((config) => {
//     // 获取token
//     //在请求头中携带token
//     console.log(config);
// });

// 设置axios的返回拦截
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.message.includes('timeout')) {
            console.log("错误回调", error);
            message.destroy(); //拒绝吐丝
            message.error('网络超时，请重新刷新连接！');
            return Promise.reject(error);
        }
        return Promise.reject(error);
    });

export function get(url, params) {
    return new Promise((resolve, reject) => {
        axios.get(window.BaseUrl + url, {
                params: params
            })
            .then(res => {
                resolve(res.data)
            })
            .catch(err => {
                reject(err.data)
            })
    })
}

export function post(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(window.BaseUrl + url + '?' + qs.stringify(params))
            .then(res => {
                resolve(res.data)
            })
            .catch(err => {
                reject(err.data)
            })
    })
}