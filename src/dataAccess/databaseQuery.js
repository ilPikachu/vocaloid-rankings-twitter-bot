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
//const queryParameter = {lastUpdated:{$regex: "2017-12-25T12:10"}}

/*
const databaseQuery = (dbName, collectionName, queryParameter) => {
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

//const value = moment().utc().format("YYYY-MM-DDTHH*");
//const queryParameter = {someKey:{$regex: value}};
const queryParameter = {lastUpdated:{$regex: "2017-12-25T12:10"}}
databaseQuery("rankDataProceeded", "rankDataProceeded",  queryParameter).then(function(array){
    console.log(array[0].hourly.rank1.title);
}).catch(function(err){
    console.log(err);
});
*/