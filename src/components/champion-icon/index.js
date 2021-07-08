import React from "react";

export function ChampionIcon(props) {
    return <div className="champion-icon" style="background-image: url(/images/champion/{props.championName}.png)"></div>
}