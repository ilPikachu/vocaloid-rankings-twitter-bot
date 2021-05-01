import schedule from "node-schedule";
import rankingTweetUpdater from "./controllers/postRankingsController";
import Term from "./common/Term";

const houlyAndDailyTerms = [Term.DAILY, Term.HOURLY];

schedule.scheduleJob({ minute: 0 }, () => {
    rankingTweetUpdater(houlyAndDailyTerms);
});
