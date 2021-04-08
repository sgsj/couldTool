/* DB库 */

const mysql = require('mysql');
const config = require('./config.js');

const Config = require('./config.js');

//创建连接池
var pool = mysql.createPool({
    host: config.database.HOST,
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE
});
let sqlService = {
    query: (sql, values)=>{
        return new Promise((resolve,reject)=>{
            //获取连接池中的一个连接
            pool.getConnection(function(err,connection){
                if (err) {
                    reject(err);
                } else {
                    //使用连接查询
                    connection.query(sql, values, (err, rows)=>{
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        //使用完成，将连接返回到连接池
                        connection.release();
                    });
                }
            })
        });
    },

    //数据库操作方法
    //查找账号
    findUser: function(obj){
        let _sql = "select * from users where name=? and pwd=?;"
        return sqlService.query(_sql,obj);
    },
    //添加账号
    addUser: function(obj){
        let _sql = "insert into users set name=?,pwd=?,email=?,phone=?;"
        return sqlService.query(_sql,obj);
    },

    //工具-分页查询
    getTools: function(arr){
        let _sql = `select * from tools limit ?,?;`
        return sqlService.query(_sql,arr);
    },
    //工具-添加
    addTool: function(obj){
        let _sql = "insert into tools set title=?,brief=?,url=?,imgUrl=?;"
        return sqlService.query(_sql,obj);
    },
    //工具-删除
    delTool: function(obj){
        let _sql = "delete from tools where id=?;"
        return sqlService.query(_sql,obj);
    },
    //工具-修改
    editTool: function(obj){
        let _sql = "update tools set name=?,url=?,brief=?,imgUrl=? where id=?;"
        return sqlService.query(_sql,obj);
    },
}

module.exports = sqlService;

// class Db{
//     static getInstance(){
//         if (!Db.instance) {
//             Db.instance = new Db();
//         }
//         return Db.instance;
//     }

//     constructor(){
//         this.dbClient = null;
//         //this.connect();
//     }

//     connect(){
//         let _that = this;
//         return new Promise((resolve,reject)=>{
//             if (!_that.dbClient) {
//                 MongoClient.connect(Config.dbUrl,{useUnifiedTopology: true},(err,client)=>{
//                     if(err){
//                         console.log(err);
//                         reject(err);
//                         return;
//                     }
//                     _that.dbClient = client.db(Config.dbName);
//                     resolve(_that.dbClient);
//                 });
//             } else {
//                 resolve(_that.dbClient);
//             }
            
//         });
//     }

//     find(collectionName,json){
//         return new Promise((resolve,reject)=>{
//             this.connect().then((db)=>{
//                 db.collection(collectionName).find(json).toArray((err,data)=>{
//                     if(err){
//                         reject(err);
//                         return;
//                     }
//                     resolve(data);
//                 });
//             });
//         });
//     }

//     insert(collectionName,json){
//         return new Promise((resolve,reject)=>{
//             this.connect().then((db)=>{
//                 db.collection(collectionName).insert(json,(err,result)=>{
//                     if(err){
//                         reject(err);
//                         return;
//                     }
//                     resolve(result);
//                 })
//             });
//         });
//     }
// }

// module.exports = Db.getInstance();
