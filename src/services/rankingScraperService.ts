import moment from "moment-timezone";
import request from "request";
import Term from "../common/Term";
import RankList from "../common/RankList";
import getRankingLists from "./rankingParserService";
import logFailure from "../utilities/log";

const getRankingData = (term: Term): Promise<RankList> => {
    const rankingUrl = `https://www.nicovideo.jp/ranking/genre/music_sound?term=${term}&tag=VOCALOID&rss=2.0&lang=ja-jp`;

    return new Promise((resolve, reject) => {
        request(rankingUrl, (error, response, body) => {
            const currentTime = moment().utc().format();
            if (!!error){
                logFailure(`${currentTime} Rank Fetch Failure.`, error.name, error.message);
                setTimeout(() => {getRankingDataRetry(rankingUrl).then((rankingList) => {
                    resolve(rankingList);
                }).catch((err) => {
                    reject(err);
                })}, 10*1000);  
            }
            else if (response.statusCode === 200){
                getRankingLists(body).then((rankingList) => {
                    resolve(rankingList);
                }).catch((err) => {
                    reject(err);
                })
            }
            else{
                logFailure(`${currentTime} Rank Fetch Failure. ${response.statusCode}`);
                setTimeout(() => {getRankingDataRetry(rankingUrl).then((rankingList) => {
                    resolve(rankingList);
                }).catch((err) => {
                    reject(err);
                })}, 10*1000);  
            }   
        });
    });
}

const getRankingDataRetry = (rankingUrl: string): Promise<RankList> => {
    return new Promise((resolve, reject) => {
        request(rankingUrl, (error, response, body) => {
            const currentTime = moment().utc().format();
            if (!!error){
                const message = `${currentTime} Retry Rank Fetch Failure.`;
                logFailure(message, error.name, error.message);
                reject(message);            
            }
            else if (response.statusCode === 200){
                console.log(`${currentTime} Retry Rank Fetch Success`);
                getRankingLists(body).then((rankingList) => {
                    resolve(rankingList);
                }).catch((err) => {
                    reject(err);
                })
            }
            else{
                const message = `${currentTime} Retry Rank Fetch Failure. ${response.statusCode}`;
                logFailure(message);
                reject(message);            
            }   
        });
    });
};

export default getRankingData;
