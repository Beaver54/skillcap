const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();
const axios = require('axios');

// Import local modules
const CONFIG = require('./modules/config');
const API_METHODS = require('./modules/api-methods');
const MODEL = require('./modules/model');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "dist")));

app.post('/api/forecast', cors(CONFIG.corsOptions), async function (request, response) {

    let outputAPI = {};
    let championsData = [];

    async function getDataFromRiotAPI(response, summonerName, platform) {

        // let summonerData,
        //     summonerMatchList,
        //     matchesInfo;
        //
        // summonerData = await API_METHODS.getData(API_METHODS.apiPath.getBySummonerName(summonerName, platform), 'summonerInfo');
        // if (typeof summonerData !== 'number') {
        //     summonerMatchList = await API_METHODS.getData(API_METHODS.apiPath.getMatchListByAccountID(summonerData.accountId, platform, '', '420', '', '', '', '10', '0'), 'matchList');
        //     if (typeof summonerMatchList !== 'number') {
        //         matchesInfo = [];
        //         for (let item of summonerMatchList.matches) {
        //             let singleMatchInfo = await API_METHODS.getData(API_METHODS.apiPath.getMatchInfoByMatchID(item.gameId, platform), 'currentMatch');
        //             if (typeof singleMatchInfo !== 'number') {
        //                 matchesInfo.push(singleMatchInfo);
        //             }else {
        //                 return singleMatchInfo;
        //             }
        //         }
        //         return {
        //             platform: platform,
        //             summonerInfo: summonerData,
        //             summonerMatchList: summonerMatchList,
        //             matchesInfo: matchesInfo
        //         };
        //     } else {
        //         return summonerMatchList;
        //     }
        // } else {
        //     return summonerData;
        // }

        let summonerData = await API_METHODS.getData(API_METHODS.apiPath.getBySummonerName(summonerName, platform), 'summonerInfo', response);
        let summonerMatchList = await API_METHODS.getData(API_METHODS.apiPath.getMatchListByAccountID(summonerData.accountId, platform, '', '420', '', '', '', '10', '0'), 'matchList', response);
        let matchesInfo = await MODEL.getMatchInfoList(summonerMatchList, platform, response);

        if (!summonerName || !summonerMatchList || !matchesInfo) {
            return false;
        } else {
            return {
                platform: platform,
                summonerInfo: summonerData,
                summonerMatchList: summonerMatchList,
                matchesInfo: matchesInfo
            };
        }

    }

    async function getSummonerData(array) {
        for (let item of array) {
            outputAPI[item.name] = await getDataFromRiotAPI(response, item.name, item.platform);
            if (!outputAPI[item.name]) {
                outputAPI = false;
                break;
            }
        }
        championsData = await API_METHODS.getData('http://ddragon.leagueoflegends.com/cdn/11.13.1/data/en_US/champion.json', 'championsData', response);
    }

    await getSummonerData(request.body);

    if (outputAPI) {
        response.send(MODEL.getSummonerInfo(outputAPI, championsData.data));
    }

});

app.listen(4001);