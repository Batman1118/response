//将拦截器整体导入
import request from '@/util/request'//导入已经写好的拦截器

// 我收到的
export function getMsgRecord(data){
    return request({
        url: '/published/warninfo/receive/Page',
        method: 'post',
        data: data
    })
}

// 叫应
export function responseMsg(id){
    return request({
        url: '/published/warninfo/responseById?id=' + id,
        method: 'get'
    })
}


export function readById(id){
    return request({
        url: '/published/warninfo/readById?id=' + id,
        method: 'get'
    })
}

// 我发出的
export function getPublishRecord(data){
    return request({
        url: '/published/warninfo/publish/Page',
        method: 'post',
        data: data
    })
}

// 历史信息
export function getHistoryRecord(data){
    return request({
        url: '/published/warninfo/history/publish',
        method: 'post',
        data: data
    })
}

// 历史叫应信息
export function getResponseRecord(data){
    return request({
        url: '/published/warninfo/history/response',
        method: 'post',
        data: data
    })
}

// 根据id获取叫应信息
export function getResponseById(data){
    return request({
        url: '/published/warninfo/responses/page',
        method: 'post',
        data: data
    })
}

// 删除文件
export function deleteFile(id){
    return request({
        url: '/attachment/delete/' + id,
        method: 'get'
    })
}