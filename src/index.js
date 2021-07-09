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
import {SummonerColumn} from './components/summoners-info/summoner-col/index';

;(async function () {
    'use strict'

    ReactDOM.render(
        <div className="content">
            <SearchForm />
            <SummonersInfoBlock />
        </div>,
        document.getElementById('app')
    );

    if (window.location.search !== '') {
        let urlParams = JSON.parse(window.location.search.replace('?', '').
        replace(/^/, '{"').
        replace(/$/, '"}').
        replaceAll('&', '","').
        replaceAll('=', '":"'));

        if (urlParams.summonerList === 'lastRequest') {

            MODEL.summonersInfo = JSON.parse(localStorage.getItem('summonersInfo'));
            MODEL.contentDisplay.displaySummonersInfo();

        }
    }


    async function startApp() {

        let inputText = MODEL.getElementById('search-input').value

        if (inputText.length > 0) {

            localStorage.clear();

            MODEL.spinner.getSpinnerOn('start');
            MODEL.summonersInfo = await MODEL.getSummonersInfo();
            MODEL.spinner.getSpinnerOff('start');

            localStorage.setItem('summonersInfo', JSON.stringify(MODEL.summonersInfo));

            document.location.href = "/?summonerList=lastRequest";

        } else {
            MODEL.getElementById('search-input-alert').innerText = 'Введите никнеймы своей команды'
        }

    }

    MODEL.getElementById('start').addEventListener('click', startApp);

    console.log(JSON.parse(localStorage.getItem('summonersInfo')))

})();