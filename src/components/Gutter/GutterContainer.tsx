import React, { useContext, useMemo } from 'react';

import Gutter from './index';

import { useSelector, useDispatch } from 'react-redux';

import { isSwipeWidgetOpenSelector } from '@store/Swipe/reducer';

import {
    isShareModalOpenToggled,
    isAboutThisAppModalOpenToggled,
    isSettingModalOpenToggled,
    isGutterHideSelector,
} from '@store/UI/reducer';
import { AppContext } from '@contexts/AppContextProvider';
import { isAnimationModeOnSelector } from '@store/AnimationMode/reducer';

type Props = {
    children: React.ReactNode;
};

const GutterContainer: React.FC<Props> = ({ children }) => {
    const dispatch = useDispatch();

    const isSwipeWidgetOpen: boolean = useSelector(isSwipeWidgetOpenSelector);
    const isAnimationModeOn: boolean = useSelector(isAnimationModeOnSelector);

    const settingsBtnDisabled = useMemo(() => {
        return isSwipeWidgetOpen || isAnimationModeOn;
    }, [isSwipeWidgetOpen, isAnimationModeOn]);

    const isHide = useSelector(isGutterHideSelector);

    const { isMobile, onPremises } = useContext(AppContext);

    const aboutButtonOnClick = () => {
        dispatch(isAboutThisAppModalOpenToggled());
    };

    const shareButtonOnClick = () => {
        dispatch(isShareModalOpenToggled());
    };

    const settingButtonOnClick = () => {
        dispatch(isSettingModalOpenToggled());
    };

    return !isHide ? (
        <Gutter
            isMobile={isMobile}
            settingsBtnDisabled={settingsBtnDisabled}
            shareBtnDisabled={onPremises}
            aboutButtonOnClick={aboutButtonOnClick}
            shareButtonOnClick={shareButtonOnClick}
            settingButtonOnClick={settingButtonOnClick}
        >
            {children}
        </Gutter>
    ) : null;
};

export default GutterContainer;
