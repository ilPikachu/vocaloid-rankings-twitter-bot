"use strict";

const Twit = require("twit");
const fs = require("fs");
const request = require("request");
const moment = require("moment-timezone");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const schedule = require("node-schedule");

function createRankingList(RankingHtmlList){
    let rankingList = {};
    
    for (let i = 0; i < RankingHtmlList.length; i++){
        rankingList["rank" + String(i + 1)] = {};
        rankingList["rank" + String(i + 1)]["points"] = RankingHtmlList.item(i).getElementsByClassName("count_time").item(0).textContent;
        rankingList["rank" + String(i + 1)]["rank"] = RankingHtmlList.item(i).getElementsByClassName("icon_rank rank" + String(i + 1)).item(0).textContent;
        rankingList["rank" + String(i + 1)]["uri"] = RankingHtmlList.item(i).getElementsByTagName("a").item(0).href;
        rankingList["rank" + String(i + 1)]["title"] = RankingHtmlList.item(i).getElementsByClassName("ttl").item(0).textContent;
        rankingList["rank" + String(i + 1)]["time"] = RankingHtmlList.item(i).getElementsByClassName("time").item(0).textContent;
        rankingList["rank" + String(i + 1)]["thumbnail"] = RankingHtmlList.item(i).getElementsByTagName("img").item(0).src;
    }
    
    return rankingList;
}

function getRankingLists(rankingFilePath){
    if (fs.existsSync(rankingFilePath)){
        let file = fs.readFileSync(rankingFilePath);  
        const dom = new JSDOM(file);
        let rankingLists = dom.window.document.getElementById("wrapper")
                            .getElementsByClassName("ranking_cnt clearfix").item(0)
                            .querySelectorAll("li");    
        
        let hourlyRankingHtmlList = rankingLists.item(0).getElementsByClassName("box");
        let dailyRankingHtmlList = rankingLists.item(1).getElementsByClassName("box");
        let weeklyRankingHtmlList = rankingLists.item(2).getElementsByClassName("box");
        let monthlyRankingHtmlList = rankingLists.item(3).getElementsByClassName("box");

        let hourlyRankingList = createRankingList(hourlyRankingHtmlList);
        let dailyRankingList = createRankingList(dailyRankingHtmlList);
        let weeklyRankingList = createRankingList(weeklyRankingHtmlList);
        let monthlyRankingList = createRankingList(monthlyRankingHtmlList);
        
        rankingLists = {
            "hourly": hourlyRankingList,
            "daily": dailyRankingList,
            "weekly": weeklyRankingList,
            "monthly": monthlyRankingList,
            "lastUpdated": moment().utc().format()
        };

        return rankingLists;
    }
    
    else {
        let error = new Error(String(rankingFilePath) + " does not exist!");
        return error;
    }

}

function tweetPostStatUpdateRetry(message){
    let secrets = JSON.parse(fs.readFileSync("~/miku_twitter_bot/utilities/secrets.json"));
        
    let twitAuth = {
        consumer_key:         secrets.twitter.consumer_key,
        consumer_secret:      secrets.twitter.consumer_secret,
        access_token:         secrets.twitter.access_token,
        access_token_secret:  secrets.twitter.access_token_secret
    };
        
    let twitUser = new Twit(twitAuth);
    
    twitUser.post("statuses/update", { status: message }, (error, data, response) => {
        if (!!error){
            console.error('***TweetRetryErrorBegin***');
            console.error(moment().utc().format() + " Retry Tweet failed again. Error.");
            console.error(error.name);
            console.error(error.message);
            console.error('***TweetRetryErrorEnd***\n');
        }
            
        else if (response.statusCode === 200){
            console.log(moment().utc().format() + " Retry Tweet successful: " + response.statusCode + "\n");
        }
        
        else{
            console.log('***TweetRetryFailureBegin***');
            console.log(moment().utc().format() + " Retry Tweet failed again. Not 200. Status code: " + response.statusCode + " " + response.statusMessage);
            console.log(data);
            console.log('***TweetRetryFailureEnd***\n');            
        }
    });
}

function tweetPostStatUpdate(message){
    if (fs.existsSync("./utilities/secrets.json")){
        let secrets = JSON.parse(fs.readFileSync("./utilities/secrets.json"));
        
        let twitAuth = {
            consumer_key:         secrets.twitter.consumer_key,
            consumer_secret:      secrets.twitter.consumer_secret,
            access_token:         secrets.twitter.access_token,
            access_token_secret:  secrets.twitter.access_token_secret
        };
        
        let twitUser = new Twit(twitAuth);
            
        message = message + '\n' + moment().tz("Asia/Tokyo").format("YYYY-MM-DD-HH");

        twitUser.post("statuses/update", { status: message }, (error, data, response) => {
            if (!!error){
                console.error('***TweetErrorBegin***');
                console.error(moment().utc().format() + " Tweet failed. Error.");                
                console.error(error.name);
                console.error(error.message);
                setTimeout(() => {tweetPostStatUpdateRetry(message)}, 30*1000);
                console.error('***TweetErrorEnd***\n');
            }
            
            else if (response.statusCode === 200){
                console.log(moment().utc().format() + " Tweet successful: " + response.statusCode + "\n");
            }
        
            else{
                console.log('***TweetFailureBegin***');                
                console.log(moment().utc().format() + " Tweet failed. Not 200. Status code: " + response.statusCode + " " + response.statusMessage);
                console.log(data);
                setTimeout(() => {tweetPostStatUpdateRetry(message)}, 30*1000);
                console.log('***TweetFailureEnd***\n');                                
            }
        });
    }

    else{
        let error = new Error("./utilities/secrets.json does not exist");
        return error;
    }
}

function tweetTitleTruncate(title){
    //truncate within 28 characters, 98 base characters, 14 time unque string, floor((280 - 98 - 14) / 3) / 2 = 28
    if (title.length > 28){
        return title.substring(0, 28);
    }
    else{
        return title;
    }
}

function rankingPageRequestWithSingleTweetRetry(rankingFilePath, callback){
    request("http://ex.nicovideo.jp/vocaloid/ranking", (error, response, body) => {
        if (!!error){
            console.error('***RankingPageRefetchErrorBegin***');
            console.error(moment().utc().format() + " Refetch Ranking page fetch failure again. Error.");
            console.error(error.name);
            console.error(error.message);
            console.log("Refetch Ranking Page File Path: "+ rankingFilePath);            
            console.error('***RankingPageRefetchErrorEnd***\n');            
        }

        else if (response.statusCode === 200){
            console.log(moment().utc().format() + " Ranking Page Refetch Success");
            console.log("Refetch Ranking Page File Path: "+ rankingFilePath + "\n");
            fs.writeFileSync(rankingFilePath, body);
            callback();                               
        }

        else{
            console.log('***RankingPageRefetchFailureBegin***');            
            console.log(moment().utc().format() + " Refetch Ranking page fetch failure again. Status code: " + response.statusCode + " " + response.statusMessage);
            console.log("headers: " + response.headers);
            console.log("body: "+ response.body);
            console.log("Refetch Ranking Page File Path: "+ rankingFilePath);            
            console.log('***RankingPageRefetchFailureEnd***\n');            
        }   
    });
}

function rankingPageRequestWithTweetUpdaterRetry(rankingFilePath){
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
            monthlyRankingTweet(rankingFilePath);                
            setTimeout(() => {weeklyRankingTweet(rankingFilePath)}, 60*1000);
            setTimeout(() => {dailyRankingTweet(rankingFilePath)}, 2*60*1000);                
            setTimeout(() => {hourlyRankingTweet(rankingFilePath)}, 3*60*1000);                                
        }

        else{
            console.log('***RankingPageRetryFailureBegin***');            
            console.log(moment().utc().format() + " Retry Ranking page fetch failure again. Status code: " + response.statusCode + " " + response.statusMessage);
            console.log("headers: " + response.headers);
            console.log("body: "+ response.body);
            console.log("Retry Ranking Page File Path: " + rankingFilePath);                        
            console.log('***RankingPageRetryFailureEnd***\n');            
        }   
    });
}

function rankingTweetUpdater(){
    let rankingFilePath = "~/miku_twitter_bot/rank_data/vocaloid_ranking" + moment().utc().format("_YYYY_MM_DD_HH") + ".html";    
    if (!fs.existsSync(rankingFilePath)){
        request("http://ex.nicovideo.jp/vocaloid/ranking", (error, response, body) => {
            if (!!error){
                console.error('***RankingPageFetchErrorBegin***');
                console.error(moment().utc().format() + " Ranking Page Fetch Failure. Error.");                
                console.error(error.name);
                console.error(error.message);
                console.error('***RankingPageFetchErrorEnd***\n');  
                setTimeout(() => {rankingPageRequestWithTweetUpdaterRetry(rankingFilePath)}, 1*60*1000);
            }

            else if (response.statusCode === 200){
                fs.writeFileSync(rankingFilePath, body);
                monthlyRankingTweet(rankingFilePath);                
                setTimeout(() => {weeklyRankingTweet(rankingFilePath)}, 60*1000);
                setTimeout(() => {dailyRankingTweet(rankingFilePath)}, 2*60*1000);                
                setTimeout(() => {hourlyRankingTweet(rankingFilePath)}, 3*60*1000);                                
            }

            else{
                console.log('***RankingPageFetchFailureBegin***');                            
                console.log(moment().utc().format() + " Ranking Page Fetch Failure. Status code: " + response.statusCode + " " + response.statusMessage);
                console.log("headers: " + response.headers);
                console.log("body: "+ response.body);
                console.log('***RankingPageFetchFailureEnd***\n');                                                            
                setTimeout(() => {rankingPageRequestWithTweetUpdaterRetry(rankingFilePath)}, 1*60*1000);  
            }   
        });
    }
    else{
        monthlyRankingTweet(rankingFilePath);                
        setTimeout(() => {weeklyRankingTweet(rankingFilePath)}, 60*1000);
        setTimeout(() => {dailyRankingTweet(rankingFilePath)}, 2*60*1000);                
        setTimeout(() => {hourlyRankingTweet(rankingFilePath)}, 3*60*1000);
    }
}

function monthlyRankingTweet(rankingFilePath){
    let processedRankingFilePath = "~/miku_twitter_bot/rank_data_proceeded/vocaloid_ranking" + moment().utc().format("_YYYY_MM_DD_HH") + ".json";
    if (!fs.existsSync(processedRankingFilePath)){
        try{
            let rankingLists = getRankingLists(rankingFilePath); 
            if (rankingLists instanceof Error){
                throw(rankingLists);
            }           
            fs.writeFileSync(processedRankingFilePath, JSON.stringify(rankingLists));

            let monthlyTweet = "月間ランキング\n" 
            + "1. " + tweetTitleTruncate(rankingLists.monthly.rank1.title) + "\n" + rankingLists.monthly.rank1.uri + "\n" 
            + "2. " + tweetTitleTruncate(rankingLists.monthly.rank2.title) + "\n" + rankingLists.monthly.rank2.uri + "\n" 
            + "3. " + tweetTitleTruncate(rankingLists.monthly.rank3.title) + "\n" + rankingLists.monthly.rank3.uri;

            console.log(monthlyTweet + "\n");

            tweetPostStatUpdate(monthlyTweet);

            console.log("----------------\n");    
        }    
        catch(error){
            console.error(error.message);
            rankingPageRequestWithSingleTweetRetry(rankingFilePath, () => {
                let rankingLists = getRankingLists(rankingFilePath); 
                if (rankingLists instanceof Error){
                    throw(rankingLists);
                }           
                fs.writeFileSync(processedRankingFilePath, JSON.stringify(rankingLists));
    
                let monthlyTweet = "月間ランキング\n" 
                + "1. " + tweetTitleTruncate(rankingLists.monthly.rank1.title) + "\n" + rankingLists.monthly.rank1.uri + "\n" 
                + "2. " + tweetTitleTruncate(rankingLists.monthly.rank2.title) + "\n" + rankingLists.monthly.rank2.uri + "\n" 
                + "3. " + tweetTitleTruncate(rankingLists.monthly.rank3.title) + "\n" + rankingLists.monthly.rank3.uri;
    
                console.log(monthlyTweet + "\n");
    
                tweetPostStatUpdate(monthlyTweet);
    
                console.log("----------------\n"); 
            });           
        }
    }

    else{
        let rankingLists = JSON.parse(fs.readFileSync(processedRankingFilePath));

        let monthlyTweet = "月間ランキング\n" 
        + "1. " + tweetTitleTruncate(rankingLists.monthly.rank1.title) + "\n" + rankingLists.monthly.rank1.uri + "\n" 
        + "2. " + tweetTitleTruncate(rankingLists.monthly.rank2.title) + "\n" + rankingLists.monthly.rank2.uri + "\n" 
        + "3. " + tweetTitleTruncate(rankingLists.monthly.rank3.title) + "\n" + rankingLists.monthly.rank3.uri;

        console.log(monthlyTweet + "\n");

        tweetPostStatUpdate(monthlyTweet);

        console.log("----------------\n");               
    }
}

function weeklyRankingTweet(rankingFilePath){  
    let processedRankingFilePath = "~/miku_twitter_bot/rank_data_proceeded/vocaloid_ranking" + moment().utc().format("_YYYY_MM_DD_HH") + ".json";
    if (!fs.existsSync(processedRankingFilePath)){
        try{
            let rankingLists = getRankingLists(rankingFilePath);
            if (rankingLists instanceof Error){
                throw(rankingLists);
            }        
            fs.writeFileSync(processedRankingFilePath, JSON.stringify(rankingLists));

            let weeklyTweet = "週間ランキング\n" 
            + "1. " + tweetTitleTruncate(rankingLists.weekly.rank1.title) + "\n" + rankingLists.weekly.rank1.uri + "\n" 
            + "2. " + tweetTitleTruncate(rankingLists.weekly.rank2.title) + "\n" + rankingLists.weekly.rank2.uri + "\n" 
            + "3. " + tweetTitleTruncate(rankingLists.weekly.rank3.title) + "\n" + rankingLists.weekly.rank3.uri;

            console.log(weeklyTweet + "\n");

            tweetPostStatUpdate(weeklyTweet);

            console.log("----------------\n");
        }
        catch(error){
            console.error(error.message);
            rankingPageRequestWithSingleTweetRetry(rankingFilePath, () => {
                let rankingLists = getRankingLists(rankingFilePath);
                if (rankingLists instanceof Error){
                    throw(rankingLists);
                }         
                fs.writeFileSync(processedRankingFilePath, JSON.stringify(rankingLists));
    
                let weeklyTweet = "週間ランキング\n" 
                + "1. " + tweetTitleTruncate(rankingLists.weekly.rank1.title) + "\n" + rankingLists.weekly.rank1.uri + "\n" 
                + "2. " + tweetTitleTruncate(rankingLists.weekly.rank2.title) + "\n" + rankingLists.weekly.rank2.uri + "\n" 
                + "3. " + tweetTitleTruncate(rankingLists.weekly.rank3.title) + "\n" + rankingLists.weekly.rank3.uri;
    
                console.log(weeklyTweet + "\n");
    
                tweetPostStatUpdate(weeklyTweet);
    
                console.log("----------------\n");
            });
        }        
    }

    else{
        let rankingLists = JSON.parse(fs.readFileSync(processedRankingFilePath));

        let weeklyTweet = "週間ランキング\n" 
        + "1. " + tweetTitleTruncate(rankingLists.weekly.rank1.title) + "\n" + rankingLists.weekly.rank1.uri + "\n" 
        + "2. " + tweetTitleTruncate(rankingLists.weekly.rank2.title) + "\n" + rankingLists.weekly.rank2.uri + "\n" 
        + "3. " + tweetTitleTruncate(rankingLists.weekly.rank3.title) + "\n" + rankingLists.weekly.rank3.uri;

        console.log(weeklyTweet + "\n");

        tweetPostStatUpdate(weeklyTweet);

        console.log("----------------\n");               
    }
}

function dailyRankingTweet(rankingFilePath){ 
    let processedRankingFilePath = "~/miku_twitter_bot/rank_data_proceeded/vocaloid_ranking" + moment().utc().format("_YYYY_MM_DD_HH") + ".json";
    if (!fs.existsSync(processedRankingFilePath)){
        try{
            let rankingLists = getRankingLists(rankingFilePath);
            if (rankingLists instanceof Error){
                throw(rankingLists);
            }         
            fs.writeFileSync(processedRankingFilePath, JSON.stringify(rankingLists));

            let dailyTweet = "24時間ランキング\n" 
            + "1. " + tweetTitleTruncate(rankingLists.daily.rank1.title) + "\n" + rankingLists.daily.rank1.uri + "\n" 
            + "2. " + tweetTitleTruncate(rankingLists.daily.rank2.title) + "\n" + rankingLists.daily.rank2.uri + "\n" 
            + "3. " + tweetTitleTruncate(rankingLists.daily.rank3.title) + "\n" + rankingLists.daily.rank3.uri;

            console.log(dailyTweet + "\n");

            tweetPostStatUpdate(dailyTweet);

            console.log("----------------\n");
        }
        catch(error){
            console.error(error.message);
            rankingPageRequestWithSingleTweetRetry(rankingFilePath, () => {
                let rankingLists = getRankingLists(rankingFilePath);
                if (rankingLists instanceof Error){
                    throw(rankingLists);
                }         
                fs.writeFileSync(processedRankingFilePath, JSON.stringify(rankingLists));
    
                let dailyTweet = "24時間ランキング\n" 
                + "1. " + tweetTitleTruncate(rankingLists.daily.rank1.title) + "\n" + rankingLists.daily.rank1.uri + "\n" 
                + "2. " + tweetTitleTruncate(rankingLists.daily.rank2.title) + "\n" + rankingLists.daily.rank2.uri + "\n" 
                + "3. " + tweetTitleTruncate(rankingLists.daily.rank3.title) + "\n" + rankingLists.daily.rank3.uri;
    
                console.log(dailyTweet + "\n");
    
                tweetPostStatUpdate(dailyTweet);
    
                console.log("----------------\n");
            });
        }        
    }

    else{
        let rankingLists = JSON.parse(fs.readFileSync(processedRankingFilePath));

        let dailyTweet = "24時間ランキング\n" 
        + "1. " + tweetTitleTruncate(rankingLists.daily.rank1.title) + "\n" + rankingLists.daily.rank1.uri + "\n" 
        + "2. " + tweetTitleTruncate(rankingLists.daily.rank2.title) + "\n" + rankingLists.daily.rank2.uri + "\n" 
        + "3. " + tweetTitleTruncate(rankingLists.daily.rank3.title) + "\n" + rankingLists.daily.rank3.uri;

        console.log(dailyTweet + "\n");

        tweetPostStatUpdate(dailyTweet);

        console.log("----------------\n");               
    }
}

function hourlyRankingTweet(rankingFilePath){
    let processedRankingFilePath = "~/miku_twitter_bot/rank_data_proceeded/vocaloid_ranking" + moment().utc().format("_YYYY_MM_DD_HH") + ".json";
    if (!fs.existsSync(processedRankingFilePath)){
        try{
            let rankingLists = getRankingLists(rankingFilePath);
            if (rankingLists instanceof Error){
                throw(rankingLists);
            }
            fs.writeFileSync(processedRankingFilePath, JSON.stringify(rankingLists));

            let hourlyTweet = "毎時ランキング\n" 
            + "1. " + tweetTitleTruncate(rankingLists.hourly.rank1.title) + "\n" + rankingLists.hourly.rank1.uri + "\n" 
            + "2. " + tweetTitleTruncate(rankingLists.hourly.rank2.title) + "\n" + rankingLists.hourly.rank2.uri + "\n" 
            + "3. " + tweetTitleTruncate(rankingLists.hourly.rank3.title) + "\n" + rankingLists.hourly.rank3.uri;

            console.log(hourlyTweet + "\n");

            tweetPostStatUpdate(hourlyTweet);

            console.log("----------------\n");
        }
        catch (error){
            console.error(error.message);
            rankingPageRequestWithSingleTweetRetry(rankingFilePath, () => {
                let rankingLists = getRankingLists(rankingFilePath);
                if (rankingLists instanceof Error){
                    throw(rankingLists);
                }
                fs.writeFileSync(processedRankingFilePath, JSON.stringify(rankingLists));
    
                let hourlyTweet = "毎時ランキング\n" 
                + "1. " + tweetTitleTruncate(rankingLists.hourly.rank1.title) + "\n" + rankingLists.hourly.rank1.uri + "\n" 
                + "2. " + tweetTitleTruncate(rankingLists.hourly.rank2.title) + "\n" + rankingLists.hourly.rank2.uri + "\n" 
                + "3. " + tweetTitleTruncate(rankingLists.hourly.rank3.title) + "\n" + rankingLists.hourly.rank3.uri;
    
                console.log(hourlyTweet + "\n");
    
                tweetPostStatUpdate(hourlyTweet);
    
                console.log("----------------\n");
            });
        }        
    }

    else{
        let rankingLists = JSON.parse(fs.readFileSync(processedRankingFilePath));

        let hourlyTweet = "毎時ランキング\n" 
        + "1. " + tweetTitleTruncate(rankingLists.hourly.rank1.title) + "\n" + rankingLists.hourly.rank1.uri + "\n" 
        + "2. " + tweetTitleTruncate(rankingLists.hourly.rank2.title) + "\n" + rankingLists.hourly.rank2.uri + "\n" 
        + "3. " + tweetTitleTruncate(rankingLists.hourly.rank3.title) + "\n" + rankingLists.hourly.rank3.uri;

        console.log(hourlyTweet + "\n");

        tweetPostStatUpdate(hourlyTweet);

        console.log("----------------\n");               
    }
}


schedule.scheduleJob('0 * * * *', rankingTweetUpdater);
rankingTweetUpdater();