import {CONFIG} from "./config";
import axios from "axios";
import React from 'react';
import ReactDOM from 'react-dom';

import {SummonerColumn} from '../components/summoners-info/summoner-col';

export const MODEL = {

    // Summoner's information
    summonersInfo: [''],

    // Spinner's methods
    spinner: {

        // Start spinner while data loading
        getSpinnerOn: function (buttonID: string) {
            this.getElementById('spinner').className = 'spinner-border spinner-border-sm';
            this.getElementById(buttonID).setAttribute('disabled', 'disabled');
        },

        // Stop spinner loading
        getSpinnerOff: function (buttonID: string) {
            this.getElementById('spinner').className = '';
            this.getElementById(buttonID).removeAttribute('disabled');
        },

    },

    // Bind all functions
    bindAll: function (obj: any, bindObj: any) {
        for (let item in obj) {
            if (typeof obj[item] == 'function') {
                obj[item] = obj[item].bind(bindObj);
            }
        }
    },

    // Remove all duplicates from array of strings
    removeAllDuplicates: function (arr: string[]) {
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
    getElementById: function (id: string) {
        return document.getElementById(id);
    },

    // Get date
    getCurrentTimeFromStamp: function (timestamp: number) {
        let date = new Date(timestamp);
        return date.getDate() + '/' + (date.getMonth()) + '/' + date.getFullYear();
    },

    // Get game duration on minutes
    getGameDuration: function (duration: number) {
        return `${Math.trunc(duration / 60)}:${((duration % 60) < 10) ? '0' : ''}${duration % 60}`;
    },

    // Get background color of match block
    getColorOfGame: function (win: boolean) {
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

        let inputValue = this.getElementById('search-input').value.replace(/, /g, ',');

        let joinedSummoners = inputValue.split(this.getSplitingElement());

        joinedSummoners.forEach(function (item: string, id: number, arr: string[]) {
            joinedSummoners[id] = item.split(' ');
            joinedSummoners[id].reverse();
        })
        let clear: any[] = [];

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

        clear.forEach(function (item: string, id: number, arr: string[]) {
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

        let summonerList:       any[]       = [];
        let platform:           string      = this.getElementById('platform').value;
        let stringForDelete:    any         = new RegExp(this.getStringForDelete(), 'g');
        let summonerNames:      string[]    = this.getElementById('search-input').value.
                                                    replace(/, /g, ',').
                                                    replace(stringForDelete, '').
                                                    split(this.getSplitingElement());

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
            summonerNames.forEach(function (item: string, id: number, arr: string[]) {
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
        }).then((response) => {return response.data;}).
           catch(error => {return error;});
    },

    // Display summoners info from local storage if client is on a page with parameters
    getUrlParams: function() {
        if (window.location.search !== '') {
            let urlParams: any = JSON.parse(window.location.search.replace('?', '').
            replace(/^/, '{"').
            replace(/$/, '"}').
            replace(/&/g, '","').
            replace(/=/g, '":"'));

            if (urlParams.summonerList === 'lastRequest') {

                MODEL.summonersInfo = JSON.parse(localStorage.getItem('summonersInfo'));
                MODEL.displaySummonersInfo();

            }
        }
    },

    // Display summoner info on screen
    displaySummonersInfo: function () {

        this.getElementById('summoners-info').innerHTML = '';

        ReactDOM.render(
            <SummonerColumn summonersInfo={MODEL.summonersInfo}
                            getColorOfGame={MODEL.getColorOfGame}
                            getCurrentTimeFromStamp={MODEL.getCurrentTimeFromStamp}
                            getGameDuration={MODEL.getGameDuration}
            />,
            document.getElementById('summoners-info')
        );

    },

    startApp: async function () {

        let inputText: string = this.getElementById('search-input').value

        if (inputText.length > 0) {

            localStorage.clear();

            this.spinner.getSpinnerOn('start');
            this.summonersInfo = await this.getSummonersInfo();
            this.spinner.getSpinnerOff('start');

            if (this.summonersInfo.name === 'Error' || typeof this.summonersInfo === 'number') {

            } else {
                localStorage.setItem('summonersInfo', JSON.stringify(this.summonersInfo));
                document.location.href = "/?summonerList=lastRequest";
            }

        } else {
            this.getElementById('search-input-alert').innerText = 'Enter your team\'s summoner names'
        }

    },

    getErrorMessage: function (errorCode: number) {
        switch (errorCode) {
            case 400:
                return 'Something went wrong. Perhaps your request is incorrect.';
            case 401:
                return 'Something went wrong. We\'re in trouble. We are sorry.';
            case 403:

                break;
            case 404:

                break;
            case 405:

                break;
            case 415:

                break;
            case 429:
                return 'The last update was less than a minute ago. Try it in a minute.';
            case 500:

                break;
            case 502:

                break;
            case 503:

                break;
            case 504:

                break;
            default:
                return 'Sorry. Unknown error.';
        }
    },

};

MODEL.bindAll(MODEL, MODEL);
MODEL.bindAll(MODEL.spinner, MODEL);