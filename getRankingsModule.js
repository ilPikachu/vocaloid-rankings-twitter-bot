const fs = require("fs");
const moment = require("moment-timezone");
const request = require("request");

const processRankingListModule = require("./processRankingListModule.js");

const getRankingData = function (callback){
    const rankingFilePath = "./rank_data/vocaloid_ranking" + moment().utc().format("_YYYY_MM_DD_HH") + ".html";
    request("http://ex.nicovideo.jp/vocaloid/ranking", (error, response, body) => {
            if (!!error){
                console.error('***RankingPageFetchErrorBegin***');
                console.error(moment().utc().format() + " Ranking Page Fetch Failure. Error.");                
                console.error(error.name);
                console.error(error.message);
                console.error('***RankingPageFetchErrorEnd***\n');  
                setTimeout(() => {getRankingDataRetry(rankingFilePath, callback)}, 10*1000);
            }
            
            else if (response.statusCode === 200){
                fs.writeFileSync(rankingFilePath, body);
                try{
                    const rankingLists = processRankingListModule.getRankingLists(rankingFilePath);
                    const processedRankingFilePath = "./rank_data_proceeded/vocaloid_ranking" + moment().utc().format("_YYYY_MM_DD_HH") + ".json"; 
                    if (rankingLists instanceof Error){
                        throw(rankingLists);
                    }           
                    fs.writeFileSync(processedRankingFilePath, JSON.stringify(rankingLists, null, 4));
                    callback();
                }
                catch(error){
                    console.error(error.message);
                }
            }
            
            else{
                console.log('***RankingPageFetchFailureBegin***');                            
                console.log(moment().utc().format() + " Ranking Page Fetch Failure. Status Code: " + response.statusCode + " " + response.statusMessage);
                console.log("headers: " + response.headers);
                console.log("body: "+ response.body);
                console.log('***RankingPageFetchFailureEnd***\n');                                                            
                setTimeout(() => {getRankingDataRetry(rankingFilePath, callback)}, 10*1000);  
            }   
        });
};

const getRankingDataRetry = function (rankingFilePath, callback){
    request("http://ex.nicovideo.jp/vocaloid/ranking", (error, response, body) => {
        if (!!error){
            console.error('***RankingPageRetryErrorBegin***');
            console.error(moment().utc().format() + " Retry Ranking page fetch failure again. Error.");
            console.error(error.name);
            console.error(error.message);
            console.log("Retry Ranking Page File Path: " + rankingFilePath);            
            console.error('***RankingPageRetryErrorEnd***\n');            
        }

        else if (response.statusCode === 200){
            console.log(moment().utc().format() + " Ranking Page Retry Success");
            console.log("Retry Ranking Page File Path: " + rankingFilePath + "\n");
            fs.writeFileSync(rankingFilePath, body);
            try{
                const rankingLists = processRankingListModule.getRankingLists(rankingFilePath);
                const processedRankingFilePath = "./rank_data_proceeded/vocaloid_ranking" + moment().utc().format("_YYYY_MM_DD_HH") + ".json"; 
                if (rankingLists instanceof Error){
                    throw(rankingLists);
                }           
                fs.writeFileSync(processedRankingFilePath, JSON.stringify(rankingLists, null, 4));
                callback();
            }
            catch(error){
                console.error(error.message);
            }                               
        }

        else{
            console.log('***RankingPageRetryFailureBegin***');            
            console.log(moment().utc().format() + " Retry Ranking page fetch failure again. Status Code: " + response.statusCode + " " + response.statusMessage);
            console.log("headers: " + response.headers);
            console.log("body: "+ response.body);
            console.log("Retry Ranking Page File Path: " + rankingFilePath);                        
            console.log('***RankingPageRetryFailureEnd***\n');            
        }   
    });
};

exports.getRankingData = getRankingData;