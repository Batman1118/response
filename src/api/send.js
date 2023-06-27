//将拦截器整体导入
import request from '@/util/request'//导入已经写好的拦截器

// 信息编辑
export function msgSend(data){
    return request({
        url: '/warning/info/add',
        method: 'post',
        data: data
    })
}

// 信息修改
export function msgUpdate(data){
    return request({
        url: '/warning/info/updateById',
        method: 'post',
        data: data
    })
}

// 群发信息
export function massSend(data){
    return request({
        url: '/mesmanager/mes/send',
        method: 'post',
        data: data
    })
}

export function getMassRecord(data){
    return request({
        url: '/mesmanager/mes/page',
        method: 'post',
        data: data
    })
}

// 发布信息
export function publishMsg(id){
    return request({
        url: '/warning/info/publishById?id=' + id,
        method: 'get'
    })
}

// 删除信息
export function deleteMsg(id){
    return request({
        url: '/warning/info/deleteById?id=' + id,
        method: 'get'
    })
}





