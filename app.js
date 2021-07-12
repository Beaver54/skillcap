const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();
const axios = require('axios');

// Import local modules
const CONFIG = require('./modules/config');
const API_METHODS = require('./modules/api-methods');
const MODEL = require('./modules/model');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "dist")));

app.post('/api/forecast', cors(CONFIG.corsOptions), async function (request, response) {

    let outputAPI = await MODEL.getSummonerData(request.body, response);
    let championsData = await MODEL.getChampionsData(response);

    if (outputAPI) {
        response.send(MODEL.getSummonerInfo(outputAPI, championsData.data));
    }

});

app.listen(4001);