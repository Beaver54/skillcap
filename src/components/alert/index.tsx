import React from 'react';

interface IProps {
    alertStyle: string,
    alertMessage: string,
}

export function AlertMessage(props: IProps) {
    return (
        <div className={'alert ' + props.alertStyle} role="alert">
            {props.alertMessage}
        </div>
    );
}