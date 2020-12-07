import React from 'react';

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
    isSettingModalOpenToggled
} from '../../store/reducers/UI'

type Props = {
    children: React.ReactNode
}

const GutterContainer:React.FC<Props> = ({
    children
}) => {

    const dispatch = useDispatch();

    const isSwipeWidgetOpen = useSelector(isSwipeWidgetOpenSelector);

    const aboutButtonOnClick = ()=>{
        dispatch(isAboutThisAppModalOpenToggled());
    }

    const shareButtonOnClick = ()=>{
        dispatch(isShareModalOpenToggled());
    }

    const settingButtonOnClick = ()=>{
        dispatch(isSettingModalOpenToggled());
    }

    return (
        <Gutter
            settingsBtnDisabled={isSwipeWidgetOpen}
            aboutButtonOnClick={aboutButtonOnClick}
            shareButtonOnClick={shareButtonOnClick}
            settingButtonOnClick={settingButtonOnClick}
        >
            { children }
        </Gutter>
    )
}

export default GutterContainer
