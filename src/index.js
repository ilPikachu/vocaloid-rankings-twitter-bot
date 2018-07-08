"use strict"

const schedule = require("node-schedule");
const twitUser = require("./services/twitObjectGeneratorService");
const postRankingsController = require("./controllers/post_rankings/postRankingsController");
const followBackUsersController = require("./controllers/follow_back_users/followBackUsersController");
const directMessageReplyController= require("./controllers/direct_message_reply/directMessageReplyController");

const stream = twitUser.stream("user");

const requestHoulyAndDailyRankings = ["daily", "hourly"];
const requestWeeklyRankings = ["weekly"];
const requestMonthlyRankings = ["monthly"];

stream.on("follow", followBackUsersController.followBack);

stream.on("direct_message", directMessageReplyController.directMessageReply);

schedule.scheduleJob({minute: 0}, () => {
    postRankingsController.rankingTweetUpdater(requestHoulyAndDailyRankings);
});

// Based on UTC, 17:02 Monday and Friday, 8 UTC = 17 JST , 11 UTC = 20 JST, 13 UTC = 22 JST.
schedule.scheduleJob({minute: 2, hour: [8, 11, 13], dayOfWeek:[1,5]}, () => {
    postRankingsController.rankingTweetUpdater(requestWeeklyRankings);
});

// Based on UTC, 17:03 Friday, 8 UTC = 17 JST , 11 UTC = 20 JST, 13 UTC = 22 JST.
schedule.scheduleJob({minute: 3, hour: [8, 11, 13], dayOfWeek:[5]}, () => {
    postRankingsController.rankingTweetUpdater(requestMonthlyRankings);
});
