/**
 * 包含n个接口请求函数
 */
import ajax from './ajax'

export const reqLogin = ({username, password}) => {
    return ajax('/login', {username, password}, 'POST') ;
}

// 函数定义时，要求传入的参数是形参，必须是变量，不能是字符串，数字的具体的量
// 函数调用的传入的是实参，也就是具体的量
export const reqRegister = ({username, password, type}) => {
    return ajax('/register', {username, password, type}, 'POST') ;
}

// 更新用户信息
export const reqUpdateUserInfo = (userInfo) => {
    return ajax('/update', userInfo, 'POST') ;
}

// 获取登录用户的信息
export const reqGetUser = () => {
    return ajax('/user') ;
}

// 获取用户列表
export const reqGetUserList = (type) => {
    return ajax('/userlist', {type}, 'GET') ;
}

// 获取聊天消息列表
export const reqReceiveMsgList = () => {
    return ajax('/msglist') ;
}

// 修改消息由未读状态变为已读状态
/**
 *
 * @param from 消息的发送者
 * @returns {Promise<AxiosResponse<T>> | Promise<AxiosResponse<T>> | undefined}
 */
export const reqReadMsg = (from) => {
    return ajax('/readmsg', {from: from}, 'POST') ;
}