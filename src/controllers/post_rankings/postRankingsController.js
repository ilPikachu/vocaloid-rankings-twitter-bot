"use strict";

const fs = require("fs");
const moment = require("moment-timezone");

const rankingScraperService = require("../../services/rankingScraperService")
const tweetRankingsService = require("../../services/post_rankings_services/tweetRankingService")

module.exports = {
    rankingTweetUpdater: (requestedRankings) => {
        const processedRankingFilePath = process.env.HOME + "/miku_twitter_bot/rank_data_proceeded/vocaloid_ranking" + moment().utc().format("_YYYY_MM_DD_HH") + ".json"; 
        if (!fs.existsSync(processedRankingFilePath)){
            const promise = rankingScraperService.getRankingData();
            promise.then(() => {
                tweetRankingsSelector(requestedRankings, processedRankingFilePath);
            });
                                                    
        }else{
            tweetRankingsSelector(requestedRankings, processedRankingFilePath);
        }
    }
}

const tweetRankingsSelector = (requestedRankings, processedRankingFilePath) => {
    console.log(requestedRankings);
    for (let i = 0; i < requestedRankings.length; i++){
        switch(requestedRankings[i]){
            case "hourly":
                setTimeout(() => {tweetRankingsService.hourlyRankingTweet(processedRankingFilePath)}, i*60*1000);
                break;
            case "daily":
                setTimeout(() => {tweetRankingsService.dailyRankingTweet(processedRankingFilePath)}, i*60*1000);
                break;
            case "weekly":
                setTimeout(() => {tweetRankingsService.weeklyRankingTweet(processedRankingFilePath)}, i*60*1000);
                break;
            case "monthly":
                setTimeout(() => {tweetRankingsService.monthlyRankingTweet(processedRankingFilePath)}, i*60*1000);
                break;
            default:
                console.error("Ranking request not supported");
        }
    }
};