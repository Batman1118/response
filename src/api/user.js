//将拦截器整体导入
import request from '@/util/request'//导入已经写好的拦截器

export function getUser(data){
    return request({
        url:'/account/user/find/user/list',
        method:'post',
        data:data,
    })
}

export function addUser(data){
    return request({
        url:'/account/user/add',
        method:'post',
        data: data,
    })
}