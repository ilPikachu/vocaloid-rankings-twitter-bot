"use strict";

module.exports = {
    tweetTitleTruncater: (title) => {
        if (title.length > 30){
            return title.substring(0, 29) + "…";
        }else{
            return title;
        }
    }
};
