import React, {Component} from 'react'
import {NavBar, WingBlank, List, InputItem, WhiteSpace, Button} from 'antd-mobile'
import {connect} from 'react-redux'
import {loginActionCreator} from '../../redux/actions'
import {Redirect} from 'react-router-dom'

import Logo from '../../components/logo/logo'



class Login extends Component {
    state = {
        username: '',
        password: '',
        // 接收错误信息
        msg: ''
    }

    login = () => {
        var {username, password} = this.state ;

        this.props.loginActionCreator({username, password}) ;

        console.log('username: ', username, 'password', password)
    }
    getInputContent = (val, type) => {
        this.setState({
            [type]: val
        })
    }

    render() {
        const {msg, redirectTo} = this.props.userState ;
        if (redirectTo) {
            return <Redirect to={redirectTo} />
        }
        return (
            <div>
                <NavBar>直聘</NavBar>
                <Logo />
                <WingBlank>
                    <List>
                        <WhiteSpace/>
                        {msg ? <div style={{color: 'red',textAlign: 'center'}}>{msg}</div> : null}
                        <InputItem
                            placeholder='请输入用户名'
                            onChange={(val) => this.getInputContent(val, 'username')}
                        >
                            用户名:
                        </InputItem>
                        <WhiteSpace/>
                        <InputItem
                            type='password'
                            placeholder='请输入密码'
                            onChange={(val) => this.getInputContent(val, 'password')}
                        >
                            密&nbsp;&nbsp;&nbsp;&nbsp;码:
                        </InputItem>
                        <WhiteSpace/>
                        <Button type='primary' onClick={() => this.login()}>登陆</Button>
                        <WhiteSpace/>
                        <Button onClick={() => this.props.history.replace('/register')}>注册</Button>
                    </List>
                </WingBlank>
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
    loginActionCreator
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login) ;