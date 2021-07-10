require.context("/src/images", true, /^\.\/.*\..*/);
import '/src/scss/styles.scss';
import '@babel/polyfill';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';

import {MODEL} from './config/model';

import {SearchForm} from './components/search';
import {SummonersInfoBlock} from './components/summoners-info';

;(async function () {
    'use strict'

    ReactDOM.render(
        <div className="content">
            <SearchForm />
            <SummonersInfoBlock />
        </div>,
        document.getElementById('app')
    );

    MODEL.getUrlParams();

    MODEL.getElementById('start').addEventListener('click', MODEL.startApp);

})();