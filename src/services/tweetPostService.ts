import twitterClient from "../utilities/twitterClient";

const tweetStat = async (message: string) => {
    await twitterClient.post("statuses/update", { status: message });
}

const tweetThread = async (thread: string[]) => {
    let lastTweetID = "";
    for (const status of thread) {
        const tweet = await twitterClient.post("statuses/update", {
            status: status,
            in_reply_to_status_id: lastTweetID,
            auto_populate_reply_metadata: true
        });
        lastTweetID = tweet.id_str;
    }
}

export { tweetStat, tweetThread };
