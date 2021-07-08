import React from 'react';

import {MODEL} from '/src/config/model';

export class SearchInput extends React.Component {
    constructor(props) {
        super(props);

        this.getStringOfSummonerNames = this.getStringOfSummonerNames.bind(this);
    }

    // Replace list of summoner names with string
    getStringOfSummonerNames() {

        function getNewString() {
            let inputText = MODEL.getElementById('search-input').value.replaceAll(MODEL.getStringForDelete(), '').split('\n');
            inputText = MODEL.removeAllDuplicates(inputText);
            MODEL.getElementById('search-input').value = inputText.join(', ');
        }

        setTimeout(getNewString, 100);

    }

    render() {
        return (
            <textarea className="form-control search-input" id="search-input" onPaste={this.getStringOfSummonerNames} />
        );
    }
}