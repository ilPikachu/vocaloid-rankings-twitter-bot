import moment from "moment-timezone";
import request from "request";
import Term from "../common/Term";
import RankList from "../common/RankList";
import getParsedRanks from "./parseRanksService";
import logFailure from "../utilities/log";

const getRanks = (term: Term): Promise<RankList> => {
    const rankingUrl = `https://www.nicovideo.jp/ranking/genre/music_sound?term=${term}&tag=VOCALOID&rss=2.0&lang=ja-jp`;

    return new Promise((resolve, reject) => {
        request(rankingUrl, (error, response, body) => {
            const currentTime = moment().utc().format();
            if (!!error){
                logFailure(`${currentTime} Rank Fetch Failure.`, error.name, error.message);
                setTimeout(() => {getRanksRetry(rankingUrl).then((pasedRanks) => {
                    resolve(pasedRanks);
                }).catch((err) => {
                    reject(err);
                })}, 10*1000);  
            }
            else if (response.statusCode === 200){
                getParsedRanks(body).then((pasedRanks) => {
                    resolve(pasedRanks);
                }).catch((err) => {
                    reject(err);
                })
            }
            else{
                logFailure(`${currentTime} Rank Fetch Failure. ${response.statusCode}`);
                setTimeout(() => {getRanksRetry(rankingUrl).then((pasedRanks) => {
                    resolve(pasedRanks);
                }).catch((err) => {
                    reject(err);
                })}, 10*1000);  
            }   
        });
    });
}

const getRanksRetry = (rankingUrl: string): Promise<RankList> => {
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
                getParsedRanks(body).then((pasedRanks) => {
                    resolve(pasedRanks);
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

export default getRanks;
