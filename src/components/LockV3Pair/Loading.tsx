import React from "react"
import styled, { keyframes } from "styled-components"

const rotate = keyframes`
    from { transform: rotate(0deg) }
    to { transform: rotate(360deg) }
`

const Spinner = styled.div`
    animation: 2s ${rotate} linear infinite;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
`

const StyledLoading = styled.div<{ label: string }>`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 6em;
    color: white;
    svg {
        width: 100%;
        height: 100%;
    }
    &::after {
        content: "${({label}) => label?.replaceAll('"', '\\"')}";
        position: absolute;
        left: 50%;
        top: 50%;
        font-size: smaller;
        transform: translate(-50%, -50%);
    }
`

export default function Loading(props) {
    return <StyledLoading {...props}>
        <Spinner>
            <svg viewBox="95 95 210 210">
                <path stroke="white" fill="none" d="M 300 200 A 100 100 0 1 1 250 113" strokeWidth="1" />
            </svg>
        </Spinner>
    </StyledLoading>
}