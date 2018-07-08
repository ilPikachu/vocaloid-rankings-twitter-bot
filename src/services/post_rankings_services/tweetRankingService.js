"use strict";

const fs = require("fs");
const moment = require("moment-timezone");

const tweetPostStatUpdateModule = require("./tweetPostStatUpdateService");
const tweetTitleTruncaterModule = require("../tweetTitleTruncaterService")

module.exports = {
    monthlyRankingTweet: (processedRankingFilePath) => {
        const rankingLists = JSON.parse(fs.readFileSync(processedRankingFilePath));

        const monthlyTweet = "月間ランキング\n" 
        + "1. " + tweetTitleTruncaterModule.tweetTitleTruncater(rankingLists.monthly.rank1.title) + "\n" + rankingLists.monthly.rank1.uri + "\n" 
        + "2. " + tweetTitleTruncaterModule.tweetTitleTruncater(rankingLists.monthly.rank2.title) + "\n" + rankingLists.monthly.rank2.uri + "\n" 
        + "3. " + tweetTitleTruncaterModule.tweetTitleTruncater(rankingLists.monthly.rank3.title) + "\n" + rankingLists.monthly.rank3.uri + '\n'
        + moment().tz("Asia/Tokyo").format("YYYY-MM-DD-HH");

        tweetPostStatUpdateModule.tweetPostStatUpdate(monthlyTweet, "Monthly");

    },

    weeklyRankingTweet: (processedRankingFilePath) => {  
        const rankingLists = JSON.parse(fs.readFileSync(processedRankingFilePath));

        const weeklyTweet = "週間ランキング\n" 
        + "1. " + tweetTitleTruncaterModule.tweetTitleTruncater(rankingLists.weekly.rank1.title) + "\n" + rankingLists.weekly.rank1.uri + "\n" 
        + "2. " + tweetTitleTruncaterModule.tweetTitleTruncater(rankingLists.weekly.rank2.title) + "\n" + rankingLists.weekly.rank2.uri + "\n" 
        + "3. " + tweetTitleTruncaterModule.tweetTitleTruncater(rankingLists.weekly.rank3.title) + "\n" + rankingLists.weekly.rank3.uri + '\n'
        + moment().tz("Asia/Tokyo").format("YYYY-MM-DD-HH");

        tweetPostStatUpdateModule.tweetPostStatUpdate(weeklyTweet, "Weekly");
    },

    dailyRankingTweet: (processedRankingFilePath) => { 
        const rankingLists = JSON.parse(fs.readFileSync(processedRankingFilePath));

        const dailyTweet = "24時間ランキング\n" 
        + "1. " + tweetTitleTruncaterModule.tweetTitleTruncater(rankingLists.daily.rank1.title) + "\n" + rankingLists.daily.rank1.uri + "\n" 
        + "2. " + tweetTitleTruncaterModule.tweetTitleTruncater(rankingLists.daily.rank2.title) + "\n" + rankingLists.daily.rank2.uri + "\n" 
        + "3. " + tweetTitleTruncaterModule.tweetTitleTruncater(rankingLists.daily.rank3.title) + "\n" + rankingLists.daily.rank3.uri + '\n'
        + moment().tz("Asia/Tokyo").format("YYYY-MM-DD-HH");

        tweetPostStatUpdateModule.tweetPostStatUpdate(dailyTweet, "Daily");
    },

    hourlyRankingTweet: (processedRankingFilePath) => {
        const rankingLists = JSON.parse(fs.readFileSync(processedRankingFilePath));

        const hourlyTweet = "毎時ランキング\n" 
        + "1. " + tweetTitleTruncaterModule.tweetTitleTruncater(rankingLists.hourly.rank1.title) + "\n" + rankingLists.hourly.rank1.uri + "\n" 
        + "2. " + tweetTitleTruncaterModule.tweetTitleTruncater(rankingLists.hourly.rank2.title) + "\n" + rankingLists.hourly.rank2.uri + "\n" 
        + "3. " + tweetTitleTruncaterModule.tweetTitleTruncater(rankingLists.hourly.rank3.title) + "\n" + rankingLists.hourly.rank3.uri + '\n'
        + moment().tz("Asia/Tokyo").format("YYYY-MM-DD-HH");

        tweetPostStatUpdateModule.tweetPostStatUpdate(hourlyTweet, "Hourly");
    }
};