"use strict"

const fs = require("fs");
const moment = require("moment-timezone");
const rankingScraperService = require("./rankingScraperService")

module.exports = { 
    saveRankingLists: (rankingFilePath) => {
        const rankingLists = rankingScraperService.getRankingLists(rankingFilePath);
        const processedRankingFilePath = process.env.HOME + "/miku_twitter_bot/rank_data_proceeded/vocaloid_ranking" + moment().utc().format("_YYYY_MM_DD_HH") + ".json"; 
        if (rankingLists === undefined){
            const error = new Error(String(rankingFilePath) + " does not exist!");
            throw(error);
        }
        fs.writeFileSync(processedRankingFilePath, JSON.stringify(rankingLists, null, 4));
    }
}