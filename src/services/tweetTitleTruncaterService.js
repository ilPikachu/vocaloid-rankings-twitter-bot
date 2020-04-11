"use strict";

module.exports = {
    tweetTitleTruncater: (title) => {
        // Availble characters: 
        // 280 - 3*23 (three links) - 7 (7 new line chars) - 4*3 ("1位. ", "2位. ", "3位. ") - 11 (max rank title) - 13 (timestamp) - 14(hashtags) = 154
        // truncate within 51 characters, floor(154 / 3) = 51
        if (title.length > 51){
            return title.substring(0, 48) + "...";
        }else{
            return title;
        }
    }
};
