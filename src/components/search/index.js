import React from 'react';

export function SearchForm(props) {
    return (
        <div className="search">
            <form className="row">
                <div className="col-8">
                    <textarea className="form-control search-input" id="search-input" rows="5"></textarea>
                    <div id="search-input-alert" className="form-alert"></div>
                </div>
                <div className="col-2">
                    <select id="platform" className="form-control">
                        <option value="RU">RU</option>
                        <option value="BR1">BR</option>
                        <option value="EUN1">EUN</option>
                        <option value="EUW1">EUW</option>
                        <option value="JP1">JP</option>
                        <option value="KR">KR</option>
                        <option value="LA1">LA</option>
                        <option value="LA2">LA</option>
                        <option value="NA1">NA</option>
                        <option value="OC1">OC</option>
                        <option value="TR1">TR</option>
                    </select>
                </div>
                <div className="col-2">
                    <button id="start" type="button" className="btn btn-primary">
                        <span id="spinner"></span>
                        Search
                    </button>
                </div>
            </form>
        </div>
    );
}