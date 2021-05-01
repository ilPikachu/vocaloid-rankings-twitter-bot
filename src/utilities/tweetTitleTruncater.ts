const tweetTitleTruncater = (title: string): string => {
    if (title.length > 31) {
        return title.substring(0, 30) + "…";
    } else {
        return title;
    }
};
export default tweetTitleTruncater;
