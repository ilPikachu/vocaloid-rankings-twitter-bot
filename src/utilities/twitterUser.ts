import Twitter, { TwitterOptions } from "twitter-lite"
import secrets from "../secrets.json"

const config: TwitterOptions = {
    consumer_key: secrets.TWITTER_CONSUMER_KEY,
    consumer_secret: secrets.TWITTER_CONSUMER_SECRET,
    access_token_key: secrets.TWITTER_ACCESS_TOKEN,
    access_token_secret: secrets.TWITTER_ACCESS_TOKEN_SECRET,
};

const twitter = new Twitter(config);

export default twitter;
