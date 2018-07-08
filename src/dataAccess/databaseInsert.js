const mongoConnectionService = require("./mongoConnectionService");

const dbConnectionPromise = mongoConnectionService.mongodbConnection();

function databaseInsertOne(dbName, collectionName, insertDocument){
    dbConnectionPromise.then(function(db){
        const collection = db.db(dbName).collection(collectionName);
        collection.insertOne(insertDocument, function(err, res){
            if (err) throw err;
        });
    });
}

function databaseInsertMany(dbName, collectionName, insertDocuments){
    dbConnectionPromise.then(function(db){
        const collection = db.db(dbName).collection(collectionName);
        collection.insertMany(insertDocuments, function(err, res){
            if (err) throw err;
        });
    });
}