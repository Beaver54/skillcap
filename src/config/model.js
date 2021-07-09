import {CONFIG} from "./config";
import axios from "axios";

export const MODEL = {

    // Summoner's information
    summonersInfo: [],

    // Spinner's methods
    spinner: {

        // Start spinner while data loading
        getSpinnerOn: function (buttonID) {
            this.getElementById('spinner').className = 'spinner-border spinner-border-sm';
            this.getElementById(buttonID).setAttribute('disabled', 'disabled');
        },

        // Stop spinner loading
        getSpinnerOff: function (buttonID) {
            this.getElementById('spinner').className = '';
            this.getElementById(buttonID).removeAttribute('disabled');
        },

    },

    // Displaying content on the app page
    contentDisplay: {

        // Display match info on screen
        displayMatchInfo: function(summoner) {
            this.summonersInfo[summoner].matches.forEach(function (match, id, arr) {

                MODEL.getElementById(MODEL.summonersInfo[summoner].summonerName).insertAdjacentHTML(
                    'beforeend',
                    `
                    <div class="match ${MODEL.getColorOfGame(match.win)}">
                        <div class="champion-icon" style="background-image: url(/images/champion/${match.championName}.png)"></div>
                        <div class="match-info">
                            <span class="kda">${match.kills}/${match.deaths}/${match.assists}</span>
                            <span class="role">${match.lane}</span>
                            <span class="date">${MODEL.getCurrentTimeFromStamp(match.gameCreation)}</span>
                            <span class="game-duration">${MODEL.getGameDuration(match.gameDuration)}</span>
                            <span class="pink-wards">${match.visionWardsBoughtInGame} wards</span>
                            <span class="cs">${match.totalMinionsKilled + match.neutralMinionsKilled}</span>
                        </div>
                    </div>
                    `
                )
            })
        },

        // Display summoner info on screen
        displaySummonersInfo: function () {

            this.getElementById('summoners-info').innerHTML = '';

            for (let key in this.summonersInfo) {

                MODEL.getElementById('summoners-info').insertAdjacentHTML(
                    'beforeend',
                    `
                    <div id="${this.summonersInfo[key].summonerName}" class="summoner-col">
                        <div class="summoner-name">${this.summonersInfo[key].summonerName}</div>
                    </div>
                    `
                )

                MODEL.contentDisplay.displayMatchInfo(key);

            }

        },

    },

    // Bind all functions
    bindAll: function (obj, bindObj) {
        for (let item in obj) {
            if (typeof obj[item] == 'function') {
                obj[item] = obj[item].bind(bindObj);
            }
        }
    },

    // Remove all duplicates from array
    removeAllDuplicates: function (arr) {
        arr.sort();
        let newArr = [];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] !== arr[i - 1]) {
                newArr.push(arr[i]);
            }
        }
        return newArr;
    },

    // Get HTML element by ID
    getElementById: function (id) {
        return document.getElementById(id);
    },

    // Get date
    getCurrentTimeFromStamp: function (timestamp) {
        let date = new Date(timestamp);
        let timeStampCon = date.getDate() + '/' + (date.getMonth()) + '/' + date.getFullYear();

        return timeStampCon;
    },

    // Get game duration on minutes
    getGameDuration: function (duration) {
        let gameDuration = `${Math.trunc(duration / 60)}:${((duration % 60) < 10) ? '0' : ''}${duration % 60}`;
        return gameDuration;
    },

    // Get background color of match block
    getColorOfGame: function (win) {
        if (win) {
            return 'win';
        } else {
            return 'defeat';
        }
    },

    // Get element for input string spliting
    getSplitingElement: function () {

        let inputValue = this.getElementById('search-input').value;
        // Number of lines in the textarea
        let lines = 0;

        for (let i = 0; i < inputValue.length; i++) {
            if (inputValue[i] === '\n') {
                lines++;
            }
        }

        if (lines > 0) {
            return '\n'
        } else {
            return ','
        }

    },

    // Get string for delete from connection message
    getStringForDelete: function () {

        let inputValue = this.getElementById('search-input').value.replaceAll(', ', ',');

        let joinedSummoners = inputValue.split(this.getSplitingElement());

        joinedSummoners.forEach(function (item, id, arr) {
            joinedSummoners[id] = item.split(' ');
            joinedSummoners[id].reverse();
        })
        let clear = [];

        for (let i = 1; i < joinedSummoners.length; i++) {
            clear[i - 1] = '';
            for (let j = 0; j < joinedSummoners[i].length; j++) {
                if (joinedSummoners[i][j] !== undefined &&
                    joinedSummoners[i][j] === joinedSummoners[i - 1][j]) {
                    clear[i - 1] = ' ' + joinedSummoners[i][j] + clear[i - 1];
                }
            }
        }

        let flag = 0;

        clear.forEach(function (item, id, arr) {
            if (item === clear[0]) {
                flag++;
            }
        })

        if (flag === clear.length) {
            return clear[0];
        }
    },

    // Get list of summoner's names
    getSummonerNames: async function () {

        let summonerList    = [];
        let stringForDelete = new RegExp(this.getStringForDelete(), 'gi');
        let summonerNames   = this.getElementById('search-input').value.
                                replaceAll(', ', ',').
                                replace(stringForDelete, '').
                                split(this.getSplitingElement());

        let platform        = this.getElementById('platform').value;

        summonerNames = this.removeAllDuplicates(summonerNames);

        // Limit the number of summoner names
        if (summonerNames.length > 5) {
            for (let id = 0; id < 5; id++) {
                summonerList[id] = {
                    name: summonerNames[id],
                    platform: CONFIG.platform[platform],
                }
            }
        } else {
            summonerNames.forEach(function (item, id, arr) {
                summonerList[id] = {
                    name: item,
                    platform: CONFIG.platform[platform],
                }
            })
        }

        return summonerList;

    },

    // Get summoner's information about matches
    getSummonersInfo: async function () {
        return await axios.post('http://localhost:4001/api/forecast', await this.getSummonerNames(), {
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            }
        }).then((response) => {return response.data });
    },

};

MODEL.bindAll(MODEL, MODEL);
MODEL.bindAll(MODEL.spinner, MODEL);
MODEL.bindAll(MODEL.contentDisplay, MODEL);