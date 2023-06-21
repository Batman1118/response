import axios from "axios";//原生的axios
import Cookies from 'js-cookie';
import { Session } from '@/util/storage';
import {message} from "ant-design-vue";
import { loginOut } from "@/api/login";
//用来拦截用的
axios.defaults.headers.post["Content-Type"] = "application/json;charset=utf-8";
//创建一个单例

const { baseUrl } = require('../../config/env.' + process.env.NODE_ENV)
const http= axios.create({
    baseURL: baseUrl,
    timeout: 5000,//响应时间
    // headers:{"Content-Type":"application/json;charset=utf-8"},
})

//拦截器  -请求拦截
http.interceptors.request.use(config=>{
    // 部分接口需要token
    let token = Cookies.get('resTk')
    let uid = Cookies.get('resUid')
    if(token){
        config.headers.tk = token;
        config.headers.uid = uid
        // config.headers ={
        // 'token':token
        // }
    }
    return config;
},err=>{
    return Promise.reject(err)
})

//拦截器  -响应拦截
http.interceptors.response.use(
    (response) => {
        // 对响应数据做点什么
        if (response.data.code && response.data.code === 401) {
            // message.error('用户不存在')
            setTimeout(()=>{
                loginOut()
                    .then(() => {
                        Session.clear();
                        window.location.href = '/';
                    });
            },2000)
        } else if (response.data.code && response.data.code === 405) {
            message.error('token失效')
            setTimeout(()=>{
            loginOut()
                .then(() => {
                    Session.clear();
                    window.location.href = '/';
                });
            },2000)
        }
        return Promise.resolve(response);
    },
    (error) => {
        // 对响应错误做点什么
        if (error.message.indexOf('timeout') != -1) {
            message.error('网络超时');
            setTimeout(() => {
                Session.clear();
                window.location.href = '/';
            }, 1000);
        } else if (error.message == 'Network Error') {
            message.error('网络连接错误');
            setTimeout(() => {
                Session.clear();
                window.location.href = '/';
            }, 1000);
        } else {
            if (error.response.data) message.error(error.response.data.error);
            else message.error('接口路径找不到');
        }
        return Promise.reject(error);
    }
);

//整体导出
export default http;