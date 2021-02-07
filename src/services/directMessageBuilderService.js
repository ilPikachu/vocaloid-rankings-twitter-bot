"use strict";

const fs = require("fs");
const moment = require("moment-timezone");
const databaseQueryService = require("../dataAccess/databaseQuery");

const rankingScraperService = require("./rankingScraperService")

module.exports = {
    directMessageRequestBuilder: (directMessageType, userId) => {
        const directMessageRequest = {
            "event": {
            "type": "message_create",
            "message_create": {
                "target": {
                },
                "message_data": {
                }
            }
            }
        };

        directMessageRequest.event.message_create.target.recipient_id = userId;

        return new Promise(function(resolve, reject) {
            const promise = messageBuilder(directMessageType);
            promise.then(function(message){
                directMessageRequest.event.message_create.message_data.text = message;
                resolve(directMessageRequest);
            });
        });
    }
}

const messageBuilder = (directMessageType) => {
    return new Promise(function(resolve, reject){
        const dbName = "vocadb";
        const collectionName = "rankDataProceeded";
        const value = moment().utc().format("YYYY-MM-DDTHH");
        const queryParameter = {lastUpdated: {$regex: value}};

        databaseQueryService.databaseQuery(dbName, collectionName, queryParameter).then(function(result){
            resolve(createMessage(result[0], directMessageType));
        }).catch(function(err){
            if (err == "No matching result for query: " + JSON.stringify(queryParameter)){
                // TODO: Update once direct message is supported
                const promise = rankingScraperService.getRankingData(dbName, collectionName);
                promise.then((processedRanking) => {
                    resolve(createMessage(processedRanking, directMessageType));
                }).catch((err) => {
                    console.error(err);
                });
            } else{
                console.error(err);
            }
        });
    });
};

const createMessage = (processedRanking, directMessageType) =>{
    const processedRankingWithType = processedRanking[directMessageType];

    let directMessage = "";

    switch(directMessageType){
        case "hourly":
            directMessage = "毎時ランキング\n";
            break;
        case "daily":
            directMessage = "24時間ランキング\n";
            break;
        case "weekly":
            directMessage = "週間ランキング\n";
            break;
        case "monthly":
            directMessage = "月間ランキング\n";
            break;
        default:
            console.error("Direct message type request not supported");
    }

    //Todo: User Specified ranking from top 1 to top 20
    for (let i = 1; i <= 10; i++){ 
        const rank = "rank" + String(i);
        directMessage += String(i) + ". " + processedRankingWithType[rank].title + "\n" + processedRankingWithType[rank].uri + "\n";
    }
        
    directMessage += moment().tz("Asia/Tokyo").format("YYYY-MM-DD-HH");

    return directMessage;
};