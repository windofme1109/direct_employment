// 使用mongoose操作已经存在的数据库集合

var mongoose = require('mongoose') ;

mongoose.connect('mongodb://localhost:27017/images', {useNewUrlParser: true}) ;

var connection = mongoose.connection ;

//
connection.on('connected', function() {
    console.log('数据库连接成功') ;
}) ;

var Schema = mongoose.Schema ;

// 第一种方式，Schema()构造函数的第二个参数，接收一个对象作为参数，属性名是collection，属性值是要操作的集合名
// 这里的Schema()的第一个参数，是一个对象，这个对象描述了已经存在的集合中文档的结构
// 最好指定这个结构同集合中文档的结构相同（第一个参数不能为空对象{}）
// 这样才能操作查询得到的文档
var vipergirlsSchema = new Schema({
    url: String,
    folderName: String,
    imageDownloadLink: Array
}, {collection: 'vipergirls'}) ;

// 第二种方式，model()的第三个参数，为已经存在的集合的名称
// 要操作已经存在的集合，指定第三参数为集合名即可
// vipergirlsModel = mongoose.model('Vipergirl', new Schema({url: String, folderName: String, imageDownloadLink: Array}), 'vipergirls') ;


vipergirlsModel = mongoose.model('Vipergirl', vipergirlsSchema) ;



var url = 'https://vipergirls.to/threads/4709127-Sloan-Harper-Be-Gentle-(29-08-2019)-57x'
// vipergirlsModel.updateOne({url: url}, {$set: {folderName: 'Tushy Sloan Harper - Be Gentle (29.08.2019)'}}, function(err, ret) {
//     console.log(ret) ;
//
// })

vipergirlsModel.findOne({url: url}, function(err, ret) {
    console.log(ret.folderName) ;

})

