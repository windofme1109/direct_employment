import React, {Component} from 'react'
import {NavBar, InputItem, TextareaItem, Button} from 'antd-mobile'
import {updateUserInfoActionCreator} from '../../redux/actions'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

import HeaderSelector from '../../components/header-selector/header-selector'

class BossInfo extends Component {

    state = {
        // 头像信息
        header: '',
        company: '',
        post: '',
        salary: '',
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

    //
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
             <NavBar>老板信息完善</NavBar>
             <HeaderSelector getHeader={this.getHeader} />
             <InputItem
                 placeholder='请输入公司名称'
                 onChange={(val) => this.getInputContent('company', val)}
             >
                 公司名称:
             </InputItem>
             <InputItem
                 placeholder='请输入招聘职位'
                 onChange={(val) => this.getInputContent('post', val)}
             >
                 招聘职位:
             </InputItem>
             <InputItem
                 placeholder='请输入职位薪资'
                 onChange={(val) => this.getInputContent('salary', val)}
             >
                 职位薪资:
             </InputItem>
             <TextareaItem
                 placeholder='请输入职位要求'
                 onChange={(val) => this.getInputContent('info', val)}
                 rows={3}
                 title='职位要求'
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
)(BossInfo)