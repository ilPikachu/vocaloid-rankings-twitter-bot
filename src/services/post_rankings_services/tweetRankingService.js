"use strict";

const moment = require("moment-timezone");

const tweetPostStatUpdateService = require("./tweetPostStatUpdateService");
const tweetTitleTruncaterService = require("../tweetTitleTruncaterService")

module.exports = {
    monthlyRankingTweet: (processedRanking) => {
        const monthlyTweet = "月間ランキング\n" 
        + "3位. " + tweetTitleTruncaterService.tweetTitleTruncater(processedRanking.monthly.rank3.title) + "\n" + processedRanking.monthly.rank3.uri + '\n'
        + "2位. " + tweetTitleTruncaterService.tweetTitleTruncater(processedRanking.monthly.rank2.title) + "\n" + processedRanking.monthly.rank2.uri + "\n" 
        + "1位. " + tweetTitleTruncaterService.tweetTitleTruncater(processedRanking.monthly.rank1.title) + "\n" + processedRanking.monthly.rank1.uri + "\n" 
        + moment().tz("Asia/Tokyo").format("YYYY-MM-DD-HH") + "\n"
        + "#ボカロ #ボカロランキング";

        tweetPostStatUpdateService.tweetPostStatUpdate(monthlyTweet, "Monthly");
    },

    weeklyRankingTweet: (processedRanking) => {  
        const weeklyTweet = "週間ランキング\n" 
        + "3位. " + tweetTitleTruncaterService.tweetTitleTruncater(processedRanking.weekly.rank3.title) + "\n" + processedRanking.weekly.rank3.uri + '\n'
        + "2位. " + tweetTitleTruncaterService.tweetTitleTruncater(processedRanking.weekly.rank2.title) + "\n" + processedRanking.weekly.rank2.uri + "\n" 
        + "1位. " + tweetTitleTruncaterService.tweetTitleTruncater(processedRanking.weekly.rank1.title) + "\n" + processedRanking.weekly.rank1.uri + "\n" 
        + moment().tz("Asia/Tokyo").format("YYYY-MM-DD-HH") + "\n"
        + "#ボカロ #ボカロランキング";

        tweetPostStatUpdateService.tweetPostStatUpdate(weeklyTweet, "Weekly");
    },

    dailyRankingTweet: (processedRanking) => { 
        const dailyTweet = "24時間ランキング\n" 
        + "3位. " + tweetTitleTruncaterService.tweetTitleTruncater(processedRanking.daily.rank3.title) + "\n" + processedRanking.daily.rank3.uri + '\n'
        + "2位. " + tweetTitleTruncaterService.tweetTitleTruncater(processedRanking.daily.rank2.title) + "\n" + processedRanking.daily.rank2.uri + "\n" 
        + "1位. " + tweetTitleTruncaterService.tweetTitleTruncater(processedRanking.daily.rank1.title) + "\n" + processedRanking.daily.rank1.uri + "\n" 
        + moment().tz("Asia/Tokyo").format("YYYY-MM-DD-HH") + "\n"
        + "#ボカロ #ボカロランキング";

        tweetPostStatUpdateService.tweetPostStatUpdate(dailyTweet, "Daily");
    },

    hourlyRankingTweet: (processedRanking) => {
        const hourlyTweet = "毎時ランキング\n" 
        + "3位. " + tweetTitleTruncaterService.tweetTitleTruncater(processedRanking.hourly.rank3.title) + "\n" + processedRanking.hourly.rank3.uri + '\n'
        + "2位. " + tweetTitleTruncaterService.tweetTitleTruncater(processedRanking.hourly.rank2.title) + "\n" + processedRanking.hourly.rank2.uri + "\n" 
        + "1位. " + tweetTitleTruncaterService.tweetTitleTruncater(processedRanking.hourly.rank1.title) + "\n" + processedRanking.hourly.rank1.uri + "\n" 
        + moment().tz("Asia/Tokyo").format("YYYY-MM-DD-HH") + "\n"
        + "#ボカロ #ボカロランキング";

        tweetPostStatUpdateService.tweetPostStatUpdate(hourlyTweet, "Hourly");
    }
};