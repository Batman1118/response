//将拦截器整体导入
import request from '@/util/request'//导入已经写好的拦截器

// 审核记录
export function getReviewRecord(data){
    return request({
        url: '/warning/info/review/Page',
        method: 'post',
        data: data
    })
}

// 信息详情
export function getReviewDetail(id){
    return request({
        url: '/warning/info/review/findById?id=' + id,
        method: 'get'
    })
}

// 工作人员查看详情
export function getReviewDetailByWorker(id){
    return request({
        url: '/warning/info/findById?id=' + id,
        method: 'get'
    })
}

// 提交审核
export function postReview(data){
    return request({
        url: '/warning/info/review/submit',
        method: 'post',
        data: data
    })
}








