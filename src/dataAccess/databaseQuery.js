const mongoConnectionService = require("./mongoConnectionService");

const dbConnectionPromise = mongoConnectionService.mongodbConnection();

function databaseQuery(dbName, collectionName, queryParameter){
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

//const queryParameter = {lastUpdated:{$regex: "2017-12-25T12:10"}}

const queryParameter = {someKey:{$regex: "empty"}}

databaseQuery("rankDataProceeded", "rankDataProceeded",  queryParameter).then(function(array){
    console.log(array);
}).catch(function(err){
    console.log(err);
});

/*
const testObj = [{
    someKey: "someValue9th",
}];

databaseInsertMany("rankDataProceeded", "rankDataProceeded", testObj);
*/