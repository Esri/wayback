import React from 'react'
import { DEFAULT_BACKGROUND_COLOR, GUTTER_WIDTH, SIDEBAR_WIDTH } from '../../constants/UI'

type Props = {
    isHide: boolean;
    isGutterHide: boolean;
    isMobile: boolean;
    children: React.ReactNode
}

const Sidebar:React.FC<Props> = ({
    isHide,
    isGutterHide,
    isMobile,
    children
}:Props) => {

    const getStyle = ():React.CSSProperties=>{

        const mobileStyle:React.CSSProperties = {
            position: 'absolute',
            top: 'auto',
            bottom: 0,
            right: 0,
            left: isGutterHide ? 0 : GUTTER_WIDTH,
            width: isGutterHide ? '100%' : 'calc(100% - 50px)',
            maxHeight: 300,
            padding: '.5rem 0'
        }

        const defaultStyle:React.CSSProperties = {
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
        }

        return isMobile 
            ? {
                ...defaultStyle,
                ...mobileStyle
            } as React.CSSProperties
            : defaultStyle
    }

    return !isHide ? (
        <div
            style={getStyle()}
        >
            { children }
        </div>
    ) : null;
}

export default Sidebar
