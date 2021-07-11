const API_METHODS = require('./api-methods');

const MODEL = {

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
                            'lane':                     playerInfo.timeline.lane,
                            'totalMinionsKilled':       playerInfo.stats.totalMinionsKilled,
                            'neutralMinionsKilled':     playerInfo.stats.neutralMinionsKilled,
                            'visionWardsBoughtInGame':  playerInfo.stats.visionWardsBoughtInGame,
                        })
                    }
                })

            })

        }

        return summonerInfo;
    }

}

module.exports = MODEL;