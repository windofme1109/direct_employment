import React, {Component} from 'react'
import {NavBar} from 'antd-mobile'
import Cookies from 'js-cookie'
import {Route, Switch, Redirect} from 'react-router-dom'
import {connect} from 'react-redux'

import BossInfo from '../boss-info/boss-info'
import JobhunterInfo from '../jobhunter-info/jobhunter-info'
import Boss from '../boss/boss'
import Jobhunter from '../jobhunter/jobhunter'
import Message from '../message/message'
import Personal from '../personal/personal'
import NavFooter from '../../components/nav-footer/nav-footer'
import NotFound from '../not-found/not-found'
import Chat from '../chat/chat'
import {getUserInfoActionCreator} from '../../redux/actions'
import {getRedirectTo} from '../../utils'


class Main extends Component {

    constructor(props) {
        super(props) ;
        // 不同路由的相关信息
        this.navList = [
            {
                // 路由路径
                path: '/boss',
                // 组件
                component: Boss,
                // 标题
                title: '大神列表',
                // 底部导航栏显示的图标
                icon: 'dashen',
                // 底部导航栏显示的导航文字
                text: '大神'
            },
            {
                path: '/jobhunter',
                component: Jobhunter,
                title: '老板列表',
                icon: 'laoban',
                text: '老板'
            },
            {
                path: '/message',
                component: Message,
                title: '消息列表',
                icon: 'message',
                text: '消息'
            },
            {
                // 路由路径
                path: '/personal',
                component: Personal,
                title: ' 用户中心',
                icon: 'personal',
                text: ' 个人',
            },

        ]
    }
    componentDidMount() {
        // 加载完成组件后，向后台请求信息
        var user_id = Cookies.get('user_id') ;
        var {userState} = this.props ;
        if (user_id && !userState._id) {
            // cookies存在，而redux中state中_id不存在
            // 表示用户曾经登陆过，但是现在没有处于登录状态
            // 所以向后台发送请求，获取登录用户信息
            this.props.getUserInfoActionCreator() ;
        }
    }

    render() {

        // 从cookies中取出user_id
        var user_id = Cookies.get('user_id') ;
        var userState = this.props.userState ;

        // 获取当前的路径
        var path = this.props.location.pathname ;

        if (!user_id) {
            // cookies不存在，则重定向到登录界面
            return <Redirect to='/login' />
        }

        if (!userState._id) {
            // state中_id不存在，表示当前用户没有处于登录状态
            // 此时不显示任何内容
            return null ;
        } else {
            if (path === '/') {
                // 当前请求的路径是根路径
                // 则根据用户类型和头像判断跳转跳转的目标路径
                var targetPath = getRedirectTo(userState.type, userState.header) ;
                return <Redirect to={targetPath} />
            }

            if (userState.type === 'boss') {
                // 如果当前用户类型是boss，则隐藏jobhunter导航信息
                this.navList[1].hide = true ;
            } else {
                // 如果当前用户类型是jobhunter，则隐藏boss导航信息
                this.navList[0].hide = true ;
            }
        }

        // 取出未读消息的总数
        var totalUnreadMsgCount = this.props.userChatMsg.totalUnreadMsgCount ;


        // 找到同当前路径匹配的组件信息
        var currentNav = this.navList.find(item => item.path === path) ;

        return (
            <div>
                {currentNav ? <NavBar className='fixed-top'>{currentNav.title}</NavBar> : null}
                <Switch>
                    <Route path='/bossinfo' component={BossInfo}/>
                    <Route path='/jobhunterinfo' component={JobhunterInfo}/>

                    <Route path='/boss' component={Boss}/>
                    <Route path='/jobhunter' component={Jobhunter}/>
                    <Route path='/message' component={Message}/>
                    <Route path='/personal' component={Personal}/>
                    <Route path='/chat/:user_id' component={Chat}/>
                    <Route component={NotFound}/>
                </Switch>
                {/*根据是否存在匹配当前路径的组件信息决定是否显示底部导航栏*/}
                {currentNav ? <NavFooter navList={this.navList} totalUnreadMsgCount={totalUnreadMsgCount} /> : null}
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
    getUserInfoActionCreator
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Main) ;