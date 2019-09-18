import {
    reqLogin,
    reqRegister,
    reqUpdateUserInfo,
    reqGetUser,
    reqGetUserList,
    reqReadMsg,
    reqReceiveMsgList
} from '../api/index'
import {
    AUTH_SUCCESS,
    AUTH_FAILURE,
    RECEIVE_USER_INFO,
    RESET_USER_INFO,
    RECEIVE_USER_LIST,
    RECEIVE_MSG,
    RECEIVE_MSG_LIST,
    READ_MSG
} from './action-types'

import io from 'socket.io-client'

/**
 * 初始化客户端的socketIO，采用单例设计模式
 * @param dispatch redux中的dispatch()方法
 * @param user_id 用户id
 */
function initSocketIO(dispatch, user_id) {
    if (!io.socket) {
        var socket = io('http://localhost:3000') ;
        io.socket = socket ;
        io.socket.on('receiveMsg', function(chatMsg) {
            if (chatMsg.from === user_id || chatMsg.to === user_id) {
                // 当前用户发的，或者是别人发给当前用户的
                console.log('客户端接收到服务器传来的消息') ;
                var target = user_id ;
                dispatch(receiveMsg({chatMsg, target})) ;
            }

        })
    }

}


const authSuccess = (userInfo) => {
    return {
        type: AUTH_SUCCESS,
        data: userInfo
    }
}

// 接收消息列表
const receiveMsgList = ({chatMsgs, users, user_id}) => {
    return {
        type: RECEIVE_MSG_LIST,
        data: {chatMsgs, users, user_id}
    }
}

const getChatMsgList = ({chatMsgs, users, user_id}) => {
    return {
        type: RECEIVE_MSG_LIST,
        data: {chatMsgs, users, user_id}
    }
}

// 接收一条消息
const receiveMsg = ({chatMsg, target}) => {
    console.log('receiveMsg target', target) ;
    return {
        type: RECEIVE_MSG,
        data: {chatMsg, target}
    }
}

const authFailure = (errInfo) => {
    return {
        type: AUTH_FAILURE,
        data: errInfo
    }
}

// 更新用户信息成功
const receiveUserInfo = (userInfo) => {
    return {
        type: RECEIVE_USER_INFO,
        data: userInfo
    }
}

// 重置用户信息
export const resetUserInfo = (errMsg) => {
    return {
        type: RESET_USER_INFO,
        data: errMsg
    }
}

// 根据用户类型获取用户列表
const receiveUserList = (userList) => {
    return {
        type: RECEIVE_USER_LIST,
        data: userList
    }
}

//
const msgRead = (source, target, modifiedCount) => {
    return {
        type: READ_MSG,
        data: {source, target, modifiedCount}
    }
}

// 实现登录的异步action
export const loginActionCreator = (user) => {

    var {username, password} = user ;

    // 对用户名和密码进行校验
    if (!username || !password) {
        return authFailure('用户名和密码不能为空！') ;
    }

    return (dispatch, getState) => {
        // 发起登录ajax请求
        reqLogin(user)
            .then(response => {
                var ret = response.data ;
                if (ret.code === 0) {
                    // 授权成功
                    getMsgList(dispatch, ret.data._id) ;
                    // 分发一个同步action
                    console.log(ret) ;
                    dispatch(authSuccess(ret.data)) ;
                } else {
                    // 授权失败
                    dispatch(authFailure(ret.msg)) ;
                }
            }, err => {
                console.log('服务器出现异常', err) ;
            })
    }
}

// 实现注册的异步action
export const registerActionCreator = (userInfo) => {
    var {username, password, passwordConfirmed, type} = userInfo ;
    // 对用户信息进行校验
    if (!username) {
        return authFailure('用户名不能为空！') ;
    } else if (password !== passwordConfirmed) {
        return authFailure('两次密码不一致！') ;
    } else if (!type) {
        return authFailure('没有选择用户类型！') ;
    }

    return (dispatch, getState) => {

        reqRegister({username, password, type})
            .then(response => {
                var ret = response.data ;
                if (ret.code === 0) {
                    // 授权成功
                    // 获取用户的聊天列表
                    getMsgList(dispatch, ret.data._id) ;
                    // 分发一个同步action
                    console.log(ret) ;
                    dispatch(authSuccess(ret.data)) ;
                } else {
                    // 授权失败
                    dispatch(authFailure(ret.msg)) ;
                }
            }, err => {
                console.log('服务器出现异常', err) ;
            })
    }
}

// 更新用户信息
export const updateUserInfoActionCreator = (userInfo) => {
    return (dispatch, getState) => {
        reqUpdateUserInfo(userInfo)
            .then(response => {
                var ret = response.data ;

                if (ret.code === 1) {
                    // 更新失败
                    //
                    dispatch(resetUserInfo(ret.msg)) ;
                } else {
                    // 更新成功
                    dispatch(receiveUserInfo(ret.data)) ;
                }
            }, err => {
                console.log('服务器出现异常', err) ;
            })
    }
}

// 获取登录用户信息
export const getUserInfoActionCreator = () => {
    return (dispatch, getState) => {
        reqGetUser()
            .then(response => {
                var ret = response.data ;

                if (ret.code === 0) {
                    // 成功
                    // 获取用户的聊天列表
                    getMsgList(dispatch, ret.data._id) ;

                    // 分发一个接收到用户信息的同步action
                    dispatch(receiveUserInfo(ret.data)) ;
                } else {
                    // 失败
                    // 分发一个重置用户信息的同步action
                    dispatch(resetUserInfo(ret.msg)) ;
                }
            })
    }
}

// 根据用户类型获取用户列表
export const receiveUserListActionCreator = (type) => {
    return (dispatch, getState) => {
        reqGetUserList(type)
            .then(response => {
                var ret = response.data ;
                console.log(ret) ;
                if (ret.code === 0) {

                    // 成功接收到响应数据，分发一个同步action
                    dispatch(receiveUserList(ret.data)) ;
                }
            }, err => {
                console.log('服务器异常', err) ;
            })
    }
}




/**
 * 获取用户的聊天消息列表
 * 在登录/注册/获取用户信息成功后调用
 * @param dispatch
 * @param user_id
 */
const getMsgList = (dispatch, user_id) => {

    // 初始化socketio
    initSocketIO(dispatch, user_id) ;

    reqReceiveMsgList()
        .then(response => {
            var ret = response.data ;
            if (ret.code === 0) {
                //
                var {chatMsgs, users} = ret.data ;
                dispatch(getChatMsgList({chatMsgs, users, user_id}))
            }
        })


}

export const sendMsg = ({from, to, content}) => {

    return (dispatch, getState) => {
        // 初始化Socket
        initSocketIO(dispatch, to) ;
        // 触发sendMsg事件，向服务器发送消息
        io.socket.emit('sendMsg', {from, to, content}) ;
    }
}

// 修改消息由未读变为已读
// 修改消息的状态，只能是修改对方发给自己的消息
export const msgReadActionCreator = (source, target) => {
    return (dispatch, getState) => {
        //
        reqReadMsg(source)
            .then(response => {
                var ret = response.data ;
                if (ret.code === 0) {
                    // 修改成功，分发一个action
                    //
                    dispatch(msgRead(source, target, ret.data)) ;
                }
            }, err => {
                console.log('服务器异常', err) ;
            })
    }
}
