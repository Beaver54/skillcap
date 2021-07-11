import React from 'react';

import {PlatformSelect} from './platform/index';
import {SearchInput} from './search-input/index';
import {ButtonDefault} from "../button";
import {SpinnerDefault} from "../spinner";

export function SearchForm(props) {
    return (
        <div className="search">
            <form className="row">
                <div className="col-8">
                    <SearchInput inputPlaceholder='summoner name1, summoner name2...' />
                    <div id="search-input-alert" className="form-alert"/>
                </div>
                <div className="col-2">
                    <PlatformSelect />
                </div>
                <div className="col-2">
                    <ButtonDefault buttonStyle='btn-primary' innerText='Search' buttonIcon={<SpinnerDefault/>} />
                </div>
            </form>
        </div>
    );
}