import React from 'react';

import {MODEL} from "../../../config/model";

interface IProps {

}

export class SearchInput extends React.Component {
    constructor(props: IProps) {

        super(props);
        this.getStringOfSummonerNames = this.getStringOfSummonerNames.bind(this);

    }

    // Replace list of summoner names with string
    props: { inputPlaceholder: string; };

    // Replace input text
    getStringOfSummonerNames() {

        let getElementById: any = MODEL.getElementById;

        function getNewString() {
            let inputText: string[] = getElementById('search-input').value.replaceAll(MODEL.getStringForDelete(), '').split('\n');
            inputText = MODEL.removeAllDuplicates(inputText);
            getElementById('search-input').value = inputText.join(', ');
        }

        setTimeout(getNewString, 100);

    }

    render() {
        return (
            <textarea className="form-control search-input" id="search-input" onPaste={this.getStringOfSummonerNames} placeholder={this.props.inputPlaceholder} />
        );
    }
}