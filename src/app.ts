import schedule from "node-schedule";
import ranksTweetUpdater from "./controllers/postRanksController";
import Term from "./interfaces/Term";

schedule.scheduleJob({ minute: 0 }, () => ranksTweetUpdater([Term.DAILY, Term.HOURLY]));
