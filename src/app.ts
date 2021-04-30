import schedule = require("node-schedule");
import postRankingsController = require("./controllers/postRankingsController");
import { Term } from "./common/term";

const houlyAndDailyTerms = [Term.DAILY, Term.HOURLY];

schedule.scheduleJob({minute: 0}, () => {
    postRankingsController.rankingTweetUpdater(houlyAndDailyTerms);
});
