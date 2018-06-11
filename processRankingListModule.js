const fs = require("fs");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const moment = require("moment-timezone");

const createRankingList = function (RankingHtmlList){
    const rankingList = {};
    
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

const getRankingLists = function (rankingFilePath){
    if (fs.existsSync(rankingFilePath)){
        const file = fs.readFileSync(rankingFilePath);  
        const dom = new JSDOM(file);
        const rankingHtmlLists = dom.window.document.getElementById("wrapper")
                            .getElementsByClassName("ranking_cnt clearfix").item(0)
                            .querySelectorAll("li");
        
        const hourlyRankingHtmlList = rankingHtmlLists.item(0).getElementsByClassName("box");
        const dailyRankingHtmlList = rankingHtmlLists.item(1).getElementsByClassName("box");
        const weeklyRankingHtmlList = rankingHtmlLists.item(2).getElementsByClassName("box");
        const monthlyRankingHtmlList = rankingHtmlLists.item(3).getElementsByClassName("box");

        const hourlyRankingList = createRankingList(hourlyRankingHtmlList);
        const dailyRankingList = createRankingList(dailyRankingHtmlList);
        const weeklyRankingList = createRankingList(weeklyRankingHtmlList);
        const monthlyRankingList = createRankingList(monthlyRankingHtmlList);
        
        const rankingLists = {
            "hourly": hourlyRankingList,
            "daily": dailyRankingList,
            "weekly": weeklyRankingList,
            "monthly": monthlyRankingList,
            "lastUpdated": moment().utc().format()
        };

        return rankingLists;
    }
    
    else {
        const error = new Error(String(rankingFilePath) + " does not exist!");
        return error;
    }
}

exports.getRankingLists = getRankingLists;
