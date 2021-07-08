import {CONFIG} from "./config";
import axios from "axios";

export const MODEL = {

    // Summoner's information
    summonersInfo: [],

    // Bind all functions
    bindAll: function (obj) {
        for (let item in obj) {
            if (typeof obj[item] == 'function') {
                obj[item] = obj[item].bind(obj);
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
        let gameDuration = duration / 60;
        return gameDuration.toFixed(1);
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

    // Start spinner while data loading
    getSpinnerOn: function () {
        this.getElementById('spinner').className = 'spinner-border spinner-border-sm';
        this.getElementById('start').setAttribute('disabled', 'disabled');
    },

    // Stop spinner loading
    getSpinnerOff: function () {
        this.getElementById('spinner').className = '';
        this.getElementById('start').removeAttribute('disabled');
    },

};

MODEL.bindAll(MODEL);