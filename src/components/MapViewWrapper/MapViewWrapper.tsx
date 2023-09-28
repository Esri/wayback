import React, { useContext } from 'react';

import { useSelector } from 'react-redux';

import { isSwipeWidgetOpenSelector } from '@store/Swipe/reducer';

import { SIDEBAR_WIDTH, GUTTER_WIDTH } from '@constants/UI';

import { AppContext } from '@contexts/AppContextProvider';
import { isGutterHideSelector } from '@store/UI/reducer';

type Props = {
    children?: React.ReactNode;
};

const MapViewWrapper: React.FC<Props> = ({ children }) => {
    const isSwipeWidgetOpen = useSelector(isSwipeWidgetOpenSelector);

    const isGutterHide = useSelector(isGutterHideSelector);

    const { isMobile } = useContext(AppContext);

    const getLeftPosition = (): number => {
        if (isMobile) {
            return isGutterHide ? 0 : GUTTER_WIDTH;
        }

        if (isSwipeWidgetOpen) {
            return GUTTER_WIDTH;
        }

        return SIDEBAR_WIDTH + GUTTER_WIDTH;
    };

    return (
        <div
            style={{
                position: 'absolute',
                top: isMobile ? 45 : 0,
                bottom: 0,
                right: 0,
                left: getLeftPosition(),
                display: 'flex',
            }}
        >
            {children}
        </div>
    );
};

export default MapViewWrapper;
