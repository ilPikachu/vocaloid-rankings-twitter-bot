"use strict";

const fs = require("fs");
const moment = require("moment-timezone");

const rankingScraperModule = require("../niconico_scraper/rankingScraperModule")

function directMessageRequestBuilder(directMessageType, userId){
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
    })
}

function messageBuilder(directMessageType){
    const processedRankingFilePath = "../../../rank_data_proceeded/vocaloid_ranking" + moment().utc().format("_YYYY_MM_DD_HH") + ".json";

    return new Promise(function(resolve, reject){
        if (fs.existsSync(processedRankingFilePath)){
            resolve(createMessage(processedRankingFilePath, directMessageType));
        }else{
            const promise = rankingScraperModule.getRankingData();
            promise.then(function(){
                resolve(createMessage(processedRankingFilePath, directMessageType));
            });
        }
    })
}

function createMessage(processedRankingFilePath, directMessageType){
    const rankingLists = JSON.parse(fs.readFileSync(processedRankingFilePath));

    const rankingListWithType = rankingLists[directMessageType];

    let directMessage = "";

    if (directMessageType == "hourly"){
        directMessage = "毎時ランキング\n";
    }
        
    else if (directMessageType == "daily"){
        directMessage = "24時間ランキング\n";
    }

    else if (directMessageType == "weekly"){
        directMessage = "週間ランキング\n";
    }

    else if (directMessageType == "monthly"){
        directMessage = "月間ランキング\n";
    }

    //Todo: User Specified ranking from top 1 to top 20
    for (let i = 1; i <= 10; i++){ 
        const rank = "rank" + String(i);
        directMessage += String(i) + ". " + rankingListWithType[rank].title + "\n" + rankingListWithType[rank].uri + "\n";
    }
        
    directMessage += moment().tz("Asia/Tokyo").format("YYYY-MM-DD-HH");

    return directMessage;
}

exports.directMessageRequestBuilder = directMessageRequestBuilder;