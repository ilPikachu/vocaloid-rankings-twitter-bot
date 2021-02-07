"use strict"

const moment = require("moment-timezone");

const twitUser = require("../twitObjectGeneratorService");

module.exports = {
    tweetPostStatUpdate: (message, type) => {
        twitUser.post("statuses/update", { status: message }, (error, data, response) => {
            if (!!error){
                console.error('***TweetErrorBegin***');
                console.error(moment().utc().format() + " " + type + " ranking tweet failed. Error.");                
                console.error(error.name);
                console.error(error.message);
                setTimeout(() => {tweetPostStatUpdateRetry(message, type)}, 30*1000);
                console.error('***TweetErrorEnd***\n');
            }

            else if (response.statusCode === 200){
                console.log(moment().utc().format() + " " + type + " ranking tweet successful: " + response.statusCode + "\n");
            }else{
                console.log('***TweetFailureBegin***');                
                console.log(moment().utc().format() + " " + type + " ranking tweet failed. Not 200. Status code: " + response.statusCode + " " + response.statusMessage);
                console.log(data);
                setTimeout(() => {tweetPostStatUpdateRetry(message, type)}, 30*1000);
                console.log('***TweetFailureEnd***\n');                                
            }
        });
    }
}

const tweetPostStatUpdateRetry = (message, type) => {
    twitUser.post("statuses/update", { status: message }, (error, data, response) => {
        if (!!error){
            console.error('***TweetRetryErrorBegin***');
            console.error(moment().utc().format() + " " + type + " ranking retry tweet failed again. Error.");
            console.error(error.name);
            console.error(error.message);
            console.error('***TweetRetryErrorEnd***\n');
        }
            
        else if (response.statusCode === 200){
            console.log(moment().utc().format() + " " + type + " ranking retry tweet successful: " + response.statusCode + "\n");
        }else{
            console.log('***TweetRetryFailureBegin***');
            console.log(moment().utc().format() + " " + type + " ranking retry tweet failed again. Not 200. Status code: " + response.statusCode + " " + response.statusMessage);
            console.log(data);
            console.log('***TweetRetryFailureEnd***\n');            
        }
    });
};
