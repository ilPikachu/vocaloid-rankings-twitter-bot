"use strict";

const fs = require("fs");
const moment = require("moment-timezone");

const twitUser = require("../../services/twitObjectGeneratorService");
const directMessageBuilderService = require("../../services/directMessageBuilderService");

const directMessagekeywords = JSON.parse(fs.readFileSync(process.env.HOME + "/miku_twitter_bot/src/utilities/directMessageStrings.json"));

module.exports = {
    directMessageReply: (event) => {
        const directMessage = event.direct_message.text;
        const userId = event.direct_message.sender_id_str;

        if (directMessagekeywords.hasOwnProperty(directMessage)){
            const directMessageType = directMessagekeywords[directMessage];
            const promise = directMessageBuilderService.directMessageRequestBuilder(directMessageType, userId);
            promise.then(function(directMessageRequest){
                replyBackRankings(directMessageType, userId, directMessageRequest);
            }).catch(function(rejectMessage){
                console.error(rejectMessage);
            }); 
        }
    }
}

const replyBackRankings = (directMessageType, userId, directMessageRequest) => {
    twitUser.post("direct_messages/events/new", directMessageRequest, (error, data, response) => {
        if (!!error){
            console.error('***DirectMessageErrorBegin***');
            console.error(moment().utc().format() + " Direct Message to User ID: " + String(userId) + " Failure. Error.");                
            console.error(error.name);
            console.error(error.message);
            console.error('***DirectMessageErrorEnd***\n');  
            setTimeout(() => {replyBackRankingsRetry(directMessageType, userId, directMessageRequest)}, 5*1000);
        }

        else if (response.statusCode === 200){
            console.log(moment().utc().format() +  " Direct Message to User ID: " + String(userId) + " Successful: " + response.statusCode +  " Type: " + directMessageType + "\n");
        }else{
            console.log('***DirectMessageFailureBegin***');                
            console.log(moment().utc().format() + " Direct Message to User ID Failed. Not 200 or Error. Status Code: " + response.statusCode + " " + response.statusMessage);
            console.log(data);
            setTimeout(() => {replyBackRankingsRetry(directMessageType, userId, directMessageRequest)}, 5*1000);
            console.log('***DirectMessageFailureEnd***\n');                                
        }
    });
};

const replyBackRankingsRetry = (directMessageType, userId, directMessageRequest) => {
    twitUser.post("direct_messages/events/new", directMessageRequest, (error, data, response) => {
        if (!!error){
            console.error('***DirectMessageRetryErrorBegin***');
            console.error(moment().utc().format() + " Direct Message to User ID: " + String(userId) + " Retry Failure. Error.");                
            console.error(error.name);
            console.error(error.message);
            console.error('***DirectMessageRetryErrorEnd***\n');  
        }

        else if (response.statusCode === 200){
            console.log(moment().utc().format() +  " Direct Message to User ID: " + String(userId) + " Retry Successful: " + response.statusCode + " Type: " + directMessageType + "\n");
        }else{
            console.log('***DirectMessageRetryFailureBegin***');                
            console.log(moment().utc().format() + " Direct Message to User ID Retry Failed. Not 200 or Error. Status Code: " + response.statusCode + " " + response.statusMessage);
            console.log(data);
            console.log('***DirectMessageRetryFailureEnd***\n');                                
        }
    });
};