import React from 'react';

export function ButtonDefault(props) {
    return (
        <button id="start" type="button" className={'btn ' + props.buttonStyle}>
            {props.buttonIcon} {props.innerText}
        </button>
    );
}