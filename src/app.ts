import schedule from "node-schedule";
import ranksTweetUpdater from "./controllers/postRanksController";
import Term from "./common/Term";

const houlyAndDailyTerms = [Term.DAILY, Term.HOURLY];

schedule.scheduleJob({ minute: 0 }, () => {
    ranksTweetUpdater(houlyAndDailyTerms);
});
