import twitterUser from "../utilities/twitterUser";

const tweetPostStat = async (message: string) => {
    await twitterUser.post("statuses/update", { status: message });
}

export default tweetPostStat;
