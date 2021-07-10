import React from 'react';

export function SummonerColumn(props) {

    // Methods
    let getColorOfGame          = props.getColorOfGame;
    let getCurrentTimeFromStamp = props.getCurrentTimeFromStamp;
    let getGameDuration         = props.getGameDuration;

    // Summoners data object
    let summonersInfo           = props.summonersInfo;

    // Summoners blocks and match lists
    let listItems               = [];
    let matchItems              = [];

    // Create summoner column with current summoner info
    for (let summoner in summonersInfo) {

        matchItems = [];
        summonersInfo[summoner].matches.forEach(function (match, id, arr) {
            matchItems.push(
                <div key={summonersInfo[summoner].summonerName + '-' + id}
                     className={`match ${getColorOfGame(match.win)}`}>
                    <div className="champion-icon"
                         style={{backgroundImage: `url("/images/champion/${match.championName}.png")`}}/>
                    <div className="match-info">
                        <span className="kda">{match.kills}/{match.deaths}/{match.assists}</span>
                        <span className="role">{match.lane}</span>
                        <span className="date">{getCurrentTimeFromStamp(match.gameCreation)}</span>
                        <span className="game-duration">{getGameDuration(match.gameDuration)}</span>
                        <span className="pink-wards">{match.visionWardsBoughtInGame} wards</span>
                        <span className="cs">{match.totalMinionsKilled + match.neutralMinionsKilled}</span>
                    </div>
                </div>
            )
        })

        listItems.push(
            <div key={summonersInfo[summoner].summonerName} id={summonersInfo[summoner].summonerName} className="summoner-col">
                <div className="summoner-name">{summonersInfo[summoner].summonerName}</div>
                {matchItems}
            </div>
        )

    }

    return (
        <div className="summoner-info">
            {listItems}
        </div>
    );
}