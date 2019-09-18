module.exports = function(server) {
    // 引入socket.io
    // 接收一个server实例作为参数
    var io = require('socket.io')(server) ;

    var {chatModel} = require('../db/mongodb_models')

    // 监听connection事件，表示客户端联上了服务器
    io.on('connection', function(socket) {
        console.log('有客户端连上了服务器') ;
        // socket表示连接对象
        // 表示一次具体的连接，监听sendMsg事件
        // 接收到客户端发来的消息msg，然后传递到回调函数中
        socket.on('sendMsg', function(msg) {
            console.log('服务器收到了数据') ;
            var {from, to, content} = msg ;
            // 将接收到的消息存入数据库
            // 生成chat_id，将from和to放入一个数组中，然后排序，最后用_连接
            // 这样可以保证发送同一条消息，对于发送者（from）还是接收者（to），生成的chat_id是一样的
            var chat_id = [from, to].sort().join('_') ;
            var create_time = Date.now() ;
            // 保存数据
            new chatModel({from, to, content, chat_id, create_time})
                .save(function(err, chatMsg) {
                    if (err) {
                        return console.log('数据库写入异常') ;
                    }
                    // 保存成功，向所有连接的客户端发送消息
                    // emit()触发一个事件，第一个参数是事件名称，第二个是发送的数据
                    io.emit('receiveMsg', chatMsg) ;

                    console.log('服务器向客户端发送消息', chatMsg) ;

                })
        })
    })
}