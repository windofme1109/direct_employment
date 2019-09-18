import React, {Component} from 'react'
import {Result, List, WhiteSpace, Button, Modal} from 'antd-mobile'
import {connect} from 'react-redux'
import Cookies from 'js-cookie'

import {resetUserInfo} from "../../redux/actions";

const Item = List.Item ;
const Brief = Item.Brief ;

class Personal extends Component {
    handleLogout = () => {
        // Modal是对话框组件
        Modal.alert('退出登陆', '确定要退出吗？', [
            {text: '取消', onPress: () => console.log('取消')},
            {text: '确定', onPress: () => {
                    // 退出登录，首先清除cookies
                    Cookies.remove('user_id') ;
                    // 然后重置用户信息
                    this.props.resetUserInfo('') ;
                }
            }
        ])
    }
    render() {
        var {userState} = this.props ;
        var {header} = userState ;

        return (
            <div>
                <Result
                    /*img是插图元素，可以是<img src="" />/<Icon type="" />等*/
                    img={<img src={require(`../../assets/images/${header}.png`)} alt=""/>}
                    title={userState.username}
                    message={userState.company ? userState.company : null}
                />
                <WhiteSpace />
                <List>
                    {/*multipleLine属性，表示显示多行*/}
                    <Item multipleLine>
                       { /*Brief用来辅助说明*/}
                       {userState.company ? <Brief>公司名称: {userState.company}</Brief> : null}
                       {userState.type === 'boss' ? <Brief>招聘职位: {userState.post}</Brief> : <Brief>求职岗位: {userState.post}</Brief>}
                       {userState.salary ? <Brief>职位薪资: {userState.salary}</Brief> : null}
                       {userState.type === 'boss' ? <Brief>职位要求: {userState.info}</Brief> : <Brief>个人简介: {userState.info}</Brief>}

                    </Item>
                </List>
                <WhiteSpace />
                <List>
                    <Button type='warning' onClick={this.handleLogout}>退出</Button>
                </List>

            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userState: state.userState
    }
}

const mapDispatchToProps = {
    resetUserInfo
}
export default connect(
   mapStateToProps,
   mapDispatchToProps
)(Personal)