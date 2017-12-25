"use strict";

const Twit = require("twit");
const fs = require("fs");
const request = require("request");
const moment = require('moment');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;


let secrets = JSON.parse(fs.readFileSync("./utilities/secrets.json"));

let twitAuth = {
    consumer_key:         secrets.twitter.consumer_key,
    consumer_secret:      secrets.twitter.consumer_secret,
    access_token:         secrets.twitter.access_token,
    access_token_secret:  secrets.twitter.access_token_secret
};

//let twitUser = new Twit(twitAuth);

function rankingDataUpdater(){
    request("http://ex.nicovideo.jp/vocaloid/ranking", (error, response, body) => {
        if (response.statusCode === 200){
            fs.writeFileSync("./rank_data/vocaloid_ranking" + moment().utc().format("_YYYY_MM_DD_HH") + ".html", body);
        }

        else{
            console.log(moment().utc().format() + " Ranking page fetch failure. Status code: " + response.statusCode);
        }
    });
}

/*
let file = fs.readFileSync("./rank_data/vocaloid_ranking_2017_12_24_05.html");

const dom = new JSDOM(file);


console.log(dom.window.document.getElementById('wrapper')
            .getElementsByClassName('ranking_cnt clearfix')
            .item(0)
            .querySelectorAll('li')
            .item(1)
            .getElementsByClassName('box')
            .item(19)
            .getElementsByTagName("a")
            .item(0).href
);
*/

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
    
    return rankingList
}

function getRankingLists(){
    //let file = fs.readFileSync("./rank_data/vocaloid_ranking" + moment().utc().format("_YYYY_MM_DD_HH") + ".html");  //"./rank_data/vocaloid_ranking_2017_12_24_05.html"
    let file = fs.readFileSync("./rank_data/vocaloid_ranking_2017_12_24_05.html");  //"./rank_data/vocaloid_ranking_2017_12_24_05.html"    
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

    return rankingLists

}

let rankingLists = getRankingLists();
fs.writeFileSync("./rank_data_proceeded/vocaloid_ranking" + moment().utc().format("_YYYY_MM_DD_HH") + ".json", JSON.stringify(rankingLists));


//console.log(rankingLists);