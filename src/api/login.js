//将拦截器整体导入
import request from '@/util/request'//导入已经写好的拦截器

export function login(data){
    return request({
        url:'/account/auth/login',
        method:'post',
        data: data,
    })
}

export function loginOut(){
    return request({
        url:'/account/auth/logout',
        method:'get'
    })
}

export function getMenuAdmin(){
    return request({
        url:'/sys/menu/get/u',
        method:'get',
    })
}

// 获取区划列表
export function getDistrictInfo(){
    return request({
        url:'/sys/districtInfo/all',
        method:'get',
    })
}

// 获取首页统计数据
export function getBasicData(){
    return request({
        url:'/statistics/basicData',
        method:'get',
    })
}

// 获取首页统计数据
export function getWarningData(){
    return request({
        url:'/statistics/warningIndex',
        method:'get',
    })
}