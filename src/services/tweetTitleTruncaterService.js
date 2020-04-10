"use strict";

module.exports = {
    tweetTitleTruncater: (title) => {
        // Availble characters: 
        // 280 - 3*23 (three links) - 6 (6 new line chars) - 4*3 ("1位. ", "2位. ", "3位. ") - 11 (max rank title) - 13 (timestamp) = 169
        // truncate within 56 characters, floor(169 / 3) = 56
        if (title.length > 56){
            return title.substring(0, 56);
        }else{
            return title;
        }
    }
};
