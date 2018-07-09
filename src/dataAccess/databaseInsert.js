const mongoConnectionService = require("./mongoConnectionService");

const dbConnectionPromise = mongoConnectionService.mongodbConnection();

module.exports = {
    databaseInsertOne: (dbName, collectionName, insertDocument) => {
        return new Promise(function(resolve, reject){
            dbConnectionPromise.then(function(db){
                const collection = db.db(dbName).collection(collectionName);
                collection.insertOne(insertDocument, function(err, res){
                    if (err){
                        reject(err);
                    }
                    else{
                        resolve(res);
                    }
                });
            });
        });
    },
    
    databaseInsertMany: (dbName, collectionName, insertDocuments) => {
        // insertDocuments must be in array of objects format
        return new Promise(function(resolve, reject){
            dbConnectionPromise.then(function(db){
                const collection = db.db(dbName).collection(collectionName);
                collection.insertMany(insertDocuments, function(err, res){
                    if (err){
                        reject(err);
                    }
                    else{
                        resolve(res);
                    }
                });
            });
        });
    }
}