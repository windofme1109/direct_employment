import {combineReducers} from 'redux'

import {getRedirectTo} from '../utils/index'
import {
    AUTH_SUCCESS,
    AUTH_FAILURE,
    RESET_USER_INFO,
    RECEIVE_USER_INFO,
    RECEIVE_USER_LIST,
    RECEIVE_MSG_LIST,
    READ_MSG,
    RECEIVE_MSG
} from './action-types'

// 初始的state
var initUserState = {
    username: '',
    type: '',
    _id: '',
    msg: '',
    // 重定向的目标路径
    redirectTo: ''
} ;



function userStateReducer(state = initUserState, action) {
    switch (action.type) {

        case AUTH_SUCCESS:
            // 授权成功
            var {type, header} = action.data ;
            var targetPath = getRedirectTo(type, header) ;
            return {...action.data, redirectTo: targetPath} ;

        case AUTH_FAILURE:
            // 授权失败
            return {...state, msg: action.data} ;
        case RECEIVE_USER_INFO:
            // 更新用户信息成功
            return {...action.data} ;
        case RESET_USER_INFO:
            // 更新用户信息失败
            // 所有信息清空
            return {...initUserState, msg: action.data} ;
        default:
            return state ;
    }
}

// 根据用户类型获取用户列表
var initUserList = [] ;

function userListReducer(state=initUserList, action) {
    switch (action.type) {
        case RECEIVE_USER_LIST:
            return action.data ;
        default:
            return state ;

    }
}

var initChatMsg = {
    // 存放消息的数组
    chatMsgs: [],
    // 用户信息
    users: {},
    // 未读消息的数量
    totalUnreadMsgCount: 0
}

function chatMsgReducer(state=initChatMsg, action) {
    switch (action.type) {
        case RECEIVE_MSG_LIST:
            var {chatMsgs, users, user_id} = action.data ;
            // 统计未读消息的总数
            var count = chatMsgs.reduce((preCount, msg) => {
                if (!msg.read && msg.to === user_id) {
                    return preCount + 1 ;
                } else {
                    return preCount
                }
            }, 0) ;

            return {chatMsgs, users, totalUnreadMsgCount: count} ;
        case RECEIVE_MSG:
            var {chatMsg, target} = action.data ;
            // 表示这条消息是否已读，1表示未读，0表示已读
            var isRead = !chatMsg.read && (chatMsg.to === target) ? 1 : 0 ;
            return {
                chatMsgs: [...state.chatMsgs, chatMsg],
                users: state.users,
                totalUnreadMsgCount: state.totalUnreadMsgCount + isRead
            } ;
        case READ_MSG:
            // 修改了哪些消息（由from、to决定）
            var {source, target, modifiedCount} = action.data ;
            // 修改chatMsgs中符合条件的消息的read为true
            var newChatMsgs = state.chatMsgs.map(msg => {
                if (msg.from === source && msg.to === target && !msg.read) {
                    // 修改read状态
                    // 不能这样直接修改
                    // 因为这样属于直接修改state
                    // msg.read = true ;
                    // 解构赋值的方式将read属性覆盖
                    return {...msg, read: true} ;
                } else {
                    return {...msg} ;
                }
            }) ;
            return {
                chatMsgs: newChatMsgs,
                users: state.users,
                totalUnreadMsgCount: state.totalUnreadMsgCount - modifiedCount
            } ;
        default:
            return state ;

    }
}

export default combineReducers({
    userState: userStateReducer,
    userList: userListReducer,
    userChatMsg: chatMsgReducer
})