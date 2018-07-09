"use strict";

const moment = require("moment-timezone");
const request = require("request");

const rankingParserService = require("./rankingParserService");
const databaseInsert = require("../dataAccess/databaseInsert");

const niconicoUrl = "http://ex.nicovideo.jp/vocaloid/ranking";

module.exports = {
    getRankingData: (dbName, collectionName) => {
        return new Promise((resolve, reject) => {
            request(niconicoUrl, (error, response, body) => {
                if (!!error){
                    console.error('***RankingPageFetchErrorBegin***');
                    console.error(moment().utc().format() + " Ranking Page Fetch Failure. Error.");                
                    console.error(error.name);
                    console.error(error.message);
                    console.error('***RankingPageFetchErrorEnd***\n');  
                    setTimeout(() => {getRankingDataRetry(dbName, collectionName)}, 10*1000);
                }
                
                else if (response.statusCode === 200){
                    const processedRanking = rankingParserService.getRankingLists(body);
                    databaseInsert.databaseInsertOne(dbName, collectionName, processedRanking).then(() => {
                        resolve(processedRanking);
                    });
                }
                
                else{
                    console.log('***RankingPageFetchFailureBegin***');                            
                    console.log(moment().utc().format() + " Ranking Page Fetch Failure. Status Code: " + response.statusCode + " " + response.statusMessage);
                    console.log("headers: " + response.headers);
                    console.log("body: "+ response.body);
                    console.log('***RankingPageFetchFailureEnd***\n');                                                            
                    setTimeout(() => {getRankingDataRetry(dbName, collectionName)}, 10*1000);  
                }   
            });
        });
    }
}

const getRankingDataRetry = (dbName, collectionName) => {
    return new Promise((resolve, reject) => {
        request(niconicoUrl, (error, response, body) => {
            if (!!error){
                console.error('***RankingPageRetryErrorBegin***');
                console.error(moment().utc().format() + " Retry Ranking page fetch failure again. Error.");
                console.error(error.name);
                console.error(error.message);
                console.error('***RankingPageRetryErrorEnd***\n');
                reject(moment().utc().format() + " Retry Ranking page fetch failure again. Error.");            
            }

            else if (response.statusCode === 200){
                console.log(moment().utc().format() + " Ranking Page Retry Success");
                const processedRanking = rankingParserService.getRankingLists(body);
                databaseInsert.databaseInsertOne(dbName, collectionName, processedRanking).then(() => {
                    resolve(processedRanking);
                });                                   
            }

            else{
                console.log('***RankingPageRetryFailureBegin***');            
                console.log(moment().utc().format() + " Retry Ranking page fetch failure again. Status Code: " + response.statusCode + " " + response.statusMessage);
                console.log("headers: " + response.headers);
                console.log("body: "+ response.body);
                console.log('***RankingPageRetryFailureEnd***\n');
                reject(moment().utc().format() + " Retry Ranking page fetch failure again. Status Code: " + response.statusCode + " " + response.statusMessage);            
            }   
        });
    });
};