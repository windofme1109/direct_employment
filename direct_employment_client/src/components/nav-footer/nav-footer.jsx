import React, {Component} from 'react'
import {TabBar, Badge} from 'antd-mobile'
import {withRouter} from 'react-router-dom'

var Item = TabBar.Item ;

class NavFooter extends Component {
    render() {
        var {navList} = this.props ;
        var pathName = this.props.location.pathname ;

        // 进行过滤
        // 如果当前登录用户是boss，则隐藏jobhunter的底部导航栏，jobhunter相反
        var currentNavList = navList.filter(item => !item.hide) ;

        var totalUnreadMsgCount = this.props.totalUnreadMsgCount ;
        console.log('nav-footer', totalUnreadMsgCount) ;

        return (
            <TabBar>
                {
                    currentNavList.map(nav => {
                        return (
                            <Item
                                /*
                                 * icon表示图标，可以是一个html标签，如img，div等
                                 * 也可以是一个对象，属性是uri，数组值是图片的路径，本地图片使用require()加载
                                 * */
                                icon={{uri: require(`../../assets/nav-footer-images/${nav.icon}.png`)}}

                                // extra={pathName==='/message' ? <Badge text={totalUnreadMsgCount} /> : null}
                                badge={nav.path === '/message' ? totalUnreadMsgCount : 0}
                                /*
                                 * selectedIcon表示选中后的图片
                                 * */
                                selectedIcon={{uri: require(`../../assets/nav-footer-images/${nav.icon}-selected.png`)}}
                                title={nav.text}
                                /*是否被选中*/
                                selected={nav.path === pathName}
                                /*点击事件，跳转到path指定的路径*/
                                onPress={() => this.props.history.push(nav.path)}
                            />
                        )
                    })
                }
            </TabBar>
        )
    }
}

//withRouter()接收一个非路由组件
// 使得非路由组件也可以获得路由相关属性
export default withRouter(NavFooter) ;