"use strict";

const rankingScraperService = require("../services/rankingScraperService")
const tweetRankingsService = require("../services/tweetRankingService")

module.exports = {
    rankingTweetUpdater: (requestedTerms) => {
        for (let i = 0; i < requestedTerms.length; i++) {
            rankingScraperService.getRankingData(requestedTerms[i]).then((processedRanking) => {
                setTimeout(() => {tweetRankingsService.rankingTweet(processedRanking, requestedTerms[i])}, i*60*1000);
            }).catch((err) => {
                console.error(err);
            });
        }
    }
}

