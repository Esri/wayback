import React, { useContext } from 'react';

import Gutter from './index';

import {
    useSelector,
    useDispatch
} from 'react-redux';

import {
    isSwipeWidgetOpenSelector,
} from '../../store/reducers/SwipeView';

import {
    isShareModalOpenToggled,
    isAboutThisAppModalOpenToggled,
    isSettingModalOpenToggled,
    isGutterHideSelector
} from '../../store/reducers/UI'
import { AppContext } from '../../contexts/AppContextProvider';

type Props = {
    children: React.ReactNode
}

const GutterContainer:React.FC<Props> = ({
    children
}) => {

    const dispatch = useDispatch();

    const isSwipeWidgetOpen = useSelector(isSwipeWidgetOpenSelector);

    const isHide = useSelector(isGutterHideSelector)

    const { isMobile } = useContext(AppContext)

    const aboutButtonOnClick = ()=>{
        dispatch(isAboutThisAppModalOpenToggled());
    }

    const shareButtonOnClick = ()=>{
        dispatch(isShareModalOpenToggled());
    }

    const settingButtonOnClick = ()=>{
        dispatch(isSettingModalOpenToggled());
    }

    return !isHide ? (
        <Gutter
            isMobile={isMobile}
            settingsBtnDisabled={isSwipeWidgetOpen}
            aboutButtonOnClick={aboutButtonOnClick}
            shareButtonOnClick={shareButtonOnClick}
            settingButtonOnClick={settingButtonOnClick}
        >
            { children }
        </Gutter>
    ) : null;
}

export default GutterContainer
