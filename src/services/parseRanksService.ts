import moment from "moment-timezone";
import xml2js from "xml2js";
import RankList from "../interfaces/RankList"

interface RssRank {
    title: string[];
    link: string[];
    guid: unknown;
    pubDate: string[];
    description: string[];
}

const parseRanks = (rssRankList: RssRank[]) => {
    const pasedRanks: RankList = {
        ranks: {},
        lastUpdated: moment().utc().format(),
    };

    for (let i = 0; i < rssRankList.length; i++) {
        pasedRanks.ranks["rank" + String(i + 1)] = {
            rank: i + 1,
            uri: rssRankList[i].link[0].split('?')[0],
            title: rssRankList[i].title[0],
        };
    }

    return pasedRanks;
};

const getParsedRanks = async (body: any): Promise<RankList> => {
    const result = await xml2js.parseStringPromise(body);
    return parseRanks(result.rss.channel[0].item);
}

export default getParsedRanks;
