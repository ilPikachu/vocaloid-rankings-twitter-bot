"use strict";

const Twit = require("twit");
const fs = require("fs");
const moment = require("moment-timezone");
const request = require("request");
const schedule = require("node-schedule");

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