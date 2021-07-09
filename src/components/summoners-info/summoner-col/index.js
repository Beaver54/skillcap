import React from 'react';

export function SummonerColumn(props) {
    return (
        <div id={props.summonerName} className="summoner-col">
            <div className="summoner-name">{props.summonerName}</div>
        </div>
    );
}