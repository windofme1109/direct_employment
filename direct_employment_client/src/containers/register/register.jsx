import React, {Component} from 'react'
import {NavBar, WingBlank, List, InputItem, WhiteSpace, Radio, Button} from 'antd-mobile'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

import Logo from '../../components/logo/logo'
import {registerActionCreator} from '../../redux/actions'
const Item = List.Item

class Register extends Component {
    state = {
        username: '',
        password: '',
        passwordConfirmed: '',
        type: ''
    }

    getInputContent = (val, inputType) => {
        this.setState({
            [inputType]: val
        })
    }

    register = () => {
        var userInfo = this.state ;
        console.log('用户注册信息', userInfo) ;
        this.props.registerActionCreator(userInfo) ;
    }
    render() {
        // 错误提示信息
        const {msg, redirectTo} = this.props.userState ;

        if (redirectTo) {
            // 注册成功后，根据redirectTo进行重定向，跳转到目标界面
            return <Redirect to={redirectTo} />
        }

        return (
            <div>
                <NavBar>直聘</NavBar>
                <Logo />
                <WingBlank>
                    {msg ? <div style={{color: 'red',textAlign: 'center'}}>{msg}</div> : null}
                    <List>
                        <InputItem
                            placeholder='请输入用户名'
                            onChange={(val) => this.getInputContent(val, 'username')}
                        >
                            用&nbsp;&nbsp;户&nbsp;&nbsp;名:
                        </InputItem>
                        <WhiteSpace />
                        <InputItem
                            type='password'
                            placeholder='请输入密码'
                            onChange={(val) => this.getInputContent(val, 'password')}
                        >
                            密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码:
                        </InputItem>
                        <WhiteSpace />
                        <InputItem
                            type='password'
                            placeholder='请确认密码'
                            onChange={(val) => this.getInputContent(val, 'passwordConfirmed')}
                        >
                            确认密码:
                        </InputItem>
                        <WhiteSpace />
                        <Item>
                            <span style={{marginRight: 15}}>用户类型:</span>
                            <Radio
                                checked={this.state.type === 'jobhunter'}
                                onChange={() => this.getInputContent('jobhunter', 'type')}
                            >
                                求职者
                            </Radio>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Radio
                                checked={this.state.type === 'boss'}
                                onChange={() => this.getInputContent('boss', 'type')}
                            >
                                招聘者
                            </Radio>
                        </Item>

                    </List>
                    <WhiteSpace />
                    <Button type='warning' onClick={() => this.register()}>注册</Button>
                    <WhiteSpace />
                    <Button onClick={() => this.props.history.replace('/login')}>已有账号？</Button>
                </WingBlank>

            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        userState: state.userState
    }
}

const mapDispatchToProps = {
    registerActionCreator: registerActionCreator
} ;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Register) ;