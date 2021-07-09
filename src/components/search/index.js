import React from 'react';

import {PlatformSelect} from './platform/index';
import {SearchInput} from './search-input/index';

export function SearchForm(props) {
    return (
        <div className="search">
            <form className="row">
                <div className="col-8">
                    <SearchInput />
                    <div id="search-input-alert" className="form-alert"></div>
                </div>
                <div className="col-2">
                    <PlatformSelect />
                </div>
                <div className="col-2">
                    <button id="start" type="button" className="btn btn-primary">
                        <span id="spinner"></span> Search
                    </button>
                </div>
            </form>
        </div>
    );
}