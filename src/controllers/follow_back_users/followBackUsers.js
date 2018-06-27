"use strict";

const moment = require("moment-timezone");
const twitUser = require("../../modules/twit_object_generator/twitObjectGeneratorModule");

const stream = twitUser.stream("user");

stream.on("follow", followBack);

const followBack = (event) => {
    const screenName = event.source.screen_name;
    if (screenName !== "mikuchan_info"){ 
        console.log( screenName + " has followed the bot.\n");
        twitUser.post("friendships/create", {screen_name: screenName}, (error, data, response) => {
            if (!!error){
                console.error('***TweetFollowErrorBegin***');
                console.error(moment().utc().format() + " Tweet follow back failed. Error.");                
                console.error(error.name);
                console.error(error.message);
                setTimeout(() => {followBackRetry(screenName)}, 10*1000);
                console.error('***TweetFollowErrorEnd***\n');
            }

            else if (response.statusCode === 200){
                console.log(moment().utc().format() +  " Tweet follow back " + String(screenName) + " successful: " + response.statusCode + "\n");
            }
            
            else if (response.statusCode === 403){
                console.log(moment().utc().format() + " User " + " " + String(screenName) + " has already been followed: " + response.statusCode + "\n");
            }else{
                console.log('***TweetFollowFailureBegin***');                
                console.log(moment().utc().format() + " Tweet follow back failed. Not 200 or 403. Status code: " + response.statusCode + " " + response.statusMessage);
                console.log(data);
                setTimeout(() => {followBackRetry(screenName)}, 10*1000);
                console.log('***TweetFollowFailureEnd***\n');                                
            }
        });
    }
};

const followBackRetry = (screenName) => {
    twitUser.post("friendships/create", {screen_name: screenName}, (error, data, response) => {
        if (!!error){
            console.error('***TweetRetryFollowErrorBegin***');
            console.error(moment().utc().format() + " Tweet follow back failed. Error.");                
            console.error(error.name);
            console.error(error.message);
            console.error('***TweetRetryFollowErrorEnd***\n');
        }

        else if (response.statusCode === 200){
            console.log(moment().utc().format() +  " Tweet retry follow back " + String(screenName) + " successful: " + response.statusCode + "\n");
        }
        
        else if (response.statusCode === 403){
            console.log(moment().utc().format() + " User " + " " + String(screenName) + " has already been followed: " + response.statusCode + "\n");
        }else{
            console.log('***TweetRetryFollowFailureBegin***');                
            console.log(moment().utc().format() + " Tweet follow back failed. Not 200 or 403. Status code: " + response.statusCode + " " + response.statusMessage);
            console.log(data);
            console.log('***TweetRetryFollowFailureEnd***\n');                                
        }
    });
};
