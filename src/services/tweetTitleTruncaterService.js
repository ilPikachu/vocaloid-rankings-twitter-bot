"use strict";

module.exports = {
    tweetTitleTruncater: (title) => {
        //availble characters: 280 - 3*23 (three links) - 6 (6 new line char) - 2*3 (1. 2. 3. char) - (8*2+1) (title for each ranking) = 182
        //truncate within 30 characters, floor(182 / 3 / 2 ) = 30
        if (title.length > 29){
            return title.substring(0, 29);
        }else{
            return title;
        }
    }
};
