interface Rank {
    rank: number;
    uri: string;
    title: string;
}

interface RankList {
    ranks: {
        [key: string]: Rank
    };
    lastUpdated: string;
}

export default RankList
