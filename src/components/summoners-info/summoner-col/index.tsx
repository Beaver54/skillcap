import React from 'react';

interface IProps {
    getColorOfGame:             any,
    getCurrentTimeFromStamp:    any,
    summonersInfo:              any,
}

export function SummonerColumn(props: IProps) {

    // Methods
    let getColorOfGame          = props.getColorOfGame;
    let getCurrentTimeFromStamp = props.getCurrentTimeFromStamp;

    // Summoners data object
    let summonersInfo: any      = props.summonersInfo;

    // Summoners blocks and match lists
    let listItems: any[] = [];
    let matchItems: any[] = [];

    // Create summoner column with current summoner info
    for (let summoner in summonersInfo) {

        matchItems = [];
        summonersInfo[summoner].matches.forEach(function (match: any, id: number, arr: any[]) {
            matchItems.push(
                <div key={summonersInfo[summoner].summonerName + '-' + id}
                     className={`match ${getColorOfGame(match.win)}`}>
                    <div className="champion-icon"
                         style={{backgroundImage: `url(http://ddragon.leagueoflegends.com/cdn/11.14.1/img/champion/${match.championName}.png)`}}/>
                    <div className="match-info">
                        <span className="kda">{match.kills}/{match.deaths}/{match.assists}</span>
                        <span className="cs">{match.totalMinionsKilled + match.neutralMinionsKilled} CS</span>
                        <span className="pink-wards">{match.visionWardsBoughtInGame} PW</span>
                        <span className="date">{getCurrentTimeFromStamp(match.gameCreation)}</span>
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