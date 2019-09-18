// 头像选择组件

import React, {Component} from 'react'
import {Grid, List} from 'antd-mobile'
export default class HeaderSelector extends Component {
    constructor(props) {
        super(props) ;
        this.state = {
            // 已选择的头像
            icon: ''
        }

        this.headerList = [] ;
        for (let i = 1; i < 21; i++) {
            this.headerList.push({
                icon: require(`../../assets/images/头像${i}.png`),
                text: `头像${i}`
            })  ;
        }
    }

    getSelectedHeader = (headerObj) => {
        var {icon, text} = headerObj ;
        // 更新当前组件状态
        this.setState({
            icon
        })

        // 更新父组件状态
        this.props.getHeader(text) ;
    }



    render() {
        //
        const {icon} = this.state ;
        var listHeader = icon ? <img src={icon} alt=""/> : <p>请选择头像</p>

        return (
            <List renderHeader={() => listHeader}>
                <Grid
                    data={this.headerList}
                    columnNum={4}
                    onClick={(header) => this.getSelectedHeader(header)}
                />
            </List>
        )
    }
}