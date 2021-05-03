import moment from "moment-timezone";
import { tweetThread } from "./tweetPostService";
import tweetTitleTruncater from "../utilities/tweetTitleTruncater";
import Term from "../common/Term";
import RankList from "../common/RankList";

const tweetRanks = async (rankList: RankList, type: Term) => {
    await tweetThread(createRankThread(rankList, type));
    console.log(`${moment().utc().format()} ${type} Rank Tweet Successful`);
}

const createTweetTitle = (type: Term): string => {
    switch (type) {
        case Term.HOURLY:
            return "毎時ランキング\n\n";
        case Term.DAILY:
            return "24時間ランキング\n\n";
        default:
            console.error("Ranking request not supported");
            return "";
    }
}

const createRankThread = (rankList: RankList, type: Term): string[] => {
    const tweetTitle = createTweetTitle(type);
    const tweetTime = moment().tz("Asia/Tokyo").format("YYYY-MM-DD-HH");

    const firstTweet = tweetTitle
        + tweetTitleTruncater(rankList.ranks.rank3.title) + "\n" + rankList.ranks.rank3.uri + '\n'
        + tweetTitleTruncater(rankList.ranks.rank2.title) + "\n" + rankList.ranks.rank2.uri + "\n"
        + tweetTitleTruncater(rankList.ranks.rank1.title) + "\n" + rankList.ranks.rank1.uri + "\n\n"
        + tweetTime;

    const secondTweet = tweetTitle
        + tweetTitleTruncater(rankList.ranks.rank6.title) + "\n" + rankList.ranks.rank6.uri + '\n'
        + tweetTitleTruncater(rankList.ranks.rank5.title) + "\n" + rankList.ranks.rank5.uri + "\n"
        + tweetTitleTruncater(rankList.ranks.rank4.title) + "\n" + rankList.ranks.rank4.uri + "\n\n"
        + tweetTime;

    return [firstTweet, secondTweet];
}

export default tweetRanks;
