const CONFIG = require('./config');
const axios = require('axios');

const API_METHODS = {

    // Generate a link
    apiPath: {

        // Create a link to summoner data by summoner name
        getBySummonerName: function (summonerName, platform) {
            return `https://${platform}/lol/summoner/v4/summoners/by-name/${encodeURIComponent(summonerName)}?api_key=${CONFIG.apiKey}`;
        },

        // Create a link to match list by account id
        getMatchListByAccountID: function (accountID, platform, champion, queue, season, endTime, beginTime, endIndex, beginIndex) {
            return `https://${platform}/lol/match/v4/matchlists/by-account/${accountID}?champion=${champion}&queue=${queue}&season=${season}&endTime=${endTime}&beginTime=${beginTime}&endIndex=${endIndex}&beginIndex=${beginIndex}&api_key=${CONFIG.apiKey}`;
        },

        // Create a link to summoner data by summoner name
        getMatchInfobyMatchID: function (matchID, platform) {
            return `https://${platform}/lol/match/v4/matches/${matchID}?api_key=${CONFIG.apiKey}`;
        },

    },

    // Get data from API Riot
    getData: function (url, action) {
        return  axios.get(url).
                    then(response => {return response.data}).
                    catch(error => {console.log(error.response.status)});
    },

}

module.exports = API_METHODS;