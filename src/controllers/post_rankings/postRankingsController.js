"use strict";

const moment = require("moment-timezone");

const rankingScraperService = require("../../services/rankingScraperService")
const tweetRankingsService = require("../../services/post_rankings_services/tweetRankingService")
const databaseQueryService = require("../../dataAccess/databaseQuery");

const Term = Object.freeze({
    HOURLY: "hour",
    DAILY: "24h",
    WEEKLY: "week",
    MONTHLY: "month",
});

module.exports = {
    rankingTweetUpdater: (requestedRankings) => {
        /*
        const dbName = "vocadb";
        const collectionName = "rankDataProceeded";
        const value = moment().utc().format("YYYY-MM-DDTHH");
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
        */

        // TODO: Update DB cache mechanism, not really useful right now as direct messaging is broken anyways
       const dbName = "vocadb";
       const collectionName = "rankDataProceeded";
       tweetRankingsSelector(dbName, collectionName, requestedRankings);
    },
    Term
}

const tweetRankingsSelector = (requestedRankings) => {
    for (let i = 0; i < requestedRankings.length; i++){
        switch(requestedRankings[i]){
            case Term.HOURLY:
                rankingScraperService.getRankingData(dbName, collectionName, Term.HOURLY).then((processedRanking) => {
                    setTimeout(() => {tweetRankingsService.hourlyRankingTweet(processedRanking)}, i*60*1000);
                }).catch((err) => {
                    console.error(err);
                });
                break;
            case Term.DAILY:
                rankingScraperService.getRankingData(dbName, collectionName, Term.DAILY).then((processedRanking) => {
                    setTimeout(() => {tweetRankingsService.dailyRankingTweet(processedRanking)}, i*60*1000);
                }).catch((err) => {
                    console.error(err);
                });
                break;
            case Term.WEEKLY:
                rankingScraperService.getRankingData(dbName, collectionName, Term.WEEKLY).then((processedRanking) => {
                    setTimeout(() => {tweetRankingsService.weeklyRankingTweet(processedRanking)}, i*60*1000);
                }).catch((err) => {
                    console.error(err);
                });
                break;
            case Term.MONTHLY:
                rankingScraperService.getRankingData(dbName, collectionName, Term.MONTHLY).then((processedRanking) => {
                    setTimeout(() => {tweetRankingsService.monthlyRankingTweet(processedRanking)}, i*60*1000);
                }).catch((err) => {
                    console.error(err);
                });
                break;
            default:
                console.error("Ranking request not supported");
        }
    }
};