/*
 * @Author: your name
 * @Date: 2020-02-26 09:09:50
 * @LastEditTime: 2020-11-04 21:17:14
 * @LastEditors: Clarissa
 * @Description: In User Settings Edit
 * @FilePath: \QiongLaiBigDataWeb\src\api\index.js
 */
import axios from 'axios'
import qs from 'qs';
import {
    message
} from 'antd';

window.BaseUrl = window.location.hostname == '暂无地址';

// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/json';

// 请求拦截器
axios.interceptors.request.use((config) => {
    // 获取token
    const access = window.localStorage.getItem('access_token');
    // 在请求头中携带token
    config.headers.authorization = `${access}`;
    return config
});

// 请求超时时间
axios.defaults.timeout = 10000;

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