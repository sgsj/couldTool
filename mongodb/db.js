/* DB库 */

const {MongoClient} = require('mongodb');

const Config = require('./config.js');

class Db{
    static getInstance(){
        if (!Db.instance) {
            Db.instance = new Db();
        }
        return Db.instance;
    }

    constructor(){
        this.dbClient = null;
        //this.connect();
    }

    connect(){
        let _that = this;
        return new Promise((resolve,reject)=>{
            if (!_that.dbClient) {
                MongoClient.connect(Config.dbUrl,{useUnifiedTopology: true},(err,client)=>{
                    if(err){
                        console.log(err);
                        reject(err);
                        return;
                    }
                    _that.dbClient = client.db(Config.dbName);
                    resolve(_that.dbClient);
                });
            } else {
                resolve(_that.dbClient);
            }
            
        });
    }

    find(collectionName,json){
        return new Promise((resolve,reject)=>{
            this.connect().then((db)=>{
                db.collection(collectionName).find(json).toArray((err,data)=>{
                    if(err){
                        reject(err);
                        return;
                    }
                    resolve(data);
                });
            });
        });
    }

    insert(collectionName,json){
        return new Promise((resolve,reject)=>{
            this.connect().then((db)=>{
                db.collection(collectionName).insert(json,(err,result)=>{
                    if(err){
                        reject(err);
                        return;
                    }
                    resolve(result);
                })
            });
        });
    }
}

module.exports = Db.getInstance();