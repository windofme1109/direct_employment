import React, {Component} from 'react'
import {Button} from 'antd-mobile'

export default class NotFound extends Component {
    render() {
        return (
            <div>
                <h2>NotFound</h2>
                <Button type='warning' onClick={() => this.props.history.replace('/')}>返回主界面</Button>
            </div>
        )
    }
}