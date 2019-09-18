import React, {Component} from 'react'
import {connect} from 'react-redux'

import UserList from '../../components/user-list/user-list'
import {receiveUserListActionCreator} from '../../redux/actions'

class Boss extends Component {

    componentDidMount() {
        //
        var type = 'jobhunter' ;
        this.props.receiveUserListActionCreator(type) ;
    }


    render() {

        var {userList} = this.props ;


        return (
            <div>
                <UserList userList={userList} />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userList: state.userList
    }
}

const mapDispatchToProps = {
    receiveUserListActionCreator
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Boss) ;
