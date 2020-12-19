import React from 'react'
import { DEFAULT_BACKGROUND_COLOR, GUTTER_WIDTH, SIDEBAR_WIDTH } from '../../constants/UI'

type Props = {
    isHide: boolean;
    children: React.ReactNode
}

const Sidebar:React.FC<Props> = ({
    isHide,
    children
}:Props) => {
    return !isHide ? (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: GUTTER_WIDTH,
                width: SIDEBAR_WIDTH,
                height: '100%',
                padding: '1rem 0',
                backgroundColor: DEFAULT_BACKGROUND_COLOR,
                // overflow: hidden;
                boxSizing: 'border-box',
                zIndex: 1,
                // padding: 1rem;
                display: 'flex',
                flexDirection: 'column',
                flexWrap: 'nowrap',
                justifyContent: 'flex-start',
                alignContent: 'stretch',
                alignItems: 'stretch'
            }}
        >
            { children }
        </div>
    ) : null;
}

export default Sidebar
