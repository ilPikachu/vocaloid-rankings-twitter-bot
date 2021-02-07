"use strict";

const moment = require("moment-timezone");
const request = require("request");

const rankingParserService = require("./rankingParserService");
const databaseInsert = require("../dataAccess/databaseInsert");

module.exports = {
    getRankingData: (dbName, collectionName, term) => {
        const rankingUrl = `https://www.nicovideo.jp/ranking/genre/music_sound?term=${term}&tag=VOCALOID&rss=2.0&lang=ja-jp`;

        return new Promise((resolve, reject) => {
            request(rankingUrl, (error, response, body) => {
                if (!!error){
                    console.error('***RankingPageFetchErrorBegin***');
                    console.error(moment().utc().format() + " Ranking Page Fetch Failure. Error.");                
                    console.error(error.name);
                    console.error(error.message);
                    console.error('***RankingPageFetchErrorEnd***\n');  

                    setTimeout(() => {getRankingDataRetry(dbName, collectionName, rankingUrl).then((rankingList) => {
                        resolve(rankingList);
                    }).catch((err) => {
                        reject(err);
                    })}, 10*1000);  
                }
                
                else if (response.statusCode === 200){
                    rankingParserService.getRankingLists(body).then((rankingList) => {
                        return databaseInsert.databaseInsertOne(dbName, collectionName, rankingList);
                    }).then((rankingList) => {
                        resolve(rankingList);
                    }).catch((err) => {
                        reject(err);
                    })
                }
                
                else{
                    console.error('***RankingPageFetchFailureBegin***');                            
                    console.error(moment().utc().format() + " Ranking Page Fetch Failure. Status Code: " + response.statusCode + " " + response.statusMessage);
                    console.error("headers: " + response.headers);
                    console.error("body: "+ response.body);
                    console.error('***RankingPageFetchFailureEnd***\n');    
                    
                    setTimeout(() => {getRankingDataRetry(dbName, collectionName, rankingUrl).then((rankingList) => {
                        resolve(rankingList);
                    }).catch((err) => {
                        reject(err);
                    })}, 10*1000);  
                }   
            });
        });
    }
}

const getRankingDataRetry = (dbName, collectionName, rankingUrl) => {
    return new Promise((resolve, reject) => {
        request(rankingUrl, (error, response, body) => {
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
                rankingParserService.getRankingLists(body).then((rankingList) => {
                    return databaseInsert.databaseInsertOne(dbName, collectionName, rankingList);
                }).then((rankingList) => {
                    resolve(rankingList);
                }).catch((err) => {
                    reject(err);
                })
            }

            else{
                console.error('***RankingPageRetryFailureBegin***');            
                console.error(moment().utc().format() + " Retry Ranking page fetch failure again. Status Code: " + response.statusCode + " " + response.statusMessage);
                console.error("headers: " + response.headers);
                console.error("body: "+ response.body);
                console.error('***RankingPageRetryFailureEnd***\n');
                reject(moment().utc().format() + " Retry Ranking page fetch failure again. Status Code: " + response.statusCode + " " + response.statusMessage);            
            }   
        });
    });
};
