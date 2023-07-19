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

export function updateUser(data){
    return request({
        url: '/account/user/update/info',
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

export function getRecipientById(id){
    return request({
        url:'/mesmanager/recipient/findById?id=' + id,
        method:'get'
    })
}

export function getPeerRecipient(){
    return request({
        url:'/mesmanager/recipient/listPeerRecipient',
        method:'get'
    })
}

export function getAreaWithUserIfo(){
    return request({
        url:'/sys/districtInfo/allWithUserIfo',
        method:'get'
    })
}

export function addRecipient(data){
    return request({
        url:'/mesmanager/recipient/add',
        method:'post',
        data:data
    })
}

export function updateRecipient(data){
    return request({
        url:'/mesmanager/recipient/update',
        method:'post',
        data:data
    })
}

export function delRecipient(id){
    return request({
        url:'/mesmanager/recipient/delete?id=' + id,
        method: 'get'
    })
}

// 获取同级领导
export function getLeaders(){
    return request({
        url: '/account/user/list/auditors',
        method: 'get'
    })
}

// 获取原通讯录用户
export function getAddressBook(data){
    return request({
        url: '/addressbook/user/page',
        method: 'post',
        data:data
    })
}

// 新增原通讯录用户
export function addGroupUser(data){
    return request({
        url: '/addressbook/user/add',
        method: 'post',
        data:data
    })
}

// 修改原通讯录用户
export function updateGroupUser(data){
    return request({
        url: '/addressbook/user/update',
        method: 'post',
        data:data
    })
}

// 删除原通讯录用户
export function delGroupUser(data){
    return request({
        url: '/addressbook/user/delete',
        method: 'post',
        data:data
    })
}

// 获取通讯录分组
export function getGroupList(){
    return request({
        url: '/addressbook/group/listAll',
        method: 'get'
    })
}

// 新增通讯录分组
export function addGroup(data){
    return request({
        url: '/addressbook/group/add',
        method: 'post',
        data:data
    })
}

// 修改通讯录分组
export function updateGroup(data){
    return request({
        url: '/addressbook/group/update',
        method: 'post',
        data:data
    })
}

// 删除通讯录分组
export function delGroup(data){
    return request({
        url: '/addressbook/group/delete',
        method: 'post',
        data:data
    })
}

// 获取分组和组员
export function getUserByGroup(){
    return request({
        url: '/addressbook/group/listUserByGroup',
        method: 'get'
    })
}

// 导入通讯录
export function importFile(data){
    return request({
        headers: {
            "Content-Type": "multipart/form-data",
        },
        url: '/addressbook/user/import',
        method: 'post',
        data: data
    })
}