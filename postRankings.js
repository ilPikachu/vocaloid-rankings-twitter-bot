"use strict";

const Twit = require("twit");
const fs = require("fs");
const request = require("request");
const moment = require('moment');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const schedule = require('node-schedule');

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
    let file = fs.readFileSync(rankingFilePath);  
    //let file = fs.readFileSync("./rank_data/vocaloid_ranking_2017_12_24_05.html");  //"./rank_data/vocaloid_ranking_2017_12_24_05.html"    
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

function tweetPostStatUpdate(message){
    let secrets = JSON.parse(fs.readFileSync("./utilities/secrets.json"));
    
    let twitAuth = {
        consumer_key:         secrets.twitter.consumer_key,
        consumer_secret:      secrets.twitter.consumer_secret,
        access_token:         secrets.twitter.access_token,
        access_token_secret:  secrets.twitter.access_token_secret
    };
    
    let twitUser = new Twit(twitAuth);
            
    twitUser.post("statuses/update", { status: message }, (err, data, response) => {
        if (response.statusCode === 200){
            console.log("Tweet successful: " + response.statusCode)
        }
    
        else{
            console.log(moment().utc().format() + " Tweet failed. Status code: " + response.statusCode);
        }
    });
}

function tweetTitleTruncate(title){
    //truncate within 30 characters, 98 base characters, floor((280 - 98) / 3) / 2 = 30
    if (title.length > 30){
        return title.substring(0, 30);
    }
    else{
        return title;
    }
}

function rankingTweetUpdater(){
    let rankingFilePath = "./rank_data/vocaloid_ranking" + moment().utc().format("_YYYY_MM_DD_HH") + ".html";    
    if (!fs.existsSync(rankingFilePath)){
        request("http://ex.nicovideo.jp/vocaloid/ranking", (error, response, body) => {
            if (response.statusCode === 200){
                fs.writeFileSync(rankingFilePath, body);
                monthlyRankingTweet(rankingFilePath);                
                setTimeout((rankingFilePath) => {weeklyRankingTweet(rankingFilePath)}, 60*1000);
                setTimeout((rankingFilePath) => {dailyRankingTweet(rankingFilePath)}, 2*60*1000);                
                setTimeout((rankingFilePath) => {hourlyRankingTweet(rankingFilePath)}, 3*60*1000);                                
            }

            else{
                console.log(moment().utc().format() + " Ranking page fetch failure. Status code: " + response.statusCode);
            }   
        });
    }
    else{
        monthlyRankingTweet(rankingFilePath);                
        setTimeout((rankingFilePath) => {weeklyRankingTweet(rankingFilePath)}, 60*1000);
        setTimeout((rankingFilePath) => {dailyRankingTweet(rankingFilePath)}, 2*60*1000);                
        setTimeout((rankingFilePath) => {hourlyRankingTweet(rankingFilePath)}, 3*60*1000);
    }
}

function monthlyRankingTweet(rankingFilePath){  
    let processedRankingFilePath = "./rank_data_proceeded/vocaloid_ranking" + moment().utc().format("_YYYY_MM_DD_HH") + ".json";
    if (!fs.existsSync(processedRankingFilePath)){
        let rankingLists = getRankingLists(rankingFilePath);        
        fs.writeFileSync(processedRankingFilePath, JSON.stringify(rankingLists));

        let monthlyTweet = "月間ランキング\n" 
        + "1. " + tweetTitleTruncate(rankingLists.monthly.rank1.title) + "\n" + rankingLists.monthly.rank1.uri + "\n" 
        + "2. " + tweetTitleTruncate(rankingLists.monthly.rank2.title) + "\n" + rankingLists.monthly.rank2.uri + "\n" 
        + "3. " + tweetTitleTruncate(rankingLists.monthly.rank3.title) + "\n" + rankingLists.monthly.rank3.uri;

        console.log(monthlyTweet + "\n");

        tweetPostStatUpdate(monthlyTweet);

        console.log("----------------\n");        
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
    let processedRankingFilePath = "./rank_data_proceeded/vocaloid_ranking" + moment().utc().format("_YYYY_MM_DD_HH") + ".json";
    if (!fs.existsSync(processedRankingFilePath)){
        let rankingLists = getRankingLists(rankingFilePath);        
        fs.writeFileSync(processedRankingFilePath, JSON.stringify(rankingLists));

        let weeklyTweet = "週間ランキング\n" 
        + "1. " + tweetTitleTruncate(rankingLists.weekly.rank1.title) + "\n" + rankingLists.weekly.rank1.uri + "\n" 
        + "2. " + tweetTitleTruncate(rankingLists.weekly.rank2.title) + "\n" + rankingLists.weekly.rank2.uri + "\n" 
        + "3. " + tweetTitleTruncate(rankingLists.weekly.rank3.title) + "\n" + rankingLists.weekly.rank3.uri;

        console.log(weeklyTweet + "\n");

        tweetPostStatUpdate(weeklyTweet);

        console.log("----------------\n");        
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
    let processedRankingFilePath = "./rank_data_proceeded/vocaloid_ranking" + moment().utc().format("_YYYY_MM_DD_HH") + ".json";
    if (!fs.existsSync(processedRankingFilePath)){
        let rankingLists = getRankingLists(rankingFilePath);        
        fs.writeFileSync(processedRankingFilePath, JSON.stringify(rankingLists));

        let dailyTweet = "24時間ランキング\n" 
        + "1. " + tweetTitleTruncate(rankingLists.daily.rank1.title) + "\n" + rankingLists.daily.rank1.uri + "\n" 
        + "2. " + tweetTitleTruncate(rankingLists.daily.rank2.title) + "\n" + rankingLists.daily.rank2.uri + "\n" 
        + "3. " + tweetTitleTruncate(rankingLists.daily.rank3.title) + "\n" + rankingLists.daily.rank3.uri;

        console.log(dailyTweet + "\n");

        tweetPostStatUpdate(dailyTweet);

        console.log("----------------\n");        
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
    let processedRankingFilePath = "./rank_data_proceeded/vocaloid_ranking" + moment().utc().format("_YYYY_MM_DD_HH") + ".json";
    if (!fs.existsSync(processedRankingFilePath)){
        let rankingLists = getRankingLists(rankingFilePath);        
        fs.writeFileSync(processedRankingFilePath, JSON.stringify(rankingLists));

        let hourlyTweet = "毎時ランキング\n" 
        + "1. " + tweetTitleTruncate(rankingLists.hourly.rank1.title) + "\n" + rankingLists.hourly.rank1.uri + "\n" 
        + "2. " + tweetTitleTruncate(rankingLists.hourly.rank2.title) + "\n" + rankingLists.hourly.rank2.uri + "\n" 
        + "3. " + tweetTitleTruncate(rankingLists.hourly.rank3.title) + "\n" + rankingLists.hourly.rank3.uri;

        console.log(hourlyTweet + "\n");

        tweetPostStatUpdate(hourlyTweet);

        console.log("----------------\n");        
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

schedule.scheduleJob('*/5 * * * *', rankingTweetUpdater);
