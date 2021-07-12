import React from 'react';

interface IProps {
    buttonStyle: string;
    buttonIcon?: any;
    innerText: string;
}

export function ButtonDefault(props: IProps) {
    return (
        <button id="start" type="button" className={'btn ' + props.buttonStyle}>
            {props.buttonIcon} {props.innerText}
        </button>
    );
}