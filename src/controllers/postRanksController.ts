import moment from "moment-timezone";
import pRetry from "p-retry";
import getRanks from "../services/getRanksService"
import tweetRanks from "../services/tweetRanksService"
import Term from "../common/Term";
import sleep from "../utilities/sleep";

const tweetDelay = 10 * 1000;

const ranksTweetUpdate = async (term: Term, tweetDelay: number): Promise<void> => {
    const ranks = await getRanks(term);
    await sleep(tweetDelay);
    await tweetRanks(ranks, term);
}

const ranksTweetUpdateExpoBackoff = (term: Term, tweetDelay: number): Promise<void> => {
    return pRetry(() => ranksTweetUpdate(term, tweetDelay), {
        onFailedAttempt: error => {
            console.error(`${moment().utc().format()} ${term} Rank tweet attempt ${error.attemptNumber} failed. ${error}`);
        },
        retries: 3
    });
}

const ranksTweetUpdater = (requestedTerms: Term[]) => {
    const rankPromises: Promise<void>[] = [];
    requestedTerms.forEach((term, index) => rankPromises.push(ranksTweetUpdateExpoBackoff(term, index * tweetDelay)));
    Promise.allSettled(rankPromises);
}

export default ranksTweetUpdater;
