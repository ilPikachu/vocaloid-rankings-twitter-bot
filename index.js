"use strict";

const Twit = require("twit");
const fs = require("fs");
const request = require("request");
const moment = require('moment');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

function hourlyRankingTweetUpdater(){
    let rankingFilePath = "./rank_data/vocaloid_ranking" + moment().utc().format("_YYYY_MM_DD_HH") + ".html";    
    if (!fs.existsSync(rankingFilePath)){
        request("http://ex.nicovideo.jp/vocaloid/ranking", (error, response, body) => {
            if (response.statusCode === 200){
                fs.writeFileSync(rankingFilePath, body);
                hourlyRankingTweet(rankingFilePath);
            }

            else{
                console.log(moment().utc().format() + " Ranking page fetch failure. Status code: " + response.statusCode);
            }
        });
    }
    else{
        hourlyRankingTweet(rankingFilePath);
    }
}

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

function hourlyRankingTweet(rankingFilePath){
    
    let processedRankingFilePath = "./rank_data_proceeded/vocaloid_ranking" + moment().utc().format("_YYYY_MM_DD_HH") + ".json";
    if (!fs.existsSync(processedRankingFilePath)){
        let rankingLists = getRankingLists(rankingFilePath);        
        fs.writeFileSync(processedRankingFilePath, JSON.stringify(rankingLists));

        let hourlyTweet = "毎時ランキング Hourly: \n" 
        + "1. " + rankingLists.hourly.rank1.title + "\n" + rankingLists.hourly.rank1.uri + "\n" 
        + "2. " + rankingLists.hourly.rank2.title + "\n" + rankingLists.hourly.rank2.uri + "\n" 
        + "3. " + rankingLists.hourly.rank3.title + "\n" + rankingLists.hourly.rank3.uri;

        console.log(hourlyTweet + "\n");
        console.log("----------------\n");

        tweetPostStatUpdate(hourlyTweet);
    }

    else{
        let rankingLists = JSON.parse(fs.readFileSync(processedRankingFilePath));

        let hourlyTweet = "毎時ランキング Hourly: \n" 
        + "1. " + rankingLists.hourly.rank1.title + "\n" + rankingLists.hourly.rank1.uri + "\n" 
        + "2. " + rankingLists.hourly.rank2.title + "\n" + rankingLists.hourly.rank2.uri + "\n" 
        + "3. " + rankingLists.hourly.rank3.title + "\n" + rankingLists.hourly.rank3.uri;

        console.log(hourlyTweet + "\n");
        console.log("----------------\n");        

        tweetPostStatUpdate(hourlyTweet);
    }
    
    
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

hourlyRankingTweetUpdater();
setInterval(hourlyRankingTweetUpdater, 60*60*1000);