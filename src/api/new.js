//将拦截器整体导入
import request from '@/util/request'//导入已经写好的拦截器

// 分页反应措施
export function getMeasure(data){
    return request({
        url: '/response/measure/page',
        method: 'post',
        data: data,
    })
}

// 新增反应措施
export function addMeasure(data){
    return request({
        url: '/response/measure/add',
        method: 'post',
        data: data,
    })
}

// 修改反应措施
export function updateMeasure(data){
    return request({
        url: '/response/measure/update',
        method: 'post',
        data: data,
    })
}

// 删除反应措施
export function delMeasure(id){
    return request({
        url: '/response/measure/deleteById?id=' + id,
        method: 'get'
    })
}

// 根据id获取反应措施
export function responseMeasure(data){
    return request({
        url: '/app/warninfo/responseMeasure/get',
        method: 'post',
        data: data
    })
}