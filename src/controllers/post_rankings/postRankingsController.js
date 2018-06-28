"use strict";

const fs = require("fs");
const moment = require("moment-timezone");

const rankingScraperModule = require("../../modules/niconico_scraper/rankingScraperModule")
const tweetRankingsHourlyModule = require("../../modules/post_rankings_modules/tweetRankingsHourlyModule")

module.exports = {
    rankingTweetUpdater: function () {
        const processedRankingFilePath = process.env.HOME + "/miku_twitter_bot/rank_data_proceeded/vocaloid_ranking" + moment().utc().format("_YYYY_MM_DD_HH") + ".json"; 
        if (!fs.existsSync(processedRankingFilePath)){
            const promise = rankingScraperModule.getRankingData();
            promise.then(() => {
                tweetRankingsHourlyModule.monthlyRankingTweet(processedRankingFilePath);                
                setTimeout(() => {tweetRankingsHourlyModule.weeklyRankingTweet(processedRankingFilePath)}, 60*1000);
                setTimeout(() => {tweetRankingsHourlyModule.dailyRankingTweet(processedRankingFilePath)}, 2*60*1000);                
                setTimeout(() => {tweetRankingsHourlyModule.hourlyRankingTweet(processedRankingFilePath)}, 3*60*1000);
            });
                                                    
        }else{
            tweetRankingsHourlyModule.monthlyRankingTweet(processedRankingFilePath);                
            setTimeout(() => {tweetRankingsHourlyModule.weeklyRankingTweet(processedRankingFilePath)}, 60*1000);
            setTimeout(() => {tweetRankingsHourlyModule.dailyRankingTweet(processedRankingFilePath)}, 2*60*1000);                
            setTimeout(() => {tweetRankingsHourlyModule.hourlyRankingTweet(processedRankingFilePath)}, 3*60*1000);
        }
    }
}