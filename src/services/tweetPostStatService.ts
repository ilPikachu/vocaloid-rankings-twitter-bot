import twitUser from "../utilities/twitUser";

const tweetPostStat = async (message: string) => {
    await twitUser.post("statuses/update", { status: message });
}

export default tweetPostStat;
