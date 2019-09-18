import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter, Switch, Route} from 'react-router-dom'
import {Provider} from 'react-redux'

import Main from './containers/main/main'
import Login from './containers/login/login'
import Register from './containers/register/register'
import store from './redux/store'


// 引入css
import './assets/index.css'

ReactDOM.render(
    <Provider store={store}>
        <HashRouter>
            <Switch>
                <Route path='/register' component={Register}></Route>
                <Route path='/login' component={Login}></Route>
                <Route component={Main}></Route>
            </Switch>
        </HashRouter>
    </Provider>
    ,
    document.getElementById('root'));



