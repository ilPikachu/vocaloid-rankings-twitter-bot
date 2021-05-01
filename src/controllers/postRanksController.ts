import getRanks from "../services/getRanksService"
import tweetRanks from "../services/tweetRanksService"
import Term from "../common/Term";

const ranksTweetUpdater = (requestedTerms: Term[]): void => {
    for (let i = 0; i < requestedTerms.length; i++) {
        getRanks(requestedTerms[i]).then((ranks) => {
            setTimeout(() => { tweetRanks(ranks, requestedTerms[i]) }, i * 60 * 1000);
        }).catch((err) => {
            console.error(err);
        });
    }
}

export default ranksTweetUpdater;
