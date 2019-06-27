"use strict"

const schedule = require("node-schedule");
const twitUser = require("./services/twitObjectGeneratorService");
const postRankingsController = require("./controllers/post_rankings/postRankingsController");
const followBackUsersController = require("./controllers/follow_back_users/followBackUsersController");
const directMessageReplyController= require("./controllers/direct_message_reply/directMessageReplyController");

const stream = twitUser.stream("user");

const requestHoulyAndDailyRankings = ["daily", "hourly"];
//const requestWeeklyRankings = ["weekly"];
//const requestMonthlyRankings = ["monthly"];

stream.on("follow", followBackUsersController.followBack);

stream.on("direct_message", directMessageReplyController.directMessageReply);

schedule.scheduleJob({minute: 0}, () => {
    postRankingsController.rankingTweetUpdater(requestHoulyAndDailyRankings);
});

// Removed due to removal of Weekly and Monthly rankings on http://ex.nicovideo.jp/vocaloid/ranking 
/*
// Based on UTC, 17:02 Monday and Friday, 23 UTC = 8 JST , 12 UTC = 21 JST.
schedule.scheduleJob({minute: 2, hour: [23, 12]}, () => {
    postRankingsController.rankingTweetUpdater(requestWeeklyRankings);
});

// Based on UTC, 17:03 Friday,12 UTC = 21 JST.
schedule.scheduleJob({minute: 3, hour: [12], dayOfWeek:[1,3,5,0]}, () => {
    postRankingsController.rankingTweetUpdater(requestMonthlyRankings);
});
*/