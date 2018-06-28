"use strict";

module.exports = {
    tweetTitleTruncater: (title) => {
        //truncate within 28 characters, 98 base characters, 14 time unque string, floor((280 - 98 - 14) / 3) / 2 = 28
        if (title.length > 28){
            return title.substring(0, 28);
        }else{
            return title;
        }
    }
};
