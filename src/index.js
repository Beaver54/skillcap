require.context("/src/images", true, /^\.\/.*\..*/);
import '/src/scss/styles.scss';
import '@babel/polyfill';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';

import {CONFIG} from './config/config';
import {MODEL} from './config/model';

import {SearchForm} from './components/search/index';
import {SummonersInfoBlock} from './components/summoners-info/index';

;(async function () {
    'use strict'

    ReactDOM.render(
        <div className="content">
            <SearchForm />
            <SummonersInfoBlock />
        </div>,
        document.getElementById('app')
    );

    async function startApp() {

        let inputText = MODEL.getElementById('search-input').value

        if (inputText.length > 0) {

            MODEL.getSpinnerOn();
            MODEL.summonersInfo = await MODEL.getSummonersInfo();
            MODEL.getSpinnerOff();

            MODEL.getElementById('summoners-info').innerHTML = '';

            for (let key in MODEL.summonersInfo) {

                function getMatchInfo(summoner) {
                    MODEL.summonersInfo[summoner].matches.forEach(function (match, id, arr) {

                        MODEL.getElementById(MODEL.summonersInfo[key].summonerName).insertAdjacentHTML(
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
                }

                MODEL.getElementById('summoners-info').insertAdjacentHTML(
                    'beforeend',
                    `
                    <div id="${MODEL.summonersInfo[key].summonerName}" class="summoner-col">
                        <div class="summoner-name">${MODEL.summonersInfo[key].summonerName}</div>
                    </div>
                    `
                )

                getMatchInfo(key);

            }

        } else {
            MODEL.getElementById('search-input-alert').innerText = 'Введите никнеймы своей команды'
        }

    }

    MODEL.getElementById('start').addEventListener('click', startApp);

})();