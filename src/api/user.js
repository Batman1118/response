//将拦截器整体导入
import request from '@/util/request'//导入已经写好的拦截器

// 用户管理
export function getUser(data){
    return request({
        url: '/account/user/find/user/list',
        method: 'post',
        data: data,
    })
}

export function addUser(data){
    return request({
        url: '/account/user/add',
        method: 'post',
        data: data,
    })
}

export function delUser(id){
    return request({
        url: '/account/user/deleteUser?userId=' + id,
        method: 'get',
    })
}

export function updatePwd(data){
    return request({
        url: '/account/user/update/password',
        method: 'post',
        data: data
    })
}

// 平级接收人管理
export function getRecipient(data){
    return request({
        url:'/mesmanager/recipient/page',
        method:'post',
        data:data,
    })
}

export function getRecipientById(data){
    return request({
        url:'/mesmanager/recipient/findById',
        method:'post',
        data:data,
    })
}

export function addRecipient(data){
    return request({
        url:'/mesmanager/recipient/page',
        method:'post',
        data:data,
    })
}














