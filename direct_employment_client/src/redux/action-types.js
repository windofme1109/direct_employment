// 授权成功，包含登录、注册、自动登录等情况
export const AUTH_SUCCESS = 'auth_success' ;

// 授权失败
export const AUTH_FAILURE = 'auth_failure' ;


// 更新用户信息成功，接收用户信息
export const RECEIVE_USER_INFO = 'recevie_user_info' ;

// 更新用户信息失败，重置用户信息
export const RESET_USER_INFO = 'reset_user_info' ;

// 根据用户类型获取用户列表
export const RECEIVE_USER_LIST = 'receive_user_list' ;

// 接收消息列表
export const RECEIVE_MSG_LIST = 'receive_msg_list' ;
// 接收一条消息
export const RECEIVE_MSG = 'receive_msg' ;
// 修改消息由未读状态变为已读状态
export const READ_MSG = 'read_msg' ;