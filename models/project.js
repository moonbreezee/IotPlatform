

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var ObjectId = mongoose.Schema.Types.ObjectId;

var ProjectSchema = new mongoose.Schema({  //数据库模式
    name:{
        unique:true,
        type:String,
        required:true
    },
    descript:String,
    relation:{
        type:ObjectId,
        ref:'User'
    },
    meta:{
        createAt:{
            type:Date,
            default:Date.now()
        },
        updateAt:{
            type:Date,
            default:Date.now()
        }
    }
});

//Middleware!
ProjectSchema.pre('save',function(next){//为数据模型添加方法，每次都执行的函数，存储数据,middleware，实例方法，不实例化也要执行的
    //var project = this;
    if(this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }
    next();  // 错误发生在这里,这里多写了个next();
});

// statics
ProjectSchema.statics = {   //静态方法，对数据模型实例化以后才会有的方法   模型方法  类方法
    fetch:function(cb){
        return this   //用于取出目前数据库中所有的数据并且按更新时间排序
            .find({})
            .sort('meta.updateAt')
            .exec(cb);
    },
    findById:function(id,cb){
        return this   //用于取出数据库中单条数据并且按更新时间排序
            .findOne({_id:id})
            .exec(cb);
    }
};

module.exports = mongoose.model('Project',ProjectSchema);//将这个构造函数导出