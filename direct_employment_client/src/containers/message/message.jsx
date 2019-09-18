import React, {Component} from 'react'
import {List, Badge} from 'antd-mobile'
import {connect} from 'react-redux'


var Item = List.Item ;
var Brief = Item.Brief ;

/**
 * 取出同当前登录用户同其他用户的聊天记录中的最后一条消息
 * @param chatMsgs 当前登录用户相关的所有聊天记录
 * @param user_id 当前登录用户的id
 * @returns {[]}
 */
function getLastMsg(chatMsgs, user_id) {
    // 1. 新建一个对象，用来存放最后一条聊天记录，形式是：{chat_id1: lastMsg1,chat_id2: lastMsg2,...}
    var lastMsgObj = {} ;
    chatMsgs.forEach(msg => {
        // 2. 取出chat_id
        var chat_id = msg.chat_id ;

        // 给每条聊天记录增加一个unreadMsgCount属性
        if (!msg.read && msg.to === user_id) {
            // msg的read属性为false，并且消息是发给当前用户的，则表示消息未读
            // 所以将unreadMsgCount设置为1
            msg.unreadMsgCount = 1 ;
        } else {
            //
            msg.unreadMsgCount = 0 ;
        }


        var lastMsg = lastMsgObj[chat_id] ;

        // 3. 检查lastMsgObj是否存在这条聊天记录
        if (lastMsg) {
            // 存在

            // 将新的消息的未读数量（就是1）同已保存的消息的未读数量做累加
            var unreadMsgCount = lastMsg.unreadMsgCount + msg.unreadMsgCount ;

            // 比较创建时间
            if (lastMsg.create_time < msg.create_time) {
                // 放入lastMsgObj对象的聊天记录创建时间小于未放入的
                // 替换
                lastMsgObj[chat_id] = msg ;
            }

            // 将更新后的未读消息数量添加到保存的最后一条聊天记录中
            lastMsgObj[chat_id].unreadMsgCount = unreadMsgCount ;

        } else {
            // 不存在
            lastMsgObj[chat_id] = msg ;
        }
    })

    // 4. 从lastMsgObj对象中取出属性值
    var lastMsgArr = Object.values(lastMsgObj) ;
    // 5. 排序，根据每条消息的创建时间进行降序排序
    lastMsgArr.sort(function(msg1, msg2) {
        //
        return msg2.create_time - msg1.create_time ;
    })
    return lastMsgArr ;
}



class Message extends Component {
    render() {

        var {userState, userChatMsg} = this.props ;
        var {chatMsgs, users} = userChatMsg ;

        console.log('Message组件重新渲染了') ;

        var currentLoginUserId = userState._id ;

        var lastMsgArr = getLastMsg(chatMsgs, currentLoginUserId) ;
        console.log('Message', lastMsgArr) ;
        return (
            <List style={{marginTop: 50, marginBottom: 50}}>
                {
                    lastMsgArr.map(msg => {
                        // 这里显示的是同当前登录用户聊天的用户的信息
                        // 而最后一条消息的发送者有可能是当前的登录用户，也有可能是其他用户
                        // 所以要判断，两种情况下，都要找出那个其他用户的信息
                        var targetUserId = msg.from === currentLoginUserId ? msg.to : msg.from;

                        var targetUser = users[targetUserId];

                        var header = targetUser.header ? require(`../../assets/images/${targetUser.header}.png`) : null;

                        return (
                            <Item
                                key={msg._id}
                                extra={<Badge text={msg.unreadMsgCount}/>}
                                // 箭头方向
                                arrow='horizontal'
                                thumb={header}
                                onClick={() => this.props.history.push(`/chat/${targetUserId}`)}
                            >
                                {msg.content}
                                <Brief>{targetUser.username}</Brief>
                            </Item>
                        )
                    })

                }
            </List>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userState: state.userState,
        userChatMsg: state.userChatMsg
    }
}

const mapDispatchToProps = {

}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Message) ;