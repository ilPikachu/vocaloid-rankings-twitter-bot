const mongoConnectionService = require("./mongoConnectionService");

mongoConnectionService.mongodbConnection().then(function(db){
    const collection = db.db("rankDataProceeded").collection("rankDataProceeded");
    const cursor = collection.find({lastUpdated:{$regex: "2017-12-25T12:10"}});
    cursor.limit(100);
    const array = cursor.toArray();
    return array;    
}).then(function(array){
    console.log(array);
});
