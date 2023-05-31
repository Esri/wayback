import React, { useContext, useMemo } from 'react';

import Gutter from './index';

import { useSelector, useDispatch } from 'react-redux';

import { isSwipeWidgetOpenSelector } from '../../store/reducers/SwipeView';

import {
    isShareModalOpenToggled,
    isAboutThisAppModalOpenToggled,
    isSettingModalOpenToggled,
    isGutterHideSelector,
} from '../../store/reducers/UI';
import { AppContext } from '../../contexts/AppContextProvider';
import { isAnimationModeOnSelector } from '../../store/reducers/AnimationMode';

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
