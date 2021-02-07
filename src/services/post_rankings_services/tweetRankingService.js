"use strict";

const moment = require("moment-timezone");

const tweetPostStatUpdateService = require("./tweetPostStatUpdateService");
const tweetTitleTruncaterService = require("../tweetTitleTruncaterService")

module.exports = {
    monthlyRankingTweet: (processedRanking) => {
        const monthlyTweet = "月間ランキング\n\n" 
        + tweetTitleTruncaterService.tweetTitleTruncater(processedRanking.rank3.title) + "\n" + processedRanking.rank3.uri + '\n'
        + tweetTitleTruncaterService.tweetTitleTruncater(processedRanking.rank2.title) + "\n" + processedRanking.rank2.uri + "\n" 
        + tweetTitleTruncaterService.tweetTitleTruncater(processedRanking.rank1.title) + "\n" + processedRanking.rank1.uri + "\n\n"
        + moment().tz("Asia/Tokyo").format("YYYY-MM-DD-HH"); 

        tweetPostStatUpdateService.tweetPostStatUpdate(monthlyTweet, "Monthly");
    },

    weeklyRankingTweet: (processedRanking) => {  
        const weeklyTweet = "週間ランキング\n\n" 
        + tweetTitleTruncaterService.tweetTitleTruncater(processedRanking.rank3.title) + "\n" + processedRanking.rank3.uri + '\n'
        + tweetTitleTruncaterService.tweetTitleTruncater(processedRanking.rank2.title) + "\n" + processedRanking.rank2.uri + "\n" 
        + tweetTitleTruncaterService.tweetTitleTruncater(processedRanking.rank1.title) + "\n" + processedRanking.rank1.uri + "\n\n"
        + moment().tz("Asia/Tokyo").format("YYYY-MM-DD-HH");

        tweetPostStatUpdateService.tweetPostStatUpdate(weeklyTweet, "Weekly");
    },

    dailyRankingTweet: (processedRanking) => { 
        const dailyTweet = "24時間ランキング\n\n" 
        + tweetTitleTruncaterService.tweetTitleTruncater(processedRanking.rank3.title) + "\n" + processedRanking.rank3.uri + '\n'
        + tweetTitleTruncaterService.tweetTitleTruncater(processedRanking.rank2.title) + "\n" + processedRanking.rank2.uri + "\n" 
        + tweetTitleTruncaterService.tweetTitleTruncater(processedRanking.rank1.title) + "\n" + processedRanking.rank1.uri + "\n\n"
        + moment().tz("Asia/Tokyo").format("YYYY-MM-DD-HH");

        tweetPostStatUpdateService.tweetPostStatUpdate(dailyTweet, "Daily");
    },

    hourlyRankingTweet: (processedRanking) => {
        const hourlyTweet = "毎時ランキング\n\n" 
        + tweetTitleTruncaterService.tweetTitleTruncater(processedRanking.rank3.title) + "\n" + processedRanking.rank3.uri + '\n'
        + tweetTitleTruncaterService.tweetTitleTruncater(processedRanking.rank2.title) + "\n" + processedRanking.rank2.uri + "\n" 
        + tweetTitleTruncaterService.tweetTitleTruncater(processedRanking.rank1.title) + "\n" + processedRanking.rank1.uri + "\n\n"
        + moment().tz("Asia/Tokyo").format("YYYY-MM-DD-HH");

        tweetPostStatUpdateService.tweetPostStatUpdate(hourlyTweet, "Hourly");
    }
};