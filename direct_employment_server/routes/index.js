var express = require('express');
var md5 =  require('blueimp-md5') ;

// 引入数据库操作模型函数
var {userModel, chatModel} = require('../db/mongodb_models') ;

var router = express.Router();

// 注册路由
router.post('/register', function(req, res) {
  var {username, password, type} = req.body ;


  // 根据用户名在数据库中查询
  userModel.findOne({username: username}, function (err, ret) {
    if (err) {
      return res.status(500).json({
        msg: '数据库写入异常'
      })
    }

    if (ret) {
      // 用户存在
      res.status(200).json({
        code: 1,
        msg: '该用户已存在'
      })
    } else {
      // 用户不存在
      // 给密码进行加密
      password = md5(password) ;

      // 新用户信息写入数据库
      new userModel({username, password, type}).save(function(err, user) {
        if (err) {
          return res.status(500).json({
            msg: '数据库写入异常'
          })
        }

        // 设置cookies
        // cookie()接收三个参数：第一个是要设置的cookies的属性名，第二个是属性值
        // 第三参数是cookies的一些配置，是一个对象，如maxAge表示最大存活时间，单位是毫秒，属性值是数字
        res.cookie('user_id', user._id, {maxAge: 1000*60*60*24*7}) ;

        // 返回响应
        res.status(200).json({
          code: 0,
          data: {
            _id: user._id,
            username: user.username,
            type: user.type
          }
        })
      })
    }

  })


}) ;

// 登录路由
router.post('/login', function(req, res) {
  var {username, password} = req.body ;

  // 密码进行加密
  password = md5(password) ;
  userModel.findOne({username, password}, {password: 0}, function(err, user) {
    if (err) {
      return res.status(500).json({
        msg: '数据库查询异常'
      })
    }
    if (user) {
      // 设置cookies
      res.cookie('user_id', user._id, {maxAge: 1000*60*60*24*7}) ;
      console.log(user.type) ;
      console.log(user) ;
      res.status(200).json({
        code: 0,
        data: user
      })
    } else {
      // 用户不存在
      res.status(200).json({
        code: 1,
        msg: '用户名或密码错误'
      })
    }
  })

}) ;

// 更新用户信息路由
router.post('/update', function(req, res) {
  // 取出cookies
  var cookies = req.cookies ;
  // 取出用户的_id
  var {user_id} = cookies ;

  if (!user_id) {
    // cookies不存在，表示用户没有登录
    return res.status(200).json({
      code: 1,
      msg: '请先登录'
    })
  }

  // findByIdAndUpdate()先根据_id查询，然后再更新，并将查询结果传入回调函数
  userModel.findByIdAndUpdate(user_id, req.body, function(err, preUser) {
    if (err) {
      return res.status(500).json({
        msg: '数据库查询失败'
      })
    }

    // preUser是数据库中更新前的文档
    // 取出username, type, _id
    var {username, type, _id} = preUser ;
    // 将username, type, _id与req.body中的更新内容组合成新的对象，作为响应数据返回
    var resData = Object.assign({}, req.body, {username, type, _id}) ;
    // 更新成功，返回响应
    res.status(200).json({
      code: 0,
      data: resData
    })

  })

}) ;

// 获取登录用户信息
router.get('/user', function(req, res) {
  // 获取cookies中user_id
  var user_id = req.cookies.user_id ;
  if (!user_id) {
    // user_id不存在
    return res.status(200).json({
      code: 1,
      msg: '请先登录'
    })
  }
  // 指定第二个参数：projections，将password字段设置为0，表示不再结果中显示
  userModel.findOne({_id: user_id}, {password: 0}, function(err, user) {
    if (err) {
      return res.status(500).json({
        msg: '数据库查询异常'
      }) ;
    }

    if (user) {
      // 用户存在
      res.status(200).json({
        code: 0,
        data: user
      })
    } else {
      // 用户不存在
      res.status(200).json({
        code: 1,
        msg: '用户不存在，请先登陆'
      })
    }


  })
})

// 根据用户类型获取响应的用户列表（boss --> jobhunter  jobhunter --> boss）
router.get('/userlist', function(req, res) {
  // get请求，设置了查询参数。以?开头的
  var {type} = req.query ;
  console.log(type) ;
  userModel.find({type: type}, {password: 0}, function(err, users) {
    if (err) {

      return res.status(500).json({
        msg: '数据库查询异常'
      })
    }
    // 查询成功
    res.status(200).json({
      code: 0,
      data: users
    }) ;
  })
})

// 获取用户的聊天记录
router.get('/msglist', function(req, res) {
  // 从cookies中取出user_id
  var user_id = req.cookies.user_id ;

  if (!user_id) {
    return res.json({
      code: 1,
      msg: '请登录'
    })
  }

  // 获取所有用户
  userModel.find({}, {password: 0}, function(err, ret) {
    if (err) {
      return res.status(500).json({
        msg: '数据库查询异常'
      })
    }

    // 存放用户信息的一个对象，属性名是_id，属性值是每个用户信息组成的对象
    var users = {} ;

    ret.forEach(item => {
      users[item._id] = {username: item.username, header: item.header} ;
    })

    // 使用reducer()实现
    // var users = ret.reduce((accumulator, doc) => {
    //   accumulator[doc._id] = {username: doc.username, header: doc.header} ;
    //
    //   return accumulator ;
    // }, {}) ;

    // 查询聊天消息
    // 使用元操作符$or，表示或，即查询发给我的，还有我发给别人的消息
    chatModel.find({$or: [{from: user_id}, {to: user_id}]}, function(err, chatMsgs) {
      if (err) {
        return res.status(500).json({
          msg: '数据库查询异常'
        })
      }
      // 查询成功
      res.status(200).json({
        code: 0,
        data: {
          users,
          chatMsgs
        }
      })
    })

  })

}) ;

// 修改指定消息为已读
router.post('/readmsg', function(req, res) {

  // 消息的发送者。即其他用户
  var from = req.body.from ;
  // 当前登录用户是消息的接收者
  var user_id = req.cookies.user_id ;

  console.log('readmsg', from, user_id) ;

  chatModel.updateMany({from: from, to: user_id, read: false}, {$set: {read: true}}, function(err, ret) {
    if (err) {
      console.log(err) ;
      return res.json({
        msg: '数据库查询异常'
      })
    }

    res.status(200).json({
          code: 0,
          // 修改的数量
          data: ret.nModified
    })
  })

})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
