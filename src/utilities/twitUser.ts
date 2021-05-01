import Twit from "twit";
import fs from "fs";

interface TwitterAuth {
    consumer_key: string;
    consumer_secret: string;
    access_token: string;
    access_token_secret: string;
}

const twitAuth: TwitterAuth = JSON.parse(fs.readFileSync(process.env.HOME + "/Documents/vocaloid-rankings-twitter-bot/src/utilities/secrets.json").toString());
const twit = new Twit(twitAuth);

export default twit;
