"use strict";

const moment = require("moment-timezone");

const rankingScraperService = require("../../services/rankingScraperService")
const tweetRankingsService = require("../../services/post_rankings_services/tweetRankingService")
const databaseQueryService = require("../../dataAccess/databaseQuery");

module.exports = {
    rankingTweetUpdater: (requestedTerms) => {
        // TODO: Update DB cache mechanism, not really useful right now as direct messaging is broken anyways
        const dbName = "vocadb";
        const collectionName = "rankDataProceeded";
        for (let i = 0; i < requestedTerms.length; i++) {
            rankingScraperService.getRankingData(dbName, collectionName, requestedTerms[i]).then((processedRanking) => {
                setTimeout(() => {tweetRankingsService.rankingTweet(processedRanking, requestedTerms[i])}, i*60*1000);
            }).catch((err) => {
                console.error(err);
            });
        }
        
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
    }
}

