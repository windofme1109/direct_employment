const mongoose = require('mongoose') ;

// 连接数据库
mongoose.connect('mongodb://localhost:27017/direct_employment_refactor', {useNewUrlParser: true}) ;

var Schema = mongoose.Schema ;

// 定义文档结构（模型），这个文档结构用于描述用户
var userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    header: {
        type: String
    },
    post: {
        type: String
    },
    info: {
        type: String
    },
    company: {
        type: String
    },
    salary: {
        type: String
    }

})

// 定义model（与集合对应 , 可以操作集合）
// UserModel是一个构造函数
var UserModel = mongoose.model('user', userSchema) ;

module.exports.userModel = UserModel ;


// 定义新的文档结构，用于描述聊天记录

var chatSchema = new Schema({
    // 发送消息的用户的id
    from: {
        type: String,
        required: true
    },
    // 接收消息的用户的id
    to: {
        type: String,
        required: true
    },
    // 标记每条聊天消息，有from和to组成的字符串
    chat_id: {
        type: String,
        required: true
    },
    // 聊天内容
    content: {
        type: String,
        required: true
    },
    // 是否已读
    read: {
        type: Boolean,
        default: false
    },
    // 创建时间
    create_time: {
        type: Number
    }
}) ;

// 发布为模型
var ChatModel = mongoose.model('chat', chatSchema) ;

// 导出
module.exports.chatModel = ChatModel ;