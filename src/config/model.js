import {CONFIG} from "./config";
import axios from "axios";

export const MODEL = {

    // Summoner's information
    summonersInfo: [],

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

    // Get string for delete from connection message
    getStringForDelete: function () {

        let joinedSummoners = this.getElementById('search-input').value.split('\n');
        joinedSummoners.forEach(function (item, id, arr) {
            joinedSummoners[id] = item.split(' ');
            joinedSummoners[id].reverse();
        })
        let clear = [];

        for (let i = 1; i < joinedSummoners.length; i++) {
            clear[i - 1] = '';
            for (let j = 0; j < joinedSummoners[0].length; j++) {
                if (joinedSummoners[i][j] !== undefined &&
                    joinedSummoners[i][j] === joinedSummoners[0][j]) {
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

        if (flag === 4) {
            return clear[0];
        }
    },

    // Get list of summoner's names
    getSummonerNames: async function () {

        let summonerList    = [];
        let stringForDelete = new RegExp(this.getStringForDelete(), 'gi');
        let summonerNames   = this.getElementById('search-input').value.replace(stringForDelete, '').split('\n');
        let platform        = this.getElementById('platform').value;

        summonerNames.forEach(function (item, id,arr) {
            summonerList[id] = {
                name: item,
                platform: CONFIG.platform[platform],
            }
        })

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

}