const mongoConnectionService = require("./mongoConnectionService");
const moment = require("moment-timezone");

const dbConnectionPromise = mongoConnectionService.mongodbConnection();

module.exports = {
    databaseQuery: (dbName, collectionName, queryParameter) => {
        return new Promise(function(resolve, reject){
            dbConnectionPromise.then(function(db){
                const collection = db.db(dbName).collection(collectionName);
                const cursor = collection.find(queryParameter);
                cursor.limit(100);
                cursor.toArray().then(function(result){
                    if (result === undefined || result.length == 0){
                        reject("No matching result for query: " + JSON.stringify(queryParameter));
                    } else{
                        resolve(result);
                    }
                });
            });
        });
    }
}
