import getRankingData from "../services/rankingScraperService"
import rankingTweet from "../services/tweetRankingService"
import Term from "../common/Term";

const rankingTweetUpdater = (requestedTerms: Term[]): void => {
    for (let i = 0; i < requestedTerms.length; i++) {
        getRankingData(requestedTerms[i]).then((processedRanking) => {
            setTimeout(() => { rankingTweet(processedRanking, requestedTerms[i]) }, i * 60 * 1000);
        }).catch((err) => {
            console.error(err);
        });
    }
}

export default rankingTweetUpdater;
