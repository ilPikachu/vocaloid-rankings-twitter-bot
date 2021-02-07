"use strict";

module.exports = {
    tweetTitleTruncater: (title) => {
        if (title.length > 34){
            return title.substring(0, 33) + "…";
        }else{
            return title;
        }
    }
};
