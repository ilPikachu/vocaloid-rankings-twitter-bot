"use strict";

const moment = require("moment-timezone");

const tweetPostStatUpdateService = require("./tweetPostStatUpdateService");
const tweetTitleTruncaterService = require("../tweetTitleTruncaterService");
const Term = require("../../common/term");

module.exports = {
    rankingTweet: (processedRanking, type) => {
        let tweetTitle = "" 
        switch(type){
            case Term.HOURLY:
                tweetTitle = tweet.concat("毎時ランキング\n\n");
                break;
            case Term.DAILY:
                tweetTitle = tweet.concat("24時間ランキング\n\n");
                break;
            case Term.WEEKLY:
                tweetTitle = tweet.concat("週間ランキング\n\n");
                break;
            case Term.MONTHLY:
                tweetTitle = tweet.concat("月間ランキング\n\n");
                break;
            default:
                console.error("Ranking request not supported");
        }

        const tweet = tweetTitle 
        + tweetTitleTruncaterService.tweetTitleTruncater(processedRanking.rank3.title) + "\n" + processedRanking.rank3.uri + '\n'
        + tweetTitleTruncaterService.tweetTitleTruncater(processedRanking.rank2.title) + "\n" + processedRanking.rank2.uri + "\n" 
        + tweetTitleTruncaterService.tweetTitleTruncater(processedRanking.rank1.title) + "\n" + processedRanking.rank1.uri + "\n\n"
        + moment().tz("Asia/Tokyo").format("YYYY-MM-DD-HH"); 

        tweetPostStatUpdateService.tweetPostStatUpdate(tweet, type);
    }
};
