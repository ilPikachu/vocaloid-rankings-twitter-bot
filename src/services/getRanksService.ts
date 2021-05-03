import axios from "axios";
import Term from "../interfaces/Term";
import RankList from "../interfaces/RankList";
import getParsedRanks from "./parseRanksService";

const getRanks = async (term: Term): Promise<RankList> => {
    const rankingUrl = `https://www.nicovideo.jp/ranking/genre/music_sound?term=${term}&tag=VOCALOID&rss=2.0&lang=ja-jp`;
    const response = await axios.get(rankingUrl);
    const parsedRanks = await getParsedRanks(response.data);
    return parsedRanks;
}

export default getRanks;
