"use strict";

const moment = require("moment-timezone");
const xml2js = require('xml2js');

const createRankingList = (rssRankingList) => {
    const rankingList = {
        "lastUpdated": moment().utc().format()
    };
    
    for (let i = 0; i < rssRankingList.length; i++){
        rankingList["rank" + String(i + 1)] = {};
        rankingList["rank" + String(i + 1)]["rank"] = i+1;
        rankingList["rank" + String(i + 1)]["uri"] = rssRankingList[i].link[0];
        rankingList["rank" + String(i + 1)]["title"] = rssRankingList[i].title[0];
    }
    
    return rankingList;
};

module.exports = {
    getRankingLists: (body) => {
        return new Promise((resolve, reject) => {
            xml2js.parseStringPromise(body).then((result) => {
                resolve(createRankingList(result.rss.channel[0].item));
            }).catch((err) => {
                reject(err);
            });
        });
    }
}