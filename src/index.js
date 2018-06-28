"use strict"

const schedule = require("node-schedule");
const twitUser = require("./modules/twit_object_generator/twitObjectGeneratorModule");
const postRankingsController = require("./controllers/post_rankings/postRankingsController");
const followBackUsersController = require("./controllers/follow_back_users/followBackUsersController");
const directMessageReplyController= require("./controllers/direct_message_reply/directMessageReplyController");

const stream = twitUser.stream("user");

stream.on("follow", followBackUsersController.followBack);

stream.on("direct_message", directMessageReplyController.directMessageReply);

schedule.scheduleJob('0 * * * *', postRankingsController.rankingTweetUpdater);
