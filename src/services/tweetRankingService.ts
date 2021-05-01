import moment from "moment-timezone";
import tweetPostStatUpdate from "./tweetPostStatUpdateService";
import tweetTitleTruncater from "../utilities/tweetTitleTruncater";
import Term from "../common/Term";
import RankList from "../common/RankList";

const rankingTweet = (processedRanking: RankList, type: Term) => {
    let tweetTitle = "";
    switch (type) {
        case Term.HOURLY:
            tweetTitle = "毎時ランキング\n\n";
            break;
        case Term.DAILY:
            tweetTitle = "24時間ランキング\n\n";
            break;
        case Term.WEEKLY:
            tweetTitle = "週間ランキング\n\n";
            break;
        case Term.MONTHLY:
            tweetTitle = "月間ランキング\n\n";
            break;
        default:
            console.error("Ranking request not supported");
    }

    const tweet = tweetTitle
        + tweetTitleTruncater(processedRanking.ranks.rank3.title) + "\n" + processedRanking.ranks.rank3.uri + '\n'
        + tweetTitleTruncater(processedRanking.ranks.rank2.title) + "\n" + processedRanking.ranks.rank2.uri + "\n"
        + tweetTitleTruncater(processedRanking.ranks.rank1.title) + "\n" + processedRanking.ranks.rank1.uri + "\n\n"
        + moment().tz("Asia/Tokyo").format("YYYY-MM-DD-HH");

    tweetPostStatUpdate(tweet, type);
}

export default rankingTweet;
