import React from 'react'
import styled from 'styled-components';

const Circle = styled.div<{ size?: number }>`
    position: relative;
    .central {
        padding: 5px;
        height: ${ (props) => (props.size ?? 50) + 6 }px;
        width: ${ (props) => (props.size ?? 50) + 6}px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .progress {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        transform: rotate(-90deg);
        circle {
            vector-effect: non-scaling-stroke;
        }
    }
`

export default function CircularProgressWithContent(props) {
    const radius = Math.floor((props.size ?? 50) / 2)
    const circumference = Math.PI * (radius + 1) * 2
    return (
        <Circle size={props.size}>
            <div className="central">{props.content}</div>
            <div className="progress">
                <svg viewBox={`-2 -2 ${radius*2 + 4} ${radius*2 + 4}`}>
                    <circle cx={radius} cy={radius} r={radius} fill="none" stroke-width="2" stroke="#fff7" />
                    <circle cx={radius} cy={radius} r={radius} fill="none" stroke-width="2" stroke="#fff" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - props.value / 100)} />
                </svg>
            </div>
            {/* <div className="progress">
                <CircularProgress variant="static" color="secondary" thickness={2} value={props.value} size="100%" />
            </div> */}
        </Circle>
    );
}