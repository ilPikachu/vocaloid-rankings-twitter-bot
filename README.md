# <img src="https://user-images.githubusercontent.com/25991364/120397947-4719e980-c307-11eb-9747-26d383538195.jpeg" width="20" height="20"> Vocaloid Rankings Twitter Bot 

[![Twitter Follow](https://img.shields.io/twitter/follow/voca_ranking.svg?style=social&label=Follow)](https://twitter.com/voca_ranking)
[![License](https://img.shields.io/github/license/ilPikachu/vocaloid-rankings-twitter-bot)](https://github.com/ilPikachu/vocaloid-rankings-twitter-bot/blob/master/LICENSE)

The Vocaloid Rankings Twitter Bot post Vocaloid music rankings from Niconico every hour.

It lets people discover the latest trending Vocaloid songs and help Vocaloid content creators to self-promote their songs to reach a wider audience.

## To start
- Create `secrets.json` under `src` with your twitter app auth
```
{
    "TWITTER_CONSUMER_KEY": "...",
    "TWITTER_CONSUMER_SECRET": "...",
    "TWITTER_ACCESS_TOKEN": "...",
    "TWITTER_ACCESS_TOKEN_SECRET": "..."
}
```
- In `npm start`, change all occurance of `~/Documents/vocaloid-rankings-twitter-bot/` to the cloned project directory
- Create `logs` directory under project directory
- `npm install`
- `npm start`
