const API_METHODS = require('./api-methods');

const MODEL = {

    // Bind all functions
    bindAll: function (obj, bindObj) {
        for (let item in obj) {
            if (typeof obj[item] == 'function') {
                obj[item] = obj[item].bind(bindObj);
            }
        }
    },

    // Get list with information about summoners matches
    getMatchInfoList: async function (summonerMatchList, platform, response) {

        if (summonerMatchList === false) {
            return false;
        }

        let matchesInfo = [];

        for (let item of summonerMatchList.matches) {
            let singleMatchInfo = await API_METHODS.getData(API_METHODS.apiPath.getMatchInfoByMatchID(item.gameId, platform), 'currentMatch', response);
            if (singleMatchInfo) {
                matchesInfo.push(singleMatchInfo);
            } else {
                matchesInfo = false;
                break;
            }
        }

        return matchesInfo;

    },

    // Get data from API and convert to object for sending to front-end
    getSummonerInfo: function (summonerData, championsData) {

        const summonerInfo = {};

        function getChampionName(championsData, currentChampionID) {
            for (let champion in championsData) {
                championsData[champion].key = Number(championsData[champion].key);
                if (championsData[champion].key === currentChampionID) {
                    return championsData[champion].id;
                }
            }
        }

        for (let summoner in summonerData) {

            // Запишем имя призывателя в новый объект
            summonerInfo[summonerData[summoner].summonerInfo.name] = {
                'summonerName': summonerData[summoner].summonerInfo.name,
                'matches': [],
            }

            // Вытаскиваем данные об играх
            summonerData[summoner].matchesInfo.forEach(function(match, id, matchesInfo) {

                // participantId текушего игрока
                let currentSummonerId = 0;

                // Перебираем игроков матча и ищем participantId текущего игрока
                match.participantIdentities.forEach(function (player, id, participantIdentities) {
                    if (player.player.summonerName === summonerData[summoner].summonerInfo.name) {
                        currentSummonerId = player.participantId;
                    }
                })

                match.participants.forEach(function (playerInfo, id, participants) {
                    if (playerInfo.participantId === currentSummonerId) {

                        summonerInfo[summonerData[summoner].summonerInfo.name].matches.push({
                            'gameCreation':             match.gameCreation,
                            'gameDuration':             match.gameDuration,
                            'championName':             getChampionName(championsData, playerInfo.championId),
                            'win':                      playerInfo.stats.win,
                            'kills':                    playerInfo.stats.kills,
                            'deaths':                   playerInfo.stats.deaths,
                            'assists':                  playerInfo.stats.assists,
                            'totalMinionsKilled':       playerInfo.stats.totalMinionsKilled,
                            'neutralMinionsKilled':     playerInfo.stats.neutralMinionsKilled,
                            'visionWardsBoughtInGame':  playerInfo.stats.visionWardsBoughtInGame,
                        })
                    }
                })

            })

        }

        return summonerInfo;
    },

    getDataFromRiotAPI: async function(response, summonerName, platform) {
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
    },

    getSummonerData: async function (array, response) {
        let outputAPI = {};
        for (let item of array) {
            outputAPI[item.name] = await this.getDataFromRiotAPI(response, item.name, item.platform);
            if (!outputAPI[item.name]) {
                return false;
            }
        }
        return outputAPI;
    },

    getChampionsData: async function (response) {
        let championsData = await API_METHODS.getData('http://ddragon.leagueoflegends.com/cdn/11.13.1/data/en_US/champion.json', 'championsData', response);
        return championsData;
    }

}

MODEL.bindAll(MODEL, MODEL);
module.exports = MODEL;