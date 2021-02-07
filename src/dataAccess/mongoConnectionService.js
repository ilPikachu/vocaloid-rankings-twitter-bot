"use strict"

const MongoClient = require('mongodb').MongoClient;

module.exports = {
    mongodbConnection: () => {
        return new Promise(function(resolve, reject){
            MongoClient.connect("mongodb://localhost:27017", {useNewUrlParser: true}, function(err, db){
                if (err){
                    reject(err);
                } else{
                    resolve(db);
                }
            });
        });
    }
}
