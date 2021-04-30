"use strict";

module.exports = {
    tweetTitleTruncater: (title) => {
        if (title.length > 31){
            return title.substring(0, 30) + "…";
        }else{
            return title;
        }
    }
};
