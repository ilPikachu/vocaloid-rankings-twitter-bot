"use strict";

const fs = require("fs");
const moment = require("moment-timezone");
const schedule = require("node-schedule");

const twitUser = require("../../modules/twit_object_generator/twitObjectGeneratorModule");
const rankingParserModule = require("../../modules/niconico_parser/rankingParserModule");
const rankingScraperModule = require("../../modules/niconico_scraper/rankingScraperModule")
const tweetRankingsHourlyModule = require("../../modules/post_rankings_modules/tweetRankingsHourlyModule")

const rankingTweetUpdater = () => {
    const rankingFilePath = "../../../rank_data/vocaloid_ranking" + moment().utc().format("_YYYY_MM_DD_HH") + ".html";    
    const processedRankingFilePath = "../../../rank_data_proceeded/vocaloid_ranking" + moment().utc().format("_YYYY_MM_DD_HH") + ".json"; 
    if (!fs.existsSync(rankingFilePath)){
        const promise = rankingScraperModule.getRankingData();
        promise.then(() => {
            tweetRankingsHourlyModule.monthlyRankingTweet(processedRankingFilePath);                
            setTimeout(() => {tweetRankingsHourlyModule.weeklyRankingTweet(processedRankingFilePath)}, 60*1000);
            setTimeout(() => {tweetRankingsHourlyModule.dailyRankingTweet(processedRankingFilePath)}, 2*60*1000);                
            setTimeout(() => {tweetRankingsHourlyModule.hourlyRankingTweet(processedRankingFilePath)}, 3*60*1000);
        });
                                                
    }else{
        monthlyRankingTweet(processedRankingFilePath);                
        setTimeout(() => {tweetRankingsHourlyModule.weeklyRankingTweet(processedRankingFilePath)}, 60*1000);
        setTimeout(() => {tweetRankingsHourlyModule.dailyRankingTweet(processedRankingFilePath)}, 2*60*1000);                
        setTimeout(() => {tweetRankingsHourlyModule.hourlyRankingTweet(processedRankingFilePath)}, 3*60*1000);
    }
};

schedule.scheduleJob('0 * * * *', rankingTweetUpdater);
