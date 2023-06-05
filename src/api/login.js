//将拦截器整体导入
import request from '@/util/request'//导入已经写好的拦截器

export function Login(data){
    return request({
        url:'/account/auth/login',
        method:'post',
        data: data,
    })
}

export function getMenuAdmin(){
    return request({
        url:'/sys/menu/get/u',
        method:'get',
    })
}