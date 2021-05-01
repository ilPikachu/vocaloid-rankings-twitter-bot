import moment from "moment-timezone";
import xml2js from "xml2js";
import RankList from "../common/RankList"

interface RssRank {
    title: string[];
    link: string[];
    guid: unknown;
    pubDate: string[];
    description: string[];
}

const createRankingList = (rssRankingList: RssRank[]) => {
    const rankingList: RankList = {
        ranks: {},
        lastUpdated: moment().utc().format(),
    };

    for (let i = 0; i < rssRankingList.length; i++) {
        rankingList.ranks["rank" + String(i + 1)] = {
            rank: i + 1,
            uri: rssRankingList[i].link[0].split('?')[0],
            title: rssRankingList[i].title[0],
        };
    }

    return rankingList;
};

const getRankingLists = (body: any): Promise<RankList> => {
    return new Promise((resolve, reject) => {
        xml2js.parseStringPromise(body).then((result) => {
            resolve(createRankingList(result.rss.channel[0].item));
        }).catch((err) => {
            reject(err);
        });
    });
}

export default getRankingLists;
