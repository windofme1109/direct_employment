import React, {Component} from 'react'
import {NavBar, InputItem, TextareaItem, Button} from 'antd-mobile'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

import HeaderSelector from '../../components/header-selector/header-selector'
import {updateUserInfoActionCreator} from '../../redux/actions'


class JobhunterInfo extends Component {

    state = {
        // 头像信息
        header: '',
        post: '',
        info: ''
    }

    getInputContent = (type, val) => {
        this.setState({
            [type]: val
        })
    }
    // 得到选择的头像
    getHeader = (header) => {
        this.setState({
            header
        })
    }

    // 保存用户信息到数据库
    save = () => {
        console.log('完善用户信息', this.state) ;
        this.props.updateUserInfoActionCreator(this.state) ;
    }

    render() {
        var {userState} = this.props ;
        if (userState.header) {
            // 如果header存在，证明用户已经选择完头像等信息，所以就要跳转到目标界面
            return <Redirect to={userState.redirectTo} />
        }
        return (
            <div>
                <NavBar>大神信息完善</NavBar>
                <HeaderSelector getHeader={this.getHeader} />
                <InputItem
                    placeholder='请输入求职岗位'
                    onChange={(val) => this.getInputContent('post', val)}
                >
                    求职岗位:
                </InputItem>
                <TextareaItem
                    placeholder='请输入个人简介'
                    onChange={(val) => this.getInputContent('info', val)}
                    rows={3}
                    title='个人简介'
                />
                <Button type='primary' onClick={this.save}>提交</Button>
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
    updateUserInfoActionCreator
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(JobhunterInfo)