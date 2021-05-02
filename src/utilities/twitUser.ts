import Twit from "twit";
require("dotenv").config("../.env");

interface TwitterAuth {
    consumer_key: string;
    consumer_secret: string;
    access_token: string;
    access_token_secret: string;
}

const twitAuth: TwitterAuth = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY!,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET!,
    access_token: process.env.TWITTER_ACCESS_TOKEN!,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
};

const twit = new Twit(twitAuth);

export default twit;
