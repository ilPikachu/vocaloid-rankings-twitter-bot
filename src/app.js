"use strict"

const schedule = require("node-schedule");
const postRankingsController = require("./controllers/postRankingsController");
const Term = require("./common/term");

const houlyAndDailyTerms = [Term.DAILY, Term.HOURLY];

schedule.scheduleJob({minute: 0}, () => {
    postRankingsController.rankingTweetUpdater(houlyAndDailyTerms);
});
