import React, {Component} from 'react'
import {Card, WhiteSpace, WingBlank} from 'antd-mobile'
import {withRouter} from 'react-router-dom'

var Header = Card.Header ;
var Body = Card.Body ;

class UserList extends Component {
    render() {
        var {userList} = this.props ;
        return (
            <WingBlank style={{marginTop: 50, marginBottom: 50}}>
                {
                    userList.map(item => {
                        console.log(item._id) ;
                        return (
                            <div id={item._id}>
                                <WhiteSpace />
                                <Card onClick={() => this.props.history.push(`/chat/${item._id}`)}>
                                    <Header
                                        /*卡片标题图片*/
                                        thumb={item.header ? require(`../../assets/images/${item.header}.png`) : null}
                                        /*卡片标题辅助内容*/
                                        extra={item.username}
                                    />
                                    <Body>
                                        {item.company ? <div>公司名称: {item.company}</div> : null}
                                        {item.type === 'boss' ? <div>招聘职位：{item.post}</div> : <div>求职岗位：{item.post}</div> }
                                        {item.type === 'boss' ? <div>岗位要求：{item.info}</div> : <div>个人简介：{item.info}</div> }
                                        {item.salary ? <div>岗位薪资: {item.salary}</div> : null}
                                    </Body>
                                </Card>
                            </div>

                        )
                    })
                }

            </WingBlank>
        )
    }
}

export default withRouter(UserList) ;