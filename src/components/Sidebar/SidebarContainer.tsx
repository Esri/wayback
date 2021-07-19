import React, { useContext } from 'react';

import { useSelector } from 'react-redux';

import { isSwipeWidgetOpenSelector } from '../../store/reducers/SwipeView';

import { isAnimationModeOnSelector } from '../../store/reducers/AnimationMode'

import {
    isGutterHideSelector,
    isSideBarHideSelector,
} from '../../store/reducers/UI';

import Sidebar from './Sidebar';
import { AppContext } from '../../contexts/AppContextProvider';

import {
    SidebarToggleBtn,
    AppTitleText,
    BarChart,
    Title4ActiveItem,
    ShowLocalChangesCheckboxToggle,
    ListView
} from '../'

import { MobileHide, Spacing } from '../SharedUI';

const MainContent:React.FC = ()=>{
    return (
        <>
            <SidebarToggleBtn />

            <Spacing paddingLeft="1rem" paddingRight="1rem">
                <MobileHide>
                    <AppTitleText />
                </MobileHide>

                <BarChart />

                <Title4ActiveItem />

                <ShowLocalChangesCheckboxToggle />
            </Spacing>

            <ListView />
        </>
    )
}

const AnimatorControls:React.FC = ()=>{
    return (
        <>
            <SidebarToggleBtn />

            <Spacing paddingLeft="1rem" paddingRight="1rem">
                <MobileHide>
                    <AppTitleText />
                </MobileHide>
            </Spacing>
        </>
    )
}

const SidebarContainer: React.FC = ({ children }) => {
    const { isMobile } = useContext(AppContext);

    const isSwipeWidgetOpen = useSelector(isSwipeWidgetOpenSelector);

    const isAnimationModeOn = useSelector(isAnimationModeOnSelector);

    const isHide = useSelector(isSideBarHideSelector);

    const isGutterHide = useSelector(isGutterHideSelector);

    return (
        <Sidebar
            isHide={isHide || isSwipeWidgetOpen}
            isGutterHide={isGutterHide}
            isMobile={isMobile}
        >
            { isAnimationModeOn ? <AnimatorControls /> : <MainContent /> }
        </Sidebar>
    );
};

export default SidebarContainer;
