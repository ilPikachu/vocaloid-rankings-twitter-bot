import moment from "moment-timezone";
import tweetPostStat from "./tweetPostStatService";
import tweetTitleTruncater from "../utilities/tweetTitleTruncater";
import Term from "../common/Term";
import RankList from "../common/RankList";

const tweetRanks = async (rankList: RankList, type: Term) => {
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
        + tweetTitleTruncater(rankList.ranks.rank3.title) + "\n" + rankList.ranks.rank3.uri + '\n'
        + tweetTitleTruncater(rankList.ranks.rank2.title) + "\n" + rankList.ranks.rank2.uri + "\n"
        + tweetTitleTruncater(rankList.ranks.rank1.title) + "\n" + rankList.ranks.rank1.uri + "\n\n"
        + moment().tz("Asia/Tokyo").format("YYYY-MM-DD-HH");
    
    await tweetPostStat(tweet);
    console.log(`${moment().utc().format()} ${type} Rank Tweet Successful`);
}

export default tweetRanks;
