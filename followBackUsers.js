"use strict";

const Twit = require("twit");
const fs = require("fs");
const moment = require("moment-timezone");

let secrets = JSON.parse(fs.readFileSync("./utilities/secrets.json"));

let twitAuth = {
    consumer_key:         secrets.twitter.consumer_key,
    consumer_secret:      secrets.twitter.consumer_secret,
    access_token:         secrets.twitter.access_token,
    access_token_secret:  secrets.twitter.access_token_secret
};

let twitUser = new Twit(twitAuth);

let stream = twitUser.stream("user");

stream.on("follow", followBack);

function followBack(event){
    let name = event.source.name;
    let screenName = event.source.screen_name;
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
        }

        else{
            console.log('***TweetFollowFailureBegin***');                
            console.log(moment().utc().format() + " Tweet follow back failed. Not 200 or 403. Status code: " + response.statusCode + " " + response.statusMessage);
            console.log(data);
            setTimeout(() => {followBackRetry(screenName)}, 10*1000);
            console.log('***TweetFollowFailureEnd***\n');                                
        }
    });
}


function followBackRetry(screenName){
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
        }

        else{
            console.log('***TweetRetryFollowFailureBegin***');                
            console.log(moment().utc().format() + " Tweet follow back failed. Not 200 or 403. Status code: " + response.statusCode + " " + response.statusMessage);
            console.log(data);
            console.log('***TweetRetryFollowFailureEnd***\n');                                
        }
    });
}
