import React, {Component} from 'react'

import logo from './images/logo.png'
import './logo.css'
export default class Logo extends Component { 
    render() {
        return (
            <div className='image-container'>
                <img src={logo} alt="logo" className='my-logo'/>
            </div>
        )
    }
}