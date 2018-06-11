"use strict";

const Twit = require("twit");
const fs = require("fs");
const moment = require("moment-timezone");
const request = require("request");
const schedule = require("node-schedule");

const getRankingsModule = require("./getRankingsModule.js");

const secrets = JSON.parse(fs.readFileSync("./utilities/secrets.json"));
const directMessagekeywords = JSON.parse(fs.readFileSync("./utilities/directMessageStrings.json"));

const twitAuth = {
    consumer_key:         secrets.twitter.consumer_key,
    consumer_secret:      secrets.twitter.consumer_secret,
    access_token:         secrets.twitter.access_token,
    access_token_secret:  secrets.twitter.access_token_secret
};

const twitUser = new Twit(twitAuth);

const stream = twitUser.stream("user");

stream.on("direct_message", directMessageReply);

function directMessageReply(event){
    console.log(event.direct_message);
    outterloop:
    for (let directMessageType in directMessagekeywords){
        for (let i = 0; i < directMessagekeywords[directMessageType].length; i++){
            if (event.direct_message.text == directMessagekeywords[directMessageType][i]){
                const userId = event.direct_message.sender_id_str;
                const promise = dmRequestBuilder(String(directMessageType), String(userId));
                promise.then(function(dmRequest){
                    replyBackRankings(String(directMessageType), String(userId), dmRequest);
                });
                break outterloop;
            }
        }
    }
}

function replyBackRankings(directMessageType, userId, dmRequest){
    twitUser.post("direct_messages/events/new", dmRequest, (error, data, response) => {
        if (!!error){
            console.error('***DirectMessageErrorBegin***');
            console.error(moment().utc().format() + " Direct Message to User ID: " + String(userId) + " Failure. Error.");                
            console.error(error.name);
            console.error(error.message);
            console.error('***DirectMessageErrorEnd***\n');  
            setTimeout(() => {replyBackRankingsRetry(directMessageType, userId, dmRequest)}, 5*1000);
        }

        else if (response.statusCode === 200){
            console.log(moment().utc().format() +  " Direct Message to User ID: " + String(userId) + " Successful: " + response.statusCode +  " Type: " + directMessageType + "\n");
        }

        else{
            console.log('***DirectMessageFailureBegin***');                
            console.log(moment().utc().format() + " Direct Message to User ID Failed. Not 200 or Error. Status Code: " + response.statusCode + " " + response.statusMessage);
            console.log(data);
            setTimeout(() => {replyBackRankingsRetry(directMessageType, userId, dmRequest)}, 5*1000);
            console.log('***DirectMessageFailureEnd***\n');                                
        }
    });
}

function replyBackRankingsRetry(directMessageType, userId, dmRequest){
    twitUser.post("direct_messages/events/new", dmRequest, (error, data, response) => {
        if (!!error){
            console.error('***DirectMessageRetryErrorBegin***');
            console.error(moment().utc().format() + " Direct Message to User ID: " + String(userId) + " Retry Failure. Error.");                
            console.error(error.name);
            console.error(error.message);
            console.error('***DirectMessageRetryErrorEnd***\n');  
        }

        else if (response.statusCode === 200){
            console.log(moment().utc().format() +  " Direct Message to User ID: " + String(userId) + " Retry Successful: " + response.statusCode + " Type: " + directMessageType + "\n");
        }

        else{
            console.log('***DirectMessageRetryFailureBegin***');                
            console.log(moment().utc().format() + " Direct Message to User ID Retry Failed. Not 200 or Error. Status Code: " + response.statusCode + " " + response.statusMessage);
            console.log(data);
            console.log('***DirectMessageRetryFailureEnd***\n');                                
        }
    });
}

function dmRequestBuilder(directMessageType, userId){
    const dmRequest = {
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

    dmRequest.event.message_create.target.recipient_id = userId;

    return new Promise(function(resolve, reject) {
        const promise = messageBuilder(directMessageType);
        promise.then(function(message){
            dmRequest.event.message_create.message_data.text = message;
            resolve(dmRequest);
        });
    })
}

function messageBuilder(directMessageType){
    const processedRankingFilePath = "./rank_data_proceeded/vocaloid_ranking" + moment().utc().format("_YYYY_MM_DD_HH") + ".json";
    
    return new Promise(function(resolve, reject){
        if (fs.existsSync(processedRankingFilePath)){
            resolve(createMessage(processedRankingFilePath, directMessageType));
        }

        else{
            const promise = getRankingsModule.getRankingData();
            promise.then(function(){
                resolve(createMessage(processedRankingFilePath, directMessageType));
            }).catch(function(rejectMessage){
                console.error(rejectMessage);
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

