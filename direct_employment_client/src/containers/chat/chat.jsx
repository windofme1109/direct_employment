import React, {Component} from 'react'
import {NavBar, InputItem, List, Icon} from 'antd-mobile'
import {connect} from 'react-redux'
import {sendMsg, msgReadActionCreator} from '../../redux/actions'

var Item = List.Item ;

class Chat extends Component {
    constructor(props) {
        super(props) ;
        this.state = {
            content: ''
        }
    }

    // 列表自动下滑到底，显示最后一条消息
    // 组件第一次装载完成调用
    componentDidMount() {
        window.scrollTo(0, document.body.scrollHeight) ;

        // 这里要发起一个修改消息状态的action
        // 修改消息只能是修改别人发给我的消息
        // 那么target表示当前登录用户，既是目标用户
        var target = this.props.userState._id ;

        // source就是同当前登录用户聊天的其他用户
        var source = this.props.match.params.user_id ;

        this.props.msgReadActionCreator(source, target) ;
    }

    // 组件更新完成后调用
    componentDidUpdate(prevProps, prevState, snapshot) {
        window.scrollTo(0, document.body.scrollHeight) ;

    }

    componentWillUnmount() {
        // 聊天发起用户的id
        var target = this.props.userState._id ;
        // 聊天的目标用户
        var source = this.props.match.params.user_id ;

        this.props.msgReadActionCreator(target, source) ;
    }

    submit = () => {
        var {content} = this.state ;
        // 聊天发起用户的id
        var from = this.props.userState._id ;
        // 聊天的目标用户
        var to = this.props.match.params.user_id ;

        // 分发一个action
        this.props.sendMsg({from, to, content}) ;
        this.setState({
            content: ''
        })
        console.log('输入的聊天内容是：', this.state) ;
    }

    getInputContent = (val) => {
        var val = val.trim() ;
        this.setState({
            content: val
        })


    }
    render() {

        var {userState, userChatMsg} = this.props ;
        var {chatMsgs, users} = userChatMsg ;
        var sourceId = userState._id ;
        var targetId = this.props.match.params.user_id ;
        // 生成chat_id
        var chat_id = [sourceId, targetId].sort().join('_') ;

        // 根据chat_id从消息列表中过滤出相关消息
        var relatedMsg = chatMsgs.filter((item) => item.chat_id === chat_id) ;

        // 获取目标用户的信息
        var targetUser = users[targetId] ;
        if (!targetUser) {
            return null ;
        }
        var targetIcon = targetUser.header ? require(`../../assets/images/${targetUser.header}.png`) : null ;
        return (
            <div id='chat-page'>
                <NavBar
                    className='fixed-top'
                    // 导航栏添加一个向左的箭头
                    icon={<Icon type='left' />}
                    // 给这个向左的箭头绑定事件，回到上一级，使用的是goBack()这个方法
                    onLeftClick={() => this.props.history.goBack()}
                >
                    {targetUser.username}
                </NavBar>
                <List style={{marginTop: 50, marginBottom: 50}}>
                    {
                        relatedMsg.map(msg => {
                            if (msg.from === targetId) {
                                // 渲染发给我的消息
                                return (
                                    <Item
                                        key={msg._id}
                                        thumb={targetIcon}
                                    >
                                        {msg.content}
                                    </Item>
                                )
                            } else {
                                // 渲染我发给别人的消息
                                return (
                                    <Item
                                        key={msg._id}
                                        className='chat-me'
                                        extra='我'
                                    >
                                        {msg.content}
                                    </Item>
                                )
                            }
                        })
                    }

                </List>
                <div className='am-tab-bar'>
                    <InputItem
                        palceholder='请输入'
                        value={this.state.content}
                        onChange={(val) => {this.getInputContent(val)}}
                        extra={
                            <span onClick={this.submit}>发送</span>
                        }
                    />

                </div>
            </div>
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
    sendMsg,
    msgReadActionCreator
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Chat) ;