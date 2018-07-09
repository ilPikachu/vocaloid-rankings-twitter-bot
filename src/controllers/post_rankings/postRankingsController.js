"use strict";

const moment = require("moment-timezone");

const rankingScraperService = require("../../services/rankingScraperService")
const tweetRankingsService = require("../../services/post_rankings_services/tweetRankingService")
const databaseQueryService = require("../../dataAccess/databaseQuery");

module.exports = {
    rankingTweetUpdater: (requestedRankings) => {
        const dbName = "vocadb";
        const collectionName = "rankDataProceeded";
        const value = moment().utc().format("YYYY-MM-DDTHH*");
        const queryParameter = {lastUpdated: {$regex: value}};
    
        databaseQueryService.databaseQuery(dbName, collectionName, queryParameter).then(function(result){
            tweetRankingsSelector(requestedRankings, result[0]);
        }).catch(function(err){
            if (err == "No matching result for query: " + JSON.stringify(queryParameter)){
                const promise = rankingScraperService.getRankingData(dbName, collectionName);
                promise.then((processedRanking) => {
                    tweetRankingsSelector(requestedRankings, processedRanking);
                }).catch((err) => {
                    console.error(err);
                });
            } else{
                console.error(err);
            }
        });
    }
}

const tweetRankingsSelector = (requestedRankings, processedRanking) => {
    console.log(requestedRankings);
    for (let i = 0; i < requestedRankings.length; i++){
        switch(requestedRankings[i]){
            case "hourly":
                setTimeout(() => {tweetRankingsService.hourlyRankingTweet(processedRanking)}, i*60*1000);
                break;
            case "daily":
                setTimeout(() => {tweetRankingsService.dailyRankingTweet(processedRanking)}, i*60*1000);
                break;
            case "weekly":
                setTimeout(() => {tweetRankingsService.weeklyRankingTweet(processedRanking)}, i*60*1000);
                break;
            case "monthly":
                setTimeout(() => {tweetRankingsService.monthlyRankingTweet(processedRanking)}, i*60*1000);
                break;
            default:
                console.error("Ranking request not supported");
        }
    }
};